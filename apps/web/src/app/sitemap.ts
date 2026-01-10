import { MetadataRoute } from 'next';
import { PrismaClient } from '@mpt/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://myprayertower.com';
    const lastModified = new Date();
    const prisma = new PrismaClient();

    // 1. Static Core Pages
    const coreRoutes = [
        '', '/about', '/contact', '/donate', '/candles', '/mass-offerings',
        '/memorials', '/prayers', '/saints', '/bible', '/confession', '/rosary',
        '/login', '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // 2. Fetch Dynamic Data - NOW USING SLUGS for SEO-friendly URLs
        const [churches, saints, prayers, memorials] = await Promise.all([
            prisma.church.findMany({
                select: { slug: true },
                where: { isVerified: true },
                take: 10000
            }),
            prisma.saint.findMany({
                select: { slug: true },
                take: 5000
            }),
            prisma.prayer.findMany({
                where: {
                    slug: { not: null }
                },
                select: { slug: true },
                take: 5000
            }),
            prisma.memorial.findMany({
                select: { slug: true },
                where: { isPublic: true },
                take: 5000
            })
        ]);

        // 3. Map to Sitemap Entries with SEO-friendly slugs
        const churchRoutes = churches.map((church) => ({
            url: `${baseUrl}/churches/${church.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        const saintRoutes = saints.map((saint) => ({
            url: `${baseUrl}/saints/${saint.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        // Prayer URLs use the ID since Prayer model doesn't have a slug field
        // The prayers/[slug] route might be using a Title-based approach
        const prayerRoutes = prayers
            .filter(p => p.slug) // Double check filter
            .map((prayer) => ({
                url: `${baseUrl}/prayers/${prayer.slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            }));

        const memorialRoutes = memorials.map((memorial) => ({
            url: `${baseUrl}/memorials/${memorial.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        await prisma.$disconnect();

        return [...coreRoutes, ...churchRoutes, ...saintRoutes, ...prayerRoutes, ...memorialRoutes];

    } catch (error) {
        console.error('Failed to generate dynamic sitemap:', error);
        return coreRoutes;
    }
}
