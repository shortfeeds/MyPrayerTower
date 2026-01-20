import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { getUserFromCookie } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/memorials - List public memorials
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '12', 10);
        const search = searchParams.get('search') || '';

        const where = {
            isPublic: true,
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' as const } },
                    { lastName: { contains: search, mode: 'insensitive' as const } },
                ],
            }),
        };

        const [memorials, total] = await Promise.all([
            prisma.memorial.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    slug: true,
                    firstName: true,
                    lastName: true,
                    birthDate: true,
                    deathDate: true,
                    shortBio: true,
                    photoUrl: true,
                    tier: true,
                    isVerified: true,
                    totalCandles: true,
                    totalMasses: true,
                    totalFlowers: true,
                    createdAt: true,
                },
            }),
            prisma.memorial.count({ where }),
        ]);

        return NextResponse.json({
            memorials,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Error fetching memorials:', error);
        // Return empty result if table doesn't exist yet
        if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
            return NextResponse.json({
                memorials: [],
                pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
            });
        }
        return NextResponse.json({
            error: 'Failed to fetch memorials',
            memorials: [],
            pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
        }, { status: 500 });
    }
}

// POST /api/memorials - Create a new memorial
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await request.json();
        const {
            firstName,
            lastName,
            birthDate,
            deathDate,
            biography,
            shortBio,
            photoUrl,
            tier = 'BASIC',
        } = body;

        if (!firstName || !lastName) {
            return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
        }

        // Generate slug
        const baseSlug = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const existingCount = await prisma.memorial.count({
            where: { slug: { startsWith: baseSlug } },
        });
        const slug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;

        const memorial = await prisma.memorial.create({
            data: {
                slug,
                firstName,
                lastName,
                birthDate: birthDate ? new Date(birthDate) : null,
                deathDate: deathDate ? new Date(deathDate) : null,
                biography,
                shortBio,
                photoUrl,
                tier: tier as 'BASIC' | 'PREMIUM',
                ownerId: user.id,
            },
        });

        return NextResponse.json({ memorial, success: true });
    } catch (error) {
        console.error('Error creating memorial:', error);
        return NextResponse.json({ error: 'Failed to create memorial' }, { status: 500 });
    }
}
