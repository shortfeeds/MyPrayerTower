import { db } from '@/lib/db';

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    let prayers: { slug: string; updatedAt?: Date | null }[] = [];

    try {
        prayers = await db.prayer.findMany({
            where: { is_active: true, slug: { not: null } },
            select: { slug: true, updatedAt: true },
            take: 5000,
            orderBy: { title: 'asc' }
        });
    } catch {
        prayers = [];
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/prayers</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${prayers
      .map(
          (p) => `
  <url>
    <loc>${baseUrl}/prayers/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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
