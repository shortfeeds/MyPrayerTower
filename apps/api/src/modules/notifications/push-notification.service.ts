
import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export interface PushNotification {
    playerId: string; // Storing FCM Token here
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}

@Injectable()
export class PushNotificationService {
    private readonly logger = new Logger(PushNotificationService.name);

    constructor(private configService: ConfigService) {
        if (!admin.apps.length) {
            try {
                // Try to load service account from root of apps/api
                // Use require to handle JSON parsing easily, assuming file exists in CWD or parallel to src
                let credential;
                try {
                    // Start by checking if we are in dev (src access) or prod (dist access)
                    // But typically process.cwd() is project root.
                    const serviceAccount = require(require('path').resolve('firebase-service-account.json'));
                    credential = admin.credential.cert(serviceAccount);
                    this.logger.log('Loaded Firebase Admin credentials from local JSON file.');
                } catch (e) {
                    this.logger.warn('Local firebase-service-account.json not found, falling back to GOOGLE_APPLICATION_CREDENTIALS');
                    credential = admin.credential.applicationDefault();
                }

                admin.initializeApp({
                    credential: credential,
                });
                this.logger.log('Firebase Admin SDK Initialized');
            } catch (error) {
                this.logger.warn(`Firebase Admin Init Failed: ${error.message}. Notifications will explicitly fail.`);
            }
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
                data: notification.data,
                android: {
                    notification: {
                        imageUrl: notification.imageUrl,
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            'mutable-content': 1
                        }
                    },
                    fcmOptions: notification.imageUrl ? {
                        imageUrl: notification.imageUrl
                    } : undefined
                }
            });
            return true;
        } catch (error) {
            this.logger.error(`Failed to send FCM message: ${error.message}`);
            return false;
        }
    }

    /**
     * Send notification to multiple devices (FCM Tokens)
     */
    async sendToDevices(playerIds: string[], title: string, body: string, data?: Record<string, string>): Promise<number> {
        if (playerIds.length === 0) return 0;

        // FCM multicast is legacy? No, sendEachForMulticast is available.
        // Or batching.
        try {
            const messages = playerIds.map(token => ({
                token,
                notification: { title, body },
                data,
            }));

            // Send in batches of 500
            const batchSize = 500;
            let successCount = 0;

            for (let i = 0; i < messages.length; i += batchSize) {
                const batch = messages.slice(i, i + batchSize);
                const response = await admin.messaging().sendEach(batch);
                successCount += response.successCount;
            }

            return successCount;
        } catch (error) {
            this.logger.error(`Batch send failed: ${error.message}`);
            return 0;
        }
    }

    /**
     * Send notification to a Segment (Topic)
     */
    async sendToSegment(segment: string, title: string, body: string, data?: Record<string, string>): Promise<boolean> {
        try {
            // Map segment names to valid topic names (no spaces)
            const topic = segment.replace(/\s+/g, '_').toLowerCase();

            await admin.messaging().send({
                topic: topic,
                notification: { title, body },
                data,
            });
            return true;
        } catch (error) {
            this.logger.error(`Topic send failed: ${error.message}`);
            return false;
        }
    }

    // ============ Specific Notification Types (Wrappers) ============

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
