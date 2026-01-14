import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Revalidate every 30 seconds
export const revalidate = 30;

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Get Real Counts from DB
        const [
            prayersActionCount,
            candlesLitCount,
            activeSessionsCount // Heuristic for "praying now"
        ] = await Promise.all([
            // Count prayers today
            db.prayerAction.count({
                where: {
                    prayedAt: {
                        gte: today
                    }
                }
            }),
            // Count candles lit today
            db.virtualCandle.count({
                where: {
                    litAt: {
                        gte: today
                    }
                }
            }),
            // Estimate "Praying Now" (Sessions in last 15 mins)
            db.session.count({
                where: {
                    expiresAt: { // Using expiresAt as proxy for active sessions if available, or createdAt
                        gte: new Date()
                    }
                }
            }).catch(() => 0)
        ]);

        // 2. Apply Requested Base Offsets
        // Prayers Today: 15,000 + Real Loop
        const prayersToday = 15420 + prayersActionCount;

        // Candles Lit: 7,000 + Real Loop
        const candlesLit = 7850 + candlesLitCount;

        // Praying Now: 9,000 + (Real Sessions * Multiplier) + Random Fluctuation
        // We want 9k-21k.
        // Let's make it 9000 + (Sessions * 5) + TimeBasedFluctuation
        const basePraying = 12450;
        const timeFluctuation = Math.floor(Math.sin(Date.now() / 10000) * 500); // Oscillation
        const prayingNow = Math.max(9000, Math.min(21000, basePraying + activeSessionsCount + timeFluctuation));

        return NextResponse.json({
            prayersToday,
            candlesLit,
            prayingNow,
            source: 'database'
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching stats:', error);

        // Fallback to purely random if DB fails
        return NextResponse.json({
            prayersToday: 15420 + Math.floor(Math.random() * 100),
            candlesLit: 7850 + Math.floor(Math.random() * 50),
            prayingNow: 12450 + Math.floor(Math.random() * 200),
            source: 'fallback'
        }, { status: 200 });
    }
}
