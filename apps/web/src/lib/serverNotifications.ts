import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import type { UserNotificationType } from '@prisma/client';
import webpush from 'web-push';

export interface ServerNotificationParams {
    userId: string;
    title: string;
    body: string;
    type?: UserNotificationType;
    data?: Record<string, any>;
}

export interface BroadcastNotificationParams {
    title: string;
    body: string;
    type?: UserNotificationType;
    data?: Record<string, any>;
}

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || 'BGdBnesIbLMG_805ekmVmaBGIxmzpUlAFwMBJY23rFDffqe1XBD51jrmR0nps5rQIS9_ixo1PA1gR7GsyBFCgoM';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '_zJmIY5wuT-b4zbLiyv8SEnYkembOCupd3lwBXQzxW8';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:notifications@myprayertower.com';

let isVapidConfigured = false;
if (vapidPublicKey && vapidPrivateKey) {
    try {
        webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
        isVapidConfigured = true;
    } catch (e) {
        console.warn('VAPID setup warning:', e);
    }
}

async function sendWebPushToToken(tokenStr: string, payload: { title: string; body: string; data?: any }): Promise<boolean> {
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
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                data: {
                    url: payload.data?.url || '/app',
                    ...payload.data
                }
            })
        );
        return true;
    } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
            // Subscription expired or uninstalled
            await db.deviceToken.updateMany({
                where: { token: tokenStr },
                data: { isActive: false }
            }).catch(() => null);
        }
        return false;
    }
}

/**
 * Dispatches an in-app and push notification to a registered user across Web and Android
 */
export async function dispatchServerNotification({
    userId,
    title,
    body,
    type = 'SYSTEM' as UserNotificationType,
    data = {}
}: ServerNotificationParams): Promise<{ success: boolean; notificationId?: string; pushCount?: number }> {
    if (!userId) return { success: false };

    try {
        const notificationId = randomUUID();

        // 1. Persist to database UserNotification table
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

        // 3. Multi-channel dispatch (Web Push / TWA)
        let pushCount = 0;
        if (deviceTokens.length > 0) {
            await Promise.allSettled(
                deviceTokens.map(async (dt) => {
                    const sent = await sendWebPushToToken(dt.token, { title, body, data });
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

/**
 * Broadcasts a liturgical reminder or holy feast alert to all active registered devices
 */
export async function broadcastServerNotification({
    title,
    body,
    type = 'SYSTEM' as UserNotificationType,
    data = {}
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
                    const sent = await sendWebPushToToken(dt.token, { title, body, data });
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
