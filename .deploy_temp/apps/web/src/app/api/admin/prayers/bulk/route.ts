import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, prayerIds } = body;

        if (!prayerIds || !Array.isArray(prayerIds) || prayerIds.length === 0) {
            return NextResponse.json({ error: 'No prayers selected' }, { status: 400 });
        }

        let updatedCount = 0;

        switch (action) {
            case 'approve':
                const approveResult = await db.prayerRequest.updateMany({
                    where: { id: { in: prayerIds } },
                    data: { status: 'APPROVED', moderatedAt: new Date(), updatedAt: new Date() }
                });
                updatedCount = approveResult.count;
                break;

            case 'reject':
                const rejectResult = await db.prayerRequest.updateMany({
                    where: { id: { in: prayerIds } },
                    data: { status: 'REJECTED', moderatedAt: new Date(), updatedAt: new Date() }
                });
                updatedCount = rejectResult.count;
                break;

            case 'pending':
                const pendingResult = await db.prayerRequest.updateMany({
                    where: { id: { in: prayerIds } },
                    data: { status: 'PENDING', updatedAt: new Date() }
                });
                updatedCount = pendingResult.count;
                break;

            case 'delete':
                const deleteResult = await db.prayerRequest.deleteMany({
                    where: { id: { in: prayerIds } }
                });
                updatedCount = deleteResult.count;
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            action,
            count: updatedCount,
            message: `${updatedCount} prayers ${action}d successfully`
        });
    } catch (error: any) {
        console.error('Bulk Prayer Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform bulk action' }, { status: 500 });
    }
}
