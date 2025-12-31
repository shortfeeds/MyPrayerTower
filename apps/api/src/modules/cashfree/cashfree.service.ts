import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

interface CashfreeOrderRequest {
    order_id: string;
    order_amount: number;
    order_currency: string;
    customer_details: {
        customer_id: string;
        customer_name?: string;
        customer_email?: string;
        customer_phone: string;
    };
    order_meta?: {
        return_url?: string;
        notify_url?: string;
        payment_methods?: string;
    };
    order_note?: string;
    order_tags?: Record<string, string>;
}

interface CashfreeOrderResponse {
    cf_order_id: string;
    order_id: string;
    order_status: string;
    order_amount: number;
    order_currency: string;
    payment_session_id: string;
    order_expiry_time: string;
    created_at: string;
}

interface CashfreeSubscriptionPlanRequest {
    plan_id: string;
    plan_name: string;
    plan_type: 'PERIODIC' | 'ON_DEMAND';
    plan_currency: string;
    plan_recurring_amount: number;
    plan_max_amount?: number;
    plan_max_cycles?: number;
    plan_intervals: number;
    plan_interval_type: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
    plan_note?: string;
}

interface CashfreeSubscriptionRequest {
    subscription_id: string;
    plan_id: string;
    customer_details: {
        customer_id: string;
        customer_name?: string;
        customer_email?: string;
        customer_phone: string;
    };
    authorization_details?: {
        authorization_amount: number;
    };
    subscription_note?: string;
    subscription_tags?: Record<string, string>;
    return_url?: string;
}

@Injectable()
export class CashfreeService {
    private readonly logger = new Logger(CashfreeService.name);
    private readonly baseUrl: string;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly apiVersion = '2025-01-01';

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        const environment = this.configService.get('CASHFREE_ENVIRONMENT') || 'sandbox';
        this.baseUrl = environment === 'production'
            ? 'https://api.cashfree.com/pg'
            : 'https://sandbox.cashfree.com/pg';

        this.clientId = this.configService.get('CASHFREE_CLIENT_ID') || '';
        this.clientSecret = this.configService.get('CASHFREE_CLIENT_SECRET') || '';

        if (!this.clientId || !this.clientSecret) {
            this.logger.warn('Cashfree credentials not configured');
        } else {
            this.logger.log(`Cashfree initialized in ${environment} mode`);
        }
    }

    /**
     * Check if Cashfree is configured
     */
    isConfigured(): boolean {
        return !!(this.clientId && this.clientSecret);
    }

    /**
     * Get common headers for Cashfree API requests
     */
    private getHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'x-client-id': this.clientId,
            'x-client-secret': this.clientSecret,
            'x-api-version': this.apiVersion,
        };
    }

    /**
     * Create a payment order
     */
    async createOrder(request: CashfreeOrderRequest): Promise<CashfreeOrderResponse> {
        if (!this.isConfigured()) {
            throw new BadRequestException('Cashfree is not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/orders`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(request),
            });

            const data = await response.json();

            if (!response.ok) {
                this.logger.error(`Cashfree order creation failed: ${JSON.stringify(data)}`);
                throw new BadRequestException(data.message || 'Failed to create order');
            }

            this.logger.log(`Order created: ${data.order_id}`);
            return data;

        } catch (error: any) {
            this.logger.error(`Cashfree API error: ${error.message}`);
            throw new BadRequestException('Payment gateway error');
        }
    }

    /**
     * Get order status
     */
    async getOrder(orderId: string): Promise<CashfreeOrderResponse> {
        if (!this.isConfigured()) {
            throw new BadRequestException('Cashfree is not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new BadRequestException(data.message || 'Failed to get order');
            }

            return data;

        } catch (error: any) {
            this.logger.error(`Cashfree get order error: ${error.message}`);
            throw new BadRequestException('Payment gateway error');
        }
    }

    /**
     * Create checkout session for Mass Offering
     */
    async createMassOfferingCheckout(params: {
        orderNumber: string;
        amount: number; // in cents (will be converted to rupees/dollars)
        currency: string;
        customerEmail: string;
        customerPhone: string;
        customerName: string;
        customerId: string;
        returnUrl: string;
        notifyUrl?: string;
        metadata: Record<string, string>;
    }): Promise<{ paymentSessionId: string; orderId: string }> {
        const amountInUnits = params.amount / 100; // Convert cents to main currency unit

        const order = await this.createOrder({
            order_id: params.orderNumber,
            order_amount: amountInUnits,
            order_currency: params.currency,
            customer_details: {
                customer_id: params.customerId,
                customer_name: params.customerName,
                customer_email: params.customerEmail,
                customer_phone: params.customerPhone || '9999999999', // Required by Cashfree
            },
            order_meta: {
                return_url: `${params.returnUrl}?order_id=${params.orderNumber}`,
                notify_url: params.notifyUrl,
            },
            order_note: `Mass Offering - ${params.orderNumber}`,
            order_tags: params.metadata,
        });

        return {
            paymentSessionId: order.payment_session_id,
            orderId: order.order_id,
        };
    }

    /**
     * Create checkout session for Donation
     */
    async createDonationCheckout(params: {
        orderNumber: string;
        amount: number;
        currency: string;
        customerEmail: string;
        customerPhone: string;
        customerName: string;
        customerId: string;
        returnUrl: string;
        notifyUrl?: string;
        tier?: string;
        metadata?: Record<string, string>;
    }): Promise<{ paymentSessionId: string; orderId: string }> {
        const amountInUnits = params.amount / 100;

        const order = await this.createOrder({
            order_id: params.orderNumber,
            order_amount: amountInUnits,
            order_currency: params.currency,
            customer_details: {
                customer_id: params.customerId,
                customer_name: params.customerName,
                customer_email: params.customerEmail,
                customer_phone: params.customerPhone || '9999999999',
            },
            order_meta: {
                return_url: `${params.returnUrl}?order_id=${params.orderNumber}`,
                notify_url: params.notifyUrl,
            },
            order_note: `Donation - ${params.tier || 'Custom'}`,
            order_tags: {
                type: 'platform_donation',
                tier: params.tier || 'CUSTOM',
                ...params.metadata,
            },
        });

        return {
            paymentSessionId: order.payment_session_id,
            orderId: order.order_id,
        };
    }

    /**
     * Create subscription plan (one-time setup)
     */
    async createSubscriptionPlan(plan: CashfreeSubscriptionPlanRequest): Promise<any> {
        if (!this.isConfigured()) {
            throw new BadRequestException('Cashfree is not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/subscriptions/plans`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(plan),
            });

            const data = await response.json();

            if (!response.ok) {
                this.logger.error(`Subscription plan creation failed: ${JSON.stringify(data)}`);
                throw new BadRequestException(data.message || 'Failed to create plan');
            }

            this.logger.log(`Subscription plan created: ${plan.plan_id}`);
            return data;

        } catch (error: any) {
            this.logger.error(`Cashfree subscription plan error: ${error.message}`);
            throw new BadRequestException('Payment gateway error');
        }
    }

    /**
     * Create subscription for a customer
     */
    async createSubscription(params: {
        subscriptionId: string;
        planId: string;
        customerId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        returnUrl: string;
        notifyUrl?: string;
    }): Promise<{ subscriptionId: string; authLink: string }> {
        if (!this.isConfigured()) {
            throw new BadRequestException('Cashfree is not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/subscriptions`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    subscription_id: params.subscriptionId,
                    plan_id: params.planId,
                    customer_details: {
                        customer_id: params.customerId,
                        customer_name: params.customerName,
                        customer_email: params.customerEmail,
                        customer_phone: params.customerPhone || '9999999999',
                    },
                    return_url: params.returnUrl,
                    subscription_note: `Prayer Partner - ${params.planId}`,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                this.logger.error(`Subscription creation failed: ${JSON.stringify(data)}`);
                throw new BadRequestException(data.message || 'Failed to create subscription');
            }

            this.logger.log(`Subscription created: ${params.subscriptionId}`);
            return {
                subscriptionId: data.subscription_id,
                authLink: data.auth_link || data.authorization_link,
            };

        } catch (error: any) {
            this.logger.error(`Cashfree subscription error: ${error.message}`);
            throw new BadRequestException('Payment gateway error');
        }
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(signature: string, timestamp: string, rawBody: string): boolean {
        if (!this.clientSecret) {
            this.logger.error('Cannot verify webhook - client secret not configured');
            return false;
        }

        try {
            const payload = timestamp + rawBody;
            const expectedSignature = crypto
                .createHmac('sha256', this.clientSecret)
                .update(payload)
                .digest('base64');

            return signature === expectedSignature;
        } catch (error) {
            this.logger.error('Webhook signature verification failed');
            return false;
        }
    }

    /**
     * Parse webhook payment event
     */
    parsePaymentWebhook(body: any): {
        orderId: string;
        status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED';
        transactionId: string;
        amount: number;
        currency: string;
        paymentMethod: string;
    } {
        const data = body.data || body;
        const order = data.order || {};
        const payment = data.payment || {};

        return {
            orderId: order.order_id || data.order_id,
            status: payment.payment_status || data.payment_status || 'PENDING',
            transactionId: payment.cf_payment_id || data.cf_payment_id || '',
            amount: (order.order_amount || data.amount || 0) * 100, // Convert back to cents
            currency: order.order_currency || data.currency || 'INR',
            paymentMethod: payment.payment_method?.type || 'unknown',
        };
    }

    /**
     * Get checkout page URL for client-side redirect
     */
    getCheckoutUrl(paymentSessionId: string): string {
        const env = this.configService.get('CASHFREE_ENVIRONMENT') || 'sandbox';
        // For production, customer will use their own domain with Cashfree SDK
        // This URL is for informational purposes
        return env === 'production'
            ? `https://payments.cashfree.com/order/${paymentSessionId}`
            : `https://payments-test.cashfree.com/order/${paymentSessionId}`;
    }
}
