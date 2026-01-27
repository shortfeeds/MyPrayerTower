
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const prayerId = params.id;

        // Verify ownership
        const prayer = await db.prayerRequest.findUnique({
            where: { id: prayerId }
        });

        if (!prayer) {
            return NextResponse.json({ error: 'Prayer not found' }, { status: 404 });
        }

        if (prayer.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Toggle answered status
        const updatedPrayer = await db.prayerRequest.update({
            where: { id: prayerId },
            data: {
                isAnswered: !prayer.isAnswered,
                answeredAt: !prayer.isAnswered ? new Date() : null
            }
        });

        return NextResponse.json(updatedPrayer);

    } catch (error) {
        console.error('Error updating prayer status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
