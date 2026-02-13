import { Context, InlineKeyboard } from "grammy";
import axios from "axios";

// We use the same API URL logic
const API_Base_URL = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "https://myprayertower.com/api";

export const saintCommand = async (ctx: Context) => {
    try {
        const response = await axios.get(`${API_Base_URL}/saints/today`);
        const saint = response.data;

        if (!saint) {
            await ctx.reply("Could not fetch today's saint.");
            return;
        }

        let message = `😇 *Saint of the Day*\n`;
        message += `*${saint.name}*\n`;
        if (saint.feastDay) message += `_Feast Day: ${saint.feastDay}_\n\n`;

        if (saint.shortBio) {
            message += `${saint.shortBio}\n\n`;
        }

        if (saint.patronOf && saint.patronOf.length > 0) {
            message += `🛡️ *Patron of:* ${saint.patronOf.join(", ")}\n`;
        }

        const keyboard = new InlineKeyboard()
            .url("Read Full Bio", `https://myprayertower.com/saints/${saint.slug}`);

        if (saint.imageUrl) {
            await ctx.replyWithPhoto(saint.imageUrl, {
                caption: message,
                parse_mode: "Markdown",
                reply_markup: keyboard
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
