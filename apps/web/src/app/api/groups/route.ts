
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const groups = await db.prayerGroup.findMany({
            where: {
                OR: [
                    { isPrivate: false },
                    { members: { some: { userId: user.id } } }
                ]
            },
            include: {
                _count: {
                    select: { members: true }
                },
                members: {
                    where: { userId: user.id },
                    select: { role: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, isPrivate } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const group = await db.prayerGroup.create({
            data: {
                name,
                description,
                isPrivate: isPrivate || false,
                createdBy: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: 'ADMIN'
                    }
                }
            }
        });

        return NextResponse.json(group);
    } catch (error) {
        console.error('Error creating group:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
