// Deploy: 2026-02-14T14:30 - Perf Optimization & User Tracking Restore
import { Bot, GrammyError, HttpError } from "grammy";
import { startCommand } from "./commands/start";
import { UserFromGetMe } from "grammy/types";
import { findOrCreateUser, updateStreak } from "./services/user.service"; // Restore imports

// Singleton instance
let botInstance: Bot | null = null;

export const createBot = (botInfo?: UserFromGetMe) => {
    // Return cached instance if available (Critical for Vercel perf)
    if (botInstance) {
        console.log(">>> [BOT] Returning cached bot instance");
        return botInstance;
    }

    console.log(">>> [BOT] Initializing new Bot instance (Mixed Mode)...");
    const token = process.env.BOT_TOKEN;
    if (!token) {
        throw new Error("BOT_TOKEN is unset");
    }

    const bot = new Bot(token, { botInfo });

    // CRITICAL: Override Grammy's HTTP layer to use native fetch.
    bot.api.config.use(async (prev, method, payload, signal) => {
        const url = `https://api.telegram.org/bot${token}/${method}`;
        // console.log(`>>> [API] Native fetch: ${method}`); // Reduce log spam
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return await response.json();
    });

    // Middleware: User Tracking & Streak (Restored)
    bot.use(async (ctx, next) => {
        console.log(`>>> [BOT] Update: ${Object.keys(ctx.update).join(', ')}`);

        // Fire-and-forget user tracking (don't block response)
        if (ctx.from) {
            const userId = ctx.from.id;
            const username = ctx.from.username;

            // We must AWAIT creation to ensure leaderboards/foreign keys work
            // But we can catch errors to not crash the bot
            findOrCreateUser(userId, username)
                .then(() => {
                    // Only update streak AFTER user exists
                    // Fire-and-forget streak to keep bot fast
                    updateStreak(userId).catch(e => console.error("Streak error:", e));
                })
                .catch(e => console.error("User tracking error:", e));
        }

        await next();
    });

    // Register commands
    // STATIC: /start (critical path)
    bot.command("start", async (ctx) => {
        try {
            await startCommand(ctx);
        } catch (e) {
            console.error(">>> [BOT] Error in /start command:", e);
        }
    });

    // DYNAMIC: Other commands
    bot.command("help", async (ctx) => {
        const { helpCommand } = await import("./commands/help");
        return helpCommand(ctx);
    });
    bot.command("reading", async (ctx) => {
        const { readingCommand } = await import("./commands/reading");
        return readingCommand(ctx);
    });
    bot.command("saint", async (ctx) => {
        const { saintCommand } = await import("./commands/saint");
        return saintCommand(ctx);
    });
    bot.command("pray", async (ctx) => {
        const { prayCommand } = await import("./commands/pray");
        return prayCommand(ctx);
    });
    // Alias for Rosary
    bot.command("rosary", async (ctx) => {
        const { rosaryCommand } = await import("./commands/rosary");
        return rosaryCommand(ctx);
    });
    bot.command("novena", async (ctx) => {
        const { novenaCommand } = await import("./commands/novena");
        return novenaCommand(ctx);
    });
    bot.command("mercy", async (ctx) => {
        const { mercyCommand } = await import("./commands/mercy");
        return mercyCommand(ctx);
    });
    bot.command("quiz", async (ctx) => {
        const { quizCommand } = await import("./commands/quiz");
        return quizCommand(ctx);
    });
    bot.command("family", async (ctx) => {
        const { familyCommand } = await import("./commands/family");
        return familyCommand(ctx);
    });
    bot.command("audio", async (ctx) => {
        const { audioCommand } = await import("./commands/audio");
        return audioCommand(ctx);
    });
    bot.command("support", async (ctx) => {
        const { supportCommand } = await import("./commands/support");
        return supportCommand(ctx);
    });
    bot.command("wall", async (ctx) => {
        const { wallCommand } = await import("./commands/wall");
        return wallCommand(ctx);
    });
    bot.command("streak", async (ctx) => {
        const { streakCommand } = await import("./commands/streak");
        return streakCommand(ctx);
    });

    bot.command("leaderboard", async (ctx) => {
        const { leaderboardCommand } = await import("./commands/leaderboard");
        return leaderboardCommand(ctx);
    });

    bot.command("admin", async (ctx) => {
        const { adminCommand } = await import("./commands/admin");
        return adminCommand(ctx);
    });

    // Register Callbacks with dynamic imports
    bot.on("callback_query:data", async (ctx) => {
        const data = ctx.callbackQuery.data;
        // console.log(`>>> [BOT] Callback: ${data}`); // Reduce log spam

        // Navigation Router
        if (data === "cmd_start") {
            await startCommand(ctx);
            return;
        }
        if (data === "menu_gospel") {
            const { readingCommand } = await import("./commands/reading");
            return readingCommand(ctx);
        }
        if (data === "menu_rosary") {
            const { rosaryCommand } = await import("./commands/rosary");
            return rosaryCommand(ctx);
        }
        if (data === "menu_novena") {
            const { novenaCommand } = await import("./commands/novena");
            return novenaCommand(ctx);
        }
        if (data === "menu_mercy") {
            const { mercyCommand } = await import("./commands/mercy");
            return mercyCommand(ctx);
        }
        if (data === "menu_saint") {
            const { saintCommand } = await import("./commands/saint");
            return saintCommand(ctx);
        }
        if (data === "menu_quiz") {
            const { quizCommand } = await import("./commands/quiz");
            return quizCommand(ctx);
        }
        if (data === "menu_wall") {
            const { wallCommand } = await import("./commands/wall");
            return wallCommand(ctx);
        }
        if (data === "menu_family") {
            const { familyCommand } = await import("./commands/family");
            return familyCommand(ctx);
        }
        if (data === "menu_audio") {
            const { audioCommand } = await import("./commands/audio");
            return audioCommand(ctx);
        }
        if (data === "menu_support") {
            const { supportCommand } = await import("./commands/support");
            return supportCommand(ctx);
        }

        // Feature-specific callbacks
        if (data.startsWith("pray_")) {
            const { handlePrayCallback } = await import("./commands/wall");
            await handlePrayCallback(ctx);
        }
        if (data.startsWith("rosary_")) {
            const { handleRosaryCallback } = await import("./commands/rosary");
            await handleRosaryCallback(ctx);
        }
        if (data.startsWith("novena_")) {
            const { handleNovenaCallback } = await import("./commands/novena");
            await handleNovenaCallback(ctx);
        }
        if (data.startsWith("mercy_")) {
            const { handleMercyCallback } = await import("./commands/mercy");
            await handleMercyCallback(ctx);
        }
        if (data.startsWith("quiz_")) {
            const { handleQuizCallback } = await import("./commands/quiz");
            await handleQuizCallback(ctx);
        }
        if (data.startsWith("family_")) {
            const { handleFamilyCallback } = await import("./commands/family");
            await handleFamilyCallback(ctx);
        }
    });

    // Debug: Log all other messages
    bot.on("message", async (ctx) => {
        // Check if reply to submission prompt
        if (ctx.message.reply_to_message &&
            "text" in ctx.message.reply_to_message &&
            ctx.message.reply_to_message.text === "Please reply to this message with your prayer intention.") {

            const { handleSubmissionMessage } = await import("./commands/wall");
            await handleSubmissionMessage(ctx);
            return;
        }

        console.log(">>> [BOT] Received message:", ctx.message.text);
    });

    console.log(">>> [BOT] createBot completed");
    botInstance = bot; // Cache the instance
    return bot;
};
