import { Context } from "grammy";
import { getSaintOfTheDay } from "../services/api";

export const saintCommand = async (ctx: Context) => {
    try {
        const saint = await getSaintOfTheDay();

        if (!saint) {
            await ctx.reply("Sorry, I couldn't fetch the Saint of the Day right now. Please try again later.");
            return;
        }

        const title = saint.title ? `${saint.title} ` : "";
        const name = saint.name;
        const feastDay = saint.feastDay || "Today";
        const patronage = saint.patronOf?.length ? `\n🛡️ *Patron of:* ${saint.patronOf.join(", ")}` : "";
        const bio = saint.shortBio ? `\n\n${saint.shortBio}` : "";

        const message = `
😇 *Saint of the Day*

*${title}${name}*
📅 Feast: ${feastDay}${patronage}${bio}

[Read more on our website](https://myprayertower.com/saints/${saint.slug})
`;

        if (saint.imageUrl) {
            await ctx.replyWithPhoto(saint.imageUrl, {
                caption: message,
                parse_mode: "Markdown",
            });
        } else {
            await ctx.reply(message, { parse_mode: "Markdown" });
        }

    } catch (error) {
        console.error("Error in saint command:", error);
        await ctx.reply("An error occurred while fetching the saint.");
    }
};
