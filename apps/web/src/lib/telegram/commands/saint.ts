import { Context, InlineKeyboard } from "grammy";
import { getSaintOfToday } from "@/lib/saints";

export const saintCommand = async (ctx: Context) => {
    try {
        const saint = await getSaintOfToday();

        if (!saint) {
            await ctx.reply("Could not fetch today's saint.");
            return;
        }

        let message = `😇 *Saint of the Day*\n`;
        message += `*${saint.name}*\n`;
        if (saint.feastDay) message += `_Feast Day: ${saint.feastDay}_\n\n`;

        if (saint.shortBio) {
            // Limited length for telegram summary
            const bio = saint.shortBio.length > 800 ? saint.shortBio.substring(0, 800) + "..." : saint.shortBio;
            message += `${bio}\n\n`;
        }

        if (saint.patronOf && (saint.patronOf as string[]).length > 0) {
            message += `🛡️ *Patron of:* ${(saint.patronOf as string[]).join(", ")}\n\n`;
        }

        // Static enhancements (since we don't have dynamic 'life lesson' in DB yet)
        message += `💡 *Life Lesson:*\nLet us imitate their virtue and ask for their intercession today.\n\n`;

        message += `🙏 *Prayer:*\nSaint ${saint.name}, pray for us! Amen.`;

        const keyboard = new InlineKeyboard()
            .url("📖 Read Full Bio", `https://myprayertower.com/saints/${saint.slug}`)
            .row()
            .text("🏠 Back to Menu", "cmd_start");

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

