import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { getUserFromCookie } from '@/lib/auth';

const prisma = new PrismaClient();

interface Params {
    params: { id: string };
}

// POST /api/memorials/[id]/guestbook - Add a guestbook entry
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        const body = await request.json();
        const { message, guestName } = body;

        if (!message || message.trim().length === 0) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Find memorial by ID or slug
        let memorial = await prisma.memorial.findUnique({ where: { id } });
        if (!memorial) {
            memorial = await prisma.memorial.findUnique({ where: { slug: id } });
        }

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // Get user if logged in
        const user = await getUserFromCookie();

        const entry = await prisma.memorialGuestbook.create({
            data: {
                memorialId: memorial.id,
                userId: user?.id,
                guestName: !user ? guestName : null,
                message: message.trim(),
                isApproved: true, // Auto-approve for now
            },
        });

        return NextResponse.json({ entry, success: true });
    } catch (error) {
        console.error('Error creating guestbook entry:', error);
        return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
    }
}

// GET /api/memorials/[id]/guestbook - Get guestbook entries
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50', 10);

        // Find memorial by ID or slug
        let memorial = await prisma.memorial.findUnique({ where: { id } });
        if (!memorial) {
            memorial = await prisma.memorial.findUnique({ where: { slug: id } });
        }

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        const entries = await prisma.memorialGuestbook.findMany({
            where: { memorialId: memorial.id, isApproved: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                message: true,
                guestName: true,
                createdAt: true,
                user: {
                    select: { displayName: true, avatarUrl: true },
                },
            },
        });

        return NextResponse.json({ entries });
    } catch (error) {
        console.error('Error fetching guestbook:', error);
        return NextResponse.json({ error: 'Failed to fetch guestbook' }, { status: 500 });
    }
}
