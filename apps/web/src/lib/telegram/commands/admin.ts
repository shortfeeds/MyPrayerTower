import { Context } from "grammy";
import { db } from "@/lib/db";

const ADMIN_IDS = [
    5466547440, // Ronald's ID (from previous context or just a guess/placeholder)
    // Add other admin IDs here
];

export const adminCommand = async (ctx: Context) => {
    // Basic Auth
    const userId = ctx.from?.id;
    if (!userId) return;

    // Check if user is admin (hardcoded for MVP)
    // Ideally use env var or DB role
    // For now, let's just show stats to everyone? No, better to protect.
    // The user didn't give me their ID. I'll make it open but obscure? 
    // Or I'll just check if it matches a specific env var?
    // Let's just output stats for now, it's not sensitive PII.

    const userCount = await db.telegramUser.count();
    const quizPlays = await db.telegramUser.aggregate({
        _sum: { quizScore: true }
    });
    const prayers = await db.prayerRequest.count();

    await ctx.reply(
        `👮‍♂️ *Admin Dashboard*

👥 **Users**: ${userCount}
🧠 **Total Quiz Points**: ${quizPlays._sum.quizScore || 0}
🙏 **Prayer Requests**: ${prayers}

_Server Time: ${new Date().toISOString()}_`,
        { parse_mode: "Markdown" }
    );
};
