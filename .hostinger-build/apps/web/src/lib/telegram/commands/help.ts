import { Context } from "grammy";

export const helpCommand = async (ctx: Context) => {
    await ctx.reply(
        `🤖 *My Prayer Tower Bot Guide*

Navigate using the main menu (/start) or use these commands:

/start - 🏠 Open Main Menu
/reading - 📖 Daily Gospel & Reflection
/rosary - 📿 Holy Rosary Guide
/novena - 🕯️ Novena Center
/mercy - ✝️ Divine Mercy Chaplet
/saint - 😇 Saint of the Day
/quiz - 🧠 Catholic Quiz
/wall - 🙏 Prayer Requests
/family - 👨‍👩‍👧 Family & Kids
/audio - 🎧 Audio Resources
/support - ❤️ Support & Share

_Tap /start at any time to return home._`,
        { parse_mode: "Markdown" }
    );
};

