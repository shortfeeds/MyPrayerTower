import { NOVENAS } from '@/lib/novenas';

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    
    // Convert novenas to category routes
    const novenaRoutes = NOVENAS.map(n => `/novenas/${n.id}`);
    
    // Add other dynamic categories here if needed
    const categories = [
        '/blog',
        '/novenas',
        ...novenaRoutes
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories
      .map(
          (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('')}
</urlset>
`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'text/xml',
        },
    });
}
