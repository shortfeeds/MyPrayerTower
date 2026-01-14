import { MetadataRoute } from 'next';
import { PrismaClient } from '@mpt/database';

export async function generateSitemaps() {
    return [
        { id: 'static' },
        { id: 'churches' },
        { id: 'saints' },
        { id: 'prayers' },
        { id: 'memorials' },
    ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://myprayertower.com';
    const lastModified = new Date();
    const prisma = new PrismaClient();

    try {
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

        if (id === 'churches') {
            const churches = await prisma.church.findMany({
                select: { slug: true },
                take: 45000
            });
            return churches.map((church) => ({
                url: `${baseUrl}/churches/${church.slug}`,
                lastModified,
                changeFrequency: 'weekly',
                priority: 0.7,
            }));
        }

        if (id === 'saints') {
            const saints = await prisma.saint.findMany({
                select: { slug: true },
                take: 10000
            });
            return saints.map((saint) => ({
                url: `${baseUrl}/saints/${saint.slug}`,
                lastModified,
                changeFrequency: 'monthly',
                priority: 0.6,
            }));
        }

        if (id === 'prayers') {
            const prayers = await prisma.prayer.findMany({
                where: { slug: { not: null } },
                select: { slug: true },
                take: 10000
            });
            return prayers.map((prayer) => ({
                url: `${baseUrl}/prayers/${prayer.slug}`,
                lastModified,
                changeFrequency: 'monthly',
                priority: 0.6,
            }));
        }

        if (id === 'memorials') {
            const memorials = await prisma.memorial.findMany({
                select: { slug: true },
                where: { isPublic: true },
                take: 10000
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
    } finally {
        await prisma.$disconnect();
    }
}
