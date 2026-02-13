import { Bot, GrammyError, HttpError } from "grammy";
import { startCommand } from "./commands/start";
import { helpCommand } from "./commands/help";
import { readingCommand } from "./commands/reading";
import { saintCommand } from "./commands/saint";
import { prayCommand } from "./commands/pray";
import { wallCommand, handlePrayCallback } from "./commands/wall";
import { streakCommand } from "./commands/streak";
import { findOrCreateUser, updateStreak } from "./services/user.service";

export const createBot = () => {
    const token = process.env.BOT_TOKEN;
    if (!token) {
        throw new Error("BOT_TOKEN is unset");
    }

    const bot = new Bot(token);

    // Middleware
    bot.use(async (ctx, next) => {
        // Track user & Streak
        if (ctx.from) {
            await findOrCreateUser(ctx.from.id, ctx.from.username)
                .catch(err => console.error(`Error ensuring user ${ctx.from?.id}:`, err));

            updateStreak(ctx.from.id)
                .catch(err => console.error(`Error updating streak for ${ctx.from?.id}:`, err));
        }
        await next();
    });

    // Register commands
    bot.command("start", startCommand);
    bot.command("help", helpCommand);
    bot.command("reading", readingCommand);
    bot.command("saint", saintCommand);
    bot.command("pray", prayCommand);
    bot.command("wall", wallCommand);
    bot.command("streak", streakCommand);

    // Register Callbacks
    bot.on("callback_query:data", async (ctx) => {
        if (ctx.callbackQuery.data.startsWith("pray_")) {
            await handlePrayCallback(ctx);
        }
    });

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

    return bot;
};
