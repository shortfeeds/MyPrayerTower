import { Context, InlineKeyboard } from "grammy";

export const supportCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
        .url("💝 Give an Offering", "https://myprayertower.com/donate").row()
        .url("📺 Subscribe on YouTube", "https://www.youtube.com/myprayertower").row()
        .url("🌐 Visit Website", "https://myprayertower.com").row()
        .url("📤 Share Bot", "https://t.me/share/url?url=https://t.me/MyPrayerTowerBot&text=Join%20me%20in%20daily%20prayer%20with%20MyPrayerTower!").row()
        .text("🏠 Back to Menu", "cmd_start");

    await ctx.reply(
        `❤️ *Support My Prayer Tower*

Our mission is to bring daily prayer to Catholics worldwide. 
This ministry is supported by your generosity.

**Ways to Help:**
1. **Pray** for our mission.
2. **Share** this bot with friends and family.
3. **Donate** to cover server costs and reach more souls.

_God loves a cheerful giver! (2 Cor 9:7)_`,
        {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        }
    );
};
