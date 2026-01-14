import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/candles/count
 * Returns count of active candles and total prayers
 * Used by CandleBanner component for live stats
 */
export async function GET() {
    try {
        const now = new Date();

        // Count active (paid and not expired) candles
        const count = await db.prayerCandle.count({
            where: {
                isActive: true,
                paymentStatus: 'PAID',
                expiresAt: { gt: now }
            }
        });

        return NextResponse.json({
            count,
            prayerCount: count * 5 // Estimate prayers (e.g. 5 prayers per candle on average or just placeholder)
        });
    } catch (error) {
        console.error('Error fetching candle count:', error);
        return NextResponse.json({ count: 0, prayerCount: 0 });
    }
}
