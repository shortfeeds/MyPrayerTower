import { Context, InlineKeyboard } from "grammy";
import { getSaintOfTheDay } from "../services/api";
import { trackEvent } from "../services/analytics";

export const saintCommand = async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    try {
        const saint = await getSaintOfTheDay();

        if (!saint) {
            await ctx.reply("Sorry, I couldn't fetch the Saint of the Day right now. Please try again later.");
            return;
        }

        await trackEvent(userId, "saint_open", { saint: saint.name });

        const title = saint.title ? `${saint.title} ` : "";
        const name = saint.name;
        const feastDay = saint.feastDay || "Today";
        const patronage = saint.patronOf?.length ? `\n🛡️ *Patron of:* ${saint.patronOf.join(", ")}` : "";
        const bio = saint.shortBio ? `\n\n${saint.shortBio}` : "";

        const message = `
😇 *Saint of the Day*

*${title}${name}*
📅 Feast: ${feastDay}${patronage}${bio}
`;

        const keyboard = new InlineKeyboard()
            .url("📖 Read More", `https://myprayertower.com/saints/${saint.slug}`).row()
            .url("🕯️ Light a Candle", "https://myprayertower.com/candles")
            .text("🙏 Submit Prayer", "pray").row()
            .text("🏠 Main Menu", "start");

        if (saint.imageUrl) {
            await ctx.replyWithPhoto(saint.imageUrl, {
                caption: message,
                parse_mode: "Markdown",
                reply_markup: keyboard,
            });
        } else {
            await ctx.reply(message, { 
                parse_mode: "Markdown",
                reply_markup: keyboard,
            });
        }

    } catch (error) {
        console.error("Error in saint command:", error);
        await ctx.reply("An error occurred while fetching the saint.");
    }
};
