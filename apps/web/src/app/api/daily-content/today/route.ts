import { NextResponse } from 'next/server';
import { getSaintOfToday } from '@/lib/saints';
import { getReadings } from '@/lib/readings';

export const revalidate = 86400; // Cache for 24 hours on Edge CDN

export async function GET() {
    try {
        const [saint, readingsData] = await Promise.all([
            getSaintOfToday(),
            getReadings()
        ]);

        return NextResponse.json({
            saint,
            reading: {
                title: readingsData.title,
                reference: readingsData.readings?.[0]?.citation || '',
                text: readingsData.readings?.[0]?.text || ''
            },
            // Fallback quote if needed, though we could add a getQuote service too
            quote: {
                text: "The Lord is my shepherd; I shall not want.",
                author: "Psalm 23"
            }
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' }
        });

    } catch (error) {
        console.error('API Daily Content Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
