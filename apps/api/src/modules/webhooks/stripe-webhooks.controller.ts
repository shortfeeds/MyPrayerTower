import { Controller, Post, RawBodyRequest, Req, Headers, Logger, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { MassOfferingsService } from '../mass-offerings/mass-offerings.service';
import { PlatformDonationsService } from '../platform-donations/platform-donations.service';

/**
 * Unified Stripe Webhook Controller for Mass Offerings & Donations
 * 
 * This handles all Stripe webhooks specifically for the centralized
 * payment system (Mass Offerings, Donations, Prayer Subscriptions)
 */
@Controller('webhooks/stripe')
export class StripeWebhooksController {
    private readonly logger = new Logger(StripeWebhooksController.name);
    private stripe: Stripe | null = null;
    private webhookSecret: string;

    constructor(
        private configService: ConfigService,
        private massOfferingsService: MassOfferingsService,
        private donationsService: PlatformDonationsService,
    ) {
        const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
        if (stripeKey) {
            this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
        }
        this.webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET') || '';
    }

    @Post()
    @HttpCode(200)
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string,
    ) {
        if (!this.stripe) {
            this.logger.error('Stripe not configured');
            return { received: false, error: 'Stripe not configured' };
        }

        if (!this.webhookSecret) {
            this.logger.error('Webhook secret not configured');
            return { received: false, error: 'Webhook secret not configured' };
        }

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req.rawBody as Buffer,
                signature,
                this.webhookSecret,
            );
        } catch (err: any) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            return { received: false, error: 'Invalid signature' };
        }

        this.logger.log(`Received Stripe event: ${event.type}`);

        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    await this.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
                    break;

                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
                    break;

                case 'customer.subscription.deleted':
                    await this.handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
                    break;

                case 'payment_intent.succeeded':
                    await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
                    break;

                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                    break;

                default:
                    this.logger.log(`Unhandled event type: ${event.type}`);
            }
        } catch (err: any) {
            this.logger.error(`Error handling ${event.type}: ${err.message}`);
            // Still return 200 to acknowledge receipt
        }

        return { received: true };
    }

    /**
     * Handle completed checkout sessions
     */
    private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
        const metadata = session.metadata || {};
        const type = metadata.type;

        this.logger.log(`Checkout complete - type: ${type}, session: ${session.id}`);

        switch (type) {
            case 'mass_offering':
                await this.massOfferingsService.handlePaymentSuccess(
                    metadata.orderNumber,
                    session.payment_intent as string || session.id
                );
                this.logger.log(`Mass offering ${metadata.orderNumber} payment processed`);
                break;

            case 'platform_donation':
                await this.donationsService.handleDonationPaymentSuccess(
                    metadata.orderNumber,
                    session.payment_intent as string || session.id
                );
                this.logger.log(`Donation ${metadata.orderNumber} payment processed`);
                break;

            case 'prayer_subscription':
                await this.donationsService.handleSubscriptionSuccess(
                    session.subscription as string,
                    session.customer as string,
                    metadata.plan
                );
                this.logger.log(`Prayer subscription created for ${metadata.plan}`);
                break;

            default:
                this.logger.log(`Unknown checkout type: ${type}`);
        }
    }

    /**
     * Handle subscription updates
     */
    private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
        this.logger.log(`Subscription updated: ${subscription.id} - status: ${subscription.status}`);
        // TODO: Update PrayerSubscription status in database
    }

    /**
     * Handle subscription cancellation
     */
    private async handleSubscriptionCancelled(subscription: Stripe.Subscription) {
        this.logger.log(`Subscription cancelled: ${subscription.id}`);
        // TODO: Update PrayerSubscription status to CANCELLED
    }

    /**
     * Handle successful payment intents
     */
    private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
        this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
    }

    /**
     * Handle failed payments
     */
    private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
        this.logger.error(`Payment failed: ${paymentIntent.id}`);
        // TODO: Send notification email about failed payment
    }
}
