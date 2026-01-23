import { NextResponse } from 'next/server';

const INDEXNOW_API_KEY = '565731002ad842e8bf184087dab6dc41';
const INDEXNOW_ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
];

interface IndexNowSubmission {
    url: string;
    urlList?: string[];
}

/**
 * IndexNow Auto-Submission Utility
 * 
 * Automatically submits URLs to search engines (Bing, Yandex, etc.)
 * when content is created or updated.
 */
export async function submitToIndexNow({ url, urlList }: IndexNowSubmission) {
    const host = 'www.myprayertower.com';

    try {
        const payload = {
            host,
            key: INDEXNOW_API_KEY,
            keyLocation: `https://${host}/${INDEXNOW_API_KEY}.txt`,
            ...(urlList ? { urlList } : { url }),
        };

        // Submit to all endpoints for better coverage
        const responses = await Promise.allSettled(
            INDEXNOW_ENDPOINTS.map(endpoint =>
                fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            )
        );

        const successful = responses.filter(r => r.status === 'fulfilled').length;

        console.log(`[IndexNow] Submitted ${urlList ? urlList.length : 1} URL(s) to ${successful}/${INDEXNOW_ENDPOINTS.length} endpoints`);

        return { success: true, submitted: successful };
    } catch (error) {
        console.error('[IndexNow] Submission failed:', error);
        return { success: false, error };
    }
}

/**
 * Helper to submit single URL
 */
export async function submitUrlToIndexNow(url: string) {
    // Ensure URL starts with /
    const path = url.startsWith('/') ? url : `/${url}`;
    return submitToIndexNow({ url: `https://www.myprayertower.com${path}` });
}

/**
 * Helper to submit multiple URLs
 */
export async function submitUrlsToIndexNow(urls: string[]) {
    const fullUrls = urls.map(u => {
        const path = u.startsWith('/') ? u : `/${u}`;
        return `https://www.myprayertower.com${path}`;
    });
    return submitToIndexNow({ urlList: fullUrls });
}

/**
 * API Route Handler for manual submissions
 */
export async function POST(request: Request) {
    try {
        const { url, urls } = await request.json();

        if (!url && (!urls || urls.length === 0)) {
            return NextResponse.json(
                { error: 'URL or URLs required' },
                { status: 400 }
            );
        }

        const result = url
            ? await submitUrlToIndexNow(url)
            : await submitUrlsToIndexNow(urls);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Submission failed', details: error },
            { status: 500 }
        );
    }
}
