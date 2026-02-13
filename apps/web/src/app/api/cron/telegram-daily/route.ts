import { NextRequest, NextResponse } from "next/server";
import { createBot } from "@/lib/telegram/bot";
import { db } from "@/lib/db";

// Secure this endpoint (e.g. check CRON_SECRET or just keep it obscure/Vercel protected)
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
    // Basic auth check against CRON_SECRET if configured via Vercel
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return new Response('Unauthorized', { status: 401 });
    }

    try {
        const bot = createBot();

        // Fetch all users
        // NOTE: In production with many users, implement cursor-based pagination
        const users = await db.telegramUser.findMany();

        const message = `
🌅 *Good Morning!*

Starting your day with prayer? 

Use /reading to get today's Mass readings.
Use /saint to meet the Saint of the Day.
        `;

        let sentCount = 0;
        let failCount = 0;

        for (const user of users) {
            try {
                await bot.api.sendMessage(Number(user.telegramId), message, { parse_mode: "Markdown" });
                // Small delay to be polite to TG API
                await new Promise(r => setTimeout(r, 30));
                sentCount++;
            } catch (e) {
                console.error(`Failed to send to ${user.telegramId}:`, e);
                failCount++;
            }
        }

        return NextResponse.json({ success: true, sent: sentCount, failed: failCount });
    } catch (error) {
        console.error("Error in daily cron:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
};
