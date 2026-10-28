import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const month = searchParams.get('month') || '';

    try {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { patronOf: { hasSome: [search] } }
            ];
        }

        if (month) {
            where.feastMonth = parseInt(month);
        }

        const [saints, total] = await Promise.all([
            db.saint.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ feastMonth: 'asc' }, { feastDayOfMonth: 'asc' }],
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    title: true,
                    feastDay: true,
                    feastMonth: true,
                    feastDayOfMonth: true,
                    shortBio: true,
                    imageUrl: true,
                    patronOf: true
                }
            }),
            db.saint.count({ where })
        ]);

        return NextResponse.json({
            saints,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Admin Saints GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch saints', saints: [], total: 0 }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, title, feastDay, patronOf, shortBio, imageUrl } = body;

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Saint name is required' }, { status: 400 });
        }

        const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const uniqueSuffix = Date.now().toString(36);
        const slug = `${baseSlug}-${uniqueSuffix}`;
        const id = randomUUID();

        let patronList: string[] = [];
        if (Array.isArray(patronOf)) {
            patronList = patronOf;
        } else if (typeof patronOf === 'string') {
            patronList = patronOf.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        const saint = await db.saint.create({
            data: {
                id,
                name: name.trim(),
                slug,
                title: title || null,
                feastDay: feastDay || null,
                patronOf: patronList,
                shortBio: shortBio || null,
                biography: shortBio || null,
                imageUrl: imageUrl || null,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, saint }, { status: 201 });
    } catch (error: any) {
        console.error('Admin Saint Creation Error:', error);
        return NextResponse.json({ error: 'Failed to create saint', details: error.message }, { status: 500 });
    }
}
