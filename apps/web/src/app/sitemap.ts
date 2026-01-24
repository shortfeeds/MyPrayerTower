import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { NOVENAS } from '@/lib/novenas';

const baseUrl = 'https://myprayertower.com';
const CHUNK_SIZE = 10000; // Large chunk size for sitemap logic

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
        '',
        '/about',
        '/actions',
        '/advertise',
        '/anniversaries',
        '/art',
        '/bible',
        '/bouquets',
        '/calendar',
        '/campaigns',
        '/candles',
        '/canon-law',
        '/careers',
        '/catechism',
        '/challenges',
        '/chant',
        '/chaplets',
        '/churches',
        '/claim',
        '/contact',
        '/contributions',
        '/cookies',
        '/dioceses',
        '/dmca',
        '/encyclicals',
        '/events',
        '/examen',
        '/fasting',
        '/features',
        '/for-churches',
        '/glossary',
        '/groups',
        '/guidelines',
        '/hierarchy',
        '/history',
        '/how-we-work',
        '/hymns',
        '/journey',
        '/leaderboard',
        '/library',
        '/login',
        '/mass-offerings',
        '/mass-times',
        '/memorials',
        '/news',
        '/novenas',
        '/partners',
        '/pilgrimages',
        '/podcasts',
        '/prayer-wall',
        '/prayers',
        '/press',
        '/privacy',
        '/quiz',
        '/readings',
        '/refunds',
        '/register',
        '/rosary',
        '/saints',
        '/stations',
        '/summa',
        '/terms',
        '/testimonies',
        '/vatican-ii',
        '/welcome',
        '/year-in-review',
    ];

    const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // 1. Fetch Churches
        // Select only slug to be efficient
        const churches = await db.church.findMany({
            select: { slug: true },
            take: 20000, // Reasonable cap for now
        });

        const churchRoutes = churches.map(church => ({
            url: `${baseUrl}/churches/${church.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7
        }));

        // 2. Fetch Saints
        const saints = await db.saint.findMany({
            select: { slug: true },
        });

        const saintRoutes = saints.map(saint => ({
            url: `${baseUrl}/saints/${saint.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7
        }));

        // 3. Novenas (Static list/Lib)
        const novenaRoutes = NOVENAS.map(novena => ({
            url: `${baseUrl}/novenas/${novena.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7
        }));

        // 4. Memorials (Public only)
        const memorials = await db.memorial.findMany({
            where: { isPublic: true },
            select: { slug: true }
        });

        const memorialRoutes = memorials.map(memorial => ({
            url: `${baseUrl}/memorials/${memorial.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6
        }));

        return [
            ...routes,
            ...churchRoutes,
            ...saintRoutes,
            ...novenaRoutes,
            ...memorialRoutes
        ];

    } catch (error) {
        console.error('Sitemap generation error:', error);
        // Fallback to static routes if DB fails
        return routes;
    }
}
