import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

export interface PushNotification {
    playerId: string; // Maps to FCM Registration Token
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}

export interface TopicNotification {
    segment: string; // Maps to FCM Topic
    title: string;
    body: string;
    data?: Record<string, string>;
}

@Injectable()
export class PushNotificationService implements OnModuleInit {
    private readonly logger = new Logger(PushNotificationService.name);

    onModuleInit() {
        this.initializeFirebase();
    }

    private initializeFirebase() {
        if (admin.apps.length > 0) {
            this.logger.debug('Firebase Admin already initialized');
            return;
        }

        const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

        try {
            if (fs.existsSync(serviceAccountPath)) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const serviceAccount = require(serviceAccountPath);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                this.logger.log('Firebase Admin initialized successfully with service account');
            } else {
                this.logger.warn(`Firebase Service Account not found at ${serviceAccountPath}. Push notifications will fail until this file is added.`);
                // Attempt default initialization in case env vars are set
                admin.initializeApp();
            }
        } catch (error) {
            this.logger.error('Failed to initialize Firebase Admin', error);
        }
    }

    /**
     * Send push notification to a specific device (FCM Token)
     */
    async sendToDevice(notification: PushNotification): Promise<boolean> {
        try {
            if (!notification.playerId) return false;

            await admin.messaging().send({
                token: notification.playerId,
                notification: {
                    title: notification.title,
                    body: notification.body,
                    imageUrl: notification.imageUrl,
                },
                data: notification.data || {},
                android: {
                    notification: {
                        imageUrl: notification.imageUrl,
                    }
                },
                apns: notification.imageUrl ? {
                    payload: {
                        aps: {
                            'mutable-content': 1
                        }
                    },
                    fcmOptions: {
                        imageUrl: notification.imageUrl
                    }
                } : undefined
            });
            return true;
        } catch (error) {
            this.logger.error(`FCM Send Error (Device: ${notification.playerId})`, error);
            return false;
        }
    }

    /**
     * Send notification to multiple devices (FCM Tokens)
     */
    async sendToDevices(playerIds: string[], title: string, body: string, data?: Record<string, string>): Promise<number> {
        if (playerIds.length === 0) return 0;

        // Use sendEachForMulticast
        try {
            const message: admin.messaging.MulticastMessage = {
                tokens: playerIds,
                notification: {
                    title: title,
                    body: body,
                },
                data: data || {},
            };

            const response = await admin.messaging().sendEachForMulticast(message);

            if (response.failureCount > 0) {
                this.logger.warn(`FCM Multicast: ${response.successCount} success, ${response.failureCount} failed.`);
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        // Ideally disable/remove bad tokens here
                        this.logger.debug(`Token failed: ${playerIds[idx]} - ${resp.error?.message}`);
                    }
                });
            }

            return response.successCount;
        } catch (error) {
            this.logger.error('FCM Multicast Error', error);
            return 0;
        }
    }

    /**
     * Send notification to a specific Topic (Segment)
     */
    async sendToSegment(segment: string, title: string, body: string, data?: Record<string, string>): Promise<boolean> {
        try {
            // Convert segment name to valid topic if needed (remove spaces etc)
            // For now assume segment matches topic name
            const topic = segment.replace(/[^a-zA-Z0-9-_.~%]/g, '_');

            await admin.messaging().send({
                topic: topic,
                notification: {
                    title: title,
                    body: body,
                },
                data: data || {},
            });
            return true;
        } catch (error) {
            this.logger.error(`FCM Topic Send Error (${segment})`, error);
            return false;
        }
    }

    // ============ Specific Notification Types ============

    async notifyPrayerReceived(playerId: string, prayerTitle: string, count: number) {
        return this.sendToDevice({
            playerId,
            title: '🙏 Someone is praying for you!',
            body: count === 1
                ? `Someone is praying for "${prayerTitle.substring(0, 50)}..."`
                : `${count} people are praying for your intention`,
            data: { type: 'prayer_received', screen: 'prayer-wall' },
        });
    }

    async notifyPrayerApproved(playerId: string, prayerId: string) {
        return this.sendToDevice({
            playerId,
            title: '✅ Prayer Request Published',
            body: 'Your prayer request has been approved and is now visible on the Prayer Wall.',
            data: { type: 'prayer_approved', prayerId, screen: 'prayer-wall' },
        });
    }

    async sendDailyReminder(playerId: string, userName: string) {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

        return this.sendToDevice({
            playerId,
            title: `${greeting}, ${userName} 🙏`,
            body: 'Take a moment to pray and check in with the community.',
            data: { type: 'daily_reminder', screen: 'home' },
        });
    }
}
