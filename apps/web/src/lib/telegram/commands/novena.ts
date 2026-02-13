import { Context, InlineKeyboard } from "grammy";
import { db } from "@/lib/db";
import { findOrCreateUser } from "../services/user.service";

// Pagination for 25 items
const ITEMS_PER_PAGE = 5;

export const novenaCommand = async (ctx: Context) => {
    await listNovenas(ctx, 1);
};

async function listNovenas(ctx: Context, page: number) {
    try {
        const count = await db.novena.count();
        const novenas = await db.novena.findMany({
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE,
            orderBy: { name: 'asc' }
        });

        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

        const keyboard = new InlineKeyboard();
        novenas.forEach(n => {
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
        if (ctx.callbackQuery) {
            await ctx.editMessageText(text, msgProps);
        } else {
            await ctx.reply(text, msgProps);
        }

    } catch (e) {
        console.error("Error listing novenas:", e);
        await ctx.reply("Failed to load Novena Center.");
    }
}

export const handleNovenaCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data || !ctx.from) return;
    const data = ctx.callbackQuery.data;

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
        const novena = await db.novena.findUnique({ where: { id } });

        if (!novena) {
            await ctx.answerCallbackQuery("Novena not found.");
            return;
        }

        // Check if user has active participation
        const user = await findOrCreateUser(ctx.from.id, ctx.from.username);
        // We need the User ID to check participation. 
        // Note: findOrCreateUser returns TelegramUser. Participation is linked to...
        // Wait, schema says NovenaParticipation links to `User` (the MPT User), NOT TelegramUser directly.
        // This is a schema constraint. 
        // If the TelegramUser is not linked to an MPT User, we can't store participation in the current schema.
        // CHECK SCHEMA: model NovenaParticipation { userId String ... user User ... }
        // This means Guest users (Telegram only) cannot use Novenas unless we modify schema or use a hack.

        // HACK for MVP: If no MPT user linked, we can't save progress. 
        // But the user requested this feature.
        // Let's check if we can link to TelegramUser in schema? 
        // I can't modify schema easily in a running app without migration.
        // Let's see if TelegramUser has an MPT User ID.

        // Use case: Many bots store state in metadata if no DB user.
        // Or we just allow viewing text without tracking for now if no account.

        let hasActive = false;
        let day = 1;

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
        // Format: novena_day_{id}_{day}
        const parts = data.split("_");
        const id = parts[2];
        const day = parseInt(parts[3]);

        const novena = await db.novena.findUnique({ where: { id } });
        if (!novena) return;

        // Get text dynamically
        // Prisma model has dayOneText...dayNineText
        const dayKey = `day${getDayWord(day)}Text` as keyof typeof novena;
        const text = novena[dayKey] as string;

        const keyboard = new InlineKeyboard();

        // "Mark Complete" button - strictly requires MPT user link for now? 
        // Or we just simulate progress for guests by showing "Next" button immediately?
        // Let's show "Complete Day X" which updates DB if possible, or just Says "Done".

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

        const user = await findOrCreateUser(ctx.from.id);
        let success = false;

        if (user && user.mptUserId) {
            // Update DB
            // We need to upsert participation
            // Note: Prisma update
            // Logic: If day 9, mark completed. Else day + 1.

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
                    currentDay: isFinal ? 9 : 2, // If they completed day 1, next is 2
                }
            });
            success = true;
        }

        const keyboard = new InlineKeyboard().text("🏠 Back to Menu", "cmd_start");
        const msg = success
            ? `🎉 *Day ${day} Completed!* \n\nSee you tomorrow for the next prayer.`
            : `🎉 *Day ${day} Completed!* \n\n(Note: Connect your MPT account to save progress permanently.)`;

        await ctx.editMessageText(msg, { parse_mode: "Markdown", reply_markup: keyboard });
        await ctx.answerCallbackQuery("Prayer recorded!");
    }
};

function getDayWord(n: number) {
    const map = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    return map[n] || "One";
}
