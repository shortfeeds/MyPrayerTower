import { Context, InlineKeyboard } from "grammy";
import { findOrCreateUser } from "../services/user.service";

export const startCommand = async (ctx: Context) => {
    // 1. Handle Referral
    const payload = ctx.match; // grammy passes payload here
    let referralCode: string | undefined;
    if (typeof payload === 'string' && payload.startsWith('ref_')) {
        referralCode = payload.replace('ref_', '');
    }

    // 2. Get User Data (Name & Streak)
    const telegramId = ctx.from?.id;
    const username = ctx.from?.username;
    const firstName = ctx.from?.first_name || "Beloved";

    if (!telegramId) return;

    // We need to update findOrCreateUser to accept referralCode if it doesn't already
    // For now, we assume it does or we'll update it next.
    const user = await findOrCreateUser(telegramId, username, referralCode);

    // 3. Daily Content (Verse)
    const verses = [
        "\"I have loved you with an everlasting love.\" - Jer 31:3",
        "\"The Lord is near to all who call on Him.\" - Ps 145:18",
        "\"Be not afraid, only believe.\" - Mark 5:36",
        "\"Come to me, all who labor and are heavy laden.\" - Matt 11:28",
        "\"My grace is sufficient for you.\" - 2 Cor 12:9",
        "\"The Lord is my shepherd; I shall not want.\" - Ps 23:1",
        "\"Trust in the Lord with all your heart.\" - Prov 3:5"
    ];
    const verse = verses[Math.floor(Math.random() * verses.length)];
    const streak = user?.streakCount || 0;

    // 4. Emotional Welcome Message
    const welcomeMsg =
        `🕊️ <b>Peace be with you, ${firstName}.</b>

<i>${verse}</i>

🔥 <b>Your Prayer Streak: ${streak} Day${streak !== 1 ? 's' : ''}</b>
The Lord is waiting for you. Let us lift our hearts.

<b>Select a devotion to begin:</b>`;

    // 5. Menu Keyboard
    const keyboard = new InlineKeyboard()
        .text("📖 Daily Gospel", "menu_gospel")
        .text("📿 Holy Rosary", "menu_rosary").row()
        .text("🕯️ Novena Center", "menu_novena")
        .text("✝️ Divine Mercy", "menu_mercy").row()
        .text("😇 Saint of the Day", "menu_saint")
        .text("🧠 Catholic Quiz", "menu_quiz").row()
        .text("🙏 Prayer Requests", "menu_wall")
        .text("👨‍👩‍👧 Family & Kids", "menu_family").row()
        .text("🎧 Audio Mode", "menu_audio")
        .text("⏳ Liturgy of Hours", "cmd_hours")
        .text("🔓 Confession Guide", "cmd_confession").row()
        .text("❤️ Support & Share", "menu_support").row()
        .webApp("🚀 Launch Mini App", "https://www.myprayertower.com/bot");

    await ctx.reply(welcomeMsg, {
        parse_mode: "HTML",
        reply_markup: keyboard,
    });
};
