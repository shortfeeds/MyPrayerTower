import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import type { UserNotificationType } from '@prisma/client';
import webpush from 'web-push';
import * as admin from 'firebase-admin';

export interface ServerNotificationParams {
    userId: string;
    title: string;
    body: string;
    type?: UserNotificationType;
    data?: Record<string, any>;
    channelId?: string;
    sound?: string;
    imageUrl?: string;
}

export interface BroadcastNotificationParams {
    title: string;
    body: string;
    type?: UserNotificationType;
    data?: Record<string, any>;
    channelId?: string;
    sound?: string;
    imageUrl?: string;
}

export interface TopicNotificationParams {
    topic: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    channelId?: string;
    sound?: string;
    imageUrl?: string;
}

// ─────────────────────────────────────────────────────────────
// 1. WEBPUSH VAPID CONFIGURATION (Web browsers & PWAs)
// ─────────────────────────────────────────────────────────────
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || 'BGdBnesIbLMG_805ekmVmaBGIxmzpUlAFwMBJY23rFDffqe1XBD51jrmR0nps5rQIS9_ixo1PA1gR7GsyBFCgoM';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '_zJmIY5wuT-b4zbLiyv8SEnYkembOCupd3lwBXQzxW8';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:notifications@myprayertower.com';

let isVapidConfigured = false;
if (vapidPublicKey && vapidPrivateKey) {
    try {
        webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
        isVapidConfigured = true;
    } catch (e) {
        console.warn('[Notifications] VAPID setup warning:', e);
    }
}

// ─────────────────────────────────────────────────────────────
// 2. FIREBASE ADMIN FCM v1 CONFIGURATION (Native Android & iOS)
// ─────────────────────────────────────────────────────────────
let isFirebaseConfigured = false;

function initFirebaseAdmin(): boolean {
    if (admin.apps.length > 0) {
        isFirebaseConfigured = true;
        return true;
    }

    try {
        // Option A: Full JSON Service Account string or base64 in env
        const rawServiceKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (rawServiceKey) {
            let serviceAccount: any;
            if (rawServiceKey.trim().startsWith('{')) {
                serviceAccount = JSON.parse(rawServiceKey);
            } else {
                // Try base64 decoded
                const decoded = Buffer.from(rawServiceKey, 'base64').toString('utf-8');
                serviceAccount = JSON.parse(decoded);
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            isFirebaseConfigured = true;
            console.log('[Notifications] Firebase Admin initialized via service account key');
            return true;
        }

        // Option B: Individual env credentials
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const projectId = process.env.FIREBASE_PROJECT_ID || 'trinity-pixels';

        if (clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey
                })
            });
            isFirebaseConfigured = true;
            console.log(`[Notifications] Firebase Admin initialized for project: ${projectId}`);
            return true;
        }

        // Option C: Google Application Default Credentials (e.g. if configured on server)
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault()
            });
            isFirebaseConfigured = true;
            console.log('[Notifications] Firebase Admin initialized via Google ADC');
            return true;
        }

        return false;
    } catch (err) {
        console.warn('[Notifications] Firebase Admin initialization skipped (credentials not configured):', (err as Error).message);
        return false;
    }
}

// Attempt initialization on startup
initFirebaseAdmin();

export function isFirebaseReady(): boolean {
    return isFirebaseConfigured || initFirebaseAdmin();
}

export function isWebPushReady(): boolean {
    return isVapidConfigured;
}

// ─────────────────────────────────────────────────────────────
// 3. LOW-LEVEL DISPATCHERS
// ─────────────────────────────────────────────────────────────

async function sendWebPushToToken(
    tokenStr: string,
    payload: { title: string; body: string; data?: any; imageUrl?: string }
): Promise<boolean> {
    if (!isVapidConfigured) return false;
    try {
        let subscription: webpush.PushSubscription;
        if (tokenStr.startsWith('{')) {
            subscription = JSON.parse(tokenStr);
        } else {
            subscription = { endpoint: tokenStr, keys: { auth: '', p256dh: '' } };
        }
        if (!subscription.endpoint) return false;

        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: payload.title,
                body: payload.body,
                icon: payload.imageUrl || '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                image: payload.imageUrl,
                data: {
                    url: payload.data?.url || '/app',
                    ...payload.data
                }
            })
        );
        return true;
    } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
            // Subscription expired or uninstalled - deactivate token
            await db.deviceToken.updateMany({
                where: { token: tokenStr },
                data: { isActive: false }
            }).catch(() => null);
        }
        return false;
    }
}

async function sendFcmToToken(
    token: string,
    payload: {
        title: string;
        body: string;
        data?: Record<string, any>;
        channelId?: string;
        sound?: string;
        imageUrl?: string;
    }
): Promise<boolean> {
    if (!isFirebaseReady()) {
        return false;
    }

    try {
        // Stringify all data values for FCM v1 requirement
        const sanitizedData: Record<string, string> = {};
        if (payload.data) {
            for (const [key, val] of Object.entries(payload.data)) {
                sanitizedData[key] = typeof val === 'string' ? val : JSON.stringify(val);
            }
        }

        const channelId = payload.channelId || 'daily_prayers';
        const sound = payload.sound || 'angelus_chimes';

        await admin.messaging().send({
            token,
            notification: {
                title: payload.title,
                body: payload.body,
                ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {})
            },
            data: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                url: payload.data?.url || '/',
                channelId,
                ...sanitizedData
            },
            android: {
                priority: 'high',
                notification: {
                    channelId,
                    sound,
                    defaultSound: sound === 'default',
                    notificationCount: 1,
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {})
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: sound === 'default' ? 'default' : `${sound}.caf`,
                        badge: 1
                    }
                }
            }
        });
        return true;
    } catch (err: any) {
        const code = err?.errorInfo?.code || err?.code;
        if (
            code === 'messaging/registration-token-not-registered' ||
            code === 'messaging/invalid-registration-token'
        ) {
            // Deactivate stale or uninstalled Android token
            await db.deviceToken.updateMany({
                where: { token },
                data: { isActive: false }
            }).catch(() => null);
        } else {
            console.warn('[Notifications] FCM send error:', err?.message || err);
        }
        return false;
    }
}

// ─────────────────────────────────────────────────────────────
// 4. HIGH-LEVEL API: DISPATCH TO SPECIFIC USER
// ─────────────────────────────────────────────────────────────

/**
 * Dispatches an in-app and push notification to a registered user across Web and Android
 */
export async function dispatchServerNotification({
    userId,
    title,
    body,
    type = 'SYSTEM' as UserNotificationType,
    data = {},
    channelId = 'daily_prayers',
    sound = 'angelus_chimes',
    imageUrl
}: ServerNotificationParams): Promise<{ success: boolean; notificationId?: string; pushCount?: number }> {
    if (!userId) return { success: false };

    try {
        const notificationId = randomUUID();

        // 1. Persist to database UserNotification table (In-App Notification Center)
        await db.userNotification.create({
            data: {
                id: notificationId,
                userId,
                title,
                body,
                type,
                data: data ? JSON.stringify(data) : undefined,
                isRead: false,
            }
        });

        // 2. Fetch active device tokens
        const deviceTokens = await db.deviceToken.findMany({
            where: {
                userId,
                isActive: true
            },
            select: {
                token: true,
                platform: true
            }
        });

        // 3. Multi-platform intelligent routing (FCM vs WebPush)
        let pushCount = 0;
        if (deviceTokens.length > 0) {
            await Promise.allSettled(
                deviceTokens.map(async (dt) => {
                    const isNative = dt.platform === 'android' || dt.platform === 'ios';
                    let sent = false;

                    if (isNative) {
                        sent = await sendFcmToToken(dt.token, {
                            title,
                            body,
                            data,
                            channelId,
                            sound,
                            imageUrl
                        });
                    } else {
                        // Web or fallback
                        sent = await sendWebPushToToken(dt.token, {
                            title,
                            body,
                            data,
                            imageUrl
                        });
                    }

                    if (sent) pushCount++;
                })
            );
        }

        return {
            success: true,
            notificationId,
            pushCount
        };
    } catch (error) {
        console.error('Failed to dispatch server notification:', error);
        return { success: false };
    }
}

// ─────────────────────────────────────────────────────────────
// 5. HIGH-LEVEL API: BROADCAST TO ALL REGISTERED DEVICES
// ─────────────────────────────────────────────────────────────

/**
 * Broadcasts a liturgical reminder or holy feast alert to all active registered devices
 */
export async function broadcastServerNotification({
    title,
    body,
    type = 'SYSTEM' as UserNotificationType,
    data = {},
    channelId = 'broadcasts',
    sound = 'angelus_chimes',
    imageUrl
}: BroadcastNotificationParams): Promise<{ success: boolean; pushCount: number }> {
    try {
        const activeTokens = await db.deviceToken.findMany({
            where: { isActive: true },
            select: { token: true, platform: true }
        });

        let pushCount = 0;
        if (activeTokens.length > 0) {
            await Promise.allSettled(
                activeTokens.map(async (dt) => {
                    const isNative = dt.platform === 'android' || dt.platform === 'ios';
                    let sent = false;

                    if (isNative) {
                        sent = await sendFcmToToken(dt.token, {
                            title,
                            body,
                            data,
                            channelId,
                            sound,
                            imageUrl
                        });
                    } else {
                        sent = await sendWebPushToToken(dt.token, {
                            title,
                            body,
                            data,
                            imageUrl
                        });
                    }

                    if (sent) pushCount++;
                })
            );
        }

        return { success: true, pushCount };
    } catch (error) {
        console.error('Failed to broadcast server notification:', error);
        return { success: false, pushCount: 0 };
    }
}

// ─────────────────────────────────────────────────────────────
// 6. TOPIC-BASED BROADCAST (Instant delivery to thousands)
// ─────────────────────────────────────────────────────────────

/**
 * Sends an instant broadcast to an FCM Topic without per-user database loops.
 * Topics: 'all_users', 'daily_gospel', 'angelus_chimes', 'liturgical_feasts'
 */
export async function broadcastToFcmTopic({
    topic,
    title,
    body,
    data = {},
    channelId = 'daily_prayers',
    sound = 'angelus_chimes',
    imageUrl
}: TopicNotificationParams): Promise<{ success: boolean; messageId?: string }> {
    if (!isFirebaseReady()) {
        console.warn(`[Notifications] Skipping FCM topic broadcast to '${topic}' - Firebase credentials not set`);
        return { success: false };
    }

    try {
        const sanitizedData: Record<string, string> = {};
        for (const [key, val] of Object.entries(data)) {
            sanitizedData[key] = typeof val === 'string' ? val : JSON.stringify(val);
        }

        const response = await admin.messaging().send({
            topic,
            notification: {
                title,
                body,
                ...(imageUrl ? { imageUrl } : {})
            },
            data: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                url: data.url || '/',
                channelId,
                ...sanitizedData
            },
            android: {
                priority: 'high',
                notification: {
                    channelId,
                    sound,
                    defaultSound: sound === 'default',
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    ...(imageUrl ? { imageUrl } : {})
                }
            }
        });

        return { success: true, messageId: response };
    } catch (err: any) {
        console.error(`[Notifications] Failed to broadcast to topic '${topic}':`, err?.message || err);
        return { success: false };
    }
}
