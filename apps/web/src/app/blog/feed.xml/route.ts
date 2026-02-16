import { getAllPosts } from '@/lib/content';

const BASE_URL = 'https://myprayertower.com';

export async function GET() {
    const posts = await getAllPosts();

    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MyPrayerTower Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Catholic articles, prayer guides, and spiritual reflections to deepen your faith journey.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      ${post.category ? `<category>${post.category}</category>` : ''}
      <author>hello@myprayertower.com (MyPrayerTower Team)</author>
    </item>`).join('')}
  </channel>
</rss>`;

    return new Response(feedXml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
