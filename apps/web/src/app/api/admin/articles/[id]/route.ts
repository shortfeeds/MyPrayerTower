import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const article = await db.article.findUnique({
            where: { id: params.id },
            include: { author: true },
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { title, slug, content, excerpt, category, coverImage, isPublished } = body;

        const updateData: any = {};
        if (title) updateData.title = title;
        if (slug) updateData.slug = slug;
        if (content) updateData.content = content;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (category !== undefined) updateData.category = category;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (isPublished !== undefined) {
            updateData.isPublished = Boolean(isPublished);
            if (isPublished) updateData.publishedAt = new Date();
        }

        const article = await db.article.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({ success: true, article });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await db.article.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
