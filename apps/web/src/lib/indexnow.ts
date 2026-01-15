/**
 * IndexNow Integration Helper
 * 
 * Auto-submit URLs to search engines when content changes
 */

import { submitUrlToIndexNow, submitUrlsToIndexNow } from '@/app/api/indexnow/route';

/**
 * Hook into server actions to auto-submit after mutations
 */
export async function notifyIndexNow(urls: string | string[]) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('[IndexNow] Skipping in development');
        return;
    }

    try {
        if (Array.isArray(urls)) {
            await submitUrlsToIndexNow(urls);
        } else {
            await submitUrlToIndexNow(urls);
        }
    } catch (error) {
        // Don't fail the main operation if IndexNow fails
        console.error('[IndexNow] Submission failed:', error);
    }
}

// Common usage examples:

// After creating a memorial:
// await notifyIndexNow(`/memorials/${memorial.slug}`);

// After updating a prayer:
// await notifyIndexNow(`/prayers/${prayer.slug}`);

// After creating multiple items:
// await notifyIndexNow(['/prayers/rosary', '/prayers/litany']);

// After candle creation (notify both pages):
// await notifyIndexNow(['/candles', `/candles/${candle.id}`]);
