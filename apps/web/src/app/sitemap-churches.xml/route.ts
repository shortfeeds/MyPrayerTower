import { db } from '@/lib/db';

export const revalidate = 86400; // Cache for 24 hours on Edge CDN

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    let churches: { slug: string; updatedAt?: Date | null }[] = [];

    try {
        churches = await db.church.findMany({
            select: { slug: true, updatedAt: true },
            take: 5000,
            orderBy: { name: 'asc' }
        });
    } catch {
        churches = [];
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/churches</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${churches
      .map(
          (c) => `
  <url>
    <loc>${baseUrl}/churches/${c.slug}</loc>
    <lastmod>${new Date(c.updatedAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`
      )
      .join('')}
</urlset>
`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
    });
}
