import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Generate at runtime only
export const revalidate = 86400; // Revalidate daily

const CHUNK_SIZE = 5000;

export async function generateSitemaps() {
    try {
        // 1. Fetch counts (fast)
        const [churchCount, saintCount, prayerCount, memorialCount] = await Promise.all([
            db.church.count(),
            db.saint.count(),
            db.prayer.count({ where: { slug: { not: null } } }),
            db.memorial.count({ where: { isPublic: true } }),
        ]);

        const sitemaps = [{ id: 'static' }];

        // 2. Generate pagination IDs
        const addChunks = (prefix: string, count: number) => {
            const chunks = Math.ceil(count / CHUNK_SIZE);
            for (let i = 0; i < chunks; i++) {
                sitemaps.push({ id: `${prefix}:${i}` });
            }
        };

        addChunks('churches', churchCount);
        addChunks('saints', saintCount);
        addChunks('prayers', prayerCount);
        addChunks('memorials', memorialCount);

        return sitemaps;
    } catch (error) {
        console.error('Failed to generate sitemap index:', error);
        // Fallback to basic if DB fails
        return [{ id: 'static' }];
    }
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://myprayertower.com';
    const lastModified = new Date();

    try {
        // Static Routes
        if (id === 'static') {
            const coreRoutes = [
                { url: '', priority: 1.0, changeFrequency: 'daily', images: ['https://myprayertower.com/opengraph-image'] },
                { url: '/candles', priority: 0.9, changeFrequency: 'weekly', images: ['https://myprayertower.com/images/candles/altar.png'] },
                { url: '/prayers', priority: 0.9, changeFrequency: 'daily' },
                { url: '/saints', priority: 0.8, changeFrequency: 'daily' },
                { url: '/mass-offerings', priority: 0.8, changeFrequency: 'weekly' },
                { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
                { url: '/contact', priority: 0.6, changeFrequency: 'monthly' },
                { url: '/donate', priority: 0.7, changeFrequency: 'monthly' },
                { url: '/memorials', priority: 0.8, changeFrequency: 'daily' },
                { url: '/prayer-wall', priority: 0.8, changeFrequency: 'hourly' },
                { url: '/journey', priority: 0.8, changeFrequency: 'weekly' },
                { url: '/bible', priority: 0.7, changeFrequency: 'monthly' },
                { url: '/confession', priority: 0.7, changeFrequency: 'monthly' },
                { url: '/rosary', priority: 0.7, changeFrequency: 'monthly' },
                { url: '/groups', priority: 0.7, changeFrequency: 'weekly' },
                { url: '/login', priority: 0.5, changeFrequency: 'yearly' },
                { url: '/register', priority: 0.5, changeFrequency: 'yearly' },
            ];

            return coreRoutes.map((route) => ({
                url: `${baseUrl}${route.url}`,
                lastModified,
                changeFrequency: route.changeFrequency as any,
                priority: route.priority,
                ...(route.images ? { images: route.images } : {}),
            }));
        }

        // Parse ID "type:page"
        const [type, pageStr] = id.split(':');
        const page = parseInt(pageStr || '0', 10);
        const skip = page * CHUNK_SIZE;

        if (type === 'churches') {
            const churches = await db.church.findMany({
                select: { slug: true },
                skip,
                take: CHUNK_SIZE,
                orderBy: { id: 'asc' } // Stable ordering
            });
            return churches.map((church) => ({
                url: `${baseUrl}/churches/${church.slug}`,
                lastModified,
                changeFrequency: 'weekly',
                priority: 0.7,
            }));
        }

        if (type === 'saints') {
            const saints = await db.saint.findMany({
                select: { slug: true },
                skip,
                take: CHUNK_SIZE,
                orderBy: { id: 'asc' }
            });
            return saints.map((saint) => ({
                url: `${baseUrl}/saints/${saint.slug}`,
                lastModified,
                changeFrequency: 'monthly',
                priority: 0.6,
            }));
        }

        if (type === 'prayers') {
            const prayers = await db.prayer.findMany({
                where: { slug: { not: null } },
                select: { slug: true },
                skip,
                take: CHUNK_SIZE,
                orderBy: { id: 'asc' }
            });
            return prayers.map((prayer) => ({
                url: `${baseUrl}/prayers/${prayer.slug}`,
                lastModified,
                changeFrequency: 'monthly',
                priority: 0.6,
            }));
        }

        if (type === 'memorials') {
            const memorials = await db.memorial.findMany({
                select: { slug: true },
                where: { isPublic: true },
                skip,
                take: CHUNK_SIZE,
                orderBy: { id: 'asc' }
            });
            return memorials.map((memorial) => ({
                url: `${baseUrl}/memorials/${memorial.slug}`,
                lastModified,
                changeFrequency: 'weekly',
                priority: 0.6,
            }));
        }

        return [];

    } catch (error) {
        console.error(`Failed to generate sitemap for ${id}:`, error);
        return [];
    }
}
