import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

// Define ChurchTier locally until schema is migrated
type ChurchTier = 'UNCLAIMED' | 'BASIC' | 'PRO' | 'CATHEDRAL' | 'DIOCESE';

@Injectable()
export class PayPalService {
    // Product amounts in cents
    private readonly PRODUCTS: Record<ChurchTier, { amount: number }> = {
        UNCLAIMED: { amount: 0 },
        BASIC: { amount: 9900 },
        PRO: { amount: 24900 },
        CATHEDRAL: { amount: 49900 },
        DIOCESE: { amount: 249900 },
    };

    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) { }

    async createOrder(
        churchId: string,
        tier: ChurchTier,
    ) {
        const product = this.PRODUCTS[tier];
        if (!product || product.amount === 0) {
            throw new BadRequestException('Invalid tier selected');
        }

        // Get church info
        const church = await this.prisma.church.findUnique({
            where: { id: churchId },
            select: { id: true, name: true, email: true }
        });

        if (!church) {
            throw new BadRequestException('Church not found');
        }

        // In a real implementation, we would call PayPal API here to create an order
        // For now, we return the details for the frontend to handle via the PayPal SDK
        return {
            amount: product.amount / 100,
            currency: 'USD',
            churchId: church.id,
            tier: tier,
            orderId: `CHURCH_${church.id.slice(0, 8)}_${Date.now()}`
        };
    }

    async verifyAndActivate(paypalOrderId: string, churchId: string, tier: ChurchTier) {
        // In a real implementation, we would verify the order with PayPal API here

        const product = this.PRODUCTS[tier];

        // Update or create church subscription
        await this.prisma.churchSubscription.upsert({
            where: { churchId },
            create: {
                churchId,
                tier,
                paidAmount: product.amount / 100,
                paidAt: new Date(),
                stripePaymentId: paypalOrderId, // Reusing field name for now or could rename in prisma
                isActive: true,
                activatedAt: new Date(),
                announcementsLimit: tier === 'BASIC' ? 3 : null,
                adminsLimit: tier === 'BASIC' ? 1 : tier === 'PRO' ? 3 : 10,
            },
            update: {
                tier,
                paidAmount: product.amount / 100,
                paidAt: new Date(),
                stripePaymentId: paypalOrderId,
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

        return { success: true, tier };
    }
}
