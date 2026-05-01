import { Context } from "grammy";
import { db } from "@/lib/db";
import { findOrCreateUser } from "../services/user.service";

export const prayCommand = async (ctx: Context) => {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    // 1. Get User
    const user = await findOrCreateUser(telegramId, ctx.from?.username);

    // 2. Parse Intention
    // ctx.match in grammy for commands is the text after the command
    const text = typeof ctx.match === 'string' ? ctx.match : "";

    if (!text || text.trim().length === 0) {
        await ctx.reply("🙏 <b>How can we pray for you?</b>\n\nPlease type your intention after the command.\nExample: <code>/pray for my sick father</code>", {
            parse_mode: "HTML"
        });
        return;
    }

    try {
        let userId = user?.mptUserId;

        // If no linked account, we can't easily create a prayer request because of FK constraint.
        // We will create a "Guest" user or prompt them.
        // For now, let's gracefully fail with a CTA if no mptUserId.

        if (!userId && user?.telegramId) {
            // Try to find if there is a User with this telegram ID linked via other means? 
            // Or just prompt to launch app which auto-creates User.
            // Actually, `findOrCreateUser` in `user.service.ts` creates a `TelegramUser`.
            // But `TelegramUser` has optional `mptUserId`.
            // We need to ensure `User` exists.

            // Simplest Plan: Just prompt to launch app one time.
            await ctx.reply("🕊️ <b>One Step Remaining</b>\n\nTo submit prayer requests, we need to set up your secure profile first.\n\nPlease tap <b>'Launch Mini App'</b> below once, then come back and type <code>/pray</code> again!", {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [[{ text: "🚀 Launch Mini App", web_app: { url: "https://www.myprayertower.com/bot" } }]]
                }
            });
            return;
        }

        // 3. Create Request
        await db.prayerRequest.create({
            data: {
                userId: userId!,
                content: text,
                category: "OTHER", // Default
                visibility: "PUBLIC",
                status: "PENDING"
            }
        });

        // 4. Confirm
        await ctx.reply(`🕯️ <b>Prayer Received</b>\n\nYour intention has been placed on the Prayer Wall. Our community will lift you up in prayer.\n\n"For where two or three are gathered in my name, there am I."`, {
            parse_mode: "HTML"
        });

    } catch (e) {
        console.error("Prayer request error:", e);
        await ctx.reply("Tracking your prayer failed, but God heard it. \n(System error, please try again later).");
    }
};
