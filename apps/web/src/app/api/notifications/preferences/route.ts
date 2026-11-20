import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getUserFromCookie().catch(() => null);
        if (!user?.id) {
            return NextResponse.json({
                preferences: {
                    morningGospel: true,
                    angelusBells: true,
                    divineMercy: true,
                    prayerEchoes: true,
                    streakReminders: true,
                }
            });
        }

        const dbUser = await db.user.findUnique({
            where: { id: user.id },
            select: { notificationsEnabled: true }
        });

        return NextResponse.json({
            preferences: {
                enabled: dbUser?.notificationsEnabled ?? true,
                morningGospel: true,
                angelusBells: true,
                divineMercy: true,
                prayerEchoes: true,
                streakReminders: true,
            }
        });
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
        return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUserFromCookie().catch(() => null);
        if (!user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const { enabled } = body;

        if (typeof enabled === 'boolean') {
            await db.user.update({
                where: { id: user.id },
                data: { notificationsEnabled: enabled }
            });
        }

        return NextResponse.json({ success: true, message: 'Preferences updated' });
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }
}
