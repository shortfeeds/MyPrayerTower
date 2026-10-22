export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    const staticRoutes = [
        '',
        '/about',
        '/achievements',
        '/actions',
        '/advertise',
        '/ai-companion',
        '/anniversaries',
        '/app',
        '/art',
        '/bible',
        '/blog',
        '/bouquets',
        '/calendar',
        '/campaigns',
        '/candles',
        '/canon-law',
        '/careers',
        '/catechism',
        '/catholic-life',
        '/certificates',
        '/challenges',
        '/chant',
        '/chaplets',
        '/church-dashboard',
        '/churches',
        '/claim',
        '/community',
        '/confession',
        '/contact',
        '/contributions',
        '/cookies',
        '/dioceses',
        '/divine-office',
        '/dmca',
        '/donate',
        '/encyclicals',
        '/events',
        '/examen',
        '/fasting',
        '/features',
        '/focus-mode',
        '/for-churches',
        '/glossary',
        '/groups',
        '/guidelines',
        '/guides',
        '/hierarchy',
        '/history',
        '/how-to',
        '/how-we-work',
        '/hymns',
        '/journal',
        '/journey',
        '/leaderboard',
        '/library',
        '/live-mass',
        '/mass-offerings',
        '/mass-times',
        '/memorials',
        '/news',
        '/novena-tracker',
        '/novenas',
        '/offerings',
        '/partners',
        '/pilgrimages',
        '/podcasts',
        '/prayer-partners',
        '/prayer-wall',
        '/prayers',
        '/press',
        '/privacy',
        '/quiz',
        '/reading-plans',
        '/readings',
        '/refunds',
        '/rosary',
        '/sacraments',
        '/saints',
        '/stations',
        '/summa',
        '/terms',
        '/testimonies',
        '/vatican-ii',
        '/watch',
        '/welcome',
        '/year-in-review'
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
      .map(
          (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : route === '/mass-offerings' || route === '/candles' || route === '/rosary' || route === '/live-mass' ? '0.9' : '0.8'}</priority>
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
