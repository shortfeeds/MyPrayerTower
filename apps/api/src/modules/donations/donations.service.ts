import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class DonationsService {
    private readonly logger = new Logger(DonationsService.name);
    private stripe: Stripe | null = null;
    private readonly PLATFORM_FEE_PERCENT = 2.5; // 2.5% platform fee

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
        if (stripeKey) {
            this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
        }
    }

    /**
     * Create donation checkout session for a church
     */
    async createDonationCheckout(
        userId: string | null,
        churchId: string,
        data: {
            amount: number; // in cents
            message?: string;
            isRecurring?: boolean;
            isAnonymous?: boolean;
        }
    ) {
        if (!this.stripe) {
            throw new Error('Payments not configured');
        }

        const church = await this.prisma.church.findUnique({
            where: { id: churchId },
            select: { id: true, name: true, stripeAccountId: true },
        });

        if (!church) {
            throw new Error('Church not found');
        }

        // Calculate platform fee
        const platformFee = Math.round(data.amount * (this.PLATFORM_FEE_PERCENT / 100));

        const session = await this.stripe.checkout.sessions.create({
            mode: data.isRecurring ? 'subscription' : 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Donation to ${church.name}`,
                        description: data.message || 'Thank you for your generous donation',
                    },
                    unit_amount: data.amount,
                    ...(data.isRecurring ? { recurring: { interval: 'month' } } : {}),
                },
                quantity: 1,
            }],
            payment_intent_data: church.stripeAccountId ? {
                application_fee_amount: platformFee,
                transfer_data: {
                    destination: church.stripeAccountId,
                },
            } : undefined,
            success_url: `${this.configService.get('WEB_URL')}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('WEB_URL')}/churches/${churchId}`,
            metadata: {
                userId: userId || 'anonymous',
                churchId,
                message: data.message || '',
                isAnonymous: data.isAnonymous?.toString() || 'false',
            },
        });

        return { url: session.url };
    }

    /**
     * Handle successful donation webhook
     */
    async handleDonationSuccess(session: Stripe.Checkout.Session) {
        const metadata = session.metadata || {};

        const donation = await this.prisma.donation.create({
            data: {
                churchId: metadata.churchId,
                userId: metadata.userId !== 'anonymous' ? metadata.userId : null,
                amount: session.amount_total || 0,
                currency: session.currency || 'usd',
                message: metadata.message || null,
                isAnonymous: metadata.isAnonymous === 'true',
                stripeSessionId: session.id,
                status: 'COMPLETED',
            },
        });

        // Update church total donations
        await this.prisma.church.update({
            where: { id: metadata.churchId },
            data: {
                totalDonations: { increment: session.amount_total || 0 },
                donationCount: { increment: 1 },
            },
        });

        return donation;
    }

    /**
     * Get church donations (for church admin)
     */
    async getChurchDonations(churchId: string, userId: string) {
        // Verify user is church admin
        const church = await this.prisma.church.findFirst({
            where: { id: churchId, claimedBy: userId },
        });

        if (!church) {
            throw new Error('Unauthorized');
        }

        return this.prisma.donation.findMany({
            where: { churchId },
            select: {
                id: true,
                amount: true,
                currency: true,
                message: true,
                isAnonymous: true,
                createdAt: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get user's donation history
     */
    async getUserDonations(userId: string) {
        const donations = await this.prisma.donation.findMany({
            where: { userId },
            include: {
                church: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const total = donations.reduce((sum, d) => sum + d.amount, 0);

        return {
            donations,
            total,
            totalFormatted: `$${(total / 100).toFixed(2)}`,
        };
    }

    /**
     * Generate tax receipt (simplified version)
     */
    async generateTaxReceipt(userId: string, year: number) {
        const donations = await this.prisma.donation.findMany({
            where: {
                userId,
                createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                },
                status: 'COMPLETED',
            },
            include: {
                church: { select: { name: true, address: true } },
            },
        });

        const total = donations.reduce((sum, d) => sum + d.amount, 0);

        return {
            year,
            totalDonations: total,
            totalFormatted: `$${(total / 100).toFixed(2)}`,
            donations: donations.map(d => ({
                date: d.createdAt,
                church: d.church.name,
                amount: `$${(d.amount / 100).toFixed(2)}`,
            })),
            disclaimer: 'This is a summary for tax purposes. Consult your tax advisor.',
        };
    }
}
