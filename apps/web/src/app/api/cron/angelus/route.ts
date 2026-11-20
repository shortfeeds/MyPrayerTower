import { createBot } from "@/lib/telegram/bot";
import { db } from "@/lib/db";
import { broadcastToFcmTopic, broadcastServerNotification } from "@/lib/serverNotifications";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    console.log(">>> [CRON] Starting Angelus Bells Broadcast...");

    try {
        const title = "🔔 The Angelus";
        const body = "The Angel of the Lord declared unto Mary. And she conceived of the Holy Spirit. Tap to pray.";

        // 1. Broadcast to Android & iOS FCM topic 'angelus_chimes' (triggers authentic church bell sound)
        await broadcastToFcmTopic({
            topic: 'angelus_chimes',
            title,
            body,
            url: '/prayers',
            channelId: 'angelus_bells',
        }).catch((err) => console.error('[CRON] FCM Angelus broadcast error:', err));

        // 2. Broadcast to WebPush & In-App subscribers
        await broadcastServerNotification({
            title,
            body,
            url: '/prayers',
            channelId: 'angelus_bells',
        }).catch((err) => console.error('[CRON] Web Angelus broadcast error:', err));

        return new Response(JSON.stringify({
            status: "success",
            message: "Angelus bells broadcast dispatched across FCM topic and WebPush",
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error('[CRON] Angelus broadcast error:', e);
        return new Response(JSON.stringify({ status: "error", error: String(e) }), { status: 500 });
    }
}
