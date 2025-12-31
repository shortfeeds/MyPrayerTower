import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { PlatformDonationsService } from './platform-donations.service';
import { PlatformDonationsController } from './platform-donations.controller';
import { CashfreeModule } from '../cashfree/cashfree.module';

@Module({
    imports: [ConfigModule, PrismaModule, CashfreeModule],
    providers: [PlatformDonationsService],
    controllers: [PlatformDonationsController],
    exports: [PlatformDonationsService],
})
export class PlatformDonationsModule { }
