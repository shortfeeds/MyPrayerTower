import { Context, InlineKeyboard } from "grammy";
import { getReadings } from "@/lib/readings";

export const readingCommand = async (ctx: Context) => {
    try {
        const now = new Date();
        const data = await getReadings(now);

        if (!data || !data.readings || data.readings.length === 0) {
            await ctx.reply("Sorry, I couldn't fetch today's readings. Please try again later.");
            return;
        }

        const gospel = data.readings.find((r: any) => r.type === "Gospel" || r.type === "Holy Gospel");
        const firstReading = data.readings.find((r: any) => r.type === "First Reading");

        let message = `📖 *Daily Gospel & Reflection*\n_${data.date}_\n`;

        if (data.season) {
            message += `*${data.season}*\n`;
        }
        message += `\n`;

        if (gospel) {
            message += `*✝️ ${gospel.type}*\n`;
            message += `_${gospel.citation}_\n\n`;

            // Truncate if too long (Tele limit)
            const text = gospel.text.length > 2000 ? gospel.text.substring(0, 2000) + "..." : gospel.text;
            message += `${text}\n\n`;

            message += `💭 *Reflection*\n`;
            message += `In today's Gospel, we are invited to listen to Christ's voice. Take a moment to silence your heart. What is one word or phrase that stood out to you? Hold onto that word today.\n\n`;
        } else if (firstReading) {
            message += `*${firstReading.type}*\n`;
            message += `_${firstReading.citation}_\n\n`;
            message += `${firstReading.text.substring(0, 1000)}...\n\n`;
        } else {
            message += "Readings are available on our website.\n\n";
        }

        const keyboard = new InlineKeyboard()
            .url("🙏 Pray with this Reading", `https://myprayertower.com/readings`) // Deeper link
            .row()
            .text("🏠 Back to Menu", "cmd_start");

        await ctx.reply(message, {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        });

    } catch (error) {
        console.error("Error in reading command:", error);
        await ctx.reply("An error occurred while fetching the reading.");
    }
};

