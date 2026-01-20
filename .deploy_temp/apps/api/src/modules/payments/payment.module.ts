import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
    imports: [ConfigModule, PrismaModule],
    providers: [PaymentService],
    controllers: [PaymentController],
    exports: [PaymentService],
})
export class PaymentModule { }
