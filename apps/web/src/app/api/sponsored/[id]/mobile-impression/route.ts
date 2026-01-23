import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const id = params.id;

        // Update impression count
        await db.sponsoredContent.update({
            where: { id },
            data: {
                impressions: { increment: 1 }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking mobile impression:', error);
        return NextResponse.json(
            { error: 'Failed to track impression' },
            { status: 500 }
        );
    }
}
