import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface PushNotification {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}

export interface TopicNotification {
    topic: string;
    title: string;
    body: string;
    data?: Record<string, string>;
}

@Injectable()
export class PushNotificationService {
    private readonly logger = new Logger(PushNotificationService.name);
    private firebaseApp: admin.app.App | null = null;

    constructor(private configService: ConfigService) {
        this.initializeFirebase();
    }

    private initializeFirebase() {
        const serviceAccount = this.configService.get('FIREBASE_SERVICE_ACCOUNT');

        if (serviceAccount) {
            try {
                this.firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert(JSON.parse(serviceAccount)),
                });
                this.logger.log('Firebase Admin initialized successfully');
            } catch (error) {
                this.logger.error('Failed to initialize Firebase Admin:', error);
            }
        } else {
            this.logger.warn('Firebase service account not configured - push notifications disabled');
        }
    }

    /**
     * Send push notification to a specific device
     */
    async sendToDevice(notification: PushNotification): Promise<boolean> {
        if (!this.firebaseApp) {
            this.logger.warn('Firebase not initialized - skipping push notification');
            return false;
        }

        try {
            const message: admin.messaging.Message = {
                token: notification.token,
                notification: {
                    title: notification.title,
                    body: notification.body,
                    imageUrl: notification.imageUrl,
                },
                data: notification.data,
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'default',
                        sound: 'default',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            badge: 1,
                            sound: 'default',
                        },
                    },
                },
            };

            await admin.messaging().send(message);
            this.logger.log(`Push sent to device: ${notification.token.substring(0, 20)}...`);
            return true;
        } catch (error: any) {
            this.logger.error('Failed to send push notification:', error.message);
            return false;
        }
    }

    /**
     * Send notification to multiple devices
     */
    async sendToDevices(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<number> {
        if (!this.firebaseApp || tokens.length === 0) return 0;

        const message: admin.messaging.MulticastMessage = {
            tokens,
            notification: { title, body },
            data,
        };

        try {
            const response = await admin.messaging().sendEachForMulticast(message);
            this.logger.log(`Sent to ${response.successCount}/${tokens.length} devices`);
            return response.successCount;
        } catch (error: any) {
            this.logger.error('Failed to send multicast:', error.message);
            return 0;
        }
    }

    /**
     * Send notification to a topic (e.g., all users, specific church)
     */
    async sendToTopic(notification: TopicNotification): Promise<boolean> {
        if (!this.firebaseApp) return false;

        try {
            await admin.messaging().send({
                topic: notification.topic,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data,
            });
            this.logger.log(`Push sent to topic: ${notification.topic}`);
            return true;
        } catch (error: any) {
            this.logger.error('Failed to send topic notification:', error.message);
            return false;
        }
    }

    /**
     * Subscribe device to a topic
     */
    async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
        if (!this.firebaseApp) return false;

        try {
            await admin.messaging().subscribeToTopic(tokens, topic);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Unsubscribe device from a topic
     */
    async unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean> {
        if (!this.firebaseApp) return false;

        try {
            await admin.messaging().unsubscribeFromTopic(tokens, topic);
            return true;
        } catch (error) {
            return false;
        }
    }

    // ============ Specific Notification Types ============

    /**
     * Notify user when someone prays for their request
     */
    async notifyPrayerReceived(userToken: string, prayerTitle: string, count: number) {
        return this.sendToDevice({
            token: userToken,
            title: '🙏 Someone is praying for you!',
            body: count === 1
                ? `Someone is praying for "${prayerTitle.substring(0, 50)}..."`
                : `${count} people are praying for your intention`,
            data: { type: 'prayer_received', screen: 'prayer-wall' },
        });
    }

    /**
     * Notify user their prayer was approved
     */
    async notifyPrayerApproved(userToken: string, prayerId: string) {
        return this.sendToDevice({
            token: userToken,
            title: '✅ Prayer Request Published',
            body: 'Your prayer request has been approved and is now visible on the Prayer Wall.',
            data: { type: 'prayer_approved', prayerId, screen: 'prayer-wall' },
        });
    }

    /**
     * Daily prayer reminder
     */
    async sendDailyReminder(userToken: string, userName: string) {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

        return this.sendToDevice({
            token: userToken,
            title: `${greeting}, ${userName} 🙏`,
            body: 'Take a moment to pray and check in with the community.',
            data: { type: 'daily_reminder', screen: 'home' },
        });
    }

    /**
     * Church event reminder (24h before)
     */
    async notifyUpcomingEvent(userToken: string, churchName: string, eventTitle: string, eventId: string) {
        return this.sendToDevice({
            token: userToken,
            title: `📅 Reminder: ${eventTitle}`,
            body: `Tomorrow at ${churchName}`,
            data: { type: 'event_reminder', eventId, screen: 'church' },
        });
    }
}
