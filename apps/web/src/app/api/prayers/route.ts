import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const duration = searchParams.get('duration') || '';

    try {
        const skip = (page - 1) * limit;

        // Use snake_case for DB query as per Prisma client generation quirks on some envs
        // or just use 'any' to bypass strict typing until full regen
        const where: any = {
            is_active: true
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (categorySlug) {
            where.category = categorySlug;
        }

        // Fetch prayers
        const [prayers, total] = await Promise.all([
            db.prayer.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ title: 'asc' }]
            }),
            db.prayer.count({ where })
        ]);

        // Fetch distinct categories from the Prayer table itself
        // aggregating unique combinations of category (slug) and category_label (name)
        const categoriesRaw = await db.prayer.findMany({
            where: { is_active: true } as any,
            select: {
                category: true,
                category_label: true
            } as any, // Cast to any to avoid IDE errors if types aren't synced
            distinct: ['category']
        });

        const categories = categoriesRaw.map((c: any) => ({
            id: c.category,
            slug: c.category,
            name: c.category_label || c.category,
            count: 0
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));

        // Post-process prayers to match frontend interface
        let filteredPrayers = prayers;
        if (duration) {
            filteredPrayers = prayers.filter((p: any) => {
                const words = p.content.split(/\s+/).length;
                if (duration === 'short') return words < 150;
                if (duration === 'medium') return words >= 150 && words <= 750;
                if (duration === 'long') return words > 750;
                return true;
            });
        }

        const prayersWithMeta = filteredPrayers.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            content: p.content,
            tags: p.tags,
            viewCount: p.viewCount || 0,
            readingTime: Math.ceil(p.content.split(/\s+/).length / 150),
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
            details: error.message
        }, { status: 500 });
    }
}
