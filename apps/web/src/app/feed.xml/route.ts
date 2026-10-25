import { getAllPosts, getAllGuides } from '@/lib/content';

const BASE_URL = 'https://www.myprayertower.com';

export async function GET() {
    const [posts, guides] = await Promise.all([
        getAllPosts(),
        getAllGuides()
    ]);

    // Combine and sort by date descending
    const items = [
        ...posts.map(p => ({
            title: p.title,
            url: `${BASE_URL}/blog/${p.slug}`,
            date: p.publishedAt ? new Date(p.publishedAt) : new Date(),
            description: p.description || '',
            category: p.category || 'Spiritual Life',
        })),
        ...guides.map(g => ({
            title: g.title,
            url: `${BASE_URL}/guides/${g.slug}`,
            date: g.publishedAt ? new Date(g.publishedAt) : new Date(),
            description: g.description || '',
            category: 'Catholic Guide',
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 50);

    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MyPrayerTower - Daily Catholic Prayers, Guides &amp; Spiritual Reflections</title>
    <link>${BASE_URL}</link>
    <description>Over 3,900 traditional and modern Catholic prayers, daily rosary, novenas, saint devotions, and spiritual growth guides.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items.map((item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <category><![CDATA[${item.category}]]></category>
      <author>hello@myprayertower.com (MyPrayerTower)</author>
    </item>`).join('')}
  </channel>
</rss>`;

    return new Response(feedXml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
