import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { getUserFromCookie } from '@/lib/auth';

const prisma = new PrismaClient();

interface Params {
    params: { id: string };
}

// POST /api/memorials/[id]/offerings - Add an offering to a memorial
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        const body = await request.json();
        const {
            type,
            amount,
            message,
            isAnonymous = false,
            guestName,
            guestEmail,
            transactionId,
            paymentSource,
        } = body;

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

        // Create offering
        const offering = await prisma.memorialOffering.create({
            data: {
                memorialId: memorial.id,
                userId: user?.id,
                guestName: !user ? guestName : null,
                guestEmail: !user ? guestEmail : null,
                type,
                amount,
                message,
                isAnonymous,
                transactionId,
                paymentSource,
            },
        });

        // Update memorial stats
        const statsUpdate: Record<string, { increment: number }> = {};
        if (type.startsWith('CANDLE')) {
            statsUpdate.totalCandles = { increment: 1 };
        } else if (type === 'FLOWERS' || type === 'FLORAL_BOUQUET') {
            statsUpdate.totalFlowers = { increment: 1 };
        } else if (type === 'MASS') {
            statsUpdate.totalMasses = { increment: 1 };
        } else if (type.startsWith('ROSARY') || type === 'PRAYER_CARD') {
            statsUpdate.totalPrayers = { increment: 1 };
        } else if (type.startsWith('SPIRITUAL_BOUQUET')) {
            // Bouquets count as multiple
            statsUpdate.totalCandles = { increment: type.includes('LEGACY') ? 100 : type.includes('ETERNAL') ? 30 : type.includes('HEAVENLY') ? 7 : 3 };
            statsUpdate.totalMasses = { increment: type.includes('LEGACY') ? 10 : type.includes('ETERNAL') ? 3 : type.includes('HEAVENLY') ? 1 : 0 };
            statsUpdate.totalPrayers = { increment: type.includes('LEGACY') ? 52 : type.includes('ETERNAL') || type.includes('HEAVENLY') ? 1 : 1 };
        }

        await prisma.memorial.update({
            where: { id: memorial.id },
            data: statsUpdate,
        });

        return NextResponse.json({ offering, success: true });
    } catch (error) {
        console.error('Error creating offering:', error);
        return NextResponse.json({ error: 'Failed to create offering' }, { status: 500 });
    }
}

// GET /api/memorials/[id]/offerings - Get offerings for a memorial
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

        const offerings = await prisma.memorialOffering.findMany({
            where: { memorialId: memorial.id },
            orderBy: { createdAt: 'desc' },
            take: limit,
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
        });

        return NextResponse.json({ offerings });
    } catch (error) {
        console.error('Error fetching offerings:', error);
        return NextResponse.json({ error: 'Failed to fetch offerings' }, { status: 500 });
    }
}
