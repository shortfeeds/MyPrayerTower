import { Controller, Post, Body, UseGuards, Request, Get, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GooglePlayService } from './google-play.service';
import { PrismaService } from '../../prisma/prisma.service';

interface VerifyGooglePurchaseDto {
    productId: string;
    purchaseToken: string;
    transactionId?: string;
}

@Controller('purchases')
export class PurchasesController {
    constructor(
        private googlePlayService: GooglePlayService,
        private prisma: PrismaService,
    ) { }

    /**
     * Verify a Google Play purchase (subscription or one-time)
     */
    @Post('verify-google')
    @UseGuards(JwtAuthGuard)
    async verifyGooglePurchase(
        @Request() req: any,
        @Body() body: VerifyGooglePurchaseDto,
    ) {
        const userId = req.user.id || req.user.sub;
        const { productId, purchaseToken } = body;

        if (!productId || !purchaseToken) {
            throw new BadRequestException('Missing productId or purchaseToken');
        }

        // Determine if this is a subscription or one-time purchase
        const isSubscription = productId.includes('monthly') || productId.includes('yearly');

        if (isSubscription) {
            return this.googlePlayService.verifySubscription(userId, productId, purchaseToken);
        } else {
            return this.googlePlayService.verifyPurchase(userId, productId, purchaseToken);
        }
    }

    /**
     * Get user's current subscription status
     */
    @Get('status')
    @UseGuards(JwtAuthGuard)
    async getSubscriptionStatus(@Request() req: any) {
        const userId = req.user.id || req.user.sub;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscriptionTier: true,
                subscriptionEnds: true,
                subscriptionSource: true,
            },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Check if subscription is still active
        const isActive =
            user.subscriptionTier === 'LIFETIME' ||
            (user.subscriptionEnds && new Date(user.subscriptionEnds) > new Date());

        return {
            tier: isActive ? user.subscriptionTier : 'FREE',
            isActive,
            expiresAt: user.subscriptionEnds,
            source: user.subscriptionSource,
            features: this.getFeatures(isActive ? user.subscriptionTier : 'FREE'),
        };
    }

    /**
     * Restore purchases (verify all previous purchases)
     */
    @Post('restore')
    @UseGuards(JwtAuthGuard)
    async restorePurchases(
        @Request() req: any,
        @Body() body: { purchases: Array<{ productId: string; purchaseToken: string }> },
    ) {
        const userId = req.user.id || req.user.sub;
        const results: Array<{ productId: string; success: boolean; error?: string }> = [];

        for (const purchase of body.purchases || []) {
            const isSubscription = purchase.productId.includes('monthly') || purchase.productId.includes('yearly');

            let result;
            if (isSubscription) {
                result = await this.googlePlayService.verifySubscription(
                    userId,
                    purchase.productId,
                    purchase.purchaseToken,
                );
            } else {
                result = await this.googlePlayService.verifyPurchase(
                    userId,
                    purchase.productId,
                    purchase.purchaseToken,
                );
            }

            results.push({
                productId: purchase.productId,
                success: result.success,
                error: result.error,
            });
        }

        return { results };
    }

    /**
     * Get user's purchase history
     */
    @Get('history')
    @UseGuards(JwtAuthGuard)
    async getPurchaseHistory(@Request() req: any) {
        const userId = req.user.id || req.user.sub;

        const purchases = await this.prisma.purchaseEvent.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
            select: {
                id: true,
                productId: true,
                productType: true,
                source: true,
                status: true,
                amount: true,
                currency: true,
                purchasedAt: true,
                expiresAt: true,
            },
        });

        return { purchases };
    }

    /**
     * Get features for a subscription tier
     */
    private getFeatures(tier: string) {
        return {
            adFree: tier !== 'FREE',
            offlineMode: tier !== 'FREE',
            audioPrayers: tier !== 'FREE',
            familyMembers: tier === 'FREE' ? 0 : tier === 'PLUS' ? 2 : 5,
            aiSuggestions: ['PREMIUM', 'LIFETIME'].includes(tier),
            prioritySupport: ['PREMIUM', 'LIFETIME'].includes(tier),
        };
    }
}
