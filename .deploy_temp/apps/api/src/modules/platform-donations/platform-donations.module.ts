import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { PlatformDonationsService } from './platform-donations.service';
import { PlatformDonationsController } from './platform-donations.controller';

@Module({
    imports: [ConfigModule, PrismaModule],
    providers: [PlatformDonationsService],
    controllers: [PlatformDonationsController],
    exports: [PlatformDonationsService],
})
export class PlatformDonationsModule { }
