/**
 * IndexNow & Instant Search Engine Indexing Engine
 * 
 * Submits URLs to IndexNow (Bing, Yandex, Naver, Seznam) and pings search engine sitemaps.
 */

import { db } from '@/lib/db';
import { NOVENAS } from '@/lib/novenas';
import { getAllGuides, getAllPosts } from '@/lib/content';

export const INDEXNOW_KEY = '565731002ad842e8bf184087dab6dc41';
export const INDEXNOW_HOST = 'www.myprayertower.com';
export const BASE_URL = `https://${INDEXNOW_HOST}`;

export const INDEXNOW_ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
];

export interface IndexNowResult {
    endpoint: string;
    status: number;
    ok: boolean;
    error?: string;
}

export interface IndexNowResponse {
    success: boolean;
    urlCount: number;
    results: IndexNowResult[];
    sitemapPings?: { engine: string; status: number; ok: boolean }[];
    error?: string;
}

/**
 * Submit an array of URLs to all IndexNow endpoints
 */
export async function submitUrlsToIndexNow(rawUrls: string[]): Promise<IndexNowResponse> {
    if (!rawUrls || rawUrls.length === 0) {
        return { success: false, urlCount: 0, results: [], error: 'No URLs provided' };
    }

    // Clean and normalize URLs to full canonical HTTPS format
    const fullUrls = Array.from(
        new Set(
            rawUrls.map(u => {
                let path = u.trim();
                if (path.startsWith('http://') || path.startsWith('https://')) {
                    const parsed = new URL(path);
                    path = parsed.pathname + parsed.search;
                }
                if (!path.startsWith('/')) {
                    path = `/${path}`;
                }
                return `${BASE_URL}${path}`;
            })
        )
    );

    // IndexNow protocol specs: max 10,000 URLs per POST payload
    const CHUNK_SIZE = 10000;
    const urlChunks: string[][] = [];
    for (let i = 0; i < fullUrls.length; i += CHUNK_SIZE) {
        urlChunks.push(fullUrls.slice(i, i + CHUNK_SIZE));
    }

    const allResults: IndexNowResult[] = [];

    for (const chunk of urlChunks) {
        const payload = {
            host: INDEXNOW_HOST,
            key: INDEXNOW_KEY,
            keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
            urlList: chunk,
        };

        const chunkResponses = await Promise.allSettled(
            INDEXNOW_ENDPOINTS.map(async (endpoint) => {
                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'User-Agent': 'MyPrayerTower-IndexNow/1.0',
                        },
                        body: JSON.stringify(payload),
                    });

                    return {
                        endpoint,
                        status: res.status,
                        ok: res.ok || res.status === 200 || res.status === 202,
                    };
                } catch (err: any) {
                    return {
                        endpoint,
                        status: 0,
                        ok: false,
                        error: err?.message || 'Network error',
                    };
                }
            })
        );

        chunkResponses.forEach((r) => {
            if (r.status === 'fulfilled') {
                allResults.push(r.value);
            } else {
                allResults.push({
                    endpoint: 'unknown',
                    status: 500,
                    ok: false,
                    error: r.reason?.message || 'Submission error',
                });
            }
        });
    }

    const anySuccessful = allResults.some((r) => r.ok);

    return {
        success: anySuccessful,
        urlCount: fullUrls.length,
        results: allResults,
    };
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrlToIndexNow(url: string): Promise<IndexNowResponse> {
    return submitUrlsToIndexNow([url]);
}

/**
 * Hook into server actions to auto-submit after content creation/mutation
 */
export async function notifyIndexNow(urls: string | string[]) {
    try {
        const urlArray = Array.isArray(urls) ? urls : [urls];
        const result = await submitUrlsToIndexNow(urlArray);
        console.log(`[IndexNow] Auto-submitted ${result.urlCount} URL(s), success: ${result.success}`);
        return result;
    } catch (error) {
        console.error('[IndexNow] Submission warning:', error);
        return { success: false, urlCount: 0, results: [], error: String(error) };
    }
}

/**
 * Ping search engines to re-fetch sitemap.xml
 */
export async function pingSearchEngineSitemaps() {
    const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
    const pings = [
        { engine: 'Google', url: `https://www.google.com/ping?sitemap=${sitemapUrl}` },
        { engine: 'Bing', url: `https://www.bing.com/ping?sitemap=${sitemapUrl}` },
    ];

    const results = await Promise.allSettled(
        pings.map(async (ping) => {
            try {
                const res = await fetch(ping.url, { method: 'GET' });
                return {
                    engine: ping.engine,
                    status: res.status,
                    ok: res.ok || res.status === 200,
                };
            } catch (err) {
                return {
                    engine: ping.engine,
                    status: 0,
                    ok: false,
                };
            }
        })
    );

    return results.map((r, i) =>
        r.status === 'fulfilled'
            ? r.value
            : { engine: pings[i].engine, status: 0, ok: false }
    );
}

/**
 * Collect all active public site URLs dynamically
 */
export async function fetchAllSiteUrls(): Promise<string[]> {
    const staticPaths = [
        '/',
        '/about',
        '/actions',
        '/advertise',
        '/anniversaries',
        '/art',
        '/bible',
        '/bouquets',
        '/calendar',
        '/campaigns',
        '/candles',
        '/canon-law',
        '/careers',
        '/catechism',
        '/challenges',
        '/chant',
        '/chaplets',
        '/churches',
        '/claim',
        '/contact',
        '/contributions',
        '/cookies',
        '/dioceses',
        '/dmca',
        '/encyclicals',
        '/events',
        '/examen',
        '/fasting',
        '/features',
        '/for-churches',
        '/glossary',
        '/groups',
        '/guidelines',
        '/guides',
        '/blog',
        '/hierarchy',
        '/history',
        '/how-to',
        '/how-we-work',
        '/hymns',
        '/journey',
        '/leaderboard',
        '/library',
        '/live-mass',
        '/mass-offerings',
        '/mass-times',
        '/memorials',
        '/news',
        '/novenas',
        '/partners',
        '/pilgrimages',
        '/podcasts',
        '/prayer-wall',
        '/prayers',
        '/press',
        '/privacy',
        '/quiz',
        '/readings',
        '/refunds',
        '/rosary',
        '/sacraments',
        '/saints',
        '/stations',
        '/summa',
        '/terms',
        '/testimonies',
        '/vatican-ii',
        '/welcome',
        '/year-in-review',
    ];

    const urls: string[] = [...staticPaths];

    try {
        // Fetch Saints
        const saints = await db.saint.findMany({ select: { slug: true }, take: 10000 });
        saints.forEach((s) => urls.push(`/saints/${s.slug}`));

        // Fetch Prayers
        const prayers = await db.prayer.findMany({
            where: { is_active: true, slug: { not: null } },
            select: { slug: true },
            take: 10000,
        });
        prayers.forEach((p) => urls.push(`/prayers/${p.slug}`));

        // Fetch Memorials
        const memorials = await db.memorial.findMany({
            where: { isPublic: true },
            select: { slug: true },
            take: 10000,
        });
        memorials.forEach((m) => urls.push(`/memorials/${m.slug}`));

        // Fetch Churches
        const churches = await db.church.findMany({ select: { slug: true }, take: 10000 });
        churches.forEach((c) => urls.push(`/churches/${c.slug}`));

        // Fetch Guides
        const guides = await getAllGuides();
        guides.forEach((g) => urls.push(`/guides/${g.slug}`));

        // Fetch Blog Posts
        const posts = await getAllPosts();
        posts.forEach((p) => urls.push(`/blog/${p.slug}`));

        // Novenas
        NOVENAS.forEach((n) => urls.push(`/novenas/${n.id}`));
    } catch (err) {
        console.error('[IndexNow] DB URL fetch error (using static routes):', err);
    }

    return Array.from(new Set(urls));
}

/**
 * Submit entire site to IndexNow & ping sitemaps
 */
export async function submitEntireSitemapToIndexNow(): Promise<IndexNowResponse> {
    const urls = await fetchAllSiteUrls();
    const indexNowResult = await submitUrlsToIndexNow(urls);
    const sitemapPings = await pingSearchEngineSitemaps();

    return {
        ...indexNowResult,
        sitemapPings,
    };
}
