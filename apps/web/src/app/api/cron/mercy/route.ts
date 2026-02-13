import { createBot } from "@/lib/telegram/bot";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    console.log(">>> [CRON] Starting Divine Mercy Reminder...");

    try {
        const users = await db.telegramUser.findMany({
            where: { isMercySubscribed: true }
        });

        if (users.length === 0) {
            return new Response("No subscribers found", { status: 200 });
        }

        const text = `🕒 *It is 3 O'Clock!*

"At three o'clock, implore My mercy, especially for sinners; and, if only for a brief moment, immerse yourself in My Passion."

🙏 *Time for the Divine Mercy Chaplet*`;

        const bot = createBot();
        const { mercyCommand } = await import("@/lib/telegram/commands/mercy");

        let successCount = 0;
        let failCount = 0;

        for (const user of users) {
            try {
                // We can just send a message, or try to invoke the command logic?
                // Sending message is safer.
                await bot.api.sendMessage(Number(user.telegramId), text, { parse_mode: "Markdown" });
                successCount++;
            } catch (e) {
                console.error(`Failed to send to ${user.telegramId}:`, e);
                failCount++;
            }
        }

        return new Response(`Mercy blast sent: ${successCount} success, ${failCount} failed`, { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response("Error in cron", { status: 500 });
    }
}
