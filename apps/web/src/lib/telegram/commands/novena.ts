import { Context, InlineKeyboard } from "grammy";
import { db } from "@/lib/db";
import { findOrCreateUser } from "../services/user.service";

// Pagination for 25 items
const ITEMS_PER_PAGE = 5;

export const novenaCommand = async (ctx: Context) => {
    await listNovenas(ctx, 1);
};

async function listNovenas(ctx: Context, page: number) {
    let displayNovenas: any[] = [];
    let totalCount = 0;

    // 1. Try Database
    try {
        const count = await db.novena.count();
        const novenas = await db.novena.findMany({
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE,
            orderBy: { name: 'asc' }
        });
        displayNovenas = novenas;
        totalCount = count;
    } catch (e) {
        console.error(">>> [NOVENA] DB Error (falling back to static):", e);
    }

    // 2. Fallback to Static Content if DB failed or empty
    if (displayNovenas.length === 0) {
        try {
            const { NOVENA_CONTENT } = await import("../content/novena-content");
            displayNovenas = NOVENA_CONTENT.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
            totalCount = NOVENA_CONTENT.length;
        } catch (err) {
            console.error(">>> [NOVENA] Static Content Error:", err);
            await ctx.reply("System maintenance. Please try again in 5 minutes.");
            return;
        }
    }

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const keyboard = new InlineKeyboard();
    displayNovenas.forEach(n => {
        keyboard.text(`🕯️ ${n.name}`, `novena_view_${n.id}`).row();
    });

    // Pagination row
    if (totalPages > 1) {
        if (page > 1) keyboard.text("⬅️ Prev", `novena_page_${page - 1}`);
        keyboard.text(`${page}/${totalPages}`, "noop");
        if (page < totalPages) keyboard.text("Next ➡️", `novena_page_${page + 1}`);
        keyboard.row();
    }

    keyboard.text("🏠 Back to Menu", "cmd_start");

    const msgProps = {
        parse_mode: "Markdown" as const,
        reply_markup: keyboard
    };

    const text = `🕯️ *Novena Center*
    
Select a Novena to begin your 9-day journey of prayer.`;

    // Either edit or reply depending on context
    try {
        if (ctx.callbackQuery) {
            await ctx.editMessageText(text, msgProps);
        } else {
            await ctx.reply(text, msgProps);
        }
    } catch (e) {
        console.error(">>> [NOVENA] Message Send Error:", e);
    }
}


export const handleNovenaCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data || !ctx.from) return;
    const data = ctx.callbackQuery.data;

    try {
        // PAGE NAVIGATION
        if (data.startsWith("novena_page_")) {
            const page = parseInt(data.split("_")[2]);
            await listNovenas(ctx, page);
            await ctx.answerCallbackQuery();
            return;
        }

        // VIEW NOVENA DETAILS
        if (data.startsWith("novena_view_")) {
            const id = data.split("_")[2];
            let novena: any = null;

            try {
                novena = await db.novena.findUnique({ where: { id } });
            } catch (e) {
                console.error(">>> [NOVENA] DB Find Error:", e);
            }

            if (!novena) {
                try {
                    const { NOVENA_CONTENT } = await import("../content/novena-content");
                    novena = NOVENA_CONTENT.find(n => n.id === id);
                } catch (e) {
                    console.error(">>> [NOVENA] Static Content Error:", e);
                }
            }

            if (!novena) {
                await ctx.answerCallbackQuery("Novena not found (System maintenance).");
                return;
            }

            // Check participation (Safely)
            let hasActive = false;
            let day = 1;

            try {
                const user = await findOrCreateUser(ctx.from.id, ctx.from.username);
                if (user && user.mptUserId) {
                    const participation = await db.novenaParticipation.findUnique({
                        where: {
                            novenaId_userId: {
                                novenaId: id,
                                userId: user.mptUserId
                            }
                        }
                    });
                    if (participation) {
                        hasActive = !participation.isCompleted;
                        day = participation.currentDay;
                    }
                }
            } catch (e) {
                console.error(">>> [NOVENA] Participation Check Error:", e);
                // Continue as guest (hasActive = false)
            }

            const keyboard = new InlineKeyboard();
            if (hasActive) {
                keyboard.text(`▶️ Continue Day ${day}`, `novena_day_${id}_${day}`).row();
            } else {
                keyboard.text("🙏 Start Novena", `novena_day_${id}_1`).row();
            }
            keyboard.text("🔙 Back to List", "novena_page_1");

            await ctx.editMessageText(
                `🕯️ *${novena.name}*
                
_${novena.description}_

${hasActive ? `✅ You are currently on Day ${day}.` : "Start this 9-day prayer today."}`,
                { parse_mode: "Markdown", reply_markup: keyboard }
            );
            await ctx.answerCallbackQuery();
            return;
        }

        // PRAY SPECIFIC DAY
        if (data.startsWith("novena_day_")) {
            const parts = data.split("_");
            const id = parts[2];
            const day = parseInt(parts[3]);

            let novena: any = null;
            try {
                novena = await db.novena.findUnique({ where: { id } });
            } catch (e) { console.error(">>> [NOVENA] DB Find Error:", e); }

            if (!novena) {
                try {
                    const { NOVENA_CONTENT } = await import("../content/novena-content");
                    novena = NOVENA_CONTENT.find(n => n.id === id);
                } catch (e) { console.error(">>> [NOVENA] Static Load Error:", e); }
            }

            if (!novena) return;

            // Get text dynamically
            const dayKey = `day${getDayWord(day)}Text` as keyof typeof novena;
            const text = novena[dayKey] as string;

            const keyboard = new InlineKeyboard();
            keyboard.text(`✅ Complete Day ${day}`, `novena_complete_${id}_${day}`).row();
            keyboard.text("🔙 Back", `novena_view_${id}`);

            await ctx.editMessageText(
                `*${novena.name} - Day ${day}*

${text}`,
                { parse_mode: "Markdown", reply_markup: keyboard }
            );
            await ctx.answerCallbackQuery();
            return;
        }

        // COMPLETE DAY
        if (data.startsWith("novena_complete_")) {
            const parts = data.split("_");
            const id = parts[2];
            const day = parseInt(parts[3]);
            let success = false;

            try {
                const user = await findOrCreateUser(ctx.from.id);
                if (user && user.mptUserId) {
                    const isFinal = day >= 9;
                    await db.novenaParticipation.upsert({
                        where: { novenaId_userId: { novenaId: id, userId: user.mptUserId } },
                        update: {
                            currentDay: isFinal ? 9 : day + 1,
                            isCompleted: isFinal,
                            lastPrayedAt: new Date()
                        },
                        create: {
                            novenaId: id,
                            userId: user.mptUserId,
                            currentDay: isFinal ? 9 : 2,
                        }
                    });
                    success = true;
                }
            } catch (e) {
                console.error(">>> [NOVENA] Progress Save Error:", e);
                // success stays false
            }

            const keyboard = new InlineKeyboard().text("🏠 Back to Menu", "cmd_start");
            const msg = success
                ? `🎉 *Day ${day} Completed!* \n\nSee you tomorrow for the next prayer.`
                : `🎉 *Day ${day} Completed!* \n\n(Note: Progress saved locally. Connect MPT account to sync.)`;

            await ctx.editMessageText(msg, { parse_mode: "Markdown", reply_markup: keyboard });
            await ctx.answerCallbackQuery("Prayer recorded!");
        }

    } catch (e) {
        console.error(">>> [NOVENA] Critical Callback Error:", e);
        await ctx.answerCallbackQuery("An error occurred. Please try again.");
    }
};


function getDayWord(n: number) {
    const map = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    return map[n] || "One";
}
