import { Context } from "grammy";
import prisma from "../services/db";
import { trackEvent } from "../services/analytics";

export const inviteCommand = async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    try {
        const user = await prisma.telegramUser.findUnique({
            where: { telegramId: BigInt(userId) }
        });

        if (!user || !user.referralCode) {
            await ctx.reply("Sorry, I couldn't generate your invite link. Please try /start first.");
            return;
        }

        const inviteLink = `https://t.me/MyPrayerTowerBot?start=${user.referralCode}`;
        
        const message = `
🎁 *Invite your friends*

Share the gift of prayer with your loved ones. When they join using your link, you both help build our community of faith.

*Your unique invite link:*
${inviteLink}
`;

        await trackEvent(userId, "referral_invite");
        await ctx.reply(message, { parse_mode: "Markdown" });

    } catch (error) {
        console.error("Error in invite command:", error);
        await ctx.reply("An error occurred while generating your invite link.");
    }
};
