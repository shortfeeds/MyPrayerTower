import { NextResponse } from 'next/server';
import { getAllPosts, getAllGuides } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('search')?.toLowerCase();

        const [posts, guides] = await Promise.all([
            getAllPosts(),
            getAllGuides()
        ]);

        const blogResults = posts.map(post => ({
            id: post.slug,
            type: 'blog',
            title: post.title,
            description: post.description,
            category: post.category,
            url: `/blog/${post.slug}`,
            publishedAt: post.publishedAt
        }));

        const guideResults = guides.map(guide => ({
            id: guide.slug,
            type: 'guide',
            title: guide.title,
            description: guide.description,
            category: guide.category,
            url: `/guides/${guide.slug}`,
            publishedAt: guide.publishedAt
        }));

        let results = [...blogResults, ...guideResults];

        if (query) {
            results = results.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            ).slice(0, 10);
        }

        return NextResponse.json({
            results,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Search index API error:', error);
        return NextResponse.json({ error: 'Failed to fetch search index' }, { status: 500 });
    }
}
