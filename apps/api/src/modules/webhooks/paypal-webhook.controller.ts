import { Controller, Post, Body, Headers, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FailedPaymentsService } from '../failed-payments/failed-payments.service';
import { PaymentType } from '@prisma/client';

@Controller('webhooks/paypal')
export class PayPalWebhookController {
    private readonly logger = new Logger(PayPalWebhookController.name);

    constructor(
        private configService: ConfigService,
        private failedPaymentsService: FailedPaymentsService,
    ) {}

    @Post()
    async handleWebhook(@Body() event: any, @Headers('paypal-transmission-id') transmissionId: string) {
        this.logger.log(`Received PayPal Webhook: ${event.event_type} (ID: ${transmissionId})`);

        // Note: Real production code should verify the signature here
        // For now, we process common failure events

        try {
            switch (event.event_type) {
                case 'PAYMENT.CAPTURE.DENIED':
                case 'PAYMENT.CAPTURE.DECLINED':
                    await this.handleCaptureFailure(event);
                    break;
                case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
                    await this.handleSubscriptionFailure(event);
                    break;
                case 'CHECKOUT.ORDER.APPROVED':
                    // This is usually a success, but if we need to track pending/failed approvals
                    break;
            }
        } catch (error) {
            this.logger.error(`Error processing PayPal webhook: ${error.message}`);
        }

        return { received: true };
    }

    private async handleCaptureFailure(event: any) {
        const resource = event.resource;
        const metadata = resource.custom_id || resource.reference_id;
        
        await this.failedPaymentsService.log({
            userId: null, // We'd need to look this up via custom_id or email
            userEmail: resource.payer?.email_address || 'unknown@paypal.com',
            amount: Math.round(parseFloat(resource.amount?.value || '0') * 100),
            currency: resource.amount?.currency_code || 'USD',
            paymentType: PaymentType.DONATION, // Usually donations or mass offerings
            failureReason: resource.status_details?.reason || 'PayPal Capture Denied',
            stripeSessionId: resource.id, // Reusing field for PayPal IDs
            metadata: {
                paypalEventId: event.id,
                resourceId: resource.id,
                status: resource.status,
                custom_id: metadata,
            }
        });
    }

    private async handleSubscriptionFailure(event: any) {
        const resource = event.resource;
        
        await this.failedPaymentsService.log({
            userId: null,
            userEmail: resource.subscriber?.email_address || 'unknown@paypal.com',
            amount: Math.round(parseFloat(resource.billing_info?.last_payment?.amount?.value || '0') * 100),
            currency: resource.billing_info?.last_payment?.amount?.currency_code || 'USD',
            paymentType: PaymentType.SUBSCRIPTION,
            failureReason: 'PayPal Subscription Payment Failed',
            stripeSessionId: resource.id,
            metadata: {
                subscriptionId: resource.id,
                planId: resource.plan_id,
                last_failed_payment: resource.billing_info?.last_failed_payment,
            }
        });
    }
}
