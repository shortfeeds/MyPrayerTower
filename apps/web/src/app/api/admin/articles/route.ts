import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
        const search = searchParams.get('search')?.trim() || '';

        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [articles, total] = await Promise.all([
            db.article.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            displayName: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            }),
            db.article.count({ where }),
        ]);

        return NextResponse.json({
            articles,
            total,
            page,
            limit,
        });
    } catch (error: any) {
        console.error('Error fetching admin articles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch articles', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, slug, content, excerpt, category, coverImage, isPublished } = body;

        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: 'Title, slug, and content are required' },
                { status: 400 }
            );
        }

        const article = await db.article.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                category: category || null,
                coverImage: coverImage || null,
                isPublished: Boolean(isPublished),
                publishedAt: isPublished ? new Date() : null,
            },
        });

        return NextResponse.json({ success: true, article }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
