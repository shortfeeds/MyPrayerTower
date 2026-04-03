import { Context, InlineKeyboard } from "grammy";
import { trackEvent } from "../services/analytics";

export const prayCommand = async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    await trackEvent(userId, "prayer_click");

    const message = `
🙏 *Submit a Prayer Request*

Share your intentions and let our community pray for you. Or take a moment to pray for others on our wall.

"For where two or three are gathered in my name, there am I among them." (Matthew 18:20)
`;

    const keyboard = new InlineKeyboard()
        .url("🙏 Submit Request", "https://myprayertower.com/prayer-wall")
        .text("🕊️ View Wall", "wall").row()
        .url("🕯️ Light a Candle", "https://myprayertower.com/candles")
        .text("🏠 Main Menu", "start");

    await ctx.reply(message, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
    });
};
