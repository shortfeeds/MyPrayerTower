import { Context, InlineKeyboard } from "grammy";
import { ROSARY_CONTENT } from "../content/rosary-content";

export const rosaryCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
        .text("🌿 Joyful (Mon, Sat)", "rosary_joyful").row()
        .text("🩸 Sorrowful (Tue, Fri)", "rosary_sorrowful").row()
        .text("☀️ Glorious (Wed, Sun)", "rosary_glorious").row()
        .text("✨ Luminous (Thu)", "rosary_luminous").row()
        .text("🏠 Back to Menu", "cmd_start"); // Alias to /start

    await ctx.reply(
        `📿 *The Holy Rosary*

"The Rosary is the most beautiful and the most rich in graces of all prayers." - Pope St. Pius X

Select a mystery to begin:`,
        {
            parse_mode: "Markdown",
            reply_markup: keyboard,
        }
    );
};

export const handleRosaryCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data) return;
    const data = ctx.callbackQuery.data; // e.g., rosary_joyful or rosary_joyful_1

    const parts = data.split("_");
    const mysteryKey = parts[1]; // joyful
    const decadeIndex = parts[2] ? parseInt(parts[2]) : -1; // Optional decade index

    const mystery = ROSARY_CONTENT[mysteryKey];
    if (!mystery) {
        await ctx.answerCallbackQuery("Mystery not found.");
        return;
    }

    // Step 0: Overview (if no decade selected)
    if (decadeIndex === -1) {
        const keyboard = new InlineKeyboard()
            .text("Start: 1st Decade ▶️", `rosary_${mysteryKey}_0`).row()
            .text("🏠 Menu", "cmd_start");

        await ctx.editMessageText(
            `📿 *${mystery.name}*
_Recommended for: ${mystery.days.join(", ")}_

Get your rosary beads ready.
Make the Sign of the Cross.
Pray the Apostles' Creed.
Pray 1 Our Father, 3 Hail Marys, 1 Glory Be.

Tap below to begin the First Mystery.`,
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
        await ctx.answerCallbackQuery();
        return;
    }

    // specific decade
    const decade = mystery.decades[decadeIndex];
    if (!decade) {
        // End of Rosary
        const keyboard = new InlineKeyboard()
            .text("🏠 Back to Menu", "cmd_start");

        await ctx.editMessageText(
            `✅ *Rosary Completed*

Hail, Holy Queen, Mother of Mercy...
Pray for us, O Holy Mother of God.

In the name of the Father, and of the Son, and of the Holy Spirit. Amen. 

You have finished the ${mystery.name}.`,
            { parse_mode: "Markdown", reply_markup: keyboard }
        );
        return;
    }

    const nextIndex = decadeIndex + 1;
    const nextLabel = nextIndex < 5 ? `Next: ${nextIndex + 1}th Decade ➡️` : "Finish Rosary 🏁";

    const keyboard = new InlineKeyboard()
        .text(nextLabel, `rosary_${mysteryKey}_${nextIndex}`);

    const message = `
*${decade.title}*
_${decade.fruit}_

📜 *Scripture:*
${decade.scripture}

💭 *Meditation:*
${decade.meditation}

---
📿 *Pray:*
1 Our Father
10 Hail Marys
1 Glory Be
1 O My Jesus
`;

    await ctx.editMessageText(message, {
        parse_mode: "Markdown",
        reply_markup: keyboard
    });
    await ctx.answerCallbackQuery();
};
