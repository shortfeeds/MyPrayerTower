/**
 * WebSub / PubSubHubbub Instant Indexing Notifier
 * Notifies Google and RSS aggregators immediately when new prayers or sitemaps are published.
 */
export async function pingWebSubHubs(feedUrls: string[] = ['https://www.myprayertower.com/feed.xml', 'https://www.myprayertower.com/blog/feed.xml']) {
    const hubs = [
        'https://pubsubhubbub.appspot.com/',
        'https://pubsubhubbub.superfeedr.com/'
    ];

    const results = [];

    for (const hub of hubs) {
        for (const feedUrl of feedUrls) {
            try {
                const response = await fetch(hub, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'hub.mode': 'publish',
                        'hub.url': feedUrl,
                    }).toString(),
                });

                results.push({
                    hub,
                    feedUrl,
                    status: response.status,
                    ok: response.status === 204 || response.status === 200,
                });
            } catch (err: any) {
                results.push({
                    hub,
                    feedUrl,
                    status: 500,
                    error: err.message,
                });
            }
        }
    }

    return results;
}
