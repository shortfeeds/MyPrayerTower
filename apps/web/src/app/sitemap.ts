import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://myprayertower.com';
    const lastModified = new Date();

    // Core public pages
    const coreRoutes = [
        '',
        '/about',
        '/contact',
        '/donate',
        '/candles',
        '/mass-offerings',
        '/memorials',
        '/prayers',
        '/saints',
        '/bible',
        '/confession',
        '/rosary',
        '/login',
        '/register',
    ];

    // Prayer & Devotional routes
    const prayerRoutes = [
        '/prayer-wall',
        '/novenas',
        '/chaplets',
        '/stations',
        '/examen',
        '/hymns',
        '/chant',
    ];

    // Readings & Resources
    const resourceRoutes = [
        '/readings',
        '/catechism',
        '/calendar',
        '/glossary',
        '/encyclicals',
        '/vatican-ii',
        '/summa',
        '/canon-law',
    ];

    // Community & Features
    const communityRoutes = [
        '/churches',
        '/groups',
        '/challenges',
        '/leaderboard',
        '/testimonies',
        '/bouquets',
        '/journey',
    ];

    // Legal pages
    const legalRoutes = [
        '/privacy',
        '/terms',
        '/cookies',
        '/guidelines',
        '/dmca',
        '/refunds',
    ];

    const allRoutes = [...coreRoutes, ...prayerRoutes, ...resourceRoutes, ...communityRoutes, ...legalRoutes];

    return allRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));
}
