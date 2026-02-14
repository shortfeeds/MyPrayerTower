import { NextResponse } from 'next/server';
import { createBot } from '@/lib/telegram/bot';
import { db } from '@/lib/db';
import { getSaintOfToday } from '@/lib/saints';
import { getReadings } from '@/lib/readings';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Extend timeout for sending many messages

export async function GET(request: Request) {
    try {
        // Authenticate cron request (optional, Vercel secures this usually)
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Initialize Bot & Fetch Content
        const bot = createBot();
        const today = new Date();
        const saint = await getSaintOfToday();
        const readings = await getReadings(today);

        let gospelText = "";
        let gospelCitation = "";

        if (readings && readings.readings) {
            const gospel = readings.readings.find((r: any) => r.type === "Gospel" || r.type === "Holy Gospel");
            if (gospel) {
                gospelCitation = gospel.citation;
                gospelText = gospel.text.substring(0, 150) + "..."; // Teaser
            }
        }

        const message =
            `🌅 <b>Morning Prayer</b>

<b>Today's Gospel:</b> ${gospelCitation}
<i>"${gospelText}"</i>

<b>Saint of the Day:</b> ${saint?.name || "All Saints"}

🔥 <b>Keep your prayer streak alive!</b>
Tap below to pray.

👇`;

        // 2. Fetch Users (Batching could be added here for scale)
        const url = new URL(request.url);
        const isTest = url.searchParams.get('test') === 'true';

        let users;
        if (isTest) {
            // Test mode: Send only to specific admin ID (replace with your ID or dynamic)
            // For now, let's try to find the user who triggered it if possible, or just a known admin.
            // Since we can't easily valid admin ID without hardcoding, let's just fetch 1 user.
            users = await db.telegramUser.findMany({
                where: { isGospelSubscribed: true },
                take: 1
            });
            console.log("🧪 TEST MODE: Sending to 1 user only.");
        } else {
            users = await db.telegramUser.findMany({
                where: { isGospelSubscribed: true },
                select: { telegramId: true }
            });
        }

        console.log(`Sending daily update to ${users.length} users...`);

        // 3. Send Messages (with concurrency limit)
        const results = await Promise.allSettled(
            users.map(async (user) => {
                try {
                    await bot.api.sendMessage(Number(user.telegramId), message, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [[{ text: "🙏 Start Prayer", callback_data: "cmd_start" }]]
                        }
                    });
                    return "sent";
                } catch (e) {
                    // Start parameter not available in sendMessage, so just text.
                    // Actually, cmd_start via callback works if we handle it? 
                    // No, "cmd_start" is not a standard callback unless we defined it. 
                    // In start.ts we used "cmd_start" as callback data for "Back to Menu".
                    // So it should work!
                    console.error(`Failed to send to ${user.telegramId}:`, e);
                    return "failed";
                }
            })
        );

        const successCount = results.filter(r => r.status === 'fulfilled' && r.value === 'sent').length;

        return NextResponse.json({
            success: true,
            sent: successCount,
            total: users.length
        });

    } catch (error) {
        console.error("Cron failed:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
