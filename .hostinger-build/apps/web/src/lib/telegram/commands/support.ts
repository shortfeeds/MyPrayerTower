import { Context, InlineKeyboard } from "grammy";
import { findOrCreateUser } from "../services/user.service";

export const supportCommand = async (ctx: Context) => {
    // Determine referral link
    let refLink = "https://t.me/MyPrayerTowerBot";

    // Try to get user's referral code
    if (ctx.from?.id) {
        const user = await findOrCreateUser(ctx.from.id, ctx.from.username);
        if (user && user.referralCode) {
            refLink = `https://t.me/MyPrayerTowerBot?start=ref_${user.referralCode}`;
        }
    }

    const shareText = encodeURIComponent("Join me in prayer with MyPrayerTower! 🕊️ Daily Gospel, Rosary, and more.");
    const shareUrl = `https://t.me/share/url?url=${refLink}&text=${shareText}`;

    const keyboard = new InlineKeyboard()
        .url("📤 Share with Friends", shareUrl).row()
        .url("💝 Give an Offering", "https://myprayertower.com/donate").row()
        .url("📺 Subscribe on YouTube", "https://www.youtube.com/myprayertower").row()
        .url("🌐 Visit Website", "https://myprayertower.com").row()
        .text("🏠 Back to Menu", "cmd_start");

    await ctx.reply(
        `❤️ <b>Support My Prayer Tower</b>

Our mission is to bring daily prayer to Catholics worldwide. 
This ministry is supported by your generosity and evangelization.

<b>Your Impact:</b>
By sharing this bot, you help us bring the Gospel to more souls.

<b>Ways to Help:</b>
1. <b>Pray</b> for our mission.
2. <b>Share</b> your unique link above.
3. <b>Donate</b> to help us grow.

<i>"Go into all the world and proclaim the gospel." (Mark 16:15)</i>`,
        {
            parse_mode: "HTML",
            reply_markup: keyboard,
        }
    );
};
