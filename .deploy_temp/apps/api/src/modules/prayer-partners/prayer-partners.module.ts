import { Module } from '@nestjs/common';
import { PrayerPartnersController } from './prayer-partners.controller';
import { PrayerPartnersService } from './prayer-partners.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [PrismaModule, NotificationsModule],
    controllers: [PrayerPartnersController],
    providers: [PrayerPartnersService],
    exports: [PrayerPartnersService],
})
export class PrayerPartnersModule { }
