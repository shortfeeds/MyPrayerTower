import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PushNotificationService } from './push-notification.service';
import { NotificationType, NotificationAudience, NotificationStatus, DeliveryStatus } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private prisma: PrismaService,
        private pushService: PushNotificationService
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async handleDailyReminders() {
        this.logger.log('Sending daily prayer reminders...');
        const users = await this.prisma.user.findMany({
            where: {
                notificationsEnabled: true,
                deviceTokens: { some: { isActive: true } }
            },
            include: { deviceTokens: true },
            take: 500
        });

        this.logger.log(`Found ${users.length} users for daily reminders.`);

        for (const user of users) {
            const tokens = user.deviceTokens.filter(t => t.isActive).map(t => t.token);
            for (const token of tokens) {
                try {
                    await this.pushService.sendDailyReminder(token, user.firstName || 'Friend');
                } catch (e) {
                    this.logger.error(`Failed to send reminder to user ${user.id}: ${e.message}`);
                }
            }
        }
    }

    async registerDevice(userId: string, token: string, platform: string) {
        return this.prisma.deviceToken.upsert({
            where: { token },
            update: {
                userId,
                platform,
                isActive: true,
                updatedAt: new Date()
            },
            create: {
                userId,
                token,
                platform,
                isActive: true
            }
        });
    }

    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { receivers: true }
                    }
                }
            }),
            this.prisma.notification.count()
        ]);

        return {
            notifications: notifications.map(n => ({
                ...n,
                recipientCount: n._count.receivers
            })),
            total,
            page,
            limit
        };
    }

    async create(data: {
        title: string;
        message: string;
        type: NotificationType;
        targetAudience: NotificationAudience;
        scheduledFor?: Date;
        createdBy?: string;
    }) {
        const notification = await this.prisma.notification.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type,
                targetAudience: data.targetAudience,
                scheduledFor: data.scheduledFor,
                // Status is SCHEDULED if scheduledFor is set, else DRAFT (until sent)
                status: data.scheduledFor ? NotificationStatus.SCHEDULED : NotificationStatus.DRAFT,
                createdBy: data.createdBy
            }
        });

        // Use Prisma's create result
        return notification;
    }

    async send(id: string) {
        const notification = await this.prisma.notification.findUnique({
            where: { id }
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        if (notification.status === NotificationStatus.SENT) {
            return notification; // Already sent
        }

        // Determine audience
        let users: { id: string }[] = [];

        // Using raw queries or just fetching IDs for massive lists might be better, 
        // but for now prisma findMany is fine for reasonable user counts (up to 10k)
        if (notification.targetAudience === NotificationAudience.ALL) {
            users = await this.prisma.user.findMany({ select: { id: true } });
        } else if (notification.targetAudience === NotificationAudience.PREMIUM) {
            users = await this.prisma.user.findMany({
                where: { subscriptionTier: { in: ['PLUS', 'PREMIUM', 'LIFETIME'] } },
                select: { id: true }
            });
        } else if (notification.targetAudience === NotificationAudience.FREE) {
            users = await this.prisma.user.findMany({
                where: { subscriptionTier: 'FREE' },
                select: { id: true }
            });
        } else if (notification.targetAudience === NotificationAudience.SPECIFIC) {
            // For SPECIFIC, receivers might have been pre-created. Check receivers.
            const explicitReceivers = await this.prisma.notificationReceiver.findMany({
                where: { notificationId: id },
                select: { userId: true }
            });
            users = explicitReceivers.map(r => ({ id: r.userId }));
            // Avoiding duplicate creation below if they already exist
        }

        if (users.length === 0) {
            // No users to send to
            await this.prisma.notification.update({
                where: { id },
                data: { status: NotificationStatus.FAILED, metadata: { error: 'No recipients found' } }
            });
            return notification;
        }

        // Create notification receivers (only for those who don't have one yet)
        // Prisma createMany is efficient
        // Batch insert if needed (prisma supports it locally, but handle potential limits)
        // PostgreSQL max parameters is 65535. Each row has 3 params -> ~21k rows limit per batch.
        // We'll trust prisma to handle or do simple batching if robust.
        if (notification.targetAudience !== NotificationAudience.SPECIFIC) {
            const receivers = users.map(u => ({
                notificationId: id,
                userId: u.id,
                status: DeliveryStatus.PENDING
            }));

            await this.prisma.notificationReceiver.createMany({
                data: receivers,
                skipDuplicates: true
            });
        }

        // Fetch tokens for these users
        const userIds = users.map(u => u.id);
        const tokens = await this.prisma.deviceToken.findMany({
            where: {
                userId: { in: userIds },
                isActive: true
            },
            select: { token: true }
        });

        const deviceTokens = tokens.map(t => t.token);

        if (deviceTokens.length > 0) {
            if (notification.type === NotificationType.PUSH || notification.type === NotificationType.ALL) {
                this.logger.log(`Sending OneSignal push to ${deviceTokens.length} devices...`);
                await this.pushService.sendToDevices(
                    deviceTokens,
                    notification.title,
                    notification.message,
                    { notificationId: id }
                );
            }
        }

        // Update status
        const updated = await this.prisma.notification.update({
            where: { id },
            data: {
                status: NotificationStatus.SENT,
                sentAt: new Date()
            }
        });

        return updated;
    }
}
