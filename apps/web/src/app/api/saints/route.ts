import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';
import { unstable_cache } from 'next/cache';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || '';
    const month = searchParams.get('month');

    // Create a cache key based on all parameters
    const cacheKey = `saints-${page}-${limit}-${search}-${month || 'all'}`;

    try {
        const getCachedSaints = unstable_cache(
            async () => {
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
                            shortBio: true,
                            patronOf: true,
                            imageUrl: true,
                        }
                    }),
                    db.saint.count({ where })
                ]);

                return { saints, total };
            },
            [cacheKey], // Dynamic Key
            { revalidate: 86400, tags: ['saints'] } // 24 hours
        );

        const { saints, total } = await getCachedSaints();

        const response = NextResponse.json({
            saints: toSafeJSON(saints),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

        // Add cache headers (1 hour for CDN)
        response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

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
