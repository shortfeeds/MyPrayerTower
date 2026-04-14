import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionTier, PaymentType } from '@prisma/client';
import { FailedPaymentsService } from '../failed-payments/failed-payments.service';

export interface CreateSubscriptionDto {
    userId: string;
    priceId: string;
    paymentMethodId: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    interval: 'month' | 'year' | 'once';
    features: string[];
}

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private stripe: Stripe | null = null;

    // Plan configurations
    readonly PLANS: SubscriptionPlan[] = [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            interval: 'month',
            features: ['Basic features', 'Ads supported', '14-day premium trial'],
        },
        {
            id: 'plus_monthly',
            name: 'Plus',
            price: 4.99,
            interval: 'month',
            features: ['No ads', 'Offline mode', 'Audio prayers', '2-user family'],
        },
        {
            id: 'plus_yearly',
            name: 'Plus (Yearly)',
            price: 39.99,
            interval: 'year',
            features: ['No ads', 'Offline mode', 'Audio prayers', '2-user family', 'Save 33%'],
        },
        {
            id: 'premium_monthly',
            name: 'Premium',
            price: 9.99,
            interval: 'month',
            features: ['All Plus features', 'AI prayer suggestions', '5-user family', 'Priority support'],
        },
        {
            id: 'premium_yearly',
            name: 'Premium (Yearly)',
            price: 79.99,
            interval: 'year',
            features: ['All Plus features', 'AI prayer suggestions', '5-user family', 'Priority support', 'Save 33%'],
        },
        {
            id: 'lifetime',
            name: 'Lifetime',
            price: 149.99,
            interval: 'once',
            features: ['All Premium features forever', 'One-time payment', 'Lifetime updates'],
        },
    ];

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
        private failedPaymentsService: FailedPaymentsService,
    ) {
        const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
        if (stripeKey) {
            this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
            this.logger.log('Stripe initialized successfully');
        } else {
            this.logger.warn('Stripe key not configured - payments disabled');
        }
    }

    /**
     * Get all available subscription plans
     */
    getPlans(): SubscriptionPlan[] {
        return this.PLANS;
    }

    /**
     * Create or get Stripe customer for user
     */
    async getOrCreateCustomer(userId: string): Promise<string | null> {
        if (!this.stripe) return null;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, firstName: true, lastName: true, stripeCustomerId: true },
        });

        if (!user) throw new Error('User not found');

        if (user.stripeCustomerId) {
            return user.stripeCustomerId;
        }

        // Create new Stripe customer
        const customer = await this.stripe.customers.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            metadata: { userId: user.id },
        });

        // Save to database
        await this.prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customer.id },
        });

        return customer.id;
    }

    /**
     * Create a subscription checkout session
     */
    async createCheckoutSession(userId: string, planId: string): Promise<string | null> {
        if (!this.stripe) return null;

        const customerId = await this.getOrCreateCustomer(userId);
        if (!customerId) return null;

        const priceId = this.configService.get(`STRIPE_PRICE_${planId.toUpperCase()}`);
        if (!priceId) {
            throw new Error(`Price not configured for plan: ${planId}`);
        }

        const plan = this.PLANS.find(p => p.id === planId);
        const mode = plan?.interval === 'once' ? 'payment' : 'subscription';

        const session = await this.stripe.checkout.sessions.create({
            customer: customerId,
            mode,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${this.configService.get('WEB_URL')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('WEB_URL')}/subscription/cancel`,
            metadata: { userId, planId },
        });

        return session.url;
    }

    /**
     * Create customer portal session for managing subscription
     */
    async createPortalSession(userId: string): Promise<string | null> {
        if (!this.stripe) return null;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { stripeCustomerId: true },
        });

        if (!user?.stripeCustomerId) {
            throw new Error('No subscription found');
        }

        const session = await this.stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${this.configService.get('WEB_URL')}/profile`,
        });

        return session.url;
    }

    /**
     * Handle Stripe webhook events
     */
    async handleWebhook(event: Stripe.Event): Promise<void> {
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
                break;
            case 'invoice.payment_failed':
                await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
                break;
            case 'checkout.session.async_payment_failed':
                await this.handleCheckoutFailed(event.data.object as Stripe.Checkout.Session);
                break;
        }
    }

    private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (!userId || !planId) return;

        const tier = planId.includes('premium') ? SubscriptionTier.PREMIUM
            : planId.includes('plus') ? SubscriptionTier.PLUS
                : SubscriptionTier.FREE;

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: tier,
                subscriptionId: session.subscription as string,
                subscriptionStatus: 'active',
            },
        });

        this.logger.log(`User ${userId} upgraded to ${tier}`);
    }

    private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
        const customerId = subscription.customer as string;

        const user = await this.prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
        });

        if (user) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { subscriptionStatus: subscription.status },
            });
        }
    }

    private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
        const customerId = subscription.customer as string;

        const user = await this.prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
        });

        if (user) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    subscriptionTier: SubscriptionTier.FREE,
                    subscriptionStatus: 'canceled',
                },
            });
        }
    }

    private async handlePaymentFailed(invoice: Stripe.Invoice) {
        const customerId = invoice.customer as string;

        const user = await this.prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
        });

        if (user) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { subscriptionStatus: 'past_due' },
            });

            // TODO: Send email notification about failed payment
            
            // Log to FailedPayment table
            await this.failedPaymentsService.log({
                userId: user.id,
                userEmail: user.email,
                amount: invoice.amount_remaining,
                currency: invoice.currency,
                paymentType: PaymentType.SUBSCRIPTION,
                failureReason: invoice.last_payment_error?.message || 'Payment failed',
                metadata: {
                    invoiceId: invoice.id,
                    subscriptionId: invoice.subscription as string,
                    errorCode: invoice.last_payment_error?.code,
                }
            });
        }
    }

    private async handleCheckoutFailed(session: Stripe.Checkout.Session) {
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (!userId) return;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true }
        });

        if (user) {
            await this.failedPaymentsService.log({
                userId: user.id,
                userEmail: user.email,
                amount: session.amount_total || 0,
                currency: session.currency || 'usd',
                paymentType: planId ? PaymentType.SUBSCRIPTION : PaymentType.OTHER,
                failureReason: 'Checkout session payment failed',
                stripeSessionId: session.id,
                metadata: {
                    planId,
                    metadata: session.metadata,
                }
            });
        }
    }
}
