
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

        const groupId = params.id;

        const group = await db.prayerGroup.findUnique({
            where: { id: groupId }
        });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Check if already a member
        const existingMember = await db.prayerGroupMember.findFirst({
            where: {
                groupId,
                userId: user.id
            }
        });

        if (existingMember) {
            return NextResponse.json({ message: 'Already a member' });
        }

        // If private, prevent joining without invite (TODO: Invite logic)
        // For now, only public groups can be joined directly
        if (group.isPrivate) {
            return NextResponse.json({ error: 'This group is private. You need an invite to join.' }, { status: 403 });
        }

        await db.prayerGroupMember.create({
            data: {
                groupId,
                userId: user.id,
                role: 'MEMBER'
            }
        });

        return NextResponse.json({ message: 'Joined successfully' });
    } catch (error) {
        console.error('Error joining group:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
