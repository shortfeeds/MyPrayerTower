import { Context, InlineKeyboard } from "grammy";

export const donateCommand = async (ctx: Context) => {
    // Explanation
    await ctx.reply("🌟 <b>Support MyPrayerTower</b>\n\nYour support helps us keep this bot running, free, and ad-free for thousands of Catholics worldwide.\n\n<b>Choose an amount (Telegram Stars):</b>", {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard()
            .text("⭐️ 50 Stars ($1)", "donate_50").row()
            .text("⭐️ 100 Stars ($2)", "donate_100").row()
            .text("⭐️ 500 Stars ($10)", "donate_500").row()
            .text("❌ Cancel", "cmd_start")
    });
};

export const handleDonateCallback = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;
    if (!data || !data.startsWith("donate_")) return;

    const amount = parseInt(data.replace("donate_", ""));
    const title = "Donation to MyPrayerTower";
    const description = `One-time offering of ${amount} Stars to support the mission.`;
    const payload = `donation_${amount}_${Date.now()}`;
    const currency = "XTR"; // Telegram Stars

    try {
        await ctx.api.sendInvoice(
            ctx.chat!.id,
            title,
            description,
            payload,
            "", // Provider token is empty for Stars
            currency,
            [{ label: "Offering", amount: amount }]
        );
        await ctx.answerCallbackQuery();
    } catch (e) {
        console.error("Invoice error:", e);
        await ctx.reply("Unable to create invoice. Please try again later.");
    }
};
