import { NextResponse } from 'next/server';
import { getSaintOfToday } from '@/lib/saints';

export const revalidate = 86400; // Cache for 24 hours on Edge CDN

export async function GET() {
    try {
        const saint = await getSaintOfToday();
        return NextResponse.json({ saint }, {
            headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' }
        });
    } catch (error) {
        console.error('API Saint Error:', error);
        return NextResponse.json({ error: 'Failed to fetch saint' }, { status: 500 });
    }
}
