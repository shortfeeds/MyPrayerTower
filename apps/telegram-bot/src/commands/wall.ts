import { Context, InlineKeyboard } from "grammy";
import { getLatestPublicPrayers, prayForRequest } from "../services/prayer-wall";

export const wallCommand = async (ctx: Context) => {
    try {
        const prayers = await getLatestPublicPrayers(5);

        if (prayers.length === 0) {
            await ctx.reply("There are no active prayer requests at the moment.");
            return;
        }

        await ctx.reply("🙏 *Prayer Wall* \nHere are the latest intentions from our community:", { parse_mode: "Markdown" });

        for (const prayer of prayers) {
            let author = "Anonymous";
            if (prayer.visibility === "PUBLIC" && prayer.user) {
                author = `${prayer.user.firstName} ${prayer.user.lastName ? prayer.user.lastName[0] + "." : ""}`;
            }

            const message = `
*${prayer.title || "Prayer Request"}*
_${author}_

${prayer.content.length > 300 ? prayer.content.substring(0, 300) + "..." : prayer.content}

🌱 ${prayer.prayerCount} prayers so far
            `;

            const keyboard = new InlineKeyboard().text(`🙏 I Prayed`, `pray_${prayer.id}`);

            await ctx.reply(message, {
                parse_mode: "Markdown",
                reply_markup: keyboard,
            });
        }

    } catch (error) {
        console.error("Error in wall command:", error);
        await ctx.reply("Sorry, I couldn't load the Prayer Wall right now.");
    }
};

// Callback handler for button clicks
export const handlePrayCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery || !ctx.callbackQuery.data) return;

    const data = ctx.callbackQuery.data;
    if (!data.startsWith("pray_")) return;

    const prayerId = data.split("_")[1];
    const user = ctx.from;

    if (!user) return;

    try {
        const result = await prayForRequest(user.id, prayerId);

        if (result.success) {
            if (result.alreadyPrayed) {
                await ctx.answerCallbackQuery({ text: "You have already prayed for this intention. 🙏" });
            } else {
                await ctx.answerCallbackQuery({ text: "Prayer recorded! Thank you. 🕊️" });

                // Optionally update the message to show new count, but that requires re-fetching or passing count
                // For MVP, just acknowledging is fine.
            }
        } else {
            await ctx.answerCallbackQuery({ text: "Failed to record prayer. Please try again." });
        }
    } catch (error) {
        console.error("Callback error:", error);
        await ctx.answerCallbackQuery({ text: "An error occurred." });
    }
};
