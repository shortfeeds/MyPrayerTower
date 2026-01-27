
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const groupId = params.id;

        // Check if member
        const member = await db.prayerGroupMember.findFirst({
            where: {
                groupId,
                userId: user.id
            }
        });

        const group = await db.prayerGroup.findUnique({ where: { id: groupId } });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        if (group.isPrivate && !member) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Fetch prayers
        const prayers = await db.groupPrayer.findMany({
            where: { groupId },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit for now
        });

        return NextResponse.json(prayers);

    } catch (error) {
        console.error('Error fetching group prayers:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const groupId = params.id;
        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Check membership
        const member = await db.prayerGroupMember.findFirst({
            where: {
                groupId,
                userId: user.id
            }
        });

        if (!member) {
            return NextResponse.json({ error: 'You must be a member to post prayers' }, { status: 403 });
        }

        const prayer = await db.groupPrayer.create({
            data: {
                groupId,
                userId: user.id,
                content
            },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true
                    }
                }
            }
        });

        return NextResponse.json(prayer);

    } catch (error) {
        console.error('Error creating group prayer:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
