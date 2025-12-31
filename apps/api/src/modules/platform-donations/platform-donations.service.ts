import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CashfreeService } from '../cashfree/cashfree.service';
import { DonationTier, PrayerPlan } from '@prisma/client';

// Donation tier amounts (in cents)
export const DONATION_TIERS = {
    CANDLE: { amount: 1000, label: '🕯️ Light a Candle', description: 'A small but meaningful gift' },
    ROSARY: { amount: 2000, label: '📿 Rosary Partner', description: 'Support our prayer ministry' },
    SUPPORTER: { amount: 5000, label: '⛪ Parish Supporter', description: 'Help sustain our mission' },
    GUARDIAN: { amount: 10000, label: '👼 Guardian Angel', description: 'A generous contribution' },
    BENEFACTOR: { amount: 25000, label: '🌟 Benefactor', description: 'Major supporter' },
    PATRON: { amount: 50000, label: '💎 Patron', description: 'Distinguished patron' },
    CORNERSTONE: { amount: 100000, label: '🏆 Cornerstone', description: 'Foundational support' },
    CUSTOM: { amount: 0, label: '❤️ Custom Amount', description: 'Give any amount' },
};

// Subscription plans
export const SUBSCRIPTION_PLANS = {
    PRAYER_PARTNER: {
        amount: 999, // $9.99/month
        label: '🙏 Prayer Partner',
        massesIncluded: 1,
        description: '1 Mass/month + Daily prayer list + 10% off offerings',
    },
    FAMILY_PLAN: {
        amount: 1999, // $19.99/month
        label: '👨‍👩‍👧‍👦 Family Plan',
        massesIncluded: 3,
        description: '3 Masses/month + Family enrollment + 15% off offerings',
    },
    PATRON_CIRCLE: {
        amount: 4999, // $49.99/month
        label: '💎 Patron Circle',
        massesIncluded: 999, // Unlimited
        description: 'Unlimited Masses + Perpetual Enrollment + 25% off',
    },
};

export interface CreateDonationDto {
    amount: number; // Custom amount in cents (for CUSTOM tier)
    tier?: DonationTier;
    email: string;
    name: string;
    phone?: string;
    isAnonymous?: boolean;
    message?: string;
    intention?: string;
    inMemoryOf?: string;
    inHonorOf?: string;
    tributeMessage?: string;
    coversFee?: boolean;
}

export interface CreateSubscriptionDto {
    plan: PrayerPlan;
    email: string;
    name: string;
    phone?: string;
}

@Injectable()
export class PlatformDonationsService {
    private readonly logger = new Logger(PlatformDonationsService.name);

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private cashfreeService: CashfreeService,
    ) {
        if (this.cashfreeService.isConfigured()) {
            this.logger.log('Cashfree initialized for Platform Donations');
        } else {
            this.logger.warn('Cashfree not configured - Donations payments disabled');
        }
    }

    /**
     * Calculate total with optional fee coverage
     */
    calculateTotal(amount: number, coversFee: boolean): { amount: number; feeAmount: number; total: number } {
        // Payment gateway fee: ~2.5%
        const feeAmount = coversFee ? Math.round(amount * 0.025) : 0;
        return {
            amount,
            feeAmount,
            total: amount + feeAmount,
        };
    }

    /**
     * Create a one-time donation checkout session using Cashfree
     */
    async createDonationCheckout(userId: string | null, data: CreateDonationDto) {
        if (!this.cashfreeService.isConfigured()) {
            throw new BadRequestException('Payments not configured');
        }

        // Determine amount based on tier or custom
        let amount: number;
        let tier: DonationTier;

        if (data.tier && data.tier !== 'CUSTOM') {
            amount = DONATION_TIERS[data.tier]?.amount || data.amount;
            tier = data.tier;
        } else {
            if (!data.amount || data.amount < 100) {
                throw new BadRequestException('Minimum donation is $1.00');
            }
            amount = data.amount;
            tier = 'CUSTOM';
        }

        const calculation = this.calculateTotal(amount, data.coversFee || false);
        const orderNumber = `DON-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Create donation record (pending)
        const donation = await this.prisma.platformDonation.create({
            data: {
                orderNumber,
                amount: calculation.amount,
                currency: 'USD',
                tier,
                userId,
                email: data.email,
                name: data.name,
                phone: data.phone,
                isAnonymous: data.isAnonymous || false,
                message: data.message,
                intention: data.intention,
                inMemoryOf: data.inMemoryOf,
                inHonorOf: data.inHonorOf,
                tributeMessage: data.tributeMessage,
                coversFee: data.coversFee || false,
                feeAmount: calculation.feeAmount,
                status: 'PENDING',
            },
        });

        // Create Cashfree checkout
        const webUrl = this.configService.get('WEB_URL') || 'http://localhost:3000';
        const apiUrl = this.configService.get('API_URL') || 'http://localhost:3001';

        const checkout = await this.cashfreeService.createDonationCheckout({
            orderNumber,
            amount: calculation.total,
            currency: 'USD',
            customerEmail: data.email,
            customerPhone: data.phone || '9999999999',
            customerName: data.name,
            customerId: userId || `guest-${Date.now()}`,
            returnUrl: `${webUrl}/donate/success`,
            notifyUrl: `${apiUrl}/webhooks/cashfree`,
            tier: tier.toString(),
            metadata: {
                type: 'platform_donation',
                donationId: donation.id,
                orderNumber,
                userId: userId || 'guest',
            },
        });

        // Update donation with Cashfree session ID
        await this.prisma.platformDonation.update({
            where: { id: donation.id },
            data: { cashfreeSessionId: checkout.paymentSessionId },
        });

        return {
            paymentSessionId: checkout.paymentSessionId,
            orderId: checkout.orderId,
            orderNumber,
            donationId: donation.id,
        };
    }

    /**
     * Create a subscription checkout session using Cashfree
     */
    async createSubscriptionCheckout(userId: string | null, data: CreateSubscriptionDto) {
        if (!this.cashfreeService.isConfigured()) {
            throw new BadRequestException('Payments not configured');
        }

        const planInfo = SUBSCRIPTION_PLANS[data.plan];
        if (!planInfo) {
            throw new BadRequestException('Invalid subscription plan');
        }

        // Generate subscription ID
        const subscriptionId = `SUB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const webUrl = this.configService.get('WEB_URL') || 'http://localhost:3000';

        // Get Cashfree plan ID from config
        const planId = this.configService.get(`CASHFREE_PLAN_${data.plan}`);

        if (!planId) {
            this.logger.warn(`Cashfree plan ID not configured for ${data.plan}. Creating subscription via dashboard.`);
            throw new BadRequestException('Subscription plan not configured. Please contact support.');
        }

        const result = await this.cashfreeService.createSubscription({
            subscriptionId,
            planId,
            customerId: userId || `guest-${Date.now()}`,
            customerName: data.name,
            customerEmail: data.email,
            customerPhone: data.phone || '9999999999',
            returnUrl: `${webUrl}/subscribe/success?subscription_id=${subscriptionId}`,
        });

        return {
            subscriptionId: result.subscriptionId,
            authLink: result.authLink,
            plan: data.plan,
        };
    }

    /**
     * Handle successful donation payment from Cashfree webhook
     */
    async handleDonationPaymentSuccess(orderId: string, transactionId: string) {
        const donation = await this.prisma.platformDonation.findFirst({
            where: { orderNumber: orderId },
        });

        if (!donation) {
            this.logger.error(`Donation not found for order: ${orderId}`);
            return null;
        }

        const updated = await this.prisma.platformDonation.update({
            where: { id: donation.id },
            data: {
                status: 'COMPLETED',
                cashfreePaymentId: transactionId,
                paidAt: new Date(),
            },
        });

        this.logger.log(`Donation ${updated.orderNumber} completed - $${(updated.amount / 100).toFixed(2)}`);

        // TODO: Send thank you email

        return updated;
    }

    /**
     * Handle successful subscription from Cashfree webhook
     */
    async handleSubscriptionSuccess(subscriptionId: string, customerId: string, plan: string) {
        const prayerPlan = plan as PrayerPlan;
        const planInfo = SUBSCRIPTION_PLANS[prayerPlan];

        if (!planInfo) {
            this.logger.error(`Unknown plan: ${plan}`);
            return null;
        }

        // Try to find user by customerId pattern (guest-timestamp or actual userId)
        let userId: string | null = null;
        if (!customerId.startsWith('guest-')) {
            userId = customerId;
        }

        if (!userId) {
            this.logger.warn('Subscription created without user ID');
            return null;
        }

        const subscription = await this.prisma.prayerSubscription.create({
            data: {
                userId,
                plan: prayerPlan,
                cashfreeSubscriptionId: subscriptionId,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
                massesIncludedMonthly: planInfo.massesIncluded,
                status: 'ACTIVE',
            },
        });

        this.logger.log(`Subscription ${subscription.id} created for user ${userId}`);

        return subscription;
    }

    /**
     * Get donation by order number
     */
    async getDonationByOrderNumber(orderNumber: string) {
        return this.prisma.platformDonation.findUnique({
            where: { orderNumber },
            select: {
                id: true,
                orderNumber: true,
                amount: true,
                tier: true,
                isAnonymous: true,
                message: true,
                intention: true,
                status: true,
                createdAt: true,
            },
        });
    }

    /**
     * Get user's donation history
     */
    async getUserDonations(userId: string) {
        const donations = await this.prisma.platformDonation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        const total = donations.reduce((sum, d) => sum + d.amount, 0);

        return {
            donations,
            total,
            totalFormatted: `$${(total / 100).toFixed(2)}`,
            count: donations.length,
        };
    }

    /**
     * Get user's active subscription
     */
    async getUserSubscription(userId: string) {
        return this.prisma.prayerSubscription.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
            },
        });
    }

    /**
     * Get available tiers and plans
     */
    getTiersAndPlans() {
        return {
            tiers: Object.entries(DONATION_TIERS).map(([key, value]) => ({
                id: key,
                ...value,
                displayAmount: `$${(value.amount / 100).toFixed(0)}`,
            })),
            subscriptions: Object.entries(SUBSCRIPTION_PLANS).map(([key, value]) => ({
                id: key,
                ...value,
                displayAmount: `$${(value.amount / 100).toFixed(2)}/month`,
            })),
        };
    }

    /**
     * Get donation statistics (admin)
     */
    async getStatistics(startDate?: Date, endDate?: Date) {
        const where: any = { status: 'COMPLETED' };
        if (startDate) where.createdAt = { gte: startDate };
        if (endDate) {
            where.createdAt = { ...where.createdAt, lte: endDate };
        }

        const [donations, subscriptions] = await Promise.all([
            this.prisma.platformDonation.aggregate({
                where,
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.prayerSubscription.count({
                where: { status: 'ACTIVE' },
            }),
        ]);

        return {
            totalDonations: donations._sum.amount || 0,
            totalDonationsFormatted: `$${((donations._sum.amount || 0) / 100).toFixed(2)}`,
            donationCount: donations._count,
            activeSubscriptions: subscriptions,
            estimatedMRR: subscriptions * SUBSCRIPTION_PLANS.PRAYER_PARTNER.amount, // Estimate
        };
    }
}
