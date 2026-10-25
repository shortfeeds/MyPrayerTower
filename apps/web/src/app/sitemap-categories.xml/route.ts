export const revalidate = 86400; // Cache for 24 hours
import { NOVENAS } from '@/lib/novenas';
import { CATHOLIC_INTENTIONS } from '@/lib/seo/intentionsData';

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    
    // Convert novenas to routes
    const novenaRoutes = NOVENAS.map(n => `/novenas/${n.id}`);
    
    // Convert intentions to programmatic hub routes
    const intentionRoutes = Object.keys(CATHOLIC_INTENTIONS).map(slug => `/prayers/intention/${slug}`);
    
    const categories = [
        '/blog',
        '/novenas',
        ...intentionRoutes,
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
    <priority>0.85</priority>
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
