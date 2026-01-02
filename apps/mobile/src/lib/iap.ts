/**
 * In-App Purchase Service for Google Play Billing
 * 
 * This service handles subscription purchases via Google Play Billing.
 * For one-time purchases (candles, donations), we use Cashfree via WebView.
 */

import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

// Product IDs - must match Google Play Console
export const SUBSCRIPTION_SKUS = {
    PLUS_MONTHLY: 'plus_monthly',
    PLUS_YEARLY: 'plus_yearly',
    PREMIUM_MONTHLY: 'premium_monthly',
    PREMIUM_YEARLY: 'premium_yearly',
} as const;

export const ONE_TIME_SKUS = {
    LIFETIME: 'lifetime',
} as const;

const ALL_SUBSCRIPTION_SKUS = Object.values(SUBSCRIPTION_SKUS);
const ALL_ONE_TIME_SKUS = Object.values(ONE_TIME_SKUS);

export interface ProductInfo {
    productId: string;
    title: string;
    description: string;
    price: string;
    priceAmount: number;
    currency: string;
    type: 'subscription' | 'one_time';
}

export interface PurchaseResult {
    success: boolean;
    productId?: string;
    transactionId?: string;
    error?: string;
}

class IAPService {
    private isInitialized = false;
    private purchaseUpdateSubscription: any = null;
    private purchaseErrorSubscription: any = null;
    private pendingPurchaseResolve: ((result: PurchaseResult) => void) | null = null;
    private authToken: string | null = null;
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    }

    /**
     * Set auth token for API calls
     */
    setAuthToken(token: string) {
        this.authToken = token;
    }

    /**
     * Initialize the IAP connection
     */
    async initialize(): Promise<boolean> {
        // Only works on Android for now
        if (Platform.OS !== 'android') {
            console.log('[IAP] iOS not supported yet');
            return false;
        }

        if (this.isInitialized) {
            return true;
        }

        try {
            const result = await RNIap.initConnection();
            console.log('[IAP] Connection initialized:', result);

            // Consume any pending purchases (for testing)
            await RNIap.flushFailedPurchasesCachedAsPendingAndroid();

            // Set up purchase listeners
            this.setupListeners();

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('[IAP] Failed to initialize:', error);
            return false;
        }
    }

    /**
     * Set up purchase event listeners
     */
    private setupListeners() {
        // Purchase update listener
        this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
            async (purchase: RNIap.Purchase | RNIap.SubscriptionPurchase) => {
                console.log('[IAP] Purchase updated:', purchase.productId);
                await this.handlePurchase(purchase);
            }
        );

        // Purchase error listener
        this.purchaseErrorSubscription = RNIap.purchaseErrorListener(
            (error: RNIap.PurchaseError) => {
                console.error('[IAP] Purchase error:', error);
                if (this.pendingPurchaseResolve) {
                    this.pendingPurchaseResolve({
                        success: false,
                        error: error.message || 'Purchase failed',
                    });
                    this.pendingPurchaseResolve = null;
                }
            }
        );
    }

    /**
     * Handle a completed purchase
     */
    private async handlePurchase(purchase: RNIap.Purchase | RNIap.SubscriptionPurchase) {
        const { productId, transactionId, purchaseToken } = purchase;

        if (!purchaseToken) {
            console.error('[IAP] No purchase token');
            if (this.pendingPurchaseResolve) {
                this.pendingPurchaseResolve({
                    success: false,
                    error: 'No purchase token received',
                });
                this.pendingPurchaseResolve = null;
            }
            return;
        }

        try {
            // Verify purchase with backend
            const verifyResult = await this.verifyPurchaseWithBackend({
                productId,
                purchaseToken,
                transactionId: transactionId || undefined,
            });

            if (verifyResult.success) {
                // Acknowledge the purchase (required within 3 days)
                await RNIap.finishTransaction({ purchase, isConsumable: false });
                console.log('[IAP] Purchase verified and acknowledged:', productId);

                if (this.pendingPurchaseResolve) {
                    this.pendingPurchaseResolve({
                        success: true,
                        productId,
                        transactionId: transactionId || undefined,
                    });
                    this.pendingPurchaseResolve = null;
                }
            } else {
                console.error('[IAP] Backend verification failed:', verifyResult.error);
                if (this.pendingPurchaseResolve) {
                    this.pendingPurchaseResolve({
                        success: false,
                        error: verifyResult.error || 'Verification failed',
                    });
                    this.pendingPurchaseResolve = null;
                }
            }
        } catch (error: any) {
            console.error('[IAP] Error handling purchase:', error);
            if (this.pendingPurchaseResolve) {
                this.pendingPurchaseResolve({
                    success: false,
                    error: error.message || 'Failed to process purchase',
                });
                this.pendingPurchaseResolve = null;
            }
        }
    }

    /**
     * Verify purchase with backend
     */
    private async verifyPurchaseWithBackend(data: {
        productId: string;
        purchaseToken: string;
        transactionId?: string;
    }): Promise<{ success: boolean; tier?: string; error?: string }> {
        if (!this.authToken) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/purchases/verify-google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.authToken}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Verification failed' };
            }

            return await response.json();
        } catch (error: any) {
            return { success: false, error: error.message || 'Network error' };
        }
    }

    /**
     * Get available subscriptions
     */
    async getSubscriptions(): Promise<ProductInfo[]> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const subscriptions = await RNIap.getSubscriptions({ skus: ALL_SUBSCRIPTION_SKUS });

            return subscriptions.map((sub) => ({
                productId: sub.productId,
                title: sub.title || sub.productId,
                description: sub.description || '',
                price: sub.localizedPrice || '',
                priceAmount: parseFloat(sub.price || '0'),
                currency: sub.currency || 'USD',
                type: 'subscription' as const,
            }));
        } catch (error) {
            console.error('[IAP] Failed to get subscriptions:', error);
            return [];
        }
    }

    /**
     * Get lifetime purchase product
     */
    async getLifetimeProduct(): Promise<ProductInfo | null> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const products = await RNIap.getProducts({ skus: ALL_ONE_TIME_SKUS });

            if (products.length === 0) return null;

            const product = products[0];
            return {
                productId: product.productId,
                title: product.title || 'Lifetime',
                description: product.description || '',
                price: product.localizedPrice || '',
                priceAmount: parseFloat(product.price || '0'),
                currency: product.currency || 'USD',
                type: 'one_time',
            };
        } catch (error) {
            console.error('[IAP] Failed to get lifetime product:', error);
            return null;
        }
    }

    /**
     * Purchase a subscription
     */
    async purchaseSubscription(productId: string): Promise<PurchaseResult> {
        if (!this.isInitialized) {
            const initialized = await this.initialize();
            if (!initialized) {
                return { success: false, error: 'IAP not available' };
            }
        }

        return new Promise(async (resolve) => {
            this.pendingPurchaseResolve = resolve;

            try {
                // For subscriptions, we need to get the offer token
                const subscriptions = await RNIap.getSubscriptions({ skus: [productId] });

                if (subscriptions.length === 0) {
                    this.pendingPurchaseResolve = null;
                    resolve({ success: false, error: 'Product not found' });
                    return;
                }

                const subscription = subscriptions[0];
                const offerToken = (subscription as any).subscriptionOfferDetails?.[0]?.offerToken || '';

                await RNIap.requestSubscription({
                    sku: productId,
                    subscriptionOffers: [{ sku: productId, offerToken }],
                });

                // The result will come through the purchase listener
            } catch (error: any) {
                this.pendingPurchaseResolve = null;
                resolve({
                    success: false,
                    error: error.message || 'Purchase failed',
                });
            }
        });
    }

    /**
     * Purchase lifetime access
     */
    async purchaseLifetime(): Promise<PurchaseResult> {
        if (!this.isInitialized) {
            const initialized = await this.initialize();
            if (!initialized) {
                return { success: false, error: 'IAP not available' };
            }
        }

        return new Promise(async (resolve) => {
            this.pendingPurchaseResolve = resolve;

            try {
                await RNIap.requestPurchase({ sku: ONE_TIME_SKUS.LIFETIME });
                // The result will come through the purchase listener
            } catch (error: any) {
                this.pendingPurchaseResolve = null;
                resolve({
                    success: false,
                    error: error.message || 'Purchase failed',
                });
            }
        });
    }

    /**
     * Restore previous purchases (for subscription recovery)
     */
    async restorePurchases(): Promise<PurchaseResult[]> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const purchases = await RNIap.getAvailablePurchases();
            const results: PurchaseResult[] = [];

            for (const purchase of purchases) {
                if (purchase.purchaseToken) {
                    const verifyResult = await this.verifyPurchaseWithBackend({
                        productId: purchase.productId,
                        purchaseToken: purchase.purchaseToken,
                        transactionId: purchase.transactionId || undefined,
                    });

                    results.push({
                        success: verifyResult.success,
                        productId: purchase.productId,
                        transactionId: purchase.transactionId || undefined,
                        error: verifyResult.error,
                    });
                }
            }

            return results;
        } catch (error: any) {
            console.error('[IAP] Failed to restore purchases:', error);
            return [];
        }
    }

    /**
     * Clean up listeners
     */
    cleanup() {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }

        RNIap.endConnection();
        this.isInitialized = false;
    }
}

// Singleton instance
export const iapService = new IAPService();
