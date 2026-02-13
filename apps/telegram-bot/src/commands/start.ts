import { Context, InlineKeyboard } from "grammy";

export const startCommand = async (ctx: Context) => {
    const welcomeMessage = `
Welcome to *My Prayer Tower* ✝️

Your daily companion for prayer, reading, and spiritual growth.

*Here's what I can do for you:*
📖 *Daily Reading* - Get today's Mass readings
😇 *Saint of the Day* - Learn about today's saint
🙏 *Prayer Request* - Submit an intention to our wall
🕯️ *Light a Candle* - Offer a virtual candle

_Select an option below to get started:_
`;

    const keyboard = new InlineKeyboard()
        .text("📖 Today's Reading", "reading").row()
        .text("😇 Saint of the Day", "saint").row()
        .url("🙏 Prayer Wall", "https://myprayertower.com/prayer-wall")
        .url("🕯️ Light a Candle", "https://myprayertower.com/candles");

    await ctx.reply(welcomeMessage, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
    });
};
