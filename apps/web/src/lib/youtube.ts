const CHANNEL_ID = 'UCniFNgosITti05xSQ6hqacg'; // My Prayer Tower
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Playlist IDs for precise categorization
export const PLAYLISTS = {
    SHORTS: 'PLBV73L6bWCJ6gqVvRlangMcymjRgDuzBd',
    PODCAST_EN: 'PLBV73L6bWCJ5L8J6P71QwTAsW2gXw0txm',
    PODCAST_ES: 'PLBV73L6bWCJ5m09CKodASxCR2lWQrxuBq',
    ROSARY: 'PLBV73L6bWCJ71ppxGO8g-YyCLQAa-1CXF',
    NOVENAS: 'PLBV73L6bWCJ6H3FMoZqUoBTb0_ffXdB3g',
    HYMNS: 'PLBV73L6bWCJ7_uC72_MQDA8rK63opb9p_',
    LENTEN: 'PLBV73L6bWCJ4GvwaNav8i9jWvCSKeE66P',
    GENESIS: 'PLBV73L6bWCJ7ZoTZViAehfoiQzDqf_axu',
};

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    type: 'short' | 'video' | 'podcast' | 'rosary' | 'novena' | 'hymn' | 'series'; // Enhanced categorization
}


/**
 * Server-side YouTube video fetcher.
 */
export async function fetchYouTubeVideos(limit: number = 30, playlistId?: string): Promise<YouTubeVideo[]> {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        
        // 1. Try YouTube Data API (PlaylistItems or Search)
        if (apiKey) {
            const endpoint = playlistId ? 'playlistItems' : 'search';
            const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
            url.searchParams.set('key', apiKey);
            url.searchParams.set('part', 'snippet');
            url.searchParams.set('maxResults', String(Math.min(limit, 50)));

            if (playlistId) {
                url.searchParams.set('playlistId', playlistId);
            } else {
                url.searchParams.set('channelId', CHANNEL_ID);
                url.searchParams.set('type', 'video');
                url.searchParams.set('order', 'date');
            }

            const response = await fetch(url.toString(), {
                next: { revalidate: 3600 },
            });

            if (response.ok) {
                const data = await response.json();
                const items = data.items || [];
                
                // Get IDs for detail lookup if needed
                const ids = items.map((i: any) => 
                    playlistId ? i.snippet?.resourceId?.videoId : i.id?.videoId
                ).filter(Boolean);

                // Fetch durations to accurately identify shorts if not using the shorts playlist
                let durations: Record<string, string> = {};
                if (ids.length > 0 && !playlistId) {
                    const videoDetailsUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
                    videoDetailsUrl.searchParams.set('key', apiKey);
                    videoDetailsUrl.searchParams.set('id', ids.join(','));
                    videoDetailsUrl.searchParams.set('part', 'contentDetails');
                    
                    const detailsResponse = await fetch(videoDetailsUrl.toString());
                    if (detailsResponse.ok) {
                        const detailsData = await detailsResponse.json();
                        (detailsData.items || []).forEach((v: any) => {
                            durations[v.id] = v.contentDetails?.duration || '';
                        });
                    }
                }

                return items.map((item: any) => {
                    const id = playlistId ? item.snippet?.resourceId?.videoId : item.id?.videoId;
                    const duration = durations[id] || '';
                    
                    // Categorization Heuristic
                    let type: YouTubeVideo['type'] = 'video';
                    if (playlistId === PLAYLISTS.SHORTS) type = 'short';
                    else if (playlistId === PLAYLISTS.PODCAST_EN || playlistId === PLAYLISTS.PODCAST_ES) type = 'podcast';
                    else if (playlistId === PLAYLISTS.ROSARY) type = 'rosary';
                    else if (playlistId === PLAYLISTS.NOVENAS) type = 'novena';
                    else if (playlistId === PLAYLISTS.HYMNS) type = 'hymn';
                    else if (playlistId === PLAYLISTS.GENESIS || playlistId === PLAYLISTS.LENTEN) type = 'series';
                    else if (duration && !duration.includes('M') && !duration.includes('H')) type = 'short';
                    
                    return {
                        id,
                        title: item.snippet?.title || '',
                        description: item.snippet?.description || '',
                        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
                        publishedAt: item.snippet?.publishedAt || '',
                        type
                    };
                });
            }
        }

        // 2. Fallback: RSS Feed
        const rssUrl = playlistId 
            ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
            : `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
            
        const rssResponse = await fetch(rssUrl, { next: { revalidate: 3600 } });
        if (!rssResponse.ok) return [];

        const xmlText = await rssResponse.text();
        const entries = xmlText.split('<entry>').slice(1);
        
        return entries.map(entry => {
            const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || '';
            const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || '';
            const description = entry.match(/<media:description>(.*?)<\/media:description>/)?.[1] || '';
            
            // Heuristic for RSS
            let type: YouTubeVideo['type'] = 'video';
            if (playlistId === PLAYLISTS.SHORTS || title.toLowerCase().includes('#shorts')) type = 'short';
            else if (playlistId === PLAYLISTS.PODCAST_EN || playlistId === PLAYLISTS.PODCAST_ES || title.toLowerCase().includes('podcast')) type = 'podcast';
            else if (playlistId === PLAYLISTS.ROSARY || title.toLowerCase().includes('rosary')) type = 'rosary';
            else if (playlistId === PLAYLISTS.NOVENAS || title.toLowerCase().includes('novena')) type = 'novena';
            else if (playlistId === PLAYLISTS.HYMNS || title.toLowerCase().includes('hymn')) type = 'hymn';
            else if (playlistId === PLAYLISTS.GENESIS || playlistId === PLAYLISTS.LENTEN || title.toLowerCase().includes('genesis')) type = 'series';

            return {
                id,
                title,
                description,
                thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                publishedAt: entry.match(/<published>(.*?)<\/published>/)?.[1] || new Date().toISOString(),
                type
            };
        }).slice(0, limit);

    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}
