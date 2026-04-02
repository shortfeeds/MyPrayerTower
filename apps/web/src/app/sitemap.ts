import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { NOVENAS } from '@/lib/novenas';
import { getAllGuides, getAllPosts } from '@/lib/content';

const baseUrl = 'https://myprayertower.com';

// ISR: cache sitemap for 24 hours — previously regenerated on every crawl request,
// querying 20,000+ churches + all saints + all prayers each time
export const revalidate = 86400;

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
            priority: 0.8
        }));

        // 3. Novenas (Static list/Lib)
        // Replaced by individual routes below

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

        // 5. Guides / Content (New SEO Hub) - Max Priority for Master Guides
        const guides = await getAllGuides();
        const guideRoutes = guides.map(guide => ({
            url: `${baseUrl}/guides/${guide.slug}`,
            lastModified: new Date(guide.updatedAt || guide.publishedAt),
            changeFrequency: 'daily' as const,
            priority: 1.0
        }));

        // 5b. Blog Posts (New Blog Hub) - High Priority for Liturgical Content
        const posts = await getAllPosts();
        const blogRoutes = posts.map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.publishedAt),
            changeFrequency: 'daily' as const,
            priority: 1.0
        }));

        // 6. Novenas (New SEO Pages)
        const novenaRoutes = NOVENAS.map(novena => ({
            url: `${baseUrl}/novenas/${novena.id}`,
            lastModified: new Date(), // Static content, could update manually
            changeFrequency: 'monthly' as const,
            priority: 0.8
        }));

        // 7. Prayers Application (3900+ items)
        const prayers = await db.prayer.findMany({
            where: {
                is_active: true,
                slug: { not: null }
            },
            select: { slug: true }
        });

        const prayerRoutes = prayers.map(prayer => ({
            url: `${baseUrl}/prayers/${prayer.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7
        }));

        const guideHubRoute = {
            url: `${baseUrl}/guides`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9
        };

        const blogHubRoute = {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9
        };

        const novenaHubRoute = {
            url: `${baseUrl}/novenas`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9
        };

        const howToHubRoute = {
            url: `${baseUrl}/how-to`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9
        };

        const catholicLifeHubRoute = {
            url: `${baseUrl}/catholic-life`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9
        };

        return [
            ...routes,
            guideHubRoute,
            blogHubRoute,
            novenaHubRoute,
            howToHubRoute,
            catholicLifeHubRoute,
            ...guideRoutes,
            ...blogRoutes,
            ...novenaRoutes,
            ...churchRoutes,
            ...saintRoutes,
            ...memorialRoutes,
            ...prayerRoutes
        ];

    } catch (error) {
        console.error('Sitemap generation error:', error);
        // Fallback to static routes if DB fails
        return routes;
    }
}
