import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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
                _count: {
                    select: { PrayerRequest: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Admin User GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body;

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
                // Upgrade to premium tier (admin-like)
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
                // For now, we'll disable notifications as a "soft ban"
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
    } catch (error: any) {
        console.error('Admin User Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform action', message: error.message }, { status: 500 });
    }
}
