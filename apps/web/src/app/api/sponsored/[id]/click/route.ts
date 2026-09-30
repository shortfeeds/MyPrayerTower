'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await db.sponsoredContent.update({
            where: { id: params.id },
            data: { clicks: { increment: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking click:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
