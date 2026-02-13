import { Context, InlineKeyboard } from "grammy";
import { db } from "@/lib/db";

export const leaderboardCommand = async (ctx: Context) => {
    // Top 10 users by quiz score
    const topUsers = await db.telegramUser.findMany({
        where: { quizScore: { gt: 0 } }, // Only those with score > 0
        orderBy: { quizScore: "desc" },
        take: 10,
    });

    if (topUsers.length === 0) {
        await ctx.reply("🏆 *Leaderboard*\n\nNo scores yet! Be the first to play the /quiz.", { parse_mode: "Markdown" });
        return;
    }

    let message = "🏆 *Quiz Leaderboard*\n\n";

    topUsers.forEach((u, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
        const name = u.telegramUsername ? `@${u.telegramUsername}` : `User ${u.id.substring(0, 4)}`;
        message += `${medal} *${name}*: ${u.quizScore} pts\n`;
    });

    const keyboard = new InlineKeyboard()
        .text("🧠 Play Quiz", "menu_quiz").row()
        .text("🏠 Home", "cmd_start");

    await ctx.reply(message, { parse_mode: "Markdown", reply_markup: keyboard });
};
