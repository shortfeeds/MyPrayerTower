import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const now = new Date().toUTCString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MyPrayerTower — Daily Catholic Rosary &amp; Gospel Reflections</title>
    <link>https://www.myprayertower.com/rosary</link>
    <atom:link href="https://www.myprayertower.com/api/feeds/rosary-rss" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <description>Daily Catholic Holy Rosary Mysteries, Gospel reflections, Angelus bells, and contemplative prayers from MyPrayerTower.</description>
    <itunes:author>MyPrayerTower Catholic Sanctuary</itunes:author>
    <itunes:category text="Religion &amp; Spirituality">
      <itunes:category text="Christianity" />
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <lastBuildDate>${now}</lastBuildDate>
    <item>
      <title>Holy Rosary — Guided Mysteries &amp; Contemplative Prayer</title>
      <link>https://www.myprayertower.com/rosary</link>
      <guid isPermaLink="false">mpt-rosary-daily</guid>
      <pubDate>${now}</pubDate>
      <description>Pray the Joyful, Sorrowful, Glorious, and Luminous Mysteries with MyPrayerTower.</description>
    </item>
    <item>
      <title>Today's Catholic Mass Readings &amp; Daily Gospel</title>
      <link>https://www.myprayertower.com/readings</link>
      <guid isPermaLink="false">mpt-gospel-daily</guid>
      <pubDate>${now}</pubDate>
      <description>Listen and reflect on today's Liturgy of the Word, Responsorial Psalm, and Gospel.</description>
    </item>
  </channel>
</rss>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
