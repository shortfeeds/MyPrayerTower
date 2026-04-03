import { Bot, GrammyError, HttpError } from "grammy";
import "dotenv/config";
import { startCommand, showMainMenu } from "./commands/start";
import { helpCommand } from "./commands/help";
import { readingCommand } from "./commands/reading";
import { saintCommand } from "./commands/saint";
import { prayCommand } from "./commands/pray";
import { wallCommand, handlePrayCallback } from "./commands/wall";
import { inviteCommand } from "./commands/invite";
import { streakCommand } from "./commands/streak";
import { findOrCreateUser, updateStreak, updateUserPreference } from "./services/user.service";
import { setupScheduler } from "./services/scheduler";
import { trackEvent } from "./services/analytics";

// Create an instance of the `Bot` class and pass your bot token to it.
const token = process.env.BOT_TOKEN;
if (!token) {
    throw new Error("BOT_TOKEN is unset");
}

const bot = new Bot(token);

// Middleware
bot.use(async (ctx, next) => {
    const start = Date.now();

    // Track user interaction & Streak
    if (ctx.from) {
        // 1. Ensure user exists
        await findOrCreateUser(ctx.from.id, ctx.from.username)
            .catch(err => console.error(`Error ensuring user ${ctx.from?.id}:`, err));

        // 2. Update Streak
        try {
            const result = await updateStreak(ctx.from.id);
            if (result?.justIncreased) {
                await ctx.reply(`🔥 *${result.streak} Day Prayer Streak!* Keep going!`, { parse_mode: "Markdown" });
            }
        } catch (err) {
            console.error(`Error updating streak for ${ctx.from?.id}:`, err);
        }
    }

    await next();
    const ms = Date.now() - start;
    console.log(`Response time: ${ms}ms`);
});

// Register commands
bot.command("start", startCommand);
bot.command("help", helpCommand);
bot.command("reading", readingCommand);
bot.command("saint", saintCommand);
bot.command("pray", prayCommand);
bot.command("wall", wallCommand);
bot.command("streak", streakCommand);

// Register Callback Queries
bot.on("callback_query:data", async (ctx) => {
    if (ctx.callbackQuery.data.startsWith("pray_")) {
        await handlePrayCallback(ctx);
    }
});

// Set bot commands menu in Telegram
bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "reading", description: "Get today's readings" },
    { command: "saint", description: "Saint of the day" },
    { command: "wall", description: "View Prayer Wall" },
    { command: "pray", description: "Submit Prayer Request" },
    { command: "streak", description: "Check your Streak" },
    { command: "help", description: "Show help" },
]).catch(console.error);

// Setup Scheduler
setupScheduler(bot);

// Error handling
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

// Start the bot.
bot.start();
console.log("Bot is running...");
