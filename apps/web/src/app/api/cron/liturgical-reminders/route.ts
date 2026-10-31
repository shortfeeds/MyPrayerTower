import { NextRequest, NextResponse } from 'next/server';
import { broadcastServerNotification } from '@/lib/serverNotifications';
import { getReadings } from '@/lib/readings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        if (process.env.NODE_ENV === 'production' && req.nextUrl.searchParams.get('key') !== cronSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const slot = req.nextUrl.searchParams.get('slot'); // 'morning', 'angelus', 'mercy', 'evening', 'novena'
    const now = new Date();
    const utcHours = now.getUTCHours();

    let title = '';
    let body = '';
    let url = '/app';

    try {
        if (slot === 'morning' || (!slot && (utcHours >= 1 && utcHours <= 3))) { // ~6:30 - 8:30 AM IST
            let citation = 'Word of God';
            try {
                const readings = await getReadings();
                const gospel = readings.readings.find((r: any) => r.type === 'Gospel' || r.type === 'Holy Gospel');
                if (gospel?.citation) citation = gospel.citation;
            } catch (e) {
                // fallback
            }
            title = '🌅 Morning Offering & Gospel';
            body = `Today's Gospel (${citation}): Take 2 minutes to offer your morning to Christ.`;
            url = '/readings';

        } else if (slot === 'angelus' || (!slot && (utcHours >= 6 && utcHours <= 7))) { // ~11:30 AM - 12:30 PM IST
            title = '🔔 The Angelus (Noon Prayer)';
            body = '"The Angel of the Lord declared unto Mary..." Pause with Our Lady in prayer.';
            url = '/prayers/the-angelus';

        } else if (slot === 'mercy' || (!slot && (utcHours >= 9 && utcHours <= 10))) { // ~2:30 - 3:30 PM IST
            title = '✝️ 3:00 PM Hour of Great Mercy';
            body = '"For the sake of His sorrowful Passion, have mercy on us and on the whole world."';
            url = '/prayers/divine-mercy-chaplet';

        } else if (slot === 'evening' || (!slot && (utcHours >= 14 && utcHours <= 16))) { // ~7:30 - 9:30 PM IST
            title = '📿 Evening Rosary & Night Peace';
            body = 'Rest your soul in prayer tonight. Enter the Sanctuary to pray the Holy Rosary.';
            url = '/rosary';

        } else {
            // Default seasonal / daily reminder
            const month = now.getMonth() + 1;
            const day = now.getDate();

            if (month === 11 && day === 2) {
                title = '🕯️ All Souls\' Day Memorial';
                body = 'Today we pray for all our dearly departed loved ones. Light a memorial candle in the Sanctuary.';
                url = '/candles';
            } else if (month === 11 && day === 1) {
                title = '✨ Solemnity of All Saints';
                body = 'Rejoice with the heavenly choir! Ask your patron saints for grace today.';
                url = '/saints';
            } else {
                title = '🕊️ Daily Moment with God';
                body = 'A peaceful pause in your day: visit the Sanctuary for daily peace and devotion.';
                url = '/app';
            }
        }

        const result = await broadcastServerNotification({
            title,
            body,
            type: 'SYSTEM',
            data: { url }
        });

        return NextResponse.json({
            success: true,
            title,
            body,
            url,
            pushCount: result.pushCount,
            timestamp: now.toISOString()
        });

    } catch (error: any) {
        console.error('Error in liturgical-reminders cron:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
