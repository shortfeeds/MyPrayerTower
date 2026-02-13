import { Context, InlineKeyboard } from "grammy";

export const prayCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
        .url("🙏 Submit Prayer Request", "https://myprayertower.com/prayer-wall");

    await ctx.reply(
        `Share your intentions with our community on the **Prayer Wall**.
    
We have thousands of prayer warriors ready to pray for you.`,
        {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        }
    );
};
