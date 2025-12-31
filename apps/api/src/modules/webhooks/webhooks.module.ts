import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CashfreeWebhooksController } from './cashfree-webhooks.controller';
import { CashfreeModule } from '../cashfree/cashfree.module';
import { MassOfferingsModule } from '../mass-offerings/mass-offerings.module';
import { PlatformDonationsModule } from '../platform-donations/platform-donations.module';

@Module({
    imports: [
        ConfigModule,
        CashfreeModule,
        MassOfferingsModule,
        PlatformDonationsModule,
    ],
    controllers: [CashfreeWebhooksController],
})
export class WebhooksModule { }
