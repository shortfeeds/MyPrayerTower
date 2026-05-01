import { Context, InlineKeyboard } from "grammy";
import { CONFESSION_GUIDE } from "../content/confession-content-guide";

// Re-exporting the content in case the path was slightly off in previous steps, 
// wait, I made `confession-content.ts` in step 4369, but here I seem to import from `confession-content-guide`.
// Let me correct the import path to match step 4369: `../content/confession-content`

import { CONFESSION_GUIDE as GUIDE } from "../content/confession-content";

export const confessionCommand = async (ctx: Context) => {
    // Check if user is in a private chat, important for confession!
    if (ctx.chat?.type !== "private") {
        await ctx.reply("Please use this command in a private chat to ensure privacy.");
        return;
    }

    const keyboard = new InlineKeyboard()
        .text("🙏 Begin Examination", "confess_step_1");

    await ctx.reply(GUIDE.intro, {
        parse_mode: "HTML",
        reply_markup: keyboard
    });
};

export const handleConfessionCallback = async (ctx: Context) => {
    const data = ctx.callbackQuery?.data;
    if (!data) return;

    try {
        if (data === "confess_finish") {
            await ctx.editMessageText(`<b>Go in Peace</b>\n\nMay God bless you and keep you. Remember to go to Confession as soon as you can to receive the sacramental absolution.\n\n"Whose sins you forgive are forgiven them." - John 20:23`, {
                parse_mode: "HTML",
                reply_markup: new InlineKeyboard().text("🏠 Return to Home", "cmd_start")
            });
            return;
        }

        if (data === "confess_act") {
            const keyboard = new InlineKeyboard()
                .text("✅ I have prayed this", "confess_finish");

            await ctx.editMessageText(GUIDE.actOfContrition, {
                parse_mode: "HTML",
                reply_markup: keyboard
            });
            return;
        }

        // Handle Steps 1-10
        if (data.startsWith("confess_step_")) {
            const step = parseInt(data.replace("confess_step_", ""));
            const commandment = GUIDE.commandments.find(c => c.id === step);

            if (!commandment) {
                // Fallback or error
                await ctx.answerCallbackQuery("Error: Step not found");
                return;
            }

            const keyboard = new InlineKeyboard();

            // Navigation buttons
            // Layout: 
            // [ Prev ] [ Next ]
            // [ Quit ]

            if (step > 1) {
                keyboard.text("⬅️ Back", `confess_step_${step - 1}`);
            }

            if (step < 10) {
                keyboard.text("Next ➡️", `confess_step_${step + 1}`);
            } else {
                keyboard.text("🙏 Act of Contrition ➡️", "confess_act");
            }

            keyboard.row();
            keyboard.text("❌ Cancel", "cmd_start");

            const message = `<b>Commandment ${commandment.id}</b>\n\n<i>${commandment.title}</i>\n\n${commandment.text}`;

            await ctx.editMessageText(message, {
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
    } catch (e) {
        console.error("Confession callback error:", e);
        try {
            await ctx.answerCallbackQuery("An error occurred. Please try again.");
        } catch (_) { }
    }
};
