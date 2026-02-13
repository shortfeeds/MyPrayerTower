import { NextResponse } from 'next/server';
import { getSaintOfToday } from '@/lib/saints';
import { getReadings } from '@/lib/readings';

export const dynamic = 'force-dynamic';

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
        });

    } catch (error) {
        console.error('API Daily Content Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
