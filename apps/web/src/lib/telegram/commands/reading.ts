import { Context, InlineKeyboard } from "grammy";
import axios from "axios";

const API_Base_URL = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "https://myprayertower.com/api";

export const readingCommand = async (ctx: Context) => {
    try {
        const now = new Date();
        const dateStr = now.toISOString().split("T")[0];

        const response = await axios.get(`${API_Base_URL}/readings?date=${dateStr}`);
        const data = response.data;

        if (!data || !data.readings) {
            await ctx.reply("Sorry, I couldn't fetch today's readings. Please try again later.");
            return;
        }

        const gospel = data.readings.find((r: any) => r.type === "Gospel" || r.type === "Holy Gospel");
        const firstReading = data.readings.find((r: any) => r.type === "First Reading");

        let message = `📖 *Daily Mass Readings*\n_${data.date}_\n\n`;

        if (data.season) {
            message += `*${data.season}*\n`;
        }
        if (data.title) {
            message += `_${data.title}_\n\n`;
        }

        if (gospel) {
            message += `*✝️ ${gospel.type}*\n`;
            message += `_${gospel.citation}_\n\n`;
            const text = gospel.text.length > 2000 ? gospel.text.substring(0, 2000) + "..." : gospel.text;
            message += `${text}\n\n`;
        } else if (firstReading) {
            message += `*${firstReading.type}*\n`;
            message += `_${firstReading.citation}_\n\n`;
            message += `${firstReading.text.substring(0, 500)}...\n\n`;
        } else {
            message += "Readings are available on our website.\n\n";
        }

        const keyboard = new InlineKeyboard()
            .url("📖 Read Full Readings via Web", `https://myprayertower.com/readings`);

        await ctx.reply(message, {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        });

    } catch (error) {
        console.error("Error in reading command:", error);
        await ctx.reply("An error occurred while fetching the reading.");
    }
};
