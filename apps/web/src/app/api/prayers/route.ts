import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';

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

        // Fetch prayers and total count
        const [prayers, total] = await Promise.all([
            db.prayer.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ title: 'asc' }]
            }),
            db.prayer.count({ where })
        ]);

        // Fetch category counts using groupBy for actual counts
        const categoryCounts = await db.prayer.groupBy({
            by: ['category', 'category_label'],
            _count: { category: true },
            orderBy: { category: 'asc' }
        });

        const categories = categoryCounts.map((c: any) => ({
            id: c.category,
            slug: c.category,
            name: c.category_label || c.category,
            count: c._count.category
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));

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

        // Return response matching frontend expectations
        return NextResponse.json({
            prayers: toSafeJSON(prayersWithMeta),
            total,
            page,
            totalPages: Math.ceil(total / limit),
            categories: categories,
            // Add pagination object for frontend compatibility
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
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
