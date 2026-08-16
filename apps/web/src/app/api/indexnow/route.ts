import { NextResponse } from 'next/server';
import {
    INDEXNOW_KEY,
    INDEXNOW_HOST,
    submitUrlToIndexNow,
    submitUrlsToIndexNow,
    pingSearchEngineSitemaps,
} from '@/lib/indexnow';

/**
 * GET /api/indexnow
 * Check IndexNow status and key location
 */
export async function GET() {
    const keyUrl = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
    
    let keyValid = false;
    try {
        const keyRes = await fetch(keyUrl, { cache: 'no-store' });
        const keyText = await keyRes.text();
        keyValid = keyRes.ok && keyText.trim() === INDEXNOW_KEY;
    } catch {
        keyValid = false;
    }

    return NextResponse.json({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyUrl,
        keyVerified: keyValid,
        endpoints: [
            'https://api.indexnow.org/indexnow',
            'https://www.bing.com/indexnow',
            'https://yandex.com/indexnow',
        ],
    });
}

/**
 * POST /api/indexnow
 * Submit specific URL or array of URLs to IndexNow
 * Body: { url?: string, urls?: string[], pingSitemaps?: boolean }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, urls, pingSitemaps } = body;

        if (!url && (!urls || !Array.isArray(urls) || urls.length === 0)) {
            return NextResponse.json(
                { error: 'Provide a valid "url" string or "urls" array' },
                { status: 400 }
            );
        }

        const targetUrls = urls || (url ? [url] : []);
        const indexNowResult = await submitUrlsToIndexNow(targetUrls);

        let sitemapPings;
        if (pingSitemaps) {
            sitemapPings = await pingSearchEngineSitemaps();
        }

        return NextResponse.json({
            ...indexNowResult,
            ...(sitemapPings ? { sitemapPings } : {}),
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Submission failed', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}
