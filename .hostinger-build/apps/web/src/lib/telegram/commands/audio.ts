import { Context, InlineKeyboard } from "grammy";

export const audioCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
        .url("📺 Latest Sermons", "https://www.youtube.com/myprayertower/videos")
        .row()
        .url("📿 Rosary Recordings", "https://www.youtube.com/results?search_query=rosary+myprayertower")
        .row()
        .url("🎵 Worship Music", "https://www.youtube.com/myprayertower/playlists")
        .row()
        .text("🏠 Back to Menu", "cmd_start");

    await ctx.reply(
        `🎧 *Audio & Video Resources*

Connect with MyPrayerTower on YouTube directly:`,
        {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        }
    );
};

