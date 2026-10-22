import { getAllGuides } from '@/lib/content';

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    let guides: { slug: string; publishedAt?: string }[] = [];

    try {
        guides = await getAllGuides();
    } catch {
        guides = [];
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/guides</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  ${guides
      .map(
          (g) => `
  <url>
    <loc>${baseUrl}/guides/${g.slug}</loc>
    <lastmod>${new Date(g.publishedAt || new Date()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
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
