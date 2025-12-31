import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import Stripe from 'stripe';

// Define ChurchTier locally until schema is migrated
type ChurchTier = 'UNCLAIMED' | 'BASIC' | 'PRO' | 'CATHEDRAL' | 'DIOCESE';

@Injectable()
export class StripeService {
    private stripe: Stripe | null = null;

    // Product IDs - set these in Stripe Dashboard
    private readonly PRODUCTS: Record<ChurchTier, { priceId: string; amount: number }> = {
        UNCLAIMED: { priceId: '', amount: 0 },
        BASIC: { priceId: process.env.STRIPE_PRICE_BASIC || 'price_basic', amount: 9900 },
        PRO: { priceId: process.env.STRIPE_PRICE_PRO || 'price_pro', amount: 24900 },
        CATHEDRAL: { priceId: process.env.STRIPE_PRICE_CATHEDRAL || 'price_cathedral', amount: 49900 },
        DIOCESE: { priceId: process.env.STRIPE_PRICE_DIOCESE || 'price_diocese', amount: 249900 },
    };

    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
        if (secretKey) {
            this.stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
        }
    }

    async createCheckoutSession(
        churchId: string,
        tier: ChurchTier,
        successUrl: string,
        cancelUrl: string,
    ) {
        if (!this.stripe) {
            throw new BadRequestException('Stripe is not configured');
        }

        const product = this.PRODUCTS[tier];
        if (!product || product.amount === 0) {
            throw new BadRequestException('Invalid tier selected');
        }

        // Get church info for metadata
        const church = await this.prisma.church.findUnique({
            where: { id: churchId },
            select: { id: true, name: true, email: true }
        });

        if (!church) {
            throw new BadRequestException('Church not found');
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `MyPrayerTower ${tier} Plan`,
                            description: `One-time payment for ${tier.toLowerCase()} church portal features`,
                        },
                        unit_amount: product.amount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            metadata: {
                churchId: church.id,
                tier: tier,
            },
            customer_email: church.email || undefined,
        });

        return {
            checkoutUrl: session.url,
            sessionId: session.id
        };
    }

    async handleWebhook(payload: Buffer, signature: string) {
        if (!this.stripe) {
            throw new BadRequestException('Stripe is not configured');
        }

        const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new BadRequestException('Webhook secret not configured');
        }

        let event: Stripe.Event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch (err) {
            throw new BadRequestException(`Webhook signature verification failed`);
        }

        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
    }

    private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
        const { churchId, tier } = session.metadata as { churchId: string; tier: ChurchTier };

        if (!churchId || !tier) {
            console.error('Missing metadata in checkout session');
            return;
        }

        const product = this.PRODUCTS[tier];

        // Update or create church subscription
        await this.prisma.churchSubscription.upsert({
            where: { churchId },
            create: {
                churchId,
                tier,
                paidAmount: product.amount / 100,
                paidAt: new Date(),
                stripePaymentId: session.payment_intent as string,
                isActive: true,
                activatedAt: new Date(),
                announcementsLimit: tier === 'BASIC' ? 3 : null,
                adminsLimit: tier === 'BASIC' ? 1 : tier === 'PRO' ? 3 : 10,
            },
            update: {
                tier,
                paidAmount: product.amount / 100,
                paidAt: new Date(),
                stripePaymentId: session.payment_intent as string,
                isActive: true,
                activatedAt: new Date(),
            },
        });

        // Verify the church
        await this.prisma.church.update({
            where: { id: churchId },
            data: {
                isVerified: true,
                verifiedAt: new Date()
            },
        });

        console.log(`[Stripe] Church ${churchId} upgraded to ${tier}`);
    }

    async getSessionStatus(sessionId: string) {
        if (!this.stripe) {
            throw new BadRequestException('Stripe is not configured');
        }

        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        return {
            status: session.payment_status,
            customerEmail: session.customer_email,
            metadata: session.metadata,
        };
    }
}
