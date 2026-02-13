import cron from "node-cron";
import { Bot } from "grammy";
import prisma from "./db";
import { getDailyReading } from "./api";

// Schedule daily messages
export const setupScheduler = (bot: Bot) => {
    // Run every day at 6:00 AM system time (ideally UTC, but depends on server)
    // detailed pattern: second(opt) minute hour day month day-of-week
    cron.schedule("0 6 * * *", async () => {
        console.log("Running daily content scheduler...");
        await sendDailyMorningContent(bot);
    });

    console.log("Scheduler setup complete. Daily content scheduled for 06:00.");
};

const sendDailyMorningContent = async (bot: Bot) => {
    try {
        // Fetch daily reading
        // Note: getDailyReading returns LiturgicalDay, needed to format content
        // For now, we'll try to use the reading command logic, 
        // but ideally we should abstract the message generation.
        // Let's keep it simple: Just a "Good Morning" with links.

        // Fetch users
        // Warning: fetching ALL users at once is not scalable for millions, 
        // but fine for MVP (< 10k users). Use cursor-based pagination for larger scale.
        const users = await prisma.telegramUser.findMany();

        console.log(`Sending daily content to ${users.length} users.`);

        const message = `
🌅 *Good Morning!*

Starting your day with prayer? 

Use /reading to get today's Mass readings.
Use /saint to meet the Saint of the Day.
    `;

        for (const user of users) {
            try {
                await bot.api.sendMessage(Number(user.telegramId), message, { parse_mode: "Markdown" });
                // Add delay to avoid rate limits if needed
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (e: any) {
                console.error(`Failed to send to ${user.telegramId}: ${e.message}`);
                // Handle blocked users, etc.
            }
        }
    } catch (error) {
        console.error("Error in daily scheduler:", error);
    }
};
