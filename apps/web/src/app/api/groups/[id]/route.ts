
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromCookie();

        // Optional: allow public view of public groups even if not logged in?
        // For now, let's allow it but hide sensitive info if any.

        const group = await db.prayerGroup.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { members: true }
                }
            }
        });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        let isMember = false;
        if (user) {
            const member = await db.prayerGroupMember.findFirst({
                where: {
                    groupId: params.id,
                    userId: user.id
                }
            });
            isMember = !!member;
        }

        // Check privacy access
        if (group.isPrivate && !isMember) {
            return NextResponse.json({
                id: group.id,
                name: 'Private Group', // Obfuscate name if really private? Or just show name? 
                description: 'This is a private group.',
                isPrivate: true,
                memberCount: group._count.members,
                isMember: false
            });
            // Or maybe just show name but no prayers.
        }

        return NextResponse.json({
            ...group,
            memberCount: group._count.members,
            isMember
        });

    } catch (error) {
        console.error('Error fetching group:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
