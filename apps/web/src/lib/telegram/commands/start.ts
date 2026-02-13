import { Context, InlineKeyboard } from "grammy";

export const startCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
        .text("📖 Daily Reading", "cmd_reading")
        .text("😇 Saint of Day", "cmd_saint").row()
        .text("🙏 Prayer Wall", "cmd_wall")
        .text("🔥 My Streak", "cmd_streak").row()
        .url("🌐 Visit Website", "https://myprayertower.com");

    await ctx.reply(
        `🙏 *Welcome to My Prayer Tower Bot!*

I am your daily Catholic companion. 
Here is what I can do for you:

• Get the **Daily Mass Readings**
• Meet the **Saint of the Day**
• View and pray for **Prayer Intentions**
• Track your **Prayer Streak**

Tap a button below or type /help to see all commands.`,
        {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        }
    );
};
