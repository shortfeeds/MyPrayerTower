export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get('source');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        const where: any = {};
        if (source) where.source = source;
        if (category) where.category = category;

        const articles = await prisma.newsArticle.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            take: Math.min(limit, 100),
            select: {
                id: true,
                source: true,
                title: true,
                summary: true,
                imageUrl: true,
                linkUrl: true,
                author: true,
                category: true,
                publishedAt: true,
            },
        });

        return NextResponse.json({ articles });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news articles' },
            { status: 500 }
        );
    }
}
