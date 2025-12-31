import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
                    data: { isApproved: true, isFlagged: false }
                });
                break;

            case 'reject':
                await db.prayerRequest.update({
                    where: { id },
                    data: { isApproved: false }
                });
                break;

            case 'flag':
                await db.prayerRequest.update({
                    where: { id },
                    data: { isFlagged: true }
                });
                break;

            case 'delete':
                await db.prayerRequest.delete({ where: { id } });
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Admin Prayer Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform action', message: error.message }, { status: 500 });
    }
}
