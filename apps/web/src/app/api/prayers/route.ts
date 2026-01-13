'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const duration = searchParams.get('duration') || ''; // short, medium, long

    try {
        const skip = (page - 1) * limit;

        const where: any = {
            isPublished: true
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (category) {
            where.category = { slug: category };
        }

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
                    tags: true,
                    viewCount: true,
                    createdAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            }),
            db.prayer.count({ where }),
            db.prayerLibraryCategory.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: { select: { prayers: true } }
                },
                orderBy: { name: 'asc' }
            })
        ]);

        // Post-process for duration filter if needed
        let filteredPrayers = prayers;
        if (duration) {
            filteredPrayers = prayers.filter(p => {
                const words = p.content.split(/\s+/).length;
                if (duration === 'short') return words < 150;
                if (duration === 'medium') return words >= 150 && words <= 750;
                if (duration === 'long') return words > 750;
                return true;
            });
        }

        // Add reading time
        const prayersWithMeta = filteredPrayers.map(p => ({
            ...p,
            readingTime: Math.ceil(p.content.split(/\s+/).length / 150),
            categoryName: p.category?.name || 'General',
            categorySlug: p.category?.slug || null
        }));

        return NextResponse.json({
            prayers: toSafeJSON(prayersWithMeta),
            total,
            page,
            totalPages: Math.ceil(total / limit),
            categories: categories.map(c => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                count: c._count.prayers
            }))
        });
    } catch (error: any) {
        console.error('Prayers API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch prayers',
            message: error.message,
            prayers: [],
            categories: [],
            total: 0
        }, { status: 500 });
    }
}
