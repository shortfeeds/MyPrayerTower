import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

// Google Play API types
interface GooglePlaySubscriptionResponse {
    kind: string;
    startTimeMillis: string;
    expiryTimeMillis: string;
    autoRenewing: boolean;
    priceCurrencyCode: string;
    priceAmountMicros: string;
    paymentState: number; // 0 = pending, 1 = received, 2 = free trial, 3 = pending deferred
    cancelReason?: number;
    orderId: string;
    purchaseType?: number;
    acknowledgementState: number; // 0 = not acknowledged, 1 = acknowledged
}

interface GooglePlayPurchaseResponse {
    kind: string;
    purchaseTimeMillis: string;
    purchaseState: number; // 0 = purchased, 1 = canceled, 2 = pending
    consumptionState: number; // 0 = not consumed, 1 = consumed
    orderId: string;
    purchaseType?: number;
    acknowledgementState: number;
}

export interface VerifyPurchaseResult {
    success: boolean;
    tier?: string;
    expiresAt?: Date;
    error?: string;
}

@Injectable()
export class GooglePlayService {
    private readonly logger = new Logger(GooglePlayService.name);
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    // Product to tier mapping
    private readonly PRODUCT_TIERS: Record<string, string> = {
        plus_monthly: 'PLUS',
        plus_yearly: 'PLUS',
        premium_monthly: 'PREMIUM',
        premium_yearly: 'PREMIUM',
        lifetime: 'LIFETIME',
    };

    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) { }

    /**
     * Check if Google Play verification is configured
     */
    isConfigured(): boolean {
        return !!(
            this.config.get('GOOGLE_PLAY_CLIENT_EMAIL') &&
            this.config.get('GOOGLE_PLAY_PRIVATE_KEY') &&
            this.config.get('ANDROID_PACKAGE_NAME')
        );
    }

    /**
     * Get OAuth access token for Google Play API
     */
    private async getAccessToken(): Promise<string> {
        // Return cached token if still valid
        if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
            return this.accessToken;
        }

        const clientEmail = this.config.get<string>('GOOGLE_PLAY_CLIENT_EMAIL');
        const privateKey = this.config.get<string>('GOOGLE_PLAY_PRIVATE_KEY')?.replace(/\\n/g, '\n');

        if (!clientEmail || !privateKey) {
            throw new BadRequestException('Google Play service account not configured');
        }

        try {
            // Create JWT for service account authentication
            const jwt = await this.createServiceAccountJWT(clientEmail, privateKey);

            // Exchange JWT for access token
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    assertion: jwt,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Token exchange failed: ${error}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);

            return this.accessToken!;
        } catch (error: any) {
            this.logger.error('Failed to get Google Play access token:', error);
            throw new BadRequestException('Failed to authenticate with Google Play');
        }
    }

    /**
     * Create JWT for service account authentication
     */
    private async createServiceAccountJWT(clientEmail: string, privateKey: string): Promise<string> {
        const header = {
            alg: 'RS256',
            typ: 'JWT',
        };

        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: clientEmail,
            scope: 'https://www.googleapis.com/auth/androidpublisher',
            aud: 'https://oauth2.googleapis.com/token',
            iat: now,
            exp: now + 3600,
        };

        const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signatureInput = `${base64Header}.${base64Payload}`;

        // Sign with private key
        const crypto = await import('crypto');
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(signatureInput);
        const signature = sign.sign(privateKey, 'base64url');

        return `${signatureInput}.${signature}`;
    }

    /**
     * Verify a subscription purchase with Google Play
     */
    async verifySubscription(
        userId: string,
        productId: string,
        purchaseToken: string,
    ): Promise<VerifyPurchaseResult> {
        if (!this.isConfigured()) {
            return { success: false, error: 'Google Play not configured' };
        }

        try {
            const packageName = this.config.get<string>('ANDROID_PACKAGE_NAME');
            const accessToken = await this.getAccessToken();

            const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const error = await response.text();
                this.logger.error(`Google Play API error: ${error}`);
                return { success: false, error: 'Failed to verify subscription' };
            }

            const data: GooglePlaySubscriptionResponse = await response.json();

            // Check payment state: 1 = received, 2 = free trial
            if (data.paymentState !== 1 && data.paymentState !== 2) {
                return { success: false, error: 'Payment not completed' };
            }

            const tier = this.PRODUCT_TIERS[productId] || 'PLUS';
            const expiresAt = new Date(parseInt(data.expiryTimeMillis));

            // Update user subscription
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    subscriptionTier: tier as any,
                    subscriptionEnds: expiresAt,
                    subscriptionSource: 'GOOGLE_PLAY',
                    googlePlayPurchaseToken: purchaseToken,
                    googlePlaySubscriptionId: productId,
                    googlePlayOrderId: data.orderId,
                },
            });

            // Record purchase event
            await this.prisma.purchaseEvent.create({
                data: {
                    userId,
                    source: 'GOOGLE_PLAY',
                    productId,
                    productType: 'subscription',
                    purchaseToken,
                    transactionId: data.orderId,
                    orderId: data.orderId,
                    status: 'COMPLETED',
                    currency: data.priceCurrencyCode,
                    amount: Math.round(parseInt(data.priceAmountMicros) / 10000), // Convert micros to cents
                    purchasedAt: new Date(parseInt(data.startTimeMillis)),
                    expiresAt,
                    acknowledgedAt: data.acknowledgementState === 1 ? new Date() : null,
                    rawPayload: data as any,
                },
            });

            this.logger.log(`User ${userId} subscribed to ${tier} via Google Play (${productId})`);

            return { success: true, tier, expiresAt };
        } catch (error: any) {
            this.logger.error('Subscription verification failed:', error);
            return { success: false, error: error.message || 'Verification failed' };
        }
    }

    /**
     * Verify a one-time purchase (lifetime) with Google Play
     */
    async verifyPurchase(
        userId: string,
        productId: string,
        purchaseToken: string,
    ): Promise<VerifyPurchaseResult> {
        if (!this.isConfigured()) {
            return { success: false, error: 'Google Play not configured' };
        }

        try {
            const packageName = this.config.get<string>('ANDROID_PACKAGE_NAME');
            const accessToken = await this.getAccessToken();

            const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const error = await response.text();
                this.logger.error(`Google Play API error: ${error}`);
                return { success: false, error: 'Failed to verify purchase' };
            }

            const data: GooglePlayPurchaseResponse = await response.json();

            // Check purchase state: 0 = purchased
            if (data.purchaseState !== 0) {
                return { success: false, error: 'Purchase not completed' };
            }

            const tier = this.PRODUCT_TIERS[productId] || 'LIFETIME';

            // Update user subscription (lifetime never expires)
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    subscriptionTier: tier as any,
                    subscriptionEnds: null, // Lifetime never expires
                    subscriptionSource: 'GOOGLE_PLAY',
                    googlePlayPurchaseToken: purchaseToken,
                    googlePlayOrderId: data.orderId,
                },
            });

            // Record purchase event
            await this.prisma.purchaseEvent.create({
                data: {
                    userId,
                    source: 'GOOGLE_PLAY',
                    productId,
                    productType: 'one_time',
                    purchaseToken,
                    transactionId: data.orderId,
                    orderId: data.orderId,
                    status: 'COMPLETED',
                    purchasedAt: new Date(parseInt(data.purchaseTimeMillis)),
                    acknowledgedAt: data.acknowledgementState === 1 ? new Date() : null,
                    rawPayload: data as any,
                },
            });

            this.logger.log(`User ${userId} purchased lifetime via Google Play`);

            return { success: true, tier };
        } catch (error: any) {
            this.logger.error('Purchase verification failed:', error);
            return { success: false, error: error.message || 'Verification failed' };
        }
    }

    /**
     * Acknowledge a purchase (required within 3 days)
     */
    async acknowledgePurchase(
        productId: string,
        purchaseToken: string,
        isSubscription: boolean,
    ): Promise<boolean> {
        if (!this.isConfigured()) {
            return false;
        }

        try {
            const packageName = this.config.get<string>('ANDROID_PACKAGE_NAME');
            const accessToken = await this.getAccessToken();

            const endpoint = isSubscription
                ? `subscriptions/${productId}/tokens/${purchaseToken}:acknowledge`
                : `products/${productId}/tokens/${purchaseToken}:acknowledge`;

            const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/${endpoint}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.text();
                this.logger.error(`Failed to acknowledge purchase: ${error}`);
                return false;
            }

            return true;
        } catch (error: any) {
            this.logger.error('Acknowledge purchase failed:', error);
            return false;
        }
    }
}
