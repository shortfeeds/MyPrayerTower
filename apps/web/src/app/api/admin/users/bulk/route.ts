import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, userIds } = body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: 'No users selected' }, { status: 400 });
        }

        let updatedCount = 0;

        switch (action) {
            case 'verify':
                const verifyResult = await db.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { emailVerified: true, updatedAt: new Date() }
                });
                updatedCount = verifyResult.count;
                break;

            case 'unverify':
                const unverifyResult = await db.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { emailVerified: false, updatedAt: new Date() }
                });
                updatedCount = unverifyResult.count;
                break;

            case 'ban':
                const banResult = await db.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { notificationsEnabled: false, updatedAt: new Date() }
                });
                updatedCount = banResult.count;
                break;

            case 'unban':
                const unbanResult = await db.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { notificationsEnabled: true, updatedAt: new Date() }
                });
                updatedCount = unbanResult.count;
                break;

            case 'delete':
                const deleteResult = await db.user.deleteMany({
                    where: { id: { in: userIds } }
                });
                updatedCount = deleteResult.count;
                break;

            case 'upgrade':
                const upgradeResult = await db.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { subscriptionTier: 'PREMIUM', updatedAt: new Date() }
                });
                updatedCount = upgradeResult.count;
                break;

            case 'downgrade':
                const downgradeResult = await db.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { subscriptionTier: 'FREE', updatedAt: new Date() }
                });
                updatedCount = downgradeResult.count;
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            action,
            count: updatedCount,
            message: `${updatedCount} users ${action}ed successfully`
        });
    } catch (error: any) {
        console.error('Bulk Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform bulk action' }, { status: 500 });
    }
}
