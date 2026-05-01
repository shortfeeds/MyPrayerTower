import { Context, InlineKeyboard } from "grammy";
import { FAMILY_CONTENT } from "../content/family-content";

export const familyCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
        .text("🛌 Bedtime Prayers", "family_bedtime").row()
        .text("❓ Simple Catechism", "family_catechism").row()
        .text("📿 Family Rosary Tips", "family_rosary").row()
        .text("🏠 Back to Menu", "cmd_start");

    await ctx.reply(
        `👨‍👩‍👧 *Family & Kids Corner*

"Let the children come to me." (Matthew 19:14)

Resources to help you build a domestic church:`,
        {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        }
    );
};

export const handleFamilyCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data) return;
    const data = ctx.callbackQuery.data;

    const backKeyboard = new InlineKeyboard().text("🔙 Back to Family Menu", "menu_family");

    if (data === "family_bedtime") {
        let text = `🛌 *Bedtime Prayers*\n\n`;
        FAMILY_CONTENT.bedtime.forEach(p => {
            text += `*${p.title}*\n${p.text}\n\n`;
        });

        await ctx.editMessageText(text, { parse_mode: "Markdown", reply_markup: backKeyboard });
    }

    if (data === "family_catechism") {
        let text = `❓ *Simple Catechism*\n\n`;
        FAMILY_CONTENT.catechism.forEach((item, idx) => {
            text += `*Q${idx + 1}: ${item.q}*\nA: ${item.a}\n\n`;
        });

        await ctx.editMessageText(text, { parse_mode: "Markdown", reply_markup: backKeyboard });
    }

    if (data === "family_rosary") {
        await ctx.editMessageText(FAMILY_CONTENT.rosaryTips, { parse_mode: "Markdown", reply_markup: backKeyboard });
    }

    await ctx.answerCallbackQuery();
};
