import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dispatchServerNotification } from '@/lib/serverNotifications';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { id, type = 'candle' } = body;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ success: false, message: 'Missing offering id' }, { status: 400 });
        }

        // Skip sample fallback IDs cleanly
        if (id.startsWith('sample-')) {
            return NextResponse.json({ success: true, sample: true });
        }

        if (type === 'candle') {
            const candle = await db.prayerCandle.findUnique({
                where: { id },
                select: { id: true, userId: true, intention: true, prayerCount: true },
            }).catch(() => null);

            if (candle) {
                const updated = await db.prayerCandle.update({
                    where: { id },
                    data: { prayerCount: { increment: 1 } },
                    select: { prayerCount: true },
                });

                // Notify the candle creator ("Someone Prayed for You")
                if (candle.userId) {
                    await dispatchServerNotification({
                        userId: candle.userId,
                        title: 'Someone Prayed for Your Intention',
                        body: `A faithful soul just lifted up a prayer for "${candle.intention.slice(0, 50)}..." (${updated.prayerCount} total prayers).`,
                        type: 'SYSTEM',
                        data: { link: '/my-vigils', candleId: candle.id },
                    }).catch(() => {});
                }

                return NextResponse.json({ success: true, prayerCount: updated.prayerCount });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Offering pray error:', error);
        return NextResponse.json({ success: false, message: error?.message || 'Error' }, { status: 500 });
    }
}
