import { createBot } from "@/lib/telegram/bot";
import { db } from "@/lib/db";
import { getReadings } from "@/lib/readings";
import { broadcastToFcmTopic, broadcastServerNotification } from "@/lib/serverNotifications";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    console.log(">>> [CRON] Starting Daily Gospel & Devotional Broadcast...");

    try {
        const daysReadings = await getReadings();
        const gospel = daysReadings.readings.find((r: any) => r.type === 'Gospel' || r.type === 'Holy Gospel');
        const gospelCitation = gospel?.citation || "";
        const gospelText = gospel?.text || "";
        const snippet = gospelText ? `${gospelText.substring(0, 160)}...` : 'Start your day with the Word of the Lord.';

        // 1. Broadcast to Android & iOS devices subscribed to FCM topic 'daily_gospel'
        await broadcastToFcmTopic({
            topic: 'daily_gospel',
            title: `📖 Daily Gospel: ${gospelCitation || daysReadings.date}`,
            body: snippet,
            url: '/readings',
            channelId: 'daily_gospel',
        }).catch((err) => console.error('[CRON] FCM Gospel broadcast error:', err));

        // 2. Broadcast to WebPush & In-App subscribers
        await broadcastServerNotification({
            title: `📖 Daily Gospel: ${gospelCitation || daysReadings.date}`,
            body: snippet,
            url: '/readings',
            channelId: 'daily_gospel',
        }).catch((err) => console.error('[CRON] Web Gospel broadcast error:', err));

        // 3. Telegram Subscribers
        const users = await db.telegramUser.findMany({
            where: { isGospelSubscribed: true }
        });

        let successCount = 0;
        let failCount = 0;

        if (users.length > 0) {
            const text = `📖 *Daily Gospel: ${daysReadings.date}*\n\n_${gospelCitation}_\n\n"${gospelText.substring(0, 500)}..."\n\n[Read Full](${daysReadings.sourceUrl})`;
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
            message: "Daily Gospel broadcast dispatched across FCM topics, WebPush, and Telegram",
            telegramSuccess: successCount,
            telegramFail: failCount,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error('[CRON] Gospel blast failure:', e);
        return new Response(JSON.stringify({ status: "error", error: String(e) }), { status: 500 });
    }
}
