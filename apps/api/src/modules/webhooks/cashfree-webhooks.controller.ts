import { Controller, Post, Req, Res, BadRequestException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CashfreeService } from '../cashfree/cashfree.service';
import { MassOfferingsService } from '../mass-offerings/mass-offerings.service';
import { PlatformDonationsService } from '../platform-donations/platform-donations.service';

@Controller('webhooks')
export class CashfreeWebhooksController {
    private readonly logger = new Logger(CashfreeWebhooksController.name);

    constructor(
        private configService: ConfigService,
        private cashfreeService: CashfreeService,
        private massOfferingsService: MassOfferingsService,
        private platformDonationsService: PlatformDonationsService,
    ) { }

    @Post('cashfree')
    async handleCashfreeWebhook(@Req() req: Request, @Res() res: Response) {
        const signature = req.headers['x-webhook-signature'] as string;
        const timestamp = req.headers['x-webhook-timestamp'] as string;
        const rawBody = (req as any).rawBody || JSON.stringify(req.body);

        // Verify webhook signature
        if (signature && timestamp) {
            const isValid = this.cashfreeService.verifyWebhookSignature(signature, timestamp, rawBody);
            if (!isValid) {
                this.logger.warn('Invalid Cashfree webhook signature');
                return res.status(400).json({ error: 'Invalid signature' });
            }
        } else {
            this.logger.warn('Missing webhook signature headers');
            // In development, we might proceed without verification
            if (this.configService.get('NODE_ENV') === 'production') {
                return res.status(400).json({ error: 'Missing signature' });
            }
        }

        try {
            const webhookEvent = req.body;
            const eventType = webhookEvent.type || webhookEvent.event;

            this.logger.log(`Received Cashfree webhook: ${eventType}`);

            // Handle different event types
            switch (eventType) {
                case 'PAYMENT_SUCCESS':
                case 'ORDER_PAID':
                    await this.handlePaymentSuccess(webhookEvent);
                    break;

                case 'PAYMENT_FAILED':
                case 'PAYMENT_USER_DROPPED':
                    await this.handlePaymentFailed(webhookEvent);
                    break;

                case 'SUBSCRIPTION_ACTIVATED':
                case 'SUBSCRIPTION_ACTIVE':
                    await this.handleSubscriptionActivated(webhookEvent);
                    break;

                case 'SUBSCRIPTION_CANCELLED':
                case 'SUBSCRIPTION_EXPIRED':
                    await this.handleSubscriptionCancelled(webhookEvent);
                    break;

                case 'PAYMENT_REFUND':
                case 'REFUND_SUCCESS':
                    await this.handleRefund(webhookEvent);
                    break;

                default:
                    this.logger.log(`Unhandled webhook event type: ${eventType}`);
            }

            return res.status(200).json({ received: true });

        } catch (error: any) {
            this.logger.error(`Webhook processing error: ${error.message}`);
            return res.status(500).json({ error: 'Webhook processing failed' });
        }
    }

    /**
     * Handle successful payment
     */
    private async handlePaymentSuccess(event: any) {
        const paymentData = this.cashfreeService.parsePaymentWebhook(event);
        const orderId = paymentData.orderId;
        const transactionId = paymentData.transactionId;

        this.logger.log(`Processing successful payment for order: ${orderId}`);

        // Determine order type from order ID prefix
        if (orderId.startsWith('MO-')) {
            // Mass Offering
            await this.massOfferingsService.handlePaymentSuccess(orderId, transactionId);
            this.logger.log(`Mass Offering ${orderId} marked as paid`);

        } else if (orderId.startsWith('DON-')) {
            // Platform Donation
            await this.platformDonationsService.handleDonationPaymentSuccess(orderId, transactionId);
            this.logger.log(`Donation ${orderId} marked as completed`);

        } else {
            this.logger.warn(`Unknown order type for order: ${orderId}`);
        }
    }

    /**
     * Handle failed payment
     */
    private async handlePaymentFailed(event: any) {
        const data = event.data || event;
        const orderId = data.order?.order_id || data.order_id;

        this.logger.warn(`Payment failed for order: ${orderId}`);

        // TODO: Update order status to FAILED
        // TODO: Send failure notification email
    }

    /**
     * Handle subscription activation
     */
    private async handleSubscriptionActivated(event: any) {
        const data = event.data || event;
        const subscriptionId = data.subscription?.subscription_id || data.subscription_id;
        const customerId = data.customer?.customer_id || data.customer_id;
        const planId = data.subscription?.plan_id || data.plan_id;

        this.logger.log(`Subscription activated: ${subscriptionId}`);

        // Determine plan type from plan ID
        let plan = 'PRAYER_PARTNER'; // Default
        if (planId) {
            if (planId.includes('FAMILY')) plan = 'FAMILY_PLAN';
            else if (planId.includes('PATRON')) plan = 'PATRON_CIRCLE';
        }

        await this.platformDonationsService.handleSubscriptionSuccess(subscriptionId, customerId, plan);
    }

    /**
     * Handle subscription cancellation
     */
    private async handleSubscriptionCancelled(event: any) {
        const data = event.data || event;
        const subscriptionId = data.subscription?.subscription_id || data.subscription_id;

        this.logger.log(`Subscription cancelled: ${subscriptionId}`);

        // TODO: Update subscription status to CANCELLED
    }

    /**
     * Handle refund
     */
    private async handleRefund(event: any) {
        const data = event.data || event;
        const orderId = data.order?.order_id || data.order_id;
        const refundAmount = data.refund?.refund_amount || data.refund_amount;

        this.logger.log(`Refund processed for order ${orderId}: ${refundAmount}`);

        // TODO: Update order status to REFUNDED
    }
}
