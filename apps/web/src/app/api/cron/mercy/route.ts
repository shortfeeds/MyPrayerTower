import { createBot } from "@/lib/telegram/bot";
import { db } from "@/lib/db";
import { broadcastToFcmTopic, broadcastServerNotification } from "@/lib/serverNotifications";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    console.log(">>> [CRON] Starting 3:00 PM Divine Mercy Broadcast...");

    try {
        const title = "✝️ Hour of Great Mercy (3:00 PM)";
        const body = "For the sake of His sorrowful Passion, have mercy on us and on the whole world. Tap to pray the Chaplet.";

        // 1. Broadcast to Android & iOS FCM topic 'divine_mercy'
        await broadcastToFcmTopic({
            topic: 'divine_mercy',
            title,
            body,
            url: '/chaplets',
            channelId: 'divine_mercy',
        }).catch((err) => console.error('[CRON] FCM Mercy broadcast error:', err));

        // 2. Broadcast to WebPush & In-App subscribers
        await broadcastServerNotification({
            title,
            body,
            url: '/prayers',
            channelId: 'divine_mercy',
        }).catch((err) => console.error('[CRON] Web Mercy broadcast error:', err));

        // 3. Telegram Subscribers
        const users = await db.telegramUser.findMany({
            where: { isMercySubscribed: true }
        });

        let successCount = 0;
        let failCount = 0;

        if (users.length > 0) {
            const text = `🕒 *It is 3 O'Clock — The Hour of Great Mercy!*\n\n"At three o'clock, implore My mercy, especially for sinners; and, if only for a brief moment, immerse yourself in My Passion."\n\n🙏 *Time for the Divine Mercy Chaplet*`;
            const bot = createBot();

            for (const user of users) {
                try {
                    await bot.api.sendMessage(Number(user.telegramId), text, { parse_mode: "Markdown" });
                    successCount++;
                } catch (e) {
                    console.error(`Failed to send to Telegram user ${user.telegramId}:`, e);
                    failCount++;
                }
            }
        }

        return new Response(JSON.stringify({
            status: "success",
            message: "Divine Mercy reminder dispatched across FCM, WebPush, and Telegram",
            telegramSuccess: successCount,
            telegramFail: failCount,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error('[CRON] Mercy broadcast error:', e);
        return new Response(JSON.stringify({ status: "error", error: String(e) }), { status: 500 });
    }
}
