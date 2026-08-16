import { NextResponse } from 'next/server';
import { submitEntireSitemapToIndexNow } from '@/lib/indexnow';

/**
 * POST /api/indexnow/submit-all
 * Fetches all site URLs and submits them in batch to IndexNow + pings sitemaps
 */
export async function POST() {
    try {
        const result = await submitEntireSitemapToIndexNow();

        return NextResponse.json({
            message: `Successfully submitted ${result.urlCount} site URLs to IndexNow engines`,
            ...result,
        });
    } catch (error: any) {
        console.error('[IndexNow] Bulk submission error:', error);
        return NextResponse.json(
            { error: 'Bulk submission failed', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}
