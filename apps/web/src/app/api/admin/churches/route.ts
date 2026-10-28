import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const verified = searchParams.get('verified');

    try {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (verified === 'true') {
            where.isVerified = true;
        } else if (verified === 'false') {
            where.isVerified = false;
        }

        const [churches, total] = await Promise.all([
            db.church.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    city: true,
                    country: true,
                    type: true,
                    isVerified: true,
                    address: true,
                    createdAt: true
                }
            }),
            db.church.count({ where })
        ]);

        return NextResponse.json({
            churches: churches.map(c => ({
                ...c,
                createdAt: c.createdAt.toISOString()
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Admin Churches GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch churches', churches: [], total: 0 }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, address, city, country, diocese, website, phone, mainImageUrl, type, denomination } = body;

        if (!name?.trim() || !address?.trim() || !city?.trim() || !country?.trim()) {
            return NextResponse.json({ error: 'Name, address, city, and country are required' }, { status: 400 });
        }

        const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const uniqueSuffix = Date.now().toString(36);
        const slug = `${baseSlug}-${uniqueSuffix}`;
        const id = randomUUID();

        const church = await db.church.create({
            data: {
                id,
                name: name.trim(),
                slug,
                type: (type as any) || 'PARISH',
                denomination: denomination || 'Roman Catholic',
                address: address.trim(),
                city: city.trim(),
                country: country.trim(),
                countryCode: country.slice(0, 2).toUpperCase(),
                website: website || null,
                phone: phone || null,
                primaryImageUrl: mainImageUrl || null,
                isVerified: false
            }
        });

        return NextResponse.json({ success: true, church }, { status: 201 });
    } catch (error: any) {
        console.error('Admin Church Creation Error:', error);
        return NextResponse.json({ error: 'Failed to create church', details: error.message }, { status: 500 });
    }
}
