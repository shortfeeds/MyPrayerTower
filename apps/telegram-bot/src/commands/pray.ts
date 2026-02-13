import { Context, InlineKeyboard } from "grammy";

export const prayCommand = async (ctx: Context) => {
    const message = `
🙏 *Prayer Wall*

Share your intentions and let our community pray for you. Or take a moment to pray for others.

"For where two or three are gathered in my name, there am I among them." (Matthew 18:20)
`;

    const keyboard = new InlineKeyboard()
        .url("Submit Prayer Request", "https://myprayertower.com/prayer-wall")
        .row()
        .url("View Prayer Wall", "https://myprayertower.com/prayer-wall");

    await ctx.reply(message, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
    });
};
