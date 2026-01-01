import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'approve':
                await db.prayerRequest.update({
                    where: { id },
                    data: { status: 'APPROVED', moderatedAt: new Date(), updatedAt: new Date() }
                });
                break;

            case 'reject':
                await db.prayerRequest.update({
                    where: { id },
                    data: { status: 'REJECTED', moderatedAt: new Date(), updatedAt: new Date() }
                });
                break;

            case 'flag':
                // Flag by setting status to REJECTED with notes
                await db.prayerRequest.update({
                    where: { id },
                    data: { status: 'REJECTED', moderationNotes: 'Flagged by admin', updatedAt: new Date() }
                });
                break;

            case 'delete':
                await db.prayerRequest.delete({ where: { id } });
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json({ success: true, action });
    } catch (error: any) {
        console.error('Admin Prayer Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform action', message: error.message }, { status: 500 });
    }
}
