import { createBot } from "@/lib/telegram/bot";
import { db } from "@/lib/db";
import { getDailyReading } from "@/lib/liturgy";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    // Basic security: Check for CRON_SECRET if desired, but for MVP standard Vercel Cron protection is enough or omitted
    console.log(">>> [CRON] Starting Daily Gospel Blast...");

    try {
        const users = await db.telegramUser.findMany({
            where: { isGospelSubscribed: true }
        });

        if (users.length === 0) {
            return new Response("No subscribers found", { status: 200 });
        }

        const reading = await getDailyReading();
        const text = `📖 *Daily Gospel: ${reading.date}*\n\n_${reading.gospelCitation}_\n\n"${reading.gospelText.substring(0, 500)}..."\n\n[Read Full](${reading.link})`;

        const bot = createBot();

        let successCount = 0;
        let failCount = 0;

        // Send in serial to avoid rate limits for now (or small chunks)
        // Telegram limit: 30 msgs/sec. 
        for (const user of users) {
            try {
                await bot.api.sendMessage(Number(user.telegramId), text, { parse_mode: "Markdown" });
                successCount++;
            } catch (e) {
                console.error(`Failed to send to ${user.telegramId}:`, e);
                failCount++;
                // Optional: Disable subscription if user blocked bot (error 403)
            }
        }

        return new Response(`Blast sent: ${successCount} success, ${failCount} faviled`, { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response("Error in cron", { status: 500 });
    }
}
