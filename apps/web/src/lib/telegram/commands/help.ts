import { Context } from "grammy";

export const helpCommand = async (ctx: Context) => {
    await ctx.reply(
        `🤖 *My Prayer Tower Bot Help*

Here are the commands you can use:

/start - Open the main menu
/reading - Get today's Mass readings
/saint - Get the Saint of the Day
/wall - View recent prayer requests
/pray - Link to the Prayer Wall
/streak - Check your activity streak
/help - Show this message

Needs support? Visit https://myprayertower.com/contact`,
        { parse_mode: "Markdown" }
    );
};
