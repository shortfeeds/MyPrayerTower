import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PayPalWebhookController } from './paypal-webhook.controller';
import { FailedPaymentsModule } from '../failed-payments/failed-payments.module';

@Module({
    imports: [
        ConfigModule,
        FailedPaymentsModule,
    ],
    controllers: [PayPalWebhookController],
})
export class WebhooksModule { }
