import cron from "node-cron";
import { Bot, InlineKeyboard } from "grammy";
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
        const users = await prisma.telegramUser.findMany();

        console.log(`Sending daily content to ${users.length} users.`);

        const templates = [
            "🌅 *Good Morning!* \nStarting your day with prayer? God is with you today.",
            "🕊️ *A New Day in Faith* \nTake a moment to center yourself in God's presence this morning.",
            "☀️ *Daily Grace* \nWelcome this day with a grateful heart and a short prayer."
        ];

        for (const user of users) {
            try {
                const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                let message = `${randomTemplate}\n\n`;

                if (user.preference === "healing") {
                    message += "🙏 _God is healing you and keeping you in His care._\n\n";
                } else if (user.preference === "peace") {
                    message += "🙏 _May the peace of Christ, which surpasses all understanding, guard your heart._\n\n";
                } else if (user.preference === "work") {
                    message += "🙏 _May God bless the work of your hands today._\n\n";
                } else if (user.preference === "family") {
                    message += "🙏 _God bless you and your family today._\n\n";
                }

                message += "🙏 *Take 30 seconds to pray*";

                const keyboard = new InlineKeyboard()
                    .text("📖 Read Gospel", "reading")
                    .url("🙏 Pray Now", "https://myprayertower.com/prayers");

                await bot.api.sendMessage(Number(user.telegramId), message, { 
                    parse_mode: "Markdown",
                    reply_markup: keyboard
                });

                // Add delay to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (e: any) {
                console.error(`Failed to send to ${user.telegramId}: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Error in daily scheduler:", error);
    }
};
