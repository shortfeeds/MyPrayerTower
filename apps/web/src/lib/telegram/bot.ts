// Deploy: 2026-02-14T14:30 - Perf Optimization & User Tracking Restore
import { Bot, GrammyError, HttpError } from "grammy";
import { UserFromGetMe } from "grammy/types";
import { findOrCreateUser, updateStreak } from "./services/user.service";

// Commands
import { startCommand } from "./commands/start";

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

            findOrCreateUser(userId, username)
                .then(() => {
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
    bot.command("hours", async (ctx) => {
        const { hoursCommand } = await import("./commands/hours");
        return hoursCommand(ctx);
    });
    bot.command("confession", async (ctx) => {
        const { confessionCommand } = await import("./commands/confession");
        return confessionCommand(ctx);
    });
    bot.command("ask", async (ctx) => {
        const { askCommand } = await import("./commands/ask");
        return askCommand(ctx);
    });
    bot.command("donate", async (ctx) => {
        const { donateCommand } = await import("./commands/donate");
        return donateCommand(ctx);
    });
    bot.command("invite", async (ctx) => {
        const { inviteCommand } = await import("./commands/invite");
        return inviteCommand(ctx);
    });
    bot.command("calendar", async (ctx) => {
        const { calendarCommand } = await import("./commands/calendar");
        return calendarCommand(ctx);
    });

    // Admin: Reload Menu Commands
    bot.command("admin_reload_commands", async (ctx) => {
        try {
            await ctx.api.setMyCommands([
                { command: "start", description: "🏠 Home & Menu" },
                { command: "ask", description: "✝️ AI Spiritual Companion" },
                { command: "calendar", description: "📅 Liturgical Calendar" },
                { command: "reading", description: "📖 Daily Gospel" },
                { command: "rosary", description: "📿 Holy Rosary" },
                { command: "novena", description: "🕯️ Novena Center" },
                { command: "pray", description: "🙏 Prayer Request" },
                { command: "wall", description: "🧱 Prayer Wall" },
                { command: "donate", description: "🌟 Support App" },
                { command: "invite", description: "🤝 Referral Dashboard" },
                { command: "quiz", description: "🧠 Catholic Quiz" },
                { command: "saint", description: "😇 Saint of the Day" },
                { command: "mercy", description: "✝️ Divine Mercy" },
                { command: "hours", description: "⏳ Liturgy of Hours" },
                { command: "confession", description: "🔓 Confession Guide" },
            ]);
            await ctx.reply("✅ Bot commands menu updated!");
        } catch (e) {
            console.error("Failed to set commands:", e);
            await ctx.reply("❌ Failed to update commands.");
        }
    });

    // Register Callbacks with dynamic imports
    bot.on("callback_query:data", async (ctx) => {
        const data = ctx.callbackQuery.data;

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
        if (data === "cmd_hours") {
            const { hoursCommand } = await import("./commands/hours");
            return hoursCommand(ctx);
        }
        if (data === "cmd_confession") {
            const { confessionCommand } = await import("./commands/confession");
            return confessionCommand(ctx);
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
        if (data.startsWith("audio_")) {
            const { handleAudioCallback } = await import("./commands/audio");
            await handleAudioCallback(ctx);
        }
        if (data.startsWith("confess_")) {
            const { handleConfessionCallback } = await import("./commands/confession");
            await handleConfessionCallback(ctx);
        }
        if (data.startsWith("donate_")) {
            const { handleDonateCallback } = await import("./commands/donate");
            await handleDonateCallback(ctx);
        }
    });

    // Payment Handlers (Telegram Stars)
    bot.on("pre_checkout_query", async (ctx) => {
        // Always answer true for Stars if payload valid
        await ctx.answerPreCheckoutQuery(true);
    });

    bot.on(":successful_payment", async (ctx) => {
        const amount = ctx.message?.successful_payment.total_amount;
        // const payload = ctx.message?.successful_payment.invoice_payload;

        await ctx.reply(`🌟 <b>Thank You!</b>\n\nYour offering of ${amount} Stars has been received. May God bless your generosity hundredfold.`, {
            parse_mode: "HTML"
        });
    });

    // Debug: Log all other messages

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
