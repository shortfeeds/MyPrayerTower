import { Context } from "grammy";

export const helpCommand = async (ctx: Context) => {
    const message = `
🤖 *My Prayer Tower Bot Help*

Here are the commands you can use:

/start - Show the main menu
/reading - Get today's Mass readings
/saint - Learn about the Saint of the Day
/pray - Visit the Prayer Wall
/help - Show this help message

For more features, visit [myprayertower.com](https://myprayertower.com).
`;

    await ctx.reply(message, { parse_mode: "Markdown" });
};
