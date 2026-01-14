import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || '';
    const month = searchParams.get('month');

    try {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } }
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
                orderBy: [
                    { feastMonth: 'asc' },
                    { feastDayOfMonth: 'asc' },
                    { name: 'asc' }
                ],
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    title: true,
                    feastMonth: true,
                    feastDayOfMonth: true,
                    feastDay: true,
                    shortBio: true,  // Use shortBio directly instead of fetching full biography
                    patronOf: true,
                    imageUrl: true,
                }
            }),
            db.saint.count({ where })
        ]);

        const response = NextResponse.json({
            saints: toSafeJSON(saints),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

        // Add cache headers (1 minute for CDN, 5 minutes stale-while-revalidate)
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

        return response;
    } catch (error: any) {
        console.error('Saints API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch saints',
            message: error.message,
            saints: [],
            total: 0
        }, { status: 500 });
    }
}
