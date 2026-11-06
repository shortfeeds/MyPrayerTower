import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const slot = searchParams.get('slot') || 'morning';
    const secret = searchParams.get('secret');

    // Cron security check (allow internal localhost or matching CRON_SECRET)
    const expectedSecret = process.env.CRON_SECRET;
    const isLocalhost = request.headers.get('host')?.includes('localhost') || request.headers.get('host')?.includes('127.0.0.1');

    if (!isLocalhost && expectedSecret && secret !== expectedSecret) {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
    }

    const token = process.env.BOT_TOKEN;
    if (!token) {
        return NextResponse.json({ 
            success: false, 
            message: 'BOT_TOKEN is not configured in environment variables. Telegram broadcast skipped.' 
        });
    }

    const channelId = process.env.TELEGRAM_CHANNEL_ID || '@myprayertower';
    const siteUrl = 'https://www.myprayertower.com';

    let messageText = '';
    let buttons: Array<Array<{ text: string; url: string }>> = [];

    const dateStr = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });

    if (slot === 'morning') {
        messageText = `🌅 <b>Daily Morning Offering & Catholic Devotion — ${dateStr}</b>\n\n` +
            `<i>"O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world."</i>\n\n` +
            `Begin your day in the sacred peace of Christ. Light a candle for your intentions or pray today's liturgy.\n\n` +
            `🕊️ @myprayertower`;

        const waText = encodeURIComponent(`🌅 Morning Offering — ${dateStr}\n\n"O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day..."\n\nPray together on MyPrayerTower: https://www.myprayertower.com/prayers/morning-offering`);

        buttons = [
            [
                { text: '🙏 Read Morning Offering', url: `${siteUrl}/prayers/morning-offering` },
                { text: '🕯️ Light a Candle', url: `${siteUrl}/candles` }
            ],
            [
                { text: '📲 Share to WhatsApp', url: `https://api.whatsapp.com/send?text=${waText}` }
            ]
        ];
    } else if (slot === 'angelus') {
        messageText = `🔔 <b>The Angelus — Midday Prayer</b>\n\n` +
            `<b>V.</b> The Angel of the Lord declared unto Mary,\n` +
            `<b>R.</b> And she conceived of the Holy Spirit.\n\n` +
            `<i>Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus...</i>\n\n` +
            `Pause your afternoon to consecrate this moment to God.\n\n` +
            `🕊️ @myprayertower`;

        const waText = encodeURIComponent(`🔔 The Angelus Midday Prayer\n\n"The Angel of the Lord declared unto Mary, and she conceived of the Holy Spirit..."\n\nPray online: https://www.myprayertower.com/prayers/the-angelus`);

        buttons = [
            [
                { text: '📿 Full Angelus Prayer', url: `${siteUrl}/prayers/the-angelus` },
                { text: '📲 Forward to Family', url: `https://api.whatsapp.com/send?text=${waText}` }
            ]
        ];
    } else if (slot === 'mercy') {
        messageText = `✝️ <b>3:00 PM — The Hour of Great Mercy</b>\n\n` +
            `<i>"You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us."</i>\n\n` +
            `<b>For the sake of His sorrowful Passion, have mercy on us and on the whole world.</b>\n\n` +
            `🕊️ @myprayertower`;

        const waText = encodeURIComponent(`✝️ 3:00 PM Divine Mercy Hour\n\n"For the sake of His sorrowful Passion, have mercy on us and on the whole world."\n\nPray the Divine Mercy Chaplet online: https://www.myprayertower.com/prayers/divine-mercy-chaplet`);

        buttons = [
            [
                { text: '📿 Divine Mercy Chaplet', url: `${siteUrl}/prayers/divine-mercy-chaplet` },
                { text: '🕯️ Light Mercy Candle', url: `${siteUrl}/candles` }
            ],
            [
                { text: '📲 Share to WhatsApp', url: `https://api.whatsapp.com/send?text=${waText}` }
            ]
        ];
    } else {
        // evening / compline
        messageText = `✨ <b>Compline & Evening Prayer of Thanksgiving</b>\n\n` +
            `<i>"Into Your hands, Lord, I commend my spirit. Protect us, Lord, as we stay awake; watch over us as we sleep, that awake, we may keep watch with Christ, and asleep, rest in His peace."</i>\n\n` +
            `Give thanks for the graces of today, release your burdens, and sleep under the mantle of Our Lady.\n\n` +
            `🕊️ @myprayertower`;

        buttons = [
            [
                { text: '📖 Catholic Prayers Library', url: `${siteUrl}/prayers` },
                { text: '🌟 Saints of the Day', url: `${siteUrl}/saints` }
            ]
        ];
    }

    try {
        const payload = {
            chat_id: channelId,
            text: messageText,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
            reply_markup: {
                inline_keyboard: buttons
            }
        };

        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        return NextResponse.json({
            success: data.ok,
            slot,
            channel: channelId,
            telegramResponse: data
        });
    } catch (err: any) {
        console.error('Telegram broadcast error:', err);
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}
