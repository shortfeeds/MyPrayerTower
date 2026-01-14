import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';

    try {
        const skip = (page - 1) * limit;

        // Build where clause - matching Saints API pattern (simple, no strict filtering initially)
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

        // Fetch prayers and total count (matching Saints API pattern)
        const [prayers, total] = await Promise.all([
            db.prayer.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ title: 'asc' }]
            }),
            db.prayer.count({ where })
        ]);

        // Fetch distinct categories from the Prayer table
        const categoriesRaw = await db.prayer.findMany({
            select: {
                category: true,
                category_label: true
            },
            distinct: ['category']
        });

        const categories = categoriesRaw.map((c: any) => ({
            id: c.category,
            slug: c.category,
            name: c.category_label || c.category,
            count: 0
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));

        // Transform prayers for frontend
        const prayersWithMeta = prayers.map((p: any) => ({
            id: p.id.toString(), // Convert BigInt to string for JSON serialization
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

        return NextResponse.json({
            prayers: toSafeJSON(prayersWithMeta),
            total,
            page,
            totalPages: Math.ceil(total / limit),
            categories: categories
        });
    } catch (error: any) {
        console.error('Prayers API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch prayers',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
