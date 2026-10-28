import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
        const search = searchParams.get('search')?.trim() || '';
        const tier = searchParams.get('tier')?.trim() || '';

        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { shortBio: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (tier && tier !== 'ALL') {
            where.tier = tier;
        }

        const [memorials, total] = await Promise.all([
            db.memorial.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: {
                        select: {
                            id: true,
                            displayName: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    _count: {
                        select: {
                            offerings: true,
                        },
                    },
                },
            }),
            db.memorial.count({ where }),
        ]);

        const formatted = memorials.map((m) => ({
            id: m.id,
            slug: m.slug,
            firstName: m.firstName,
            lastName: m.lastName,
            birthDate: m.birthDate ? m.birthDate.toISOString() : null,
            deathDate: m.deathDate ? m.deathDate.toISOString() : null,
            photoUrl: m.photoUrl,
            isPremium: m.tier === 'PREMIUM' || m.tier === 'PERPETUAL',
            isActive: m.isPublic,
            isVerified: m.isVerified,
            tier: m.tier,
            totalOfferings: m.totalCandles + m.totalFlowers + m.totalPrayers + (m._count?.offerings || 0),
            userName: m.owner?.displayName || (m.owner?.firstName ? `${m.owner.firstName} ${m.owner.lastName || ''}`.trim() : m.owner?.email || 'Administrator'),
            createdAt: m.createdAt.toISOString(),
        }));

        return NextResponse.json({
            memorials: formatted,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        console.error('Error fetching admin memorials:', error);
        return NextResponse.json(
            { error: 'Failed to fetch memorials', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, birthDate, deathDate, biography, photoUrl, isPremium, isActive } = body;

        if (!firstName?.trim() || !lastName?.trim()) {
            return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
        }

        // Find or create admin user for ownership
        let adminUser = await db.user.findFirst({
            where: { subscriptionTier: 'PREMIUM' }
        });

        if (!adminUser) {
            adminUser = await db.user.findFirst();
        }

        if (!adminUser) {
            return NextResponse.json({ error: 'No user exists to assign ownership' }, { status: 400 });
        }

        const baseSlug = `${firstName.trim()}-${lastName.trim()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const uniqueSuffix = Date.now().toString(36);
        const slug = `${baseSlug}-${uniqueSuffix}`;

        const memorial = await db.memorial.create({
            data: {
                slug,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                birthDate: birthDate ? new Date(birthDate) : null,
                deathDate: deathDate ? new Date(deathDate) : null,
                biography: biography || null,
                shortBio: biography ? biography.slice(0, 480) : null,
                photoUrl: photoUrl || null,
                tier: isPremium ? 'PREMIUM' : 'BASIC',
                isPublic: isActive ?? true,
                ownerId: adminUser.id,
            }
        });

        return NextResponse.json({ success: true, memorial }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating memorial:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
