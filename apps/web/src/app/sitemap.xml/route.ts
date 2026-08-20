export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    const sitemaps = ['main', 'categories', 'products', 'blog'];

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
            'Content-Type': 'text/xml',
        },
    });
}
