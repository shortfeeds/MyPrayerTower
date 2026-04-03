import { Context, InlineKeyboard } from "grammy";
import { findOrCreateUser } from "../services/user.service";
import { trackEvent } from "../services/analytics";

export const startCommand = async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Handle referral if present
    const startPayload = ctx.match as string;
    await findOrCreateUser(userId, ctx.from?.username, startPayload);
    
    // Track event
    await trackEvent(userId, "start", { referral: startPayload });

    const welcomeMessage = `
🙏 *Welcome to My Prayer Tower* ✝️

"Come to me, all you who are weary and burdened, and I will give you rest." (Matthew 11:28)

I am your spiritual assistant, here to walk with you in faith. Whether you seek peace, healing, or guidance, let us turn to God together.

*How can I serve your spirit today?*
Please select your primary prayer focus so I can better guide you:
`;

    const prefKeyboard = new InlineKeyboard()
        .text("💙 Peace", "pref_peace")
        .text("❤️ Healing", "pref_healing").row()
        .text("💼 Work", "pref_work")
        .text("👨‍👩‍👧 Family", "pref_family").row()
        .text("🙏 General", "pref_general");

    await ctx.reply(welcomeMessage, {
        parse_mode: "Markdown",
        reply_markup: prefKeyboard,
    });
};

export const showMainMenu = async (ctx: Context) => {
    const mainMenuMessage = `
✨ *Main Menu*

Choose a path for your spiritual growth today:
`;

    const keyboard = new InlineKeyboard()
        .text("🙏 Daily Prayer", "daily_prayer").row()
        .text("📖 Reading", "reading").row()
        .url("📿 Rosary", "https://myprayertower.com/rosary").row()
        .text("🕊️ Prayer Wall", "wall").row()
        .url("🕯️ Light Candle", "https://myprayertower.com/candles");

    await ctx.reply(mainMenuMessage, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
    });
};
