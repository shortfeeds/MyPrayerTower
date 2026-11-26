import { NextRequest, NextResponse } from 'next/server';
import { broadcastServerNotification, broadcastToFcmTopic } from '@/lib/serverNotifications';
import { getReadings } from '@/lib/readings';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Location/Timezone-Aware Hourly Liturgical Reminder Dispatcher.
 * Evaluates current UTC hour against major Catholic regional offsets
 * (Americas UTC-5, Europe/Africa UTC+1, India UTC+5:30, Philippines/Asia UTC+8)
 * when no explicit ?slot= override is provided.
 */
function resolveTimezoneAwareSlot(utcHours: number): { slot: string; regionLabel: string } {
    // Check which region is currently at ~7 AM (Morning), ~12 PM (Angelus), ~3 PM (Mercy), or ~8 PM (Evening)
    const regions = [
        { label: 'India / South Asia', offset: 5.5 },
        { label: 'Philippines / East Asia', offset: 8 },
        { label: 'Europe / Africa', offset: 1 },
        { label: 'Americas (EST)', offset: -5 },
    ];

    for (const r of regions) {
        const localHour = Math.floor((utcHours + r.offset + 24) % 24);
        if (localHour === 7) return { slot: 'morning', regionLabel: r.label };
        if (localHour === 12) return { slot: 'angelus', regionLabel: r.label };
        if (localHour === 15) return { slot: 'mercy', regionLabel: r.label };
        if (localHour === 20) return { slot: 'evening', regionLabel: r.label };
    }
    return { slot: 'daily', regionLabel: 'Global' };
}

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        if (process.env.NODE_ENV === 'production' && req.nextUrl.searchParams.get('key') !== cronSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const explicitSlot = req.nextUrl.searchParams.get('slot'); // 'morning', 'angelus', 'mercy', 'evening'
    const now = new Date();
    const utcHours = now.getUTCHours();
    const resolved = resolveTimezoneAwareSlot(utcHours);
    const slot = explicitSlot || resolved.slot;

    let title = '';
    let body = '';
    let url = '/app';
    let channelId = 'broadcasts';

    try {
        if (slot === 'morning') {
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
            channelId = 'daily_gospel';

        } else if (slot === 'angelus') {
            title = '🔔 The Angelus (Noon Prayer)';
            body = '"The Angel of the Lord declared unto Mary..." Pause with Our Lady in prayer.';
            url = '/prayers';
            channelId = 'angelus_bells';

        } else if (slot === 'mercy') {
            title = '✝️ 3:00 PM Hour of Great Mercy';
            body = '"For the sake of His sorrowful Passion, have mercy on us and on the whole world."';
            url = '/chaplets';
            channelId = 'divine_mercy';

        } else if (slot === 'evening') {
            title = '📿 Evening Rosary & Night Peace';
            body = 'Rest your soul in prayer tonight. Enter the Sanctuary to pray the Holy Rosary.';
            url = '/rosary';
            channelId = 'daily_prayers';

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

        // 1. Broadcast to FCM topic for native mobile apps
        await broadcastToFcmTopic({
            topic: 'liturgical_feasts',
            title,
            body,
            url,
            channelId,
        }).catch(() => {});

        // 2. Broadcast to WebPush and in-app users
        const result = await broadcastServerNotification({
            title,
            body,
            type: 'SYSTEM',
            data: { url }
        });

        // 3. Record last cron run for Admin System Health Monitor
        await db.systemSetting.upsert({
            where: { key: 'cron_last_run_liturgical' },
            update: { value: JSON.stringify({ at: now.toISOString(), slot, region: resolved.regionLabel }) },
            create: { key: 'cron_last_run_liturgical', value: JSON.stringify({ at: now.toISOString(), slot, region: resolved.regionLabel }) },
        }).catch(() => {});

        return NextResponse.json({
            success: true,
            slot,
            region: resolved.regionLabel,
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
