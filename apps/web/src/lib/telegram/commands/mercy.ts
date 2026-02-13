import { Context, InlineKeyboard } from "grammy";
import { MERCY_CONTENT } from "../content/mercy-content";

export const mercyCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
        .text("🙏 Start Chaplet", "mercy_start")
        .text("🏠 Menu", "cmd_start");

    await ctx.reply(MERCY_CONTENT.intro, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
    });
};

export const handleMercyCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data) return;
    const data = ctx.callbackQuery.data; // mercy_start or mercy_step_1

    let step = 0;
    if (data === "mercy_start") step = 1;
    else if (data.startsWith("mercy_step_")) step = parseInt(data.split("_")[2]);

    let message = "";
    let nextStep = step + 1;
    let btnText = "Next ➡️";

    switch (step) {
        case 1:
            message = MERCY_CONTENT.opening + "\n\n" + MERCY_CONTENT.creed;
            btnText = "First Decade ➡️";
            break;
        case 2: // Decade 1
        case 3: // Decade 2
        case 4: // Decade 3
        case 5: // Decade 4
        case 6: // Decade 5
            message = `*Decade ${step - 1}*

${MERCY_CONTENT.eternalFather}

---
${MERCY_CONTENT.passion}
(Repeat 10 times)`;
            btnText = step < 6 ? `Next: Decade ${step} ➡️` : "Concluding Prayer 🏁";
            break;
        case 7:
            message = MERCY_CONTENT.holyGod;
            nextStep = -1; // End
            break;
    }

    const keyboard = new InlineKeyboard();
    if (nextStep !== -1) {
        keyboard.text(btnText, `mercy_step_${nextStep}`);
    } else {
        keyboard.text("🏠 Back to Menu", "cmd_start");
    }

    await ctx.editMessageText(message, {
        parse_mode: "Markdown",
        reply_markup: keyboard
    });
    await ctx.answerCallbackQuery();
};
