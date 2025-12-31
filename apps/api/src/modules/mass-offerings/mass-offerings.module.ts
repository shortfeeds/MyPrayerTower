import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { MassOfferingsService } from './mass-offerings.service';
import { MassOfferingsController } from './mass-offerings.controller';
import { CashfreeModule } from '../cashfree/cashfree.module';

@Module({
    imports: [ConfigModule, PrismaModule, CashfreeModule],
    providers: [MassOfferingsService],
    controllers: [MassOfferingsController],
    exports: [MassOfferingsService],
})
export class MassOfferingsModule { }
