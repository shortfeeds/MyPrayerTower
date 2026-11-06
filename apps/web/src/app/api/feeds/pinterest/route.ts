import { db } from '@/lib/db';
import { NOVENAS } from '@/lib/novenas';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

const BASE_URL = 'https://www.myprayertower.com';

export async function GET() {
    try {
        // Fetch top prayers
        const prayers = await db.prayer.findMany({
            where: { is_active: true },
            take: 60,
            orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                category: true,
                category_label: true,
                created_at: true,
            }
        }).catch(() => []);

        // Combine novenas and prayers
        const items: Array<{
            title: string;
            url: string;
            description: string;
            category: string;
            imageUrl: string;
            pubDate: string;
        }> = [];

        // 1. Novenas
        for (const novena of NOVENAS) {
            const subtitle = novena.feastDay ? `Feast: ${novena.feastDay} • Patron of ${novena.patronOf || novena.patron}` : `9-Day Catholic Novena`;
            const quote = novena.intention || novena.description || `Join thousands praying the 9-day novena to ${novena.name}.`;
            const ogUrl = `${BASE_URL}/api/og/pinterest?title=${encodeURIComponent(novena.name)}&subtitle=${encodeURIComponent(subtitle)}&quote=${encodeURIComponent(quote.slice(0, 200))}&category=Novena`;

            items.push({
                title: `${novena.name} - 9-Day Catholic Novena Prayers & Meditations`,
                url: `${BASE_URL}/novenas/${novena.id}`,
                description: `${novena.description}. Pray this powerful 9-day novena to ${novena.name}. Includes daily prayers, intentions, and intercessions.`,
                category: 'Catholic Novenas',
                imageUrl: ogUrl,
                pubDate: new Date().toUTCString(),
            });
        }

        // 2. Prayers
        for (const prayer of prayers) {
            const firstParagraph = prayer.content.split('\n').map(l => l.trim()).find(l => l.length > 20 && !l.startsWith('>')) || prayer.content.slice(0, 200);
            const subtitle = prayer.category_label || prayer.category || 'Traditional Catholic Prayer';
            const ogUrl = `${BASE_URL}/api/og/pinterest?title=${encodeURIComponent(prayer.title)}&subtitle=${encodeURIComponent(subtitle)}&quote=${encodeURIComponent(firstParagraph.slice(0, 200))}&category=Prayer`;

            items.push({
                title: `${prayer.title} — Catholic Prayers & Devotions`,
                url: `${BASE_URL}/prayers/${prayer.slug || prayer.id}`,
                description: `${prayer.content.slice(0, 280).replace(/\s+/g, ' ').trim()}... Pray online with text, audio recitation, and virtual candle vigil.`,
                category: prayer.category_label || 'Catholic Prayers',
                imageUrl: ogUrl,
                pubDate: (prayer.created_at || new Date()).toUTCString(),
            });
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:media="http://search.yahoo.com/mrss/" 
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MyPrayerTower — Daily Catholic Prayers, Miraculous Novenas &amp; Holy Scripture</title>
    <link>${BASE_URL}</link>
    <description>Daily Catholic prayers, 9-day miraculous novenas, Holy Rosary mysteries, patron saint biographies, and liturgical devotions.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/api/feeds/pinterest" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/icon.png</url>
      <title>MyPrayerTower</title>
      <link>${BASE_URL}</link>
    </image>
    ${items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <category><![CDATA[${item.category}]]></category>
      <enclosure url="${item.imageUrl}" length="150000" type="image/png" />
      <media:content url="${item.imageUrl}" medium="image" width="1000" height="1500">
        <media:title><![CDATA[${item.title}]]></media:title>
      </media:content>
    </item>`).join('')}
  </channel>
</rss>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error: any) {
        console.error('Pinterest feed generation error:', error);
        return new Response('<error>Failed to generate Pinterest RSS feed</error>', { status: 500 });
    }
}
