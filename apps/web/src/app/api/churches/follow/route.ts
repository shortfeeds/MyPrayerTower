import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const user = await getUserFromCookie();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { churchId, action } = await request.json();

        if (!churchId) {
            return NextResponse.json({ error: 'Church ID required' }, { status: 400 });
        }

        if (action === 'follow') {
            // Check if already following
            const existing = await db.churchFollower.findUnique({
                where: {
                    churchId_userId: {
                        churchId,
                        userId: user.id
                    }
                }
            });

            if (!existing) {
                await db.$transaction([
                    db.churchFollower.create({
                        data: {
                            churchId,
                            userId: user.id,
                            pushEnabled: true
                        }
                    }),
                    db.church.update({
                        where: { id: churchId },
                        data: { followerCount: { increment: 1 } }
                    })
                ]);
            }
        } else if (action === 'unfollow') {
            await db.$transaction([
                db.churchFollower.deleteMany({
                    where: {
                        churchId,
                        userId: user.id
                    }
                }),
                db.church.update({
                    where: { id: churchId },
                    data: { followerCount: { decrement: 1 } }
                })
            ]);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Follow API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
