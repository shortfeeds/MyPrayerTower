import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PushNotificationService } from './push-notification.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [PrismaModule, ConfigModule],
    controllers: [NotificationsController],
    providers: [NotificationsService, PushNotificationService],
    exports: [NotificationsService, PushNotificationService]
})
export class NotificationsModule { }
