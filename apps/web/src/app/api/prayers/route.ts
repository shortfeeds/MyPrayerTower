import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';
import { unstable_cache } from 'next/cache';

// Cache category counts for 1 hour (they rarely change)
const getCachedCategories = unstable_cache(
    async () => {
        const categoryCounts = await db.prayer.groupBy({
            by: ['category', 'category_label'],
            _count: { category: true },
            orderBy: { category: 'asc' }
        });

        return categoryCounts.map((c: any) => ({
            id: c.category,
            slug: c.category,
            name: c.category_label || c.category,
            count: c._count.category
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
    },
    ['prayer-categories'],
    { revalidate: 3600, tags: ['prayers'] }
);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || searchParams.get('q') || '';
    const categorySlug = searchParams.get('category') || '';

    try {
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (categorySlug) {
            where.category = categorySlug;
        }

        // Fetch prayers with only needed fields (much faster)
        const [prayers, total, categories] = await Promise.all([
            db.prayer.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ title: 'asc' }],
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true,
                    category: true,
                    category_label: true,
                    tags: true,
                }
            }),
            db.prayer.count({ where }),
            getCachedCategories()
        ]);

        // Transform prayers for frontend
        const prayersWithMeta = prayers.map((p: any) => ({
            id: p.id.toString(),
            title: p.title,
            slug: p.slug,
            content: p.content,
            tags: p.tags || [],
            readingTime: Math.ceil((p.content?.split(/\s+/).length || 0) / 150),
            category: {
                name: p.category_label || p.category,
                slug: p.category
            },
            categoryName: p.category_label || p.category,
            categorySlug: p.category
        }));

        // Return response with cache headers
        const response = NextResponse.json({
            prayers: toSafeJSON(prayersWithMeta),
            total,
            page,
            totalPages: Math.ceil(total / limit),
            categories: categories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

        // Add cache headers for CDN/browser caching (1 hour)
        response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

        return response;
    } catch (error: any) {
        console.error('Prayers API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch prayers',
            details: error.message,
            prayers: [],
            total: 0,
            pagination: { total: 0, page: 1, limit: 24, totalPages: 0 },
            categories: []
        }, { status: 500 });
    }
}
