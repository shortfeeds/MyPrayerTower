import { NextResponse } from 'next/server';
import { submitEntireSitemapToIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * POST /api/indexnow/submit-all
 * Fetches all site URLs and submits them in batch to IndexNow + pings sitemaps
 */
export async function POST() {
    try {
        const result = await submitEntireSitemapToIndexNow();

        return NextResponse.json({
            success: true,
            message: `Successfully submitted ${result.urlCount} site URLs to IndexNow engines`,
            ...result,
        });
    } catch (error: any) {
        console.error('[IndexNow] Bulk submission error:', error);
        return NextResponse.json(
            { success: false, error: 'Bulk submission failed', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}

/**
 * GET /api/indexnow/submit-all
 * Enables on-demand trigger via browser or simple curl
 */
export async function GET() {
    return POST();
}
