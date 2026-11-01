import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NOVENAS } from '@/lib/novenas';
import { getAllPosts, getAllGuides } from '@/lib/content';

export const dynamic = 'force-dynamic';

export interface UnifiedSearchResult {
    id: string;
    type: 'prayer' | 'novena' | 'saint' | 'blog' | 'guide' | 'church';
    title: string;
    subtitle?: string;
    snippet?: string;
    url: string;
    badge?: string;
    score: number;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = (searchParams.get('q') || searchParams.get('search') || '').trim();
    const typeFilter = searchParams.get('type') || 'all';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    if (!query || query.length < 2) {
        return NextResponse.json({
            query: '',
            total: 0,
            results: [],
            counts: { all: 0, prayers: 0, novenas: 0, saints: 0, articles: 0, churches: 0 }
        });
    }

    const lowerQuery = query.toLowerCase();
    const queryTerms = lowerQuery.split(/\s+/).filter(Boolean);

    try {
        const results: UnifiedSearchResult[] = [];

        // 1. NOVENAS (In-Memory, ultra fast)
        let novenaCount = 0;
        if (typeFilter === 'all' || typeFilter === 'novena' || typeFilter === 'novenas') {
            for (const novena of NOVENAS) {
                const nameLower = novena.name.toLowerCase();
                const patronLower = (novena.patron || '').toLowerCase();
                const patronOfLower = (novena.patronOf || '').toLowerCase();
                const descLower = (novena.description || '').toLowerCase();
                const intentionLower = (novena.intention || '').toLowerCase();

                let matches = false;
                let score = 0;

                if (nameLower === lowerQuery) {
                    score += 100;
                    matches = true;
                } else if (nameLower.startsWith(lowerQuery)) {
                    score += 75;
                    matches = true;
                } else if (nameLower.includes(lowerQuery)) {
                    score += 50;
                    matches = true;
                } else if (patronLower.includes(lowerQuery) || patronOfLower.includes(lowerQuery)) {
                    score += 40;
                    matches = true;
                } else if (descLower.includes(lowerQuery) || intentionLower.includes(lowerQuery)) {
                    score += 25;
                    matches = true;
                }

                if (matches) {
                    novenaCount++;
                    results.push({
                        id: `novena-${novena.id}`,
                        type: 'novena',
                        title: novena.name,
                        subtitle: novena.feastDay ? `Feast: ${novena.feastDay} • Patron of ${novena.patronOf || novena.patron}` : `9-Day Catholic Novena • ${novena.patron || ''}`,
                        snippet: novena.intention || novena.description,
                        url: `/novenas/${novena.id}`,
                        badge: '9-Day Novena',
                        score
                    });
                }
            }
        }

        // 2. BLOG & GUIDES (In-Memory, fast)
        let articleCount = 0;
        if (typeFilter === 'all' || typeFilter === 'blog' || typeFilter === 'article' || typeFilter === 'guide' || typeFilter === 'articles') {
            try {
                const [posts, guides] = await Promise.all([
                    getAllPosts().catch(() => []),
                    getAllGuides().catch(() => [])
                ]);

                for (const post of posts) {
                    const titleLower = post.title.toLowerCase();
                    const descLower = (post.description || '').toLowerCase();
                    const catLower = (post.category || '').toLowerCase();

                    let score = 0;
                    if (titleLower.includes(lowerQuery)) score += 60;
                    else if (descLower.includes(lowerQuery) || catLower.includes(lowerQuery)) score += 30;

                    if (score > 0) {
                        articleCount++;
                        results.push({
                            id: `blog-${post.slug}`,
                            type: 'blog',
                            title: post.title,
                            subtitle: `Catholic Reflection • ${post.category || 'Article'}`,
                            snippet: post.description,
                            url: `/blog/${post.slug}`,
                            badge: 'Article',
                            score
                        });
                    }
                }

                for (const guide of guides) {
                    const titleLower = guide.title.toLowerCase();
                    const descLower = (guide.description || '').toLowerCase();

                    let score = 0;
                    if (titleLower.includes(lowerQuery)) score += 60;
                    else if (descLower.includes(lowerQuery)) score += 30;

                    if (score > 0) {
                        articleCount++;
                        results.push({
                            id: `guide-${guide.slug}`,
                            type: 'guide',
                            title: guide.title,
                            subtitle: `Spiritual Guide • ${guide.category || 'Guide'}`,
                            snippet: guide.description,
                            url: `/guides/${guide.slug}`,
                            badge: 'Guide',
                            score
                        });
                    }
                }
            } catch (err) {
                // non-fatal
            }
        }

        // 3. DATABASE QUERIES (Prayers, Saints, Churches in parallel)
        const fetchPrayers = (typeFilter === 'all' || typeFilter === 'prayer' || typeFilter === 'prayers')
            ? db.prayer.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } },
                        { tags: { hasSome: queryTerms } }
                    ]
                },
                take: limit,
                orderBy: { title: 'asc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true,
                    category: true,
                    category_label: true
                }
            })
            : Promise.resolve([]);

        const fetchSaints = (typeFilter === 'all' || typeFilter === 'saint' || typeFilter === 'saints')
            ? db.saint.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { title: { contains: query, mode: 'insensitive' } },
                        { shortBio: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: limit,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    title: true,
                    feastDay: true,
                    imageUrl: true,
                    shortBio: true
                }
            })
            : Promise.resolve([]);

        const fetchChurches = (typeFilter === 'all' || typeFilter === 'church' || typeFilter === 'churches')
            ? db.church.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { city: { contains: query, mode: 'insensitive' } },
                        { state: { contains: query, mode: 'insensitive' } },
                        { country: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: limit,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    city: true,
                    state: true,
                    country: true
                }
            })
            : Promise.resolve([]);

        const [dbPrayers, dbSaints, dbChurches] = await Promise.all([
            fetchPrayers.catch(() => []),
            fetchSaints.catch(() => []),
            fetchChurches.catch(() => [])
        ]);

        // Process Prayers
        for (const p of dbPrayers) {
            const titleLower = p.title.toLowerCase();
            let score = 20;
            if (titleLower === lowerQuery) score = 95;
            else if (titleLower.startsWith(lowerQuery)) score = 70;
            else if (titleLower.includes(lowerQuery)) score = 55;

            results.push({
                id: `prayer-${p.id}`,
                type: 'prayer',
                title: p.title,
                subtitle: p.category_label || p.category || 'Catholic Prayer',
                snippet: p.content ? p.content.slice(0, 140) + '...' : undefined,
                url: `/prayers/${p.slug || p.id}`,
                badge: 'Prayer',
                score
            });
        }

        // Process Saints
        for (const s of dbSaints) {
            const nameLower = s.name.toLowerCase();
            let score = 20;
            if (nameLower === lowerQuery) score = 95;
            else if (nameLower.startsWith(lowerQuery)) score = 70;
            else if (nameLower.includes(lowerQuery)) score = 55;

            results.push({
                id: `saint-${s.id}`,
                type: 'saint',
                title: s.name,
                subtitle: s.feastDay ? `Feast Day: ${s.feastDay}` : (s.title || 'Saint of God'),
                snippet: s.shortBio ? s.shortBio.slice(0, 140) + '...' : undefined,
                url: `/saints/${s.slug || s.id}`,
                badge: 'Saint',
                score
            });
        }

        // Process Churches
        for (const c of dbChurches) {
            const nameLower = c.name.toLowerCase();
            let score = 20;
            if (nameLower.includes(lowerQuery)) score = 50;

            const location = [c.city, c.state, c.country].filter(Boolean).join(', ');
            results.push({
                id: `church-${c.id}`,
                type: 'church',
                title: c.name,
                subtitle: location || 'Catholic Parish',
                url: `/churches/${c.slug || c.id}`,
                badge: 'Parish',
                score
            });
        }

        // Sort results by relevance score (highest first)
        results.sort((a, b) => b.score - a.score);

        const slicedResults = results.slice(0, limit);

        return NextResponse.json({
            query,
            total: results.length,
            results: slicedResults,
            counts: {
                all: results.length,
                prayers: dbPrayers.length,
                novenas: novenaCount,
                saints: dbSaints.length,
                articles: articleCount,
                churches: dbChurches.length
            }
        });

    } catch (error: any) {
        console.error('Universal Search API Error:', error);
        return NextResponse.json({
            error: 'Failed to execute universal search',
            message: error?.message || 'Internal error'
        }, { status: 500 });
    }
}
