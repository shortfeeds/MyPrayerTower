import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, churchIds } = body;

        if (!churchIds || !Array.isArray(churchIds) || churchIds.length === 0) {
            return NextResponse.json({ error: 'No churches selected' }, { status: 400 });
        }

        let updatedCount = 0;

        switch (action) {
            case 'verify':
                const verifyResult = await db.church.updateMany({
                    where: { id: { in: churchIds } },
                    data: { isVerified: true, verifiedAt: new Date(), updatedAt: new Date() }
                });
                updatedCount = verifyResult.count;
                break;

            case 'unverify':
                const unverifyResult = await db.church.updateMany({
                    where: { id: { in: churchIds } },
                    data: { isVerified: false, verifiedAt: null, updatedAt: new Date() }
                });
                updatedCount = unverifyResult.count;
                break;

            case 'delete':
                const deleteResult = await db.church.deleteMany({
                    where: { id: { in: churchIds } }
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
            message: `${updatedCount} churches ${action}ed successfully`
        });
    } catch (error: any) {
        console.error('Bulk Church Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform bulk action' }, { status: 500 });
    }
}
