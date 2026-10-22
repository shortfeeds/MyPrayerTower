export const revalidate = 86400; // Cache index for 24 hours

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    const sitemaps = ['main', 'categories', 'products', 'blog', 'saints', 'prayers', 'guides'];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps
      .map(
          (type) => `
  <sitemap>
    <loc>${baseUrl}/sitemap-${type}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
      )
      .join('')}
</sitemapindex>
`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
    });
}
