import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MassOfferingType, IntentionCategory, MassOfferingStatus } from '@prisma/client';

// Pricing configuration (in cents)
export const MASS_OFFERING_PRICES = {
    REGULAR: 1500,      // $15
    EXPEDITED: 2500,    // $25
    NOVENA: 7500,       // $75
    GREGORIAN: 25000,   // $250
    PERPETUAL: 10000,   // $100
    MONTHLY_CLUB: 0,    // Included with subscription
};

// Add-on prices
export const ADDON_PRICES = {
    VIRTUAL_CANDLE: 500,        // $5
    PRINTED_CARD: 1000,         // $10
    FRAMED_CERTIFICATE: 3500,   // $35
};

export interface CreateMassOfferingDto {
    offeringType: MassOfferingType;
    intentionFor: string;
    additionalNames?: string[];
    isForLiving: boolean;
    categories: IntentionCategory[];
    specialIntention?: string;
    offeredBy?: string;
    inMemoryOf?: string;
    inHonorOf?: string;
    tributeMessage?: string;
    email: string;
    name: string;
    phone?: string;
    isGift?: boolean;
    recipientEmail?: string;
    recipientName?: string;
    giftMessage?: string;
    sendDate?: Date;
    includesPrayerCandle?: boolean;
    includesPrintedCard?: boolean;
    includesFramedCertificate?: boolean;
    printedCardShippingAddress?: string;
    paypalOrderId?: string;
}

@Injectable()
export class MassOfferingsService {
    private readonly logger = new Logger(MassOfferingsService.name);

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        this.logger.log('MassOfferingsService initialized with PayPal support');
    }

    /**
     * Calculate total amount for a Mass offering with add-ons
     */
    calculateTotalAmount(data: CreateMassOfferingDto): {
        baseAmount: number;
        candleAmount: number;
        printedCardAmount: number;
        framedCertificateAmount: number;
        totalAmount: number;
    } {
        const baseAmount = MASS_OFFERING_PRICES[data.offeringType] || MASS_OFFERING_PRICES.REGULAR;
        const candleAmount = data.includesPrayerCandle ? ADDON_PRICES.VIRTUAL_CANDLE : 0;
        const printedCardAmount = data.includesPrintedCard ? ADDON_PRICES.PRINTED_CARD : 0;
        const framedCertificateAmount = data.includesFramedCertificate ? ADDON_PRICES.FRAMED_CERTIFICATE : 0;

        return {
            baseAmount,
            candleAmount,
            printedCardAmount,
            framedCertificateAmount,
            totalAmount: baseAmount + candleAmount + printedCardAmount + framedCertificateAmount,
        };
    }

    /**
     * Create a Mass offering checkout session / verify PayPal payment
     */
    async createMassOfferingCheckout(userId: string | null, data: CreateMassOfferingDto) {
        const pricing = this.calculateTotalAmount(data);

        // Generate or use provided PayPal order ID
        const orderNumber = data.paypalOrderId || `MO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Create the offering record
        const offering = await this.prisma.massOffering.create({
            data: {
                orderNumber,
                offeringType: data.offeringType,
                amount: pricing.totalAmount,
                currency: 'USD',
                intentionFor: data.intentionFor,
                additionalNames: data.additionalNames || [],
                isForLiving: data.isForLiving,
                categories: data.categories,
                specialIntention: data.specialIntention,
                offeredBy: data.offeredBy,
                inMemoryOf: data.inMemoryOf,
                inHonorOf: data.inHonorOf,
                tributeMessage: data.tributeMessage,
                userId,
                email: data.email,
                name: data.name,
                phone: data.phone,
                isGift: data.isGift || false,
                recipientEmail: data.recipientEmail,
                recipientName: data.recipientName,
                giftMessage: data.giftMessage,
                sendDate: data.sendDate,
                includesPrayerCandle: data.includesPrayerCandle || false,
                virtualCandleAmount: pricing.candleAmount,
                includesPrintedCard: data.includesPrintedCard || false,
                printedCardAmount: pricing.printedCardAmount,
                printedCardShippingAddress: data.printedCardShippingAddress,
                includesFramedCertificate: data.includesFramedCertificate || false,
                framedCertificateAmount: pricing.framedCertificateAmount,
                status: data.paypalOrderId ? 'PAID' : 'PENDING_PAYMENT',
                paidAt: data.paypalOrderId ? new Date() : null,
            },
        });

        return {
            success: true,
            orderNumber,
            offeringId: offering.id,
            amount: pricing.totalAmount / 100,
        };
    }

    /**
     * Handle successful payment (verification)
     */
    async handlePaymentSuccess(orderId: string, transactionId: string) {
        const offering = await this.prisma.massOffering.findFirst({
            where: { orderNumber: orderId },
        });

        if (!offering) {
            this.logger.error(`Mass offering not found for order: ${orderId}`);
            return null;
        }

        const updated = await this.prisma.massOffering.update({
            where: { id: offering.id },
            data: {
                status: 'PAID',
                cashfreePaymentId: transactionId, // Reusing field for transaction ID
                paidAt: new Date(),
            },
        });

        this.logger.log(`Mass offering ${updated.orderNumber} payment successful`);
        return updated;
    }

    /**
     * Get user's Mass offerings history
     */
    async getUserOfferings(userId: string) {
        return this.prisma.massOffering.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderNumber: true,
                offeringType: true,
                amount: true,
                intentionFor: true,
                isForLiving: true,
                categories: true,
                status: true,
                celebrationDate: true,
                certificateUrl: true,
                createdAt: true,
            },
        });
    }

    /**
     * Get offering by order number (public - for success page)
     */
    async getOfferingByOrderNumber(orderNumber: string) {
        return this.prisma.massOffering.findUnique({
            where: { orderNumber },
        });
    }

    /**
     * Get all offerings (admin)
     */
    async getAllOfferings(status?: MassOfferingStatus, limit = 50, offset = 0) {
        const where = status ? { status } : {};

        const [offerings, total] = await Promise.all([
            this.prisma.massOffering.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
                include: {
                    Partner: { select: { id: true, name: true } },
                },
            }),
            this.prisma.massOffering.count({ where }),
        ]);

        return { offerings, total };
    }

    /**
     * Assign offering to a partner monastery
     */
    async assignToPartner(offeringId: string, partnerId: string) {
        return this.prisma.massOffering.update({
            where: { id: offeringId },
            data: {
                partnerId,
                status: 'ASSIGNED',
            },
        });
    }

    /**
     * Schedule Mass date
     */
    async scheduleMass(offeringId: string, celebrationDate: Date, massTime?: string, celebrant?: string) {
        return this.prisma.massOffering.update({
            where: { id: offeringId },
            data: {
                celebrationDate,
                massTime,
                celebrant,
                status: 'SCHEDULED',
            },
        });
    }

    /**
     * Mark Mass as offered/celebrated
     */
    async markAsOffered(offeringId: string) {
        return this.prisma.massOffering.update({
            where: { id: offeringId },
            data: {
                status: 'OFFERED',
            },
        });
    }

    /**
     * Get available pricing
     */
    getPricing() {
        return {
            offerings: Object.entries(MASS_OFFERING_PRICES).map(([type, amount]) => ({
                type,
                amount,
                display: `$${(amount / 100).toFixed(2)}`,
            })),
            addons: Object.entries(ADDON_PRICES).map(([type, amount]) => ({
                type,
                amount,
                display: `$${(amount / 100).toFixed(2)}`,
            })),
        };
    }

    /**
     * Get intention categories
     */
    getIntentionCategories() {
        return {
            living: [
                { value: 'THANKSGIVING', label: 'Thanksgiving / Gratitude' },
                { value: 'GOOD_HEALTH', label: 'Good Health' },
                { value: 'HEALING', label: 'Healing' },
                { value: 'BIRTHDAY_BLESSING', label: 'Birthday Blessing' },
                { value: 'WEDDING_ANNIVERSARY', label: 'Wedding Anniversary' },
                { value: 'SAFE_TRAVEL', label: 'Safe Travel' },
                { value: 'EXAM_SUCCESS', label: 'Exam Success' },
                { value: 'CAREER_SUCCESS', label: 'Career Success' },
                { value: 'FAMILY_PEACE', label: 'Family Peace' },
                { value: 'FAMILY_UNITY', label: 'Family Unity' },
                { value: 'PROTECTION', label: 'Protection' },
                { value: 'CONVERSION', label: 'Conversion' },
                { value: 'SPECIAL_GRACE', label: 'Special Grace' },
                { value: 'VOCATIONS', label: 'Vocations' },
            ],
            deceased: [
                { value: 'REPOSE_OF_SOUL', label: 'Repose of the Soul' },
                { value: 'ALL_SOULS', label: 'All Souls / Poor Souls' },
                { value: 'DEATH_ANNIVERSARY', label: 'Death Anniversary' },
                { value: 'RECENTLY_DECEASED', label: 'Recently Deceased' },
                { value: 'FORGOTTEN_SOULS', label: 'Forgotten Souls' },
                { value: 'PURGATORY', label: 'Souls in Purgatory' },
            ],
            special: [
                { value: 'FEAST_DAY', label: 'Feast Day' },
                { value: 'ALL_SAINTS', label: 'All Saints Day' },
                { value: 'CHRISTMAS', label: 'Christmas' },
                { value: 'EASTER', label: 'Easter' },
                { value: 'MOTHERS_DAY', label: "Mother's Day" },
                { value: 'FATHERS_DAY', label: "Father's Day" },
            ],
            general: [
                { value: 'SPECIAL_INTENTION', label: 'Special Intention' },
                { value: 'OTHER', label: 'Other' },
            ],
        };
    }
}
