import { Context, InlineKeyboard } from "grammy";
import { getSaintOfToday } from "@/lib/saints";

export const startCommand = async (ctx: Context) => {
    // 10-Module Main Menu
    const keyboard = new InlineKeyboard()
        .text("📖 Daily Gospel", "menu_gospel")
        .text("📿 Holy Rosary", "menu_rosary").row()
        .text("🕯️ Novena Center", "menu_novena")
        .text("✝️ Divine Mercy", "menu_mercy").row()
        .text("😇 Saint of Day", "menu_saint")
        .text("🧠 Catholic Quiz", "menu_quiz").row() // Phase 2 placeholder (active)
        .text("🙏 Prayer Requests", "menu_wall")
        .text("👨‍👩‍👧 Family & Kids", "menu_family").row() // Phase 2 placeholder (active)
        .text("🎧 Audio Mode", "menu_audio")
        .text("❤️ Support Us", "menu_support").row()
        .webApp("🚀 Launch Mini App", "https://www.myprayertower.com/bot");

    const welcomeMsg =
        `🙏 <b>Welcome to My Prayer Tower</b>

I am your daily Catholic companion. Choose a devotion below to begin:

📖 <b>Daily Gospel</b> - Readings & Reflection
📿 <b>Holy Rosary</b> - Interactive Guide
🕯️ <b>Novena Center</b> - Track 9-Day Prayers
✝️ <b>Divine Mercy</b> - 3PM Chaplet
😇 <b>Saint of Day</b> - Life & Lessons
🙏 <b>Prayer Wall</b> - Submit Intentions

<i>"Pray without ceasing." - 1 Thessalonians 5:17</i>`;

    await ctx.reply(welcomeMsg, {
        parse_mode: "HTML",
        reply_markup: keyboard,
    });
};

