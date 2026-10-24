import { NextResponse } from 'next/server';
import { getReadings } from '@/lib/readings';

export const revalidate = 43200; // 12 hours cache

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    try {
        const data = await getReadings(date);
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('API Readings Error:', error);
        return NextResponse.json({ error: 'Failed to fetch readings' }, { status: 500 });
    }
}
