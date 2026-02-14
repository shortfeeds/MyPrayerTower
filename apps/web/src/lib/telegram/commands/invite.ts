import { Context } from "grammy";
import { db } from "@/lib/db";
import { findOrCreateUser } from "../services/user.service";

export const inviteCommand = async (ctx: Context) => {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    // 1. Ensure User Exists
    const user = await findOrCreateUser(telegramId, ctx.from?.username);
    if (!user) return;

    // 2. Get Referral Stats
    const referralCount = await db.telegramUser.count({
        where: { referredById: user.id }
    });

    // 3. Generate Link
    const botUser = await ctx.api.getMe();
    // referralCode is usually the DB ID to keep it short/unique, or a custom code if we had one.
    // Using user.id (cuid) is safe.
    const refLink = `https://t.me/${botUser.username}?start=ref_${user.id}`;

    await ctx.reply(`🤝 <b>Evangelize with Us!</b>\n\nInvite friends to pray with MyPrayerTower. Help us grow the Kingdom of God.\n\n<b>Your Stats:</b>\n👥 Souls Invited: <b>${referralCount}</b>\n\n<b>Your Link:</b>\n<code>${refLink}</code>\n\n<i>Tap to copy and share!</i>`, {
        parse_mode: "HTML"
    });
};
