import { NextResponse } from 'next/server';
import { submitEntireSitemapToIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Max allowed serverless duration

/**
 * GET /api/cron/indexnow
 * Automated recurring cron job for Vercel Cron & external schedulers.
 * Periodically notifies IndexNow search engines (Bing, Yandex, Naver, Seznam)
 * of all published content for rapid indexing and maximum organic visibility.
 */
export async function GET(req: Request) {
    try {
        console.log('[IndexNow Cron] Starting automated daily indexing job...');

        // Optional CRON_SECRET authorization check for external calls
        const cronSecret = process.env.CRON_SECRET;
        const authHeader = req.headers.get('authorization');
        const isVercelCron = req.headers.get('x-vercel-cron') === '1';

        if (cronSecret && authHeader !== `Bearer ${cronSecret}` && !isVercelCron) {
            const url = new URL(req.url);
            const token = url.searchParams.get('token') || url.searchParams.get('key');
            if (token !== cronSecret) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const result = await submitEntireSitemapToIndexNow();

        console.log(`[IndexNow Cron] Successfully submitted ${result.urlCount} URLs to IndexNow engines.`);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            urlCount: result.urlCount,
            message: `Successfully syndicated ${result.urlCount} URLs to IndexNow search engines (Bing, Yandex, Naver, Seznam, DuckDuckGo, Copilot).`,
            results: result.results,
            sitemapPings: result.sitemapPings,
        });
    } catch (error: any) {
        console.error('[IndexNow Cron] Execution error:', error);
        return NextResponse.json(
            {
                success: false,
                timestamp: new Date().toISOString(),
                error: error?.message || 'IndexNow cron execution failed',
            },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    return GET(req);
}
