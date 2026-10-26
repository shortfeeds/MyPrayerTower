import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getUserFromCookie().catch(() => null);
        if (!user?.id) {
            return NextResponse.json({ notifications: [], unreadCount: 0 });
        }

        const notifications = await db.userNotification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 25,
        });

        const unreadCount = notifications.filter(n => !n.isRead).length;

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getUserFromCookie().catch(() => null);
        if (!user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const { id, markAllAsRead } = body;

        if (markAllAsRead) {
            await db.userNotification.updateMany({
                where: { userId: user.id, isRead: false },
                data: { isRead: true, readAt: new Date() },
            });
            return NextResponse.json({ success: true, message: 'All notifications marked as read' });
        }

        if (id) {
            await db.userNotification.updateMany({
                where: { id, userId: user.id },
                data: { isRead: true, readAt: new Date() },
            });
            return NextResponse.json({ success: true, message: 'Notification marked as read' });
        }

        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}
