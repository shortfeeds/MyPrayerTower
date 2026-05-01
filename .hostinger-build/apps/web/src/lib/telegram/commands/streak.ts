import { Context } from "grammy";
import { updateStreak } from "../services/user.service";

export const streakCommand = async (ctx: Context) => {
    if (!ctx.from) return;

    try {
        const result = await updateStreak(ctx.from.id);

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

        await ctx.reply(message, { parse_mode: "Markdown" });

    } catch (error) {
        console.error("Error in streak command:", error);
        await ctx.reply("An error occurred.");
    }
};
