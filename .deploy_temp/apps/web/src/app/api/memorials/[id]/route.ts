import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

interface Params {
    params: { id: string };
}

// GET /api/memorials/[id] - Get single memorial with offerings and guestbook
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;

        // Try to find by ID first, then by slug
        let memorial = await prisma.memorial.findUnique({
            where: { id },
            include: {
                photos: {
                    orderBy: { sortOrder: 'asc' },
                },
                offerings: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    select: {
                        id: true,
                        type: true,
                        amount: true,
                        message: true,
                        isAnonymous: true,
                        guestName: true,
                        createdAt: true,
                        user: {
                            select: { displayName: true, avatarUrl: true },
                        },
                    },
                },
                guestbook: {
                    where: { isApproved: true },
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                    select: {
                        id: true,
                        message: true,
                        guestName: true,
                        createdAt: true,
                        user: {
                            select: { displayName: true, avatarUrl: true },
                        },
                    },
                },
                owner: {
                    select: { displayName: true },
                },
            },
        });

        // If not found by ID, try slug
        if (!memorial) {
            memorial = await prisma.memorial.findUnique({
                where: { slug: id },
                include: {
                    photos: {
                        orderBy: { sortOrder: 'asc' },
                    },
                    offerings: {
                        orderBy: { createdAt: 'desc' },
                        take: 20,
                        select: {
                            id: true,
                            type: true,
                            amount: true,
                            message: true,
                            isAnonymous: true,
                            guestName: true,
                            createdAt: true,
                            user: {
                                select: { displayName: true, avatarUrl: true },
                            },
                        },
                    },
                    guestbook: {
                        where: { isApproved: true },
                        orderBy: { createdAt: 'desc' },
                        take: 50,
                        select: {
                            id: true,
                            message: true,
                            guestName: true,
                            createdAt: true,
                            user: {
                                select: { displayName: true, avatarUrl: true },
                            },
                        },
                    },
                    owner: {
                        select: { displayName: true },
                    },
                },
            });
        }

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // Increment view count (fire and forget)
        prisma.memorial.update({
            where: { id: memorial.id },
            data: { viewCount: { increment: 1 } },
        }).catch(() => { });

        return NextResponse.json(memorial);
    } catch (error) {
        console.error('Error fetching memorial:', error);
        return NextResponse.json({ error: 'Failed to fetch memorial' }, { status: 500 });
    }
}
