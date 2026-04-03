import { Context, InlineKeyboard } from "grammy";
import { updateStreak } from "../services/user.service";
import { trackEvent } from "../services/analytics";

export const streakCommand = async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    try {
        await trackEvent(userId, "streak_check");

        // Force an update/check when they run the command
        const result = await updateStreak(userId);

        if (!result) {
            await ctx.reply("I couldn't retrieve your streak at this moment.");
            return;
        }

        const count = result.streak;
        let message = `🔥 *Current Streak: ${count} Day${count === 1 ? "" : "s"}* \n\n`;

        if (count < 3) {
            message += "Every day counts! Keep praying. 🌱";
        } else if (count < 7) {
            message += "You're building a holy habit! Keep it up! 🌿";
        } else if (count < 30) {
            message += "Amazing consistency! Your faith is growing strong. 🌳";
        } else {
            message += "Incredible dedication! You are a pillar of prayer. 🕊️";
        }

        const keyboard = new InlineKeyboard()
            .text("🙏 Daily Prayer", "daily_prayer").row()
            .url("🕯️ Light a Candle", "https://myprayertower.com/candles")
            .text("🏠 Main Menu", "start");

        await ctx.reply(message, { 
            parse_mode: "Markdown",
            reply_markup: keyboard
        });

    } catch (error) {
        console.error("Error in streak command:", error);
        await ctx.reply("An error occurred.");
    }
};
