import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
