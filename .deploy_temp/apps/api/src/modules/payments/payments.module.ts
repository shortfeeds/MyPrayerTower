import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PayPalService } from './paypal.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [PaymentsController],
    providers: [PayPalService],
    exports: [PayPalService],
})
export class PaymentsModule { }
