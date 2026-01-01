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

        if (action === 'approve') {
            const claim = await db.churchClaim.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    updatedAt: new Date()
                }
            });

            // Also verify the church
            await db.church.update({
                where: { id: claim.churchId },
                data: {
                    isVerified: true,
                    verifiedAt: new Date(),
                    claimedBy: claim.userId,
                    updatedAt: new Date()
                }
            });
        } else if (action === 'reject') {
            await db.churchClaim.update({
                where: { id },
                data: {
                    status: 'REJECTED',
                    updatedAt: new Date()
                }
            });
        }

        return NextResponse.json({ success: true, action });
    } catch (error: any) {
        console.error('Claim Action Error:', error);
        return NextResponse.json({ error: 'Failed to process claim' }, { status: 500 });
    }
}
