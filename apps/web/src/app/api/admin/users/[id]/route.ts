import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const user = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                displayName: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                subscriptionTier: true,
                emailVerified: true,
                avatarUrl: true,
                bio: true,
                createdAt: true,
                lastLoginAt: true,
                streakCount: true,
                longestStreak: true,
                notificationsEnabled: true,
                _count: {
                    select: { PrayerRequest: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...user,
            isBanned: user.notificationsEnabled === false,
            role: user.subscriptionTier === 'PREMIUM' || user.subscriptionTier === 'PLUS' ? 'PREMIUM' : 'USER'
        });
    } catch (error: any) {
        console.error('Admin User GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { action } = body;

        if (action) {
            switch (action) {
                case 'verify':
                    await db.user.update({
                        where: { id },
                        data: { emailVerified: true, updatedAt: new Date() }
                    });
                    break;

                case 'unverify':
                    await db.user.update({
                        where: { id },
                        data: { emailVerified: false, updatedAt: new Date() }
                    });
                    break;

                case 'makeAdmin':
                    await db.user.update({
                        where: { id },
                        data: { subscriptionTier: 'PREMIUM', updatedAt: new Date() }
                    });
                    break;

                case 'removeAdmin':
                    await db.user.update({
                        where: { id },
                        data: { subscriptionTier: 'FREE', updatedAt: new Date() }
                    });
                    break;

                case 'ban':
                    await db.user.update({
                        where: { id },
                        data: { notificationsEnabled: false, updatedAt: new Date() }
                    });
                    break;

                case 'unban':
                    await db.user.update({
                        where: { id },
                        data: { notificationsEnabled: true, updatedAt: new Date() }
                    });
                    break;

                case 'delete':
                    await db.user.delete({ where: { id } });
                    break;

                default:
                    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
            }
            return NextResponse.json({ success: true, action });
        }

        // Full profile update
        const updateData: any = { updatedAt: new Date() };
        if (body.firstName !== undefined) updateData.firstName = body.firstName;
        if (body.lastName !== undefined) updateData.lastName = body.lastName;
        if (body.firstName || body.lastName) {
            updateData.displayName = `${body.firstName || ''} ${body.lastName || ''}`.trim();
        }
        if (body.email !== undefined) updateData.email = body.email;
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.role) {
            updateData.subscriptionTier = (body.role === 'PREMIUM' || body.role === 'PLUS') ? 'PREMIUM' : 'FREE';
        }
        if (typeof body.isBanned === 'boolean') {
            updateData.notificationsEnabled = !body.isBanned;
        }

        const updatedUser = await db.user.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error: any) {
        console.error('Admin User Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform action', message: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await db.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
