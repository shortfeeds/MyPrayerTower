export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    const staticRoutes = [
        '',
        '/about',
        '/actions',
        '/advertise',
        '/anniversaries',
        '/art',
        '/bible',
        '/calendar',
        '/campaigns',
        '/careers',
        '/catechism',
        '/catholic-life',
        '/certificates',
        '/challenges',
        '/chant',
        '/chaplets',
        '/churches',
        '/community',
        '/confession',
        '/contact',
        '/contributions',
        '/cookies',
        '/dioceses',
        '/divine-office',
        '/dmca',
        '/encyclicals',
        '/events',
        '/examen',
        '/fasting',
        '/features',
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
        '/mass-times',
        '/memorials',
        '/news',
        '/novena-tracker',
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
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
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
