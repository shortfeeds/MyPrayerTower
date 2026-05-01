import { Context, InlineKeyboard } from "grammy";
import { getPrayerRequests, markPrayer as markPrayerService, submitPrayerFromTelegram } from "../services/prayer-wall";
import { SUBMISSION_PROMPT_TEXT } from "../utils/constants";

export const wallCommand = async (ctx: Context) => {
    // Show options
    const keyboard = new InlineKeyboard()
        .text("🙏 View Requests", "wall_view")
        .text("📝 Submit Request", "wall_submit").row()
        .text("🏠 Home", "cmd_start");

    await ctx.reply(
        `🙏 *Prayer Wall*

"Bear one another's burdens, and so fulfill the law of Christ." (Galatians 6:2)

View requests from the community or ask for prayers.`,
        {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        }
    );
};

export const handlePrayerWallCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data) return;
    const data = ctx.callbackQuery.data;

    // VIEW REQUESTS
    if (data === "wall_view" || data === "wall_refresh") {
        const prayers = await getPrayerRequests();

        if (prayers.length === 0) {
            await ctx.answerCallbackQuery("No public requests found.");
            return;
        }

        // Show latest 3
        const subset = prayers.slice(0, 3);

        for (const p of subset) {
            const k = new InlineKeyboard()
                .text(`🙏 Prayed (${p.prayerCount})`, `pray_${p.id}`);

            await ctx.reply(
                `👤 *${p.name || 'Anonymous'}*\n\n"${p.content}"\n\n_${new Date(p.createdAt).toLocaleDateString()}_`,
                { parse_mode: "Markdown", reply_markup: k }
            );
        }

        const refreshK = new InlineKeyboard()
            .text("🔄 Refresh", "wall_refresh")
            .text("📝 Submit", "wall_submit");

        await ctx.reply("Scroll up to see requests.", { reply_markup: refreshK });
        await ctx.answerCallbackQuery();
    }

    // SUBMIT REQUEST
    if (data === "wall_submit") {
        // ForceReply to make it easy to track
        await ctx.reply(SUBMISSION_PROMPT_TEXT, {
            reply_markup: { force_reply: true }
        });
        await ctx.answerCallbackQuery();
    }
};

export const handlePrayCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data) return;
    const data = ctx.callbackQuery.data;

    // pray_ID
    const id = data.split("_")[1];
    if (id) {
        await markPrayerService(id);
        await ctx.answerCallbackQuery("Thanks for praying! 🙏");
    }
};

export const handleSubmissionMessage = async (ctx: Context) => {
    if (!ctx.message?.text || !ctx.from) return;

    // Create prayer
    const name = ctx.from.first_name || "Anonymous";
    const content = ctx.message.text;

    try {
        await submitPrayerFromTelegram(content, name, ctx.from.id.toString());
        await ctx.reply("✅ Your prayer request has been received and added to the wall.");
    } catch (e) {
        console.error(e);
        await ctx.reply("Failed to submit prayer. Please try again.");
    }
};

