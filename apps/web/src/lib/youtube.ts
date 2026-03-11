const CHANNEL_ID = 'UCniFNgosITti05xSQ6hqacg'; // My Prayer Tower
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
}

/**
 * Server-side YouTube video fetcher.
 * Uses Next.js fetch caching (ISR) — no client-side API route needed.
 * This avoids serverless function invocations per visitor.
 */
export async function fetchYouTubeVideos(limit: number = 12): Promise<YouTubeVideo[]> {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            console.warn('YOUTUBE_API_KEY is not set');
            return [];
        }

        const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
        searchUrl.searchParams.set('key', apiKey);
        searchUrl.searchParams.set('channelId', CHANNEL_ID);
        searchUrl.searchParams.set('part', 'snippet');
        searchUrl.searchParams.set('type', 'video');
        searchUrl.searchParams.set('order', 'date');
        searchUrl.searchParams.set('maxResults', String(Math.min(limit, 50)));

        const response = await fetch(searchUrl.toString(), {
            next: { revalidate: 3600 }, // ISR: revalidate every hour
        });

        if (!response.ok) {
            console.error('YouTube API error:', response.status);
            return [];
        }

        const data = await response.json();

        return (data.items || []).map((item: any) => ({
            id: item.id?.videoId || '',
            title: item.snippet?.title || '',
            description: item.snippet?.description || '',
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
            publishedAt: item.snippet?.publishedAt || '',
        }));
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}
