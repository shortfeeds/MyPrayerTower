import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { MassOfferingsService } from './mass-offerings.service';
import { MassOfferingsController } from './mass-offerings.controller';


@Module({
    imports: [ConfigModule, PrismaModule],
    providers: [MassOfferingsService],
    controllers: [MassOfferingsController],
    exports: [MassOfferingsService],
})
export class MassOfferingsModule { }
