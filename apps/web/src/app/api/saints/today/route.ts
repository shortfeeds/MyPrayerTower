import { NextResponse } from 'next/server';
import { getSaintOfToday } from '@/lib/saints';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const saint = await getSaintOfToday();
        return NextResponse.json({ saint });
    } catch (error) {
        console.error('API Saint Error:', error);
        return NextResponse.json({ error: 'Failed to fetch saint' }, { status: 500 });
    }
}
