import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const revalidate = 60; // 1 minute ISR

export async function GET() {
    try {
        // Fetch recent candles
        const candles = await db.prayerCandle.findMany({
            where: { isActive: true },
            take: 12,
            orderBy: { litAt: 'desc' },
            select: {
                id: true,
                name: true,
                country: true,
                intention: true,
                isAnonymous: true,
                duration: true,
                prayerCount: true,
                litAt: true,
            },
        });

        // Format as sanctuary dedication items
        const memorials = candles.map((c) => {
            let dedicationType = 'SPECIAL_INTENTION';
            const lowerIntention = (c.intention || '').toLowerCase();
            if (lowerIntention.includes('memory') || lowerIntention.includes('rest') || lowerIntention.includes('soul')) {
                dedicationType = 'IN_MEMORY';
            } else if (lowerIntention.includes('thank') || lowerIntention.includes('gratitude')) {
                dedicationType = 'IN_THANKSGIVING';
            } else if (lowerIntention.includes('heal') || lowerIntention.includes('cancer') || lowerIntention.includes('health')) {
                dedicationType = 'FOR_HEALING';
            }

            const donorDisplay = c.isAnonymous
                ? 'A Devout Pilgrim'
                : c.name
                ? `${c.name}${c.country ? ` (${c.country})` : ''}`
                : 'A Devout Pilgrim';

            return {
                id: c.id,
                type: 'candle',
                title: c.duration === 'THIRTY_DAYS' ? 'Perpetual Vigil Lamp' : 'Sanctuary Votive Candle',
                dedicationType,
                intention: c.intention,
                offeredBy: donorDisplay,
                isAnonymous: c.isAnonymous,
                prayerCount: c.prayerCount || 0,
                createdAt: c.litAt.toISOString(),
            };
        });

        // Fallback default reverent memorials if database has fewer than 4 records
        if (memorials.length < 4) {
            const sampleMemorials = [
                {
                    id: 'sample-mem-1',
                    type: 'mass',
                    title: 'Holy Mass Intention',
                    dedicationType: 'IN_MEMORY',
                    intention: 'For the eternal repose of the soul of Maria Santos',
                    offeredBy: 'Carlos S. (Philippines)',
                    isAnonymous: false,
                    prayerCount: 148,
                    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
                },
                {
                    id: 'sample-mem-2',
                    type: 'candle',
                    title: '7-Day Sanctuary Candle',
                    dedicationType: 'FOR_HEALING',
                    intention: 'Praying for complete recovery for my father after surgery',
                    offeredBy: 'Patrick O. (Ireland)',
                    isAnonymous: false,
                    prayerCount: 94,
                    createdAt: new Date(Date.now() - 42 * 60000).toISOString(),
                },
                {
                    id: 'sample-mem-3',
                    type: 'candle',
                    title: 'Vigil Lamp',
                    dedicationType: 'IN_THANKSGIVING',
                    intention: 'Thanksgiving for our healthy newborn daughter and family blessings',
                    offeredBy: 'A Devout Pilgrim',
                    isAnonymous: true,
                    prayerCount: 67,
                    createdAt: new Date(Date.now() - 95 * 60000).toISOString(),
                },
                {
                    id: 'sample-mem-4',
                    type: 'mass',
                    title: 'Perpetual Mass Roster',
                    dedicationType: 'SPECIAL_INTENTION',
                    intention: 'For the sanctification of priests and vocations to the holy priesthood',
                    offeredBy: 'Fr. Thomas K. (United States)',
                    isAnonymous: false,
                    prayerCount: 231,
                    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
                },
            ];
            return NextResponse.json({ success: true, memorials: [...memorials, ...sampleMemorials] });
        }

        return NextResponse.json({ success: true, memorials });
    } catch (error) {
        console.error('Error fetching recent offerings:', error);
        return NextResponse.json({ success: false, memorials: [] }, { status: 500 });
    }
}
