import { db } from '@/lib/db';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://myprayertower.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
        { url: `${BASE_URL}/churches`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
        { url: `${BASE_URL}/prayer-wall`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
        { url: `${BASE_URL}/saints`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${BASE_URL}/prayers`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${BASE_URL}/readings`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
        { url: `${BASE_URL}/bible`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${BASE_URL}/rosary`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${BASE_URL}/confession`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    ];

    // Dynamic pages - Saints
    let saintPages: MetadataRoute.Sitemap = [];
    try {
        const saints = await db.saint.findMany({
            select: { id: true, updatedAt: true },
            take: 1000, // Limit for performance
        });
        saintPages = saints.map((saint) => ({
            url: `${BASE_URL}/saints/${saint.id}`,
            lastModified: saint.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (e) {
        console.error('Error fetching saints for sitemap:', e);
    }

    // Dynamic pages - Churches
    let churchPages: MetadataRoute.Sitemap = [];
    try {
        const churches = await db.church.findMany({
            select: { id: true, updatedAt: true },
            take: 5000, // Limit for performance
        });
        churchPages = churches.map((church) => ({
            url: `${BASE_URL}/churches/${church.id}`,
            lastModified: church.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));
    } catch (e) {
        console.error('Error fetching churches for sitemap:', e);
    }

    // Dynamic pages - Prayers
    let prayerPages: MetadataRoute.Sitemap = [];
    try {
        const prayers = await db.prayer.findMany({
            select: { id: true, updatedAt: true },
            take: 500,
        });
        prayerPages = prayers.map((prayer) => ({
            url: `${BASE_URL}/prayers/${prayer.id}`,
            lastModified: prayer.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (e) {
        console.error('Error fetching prayers for sitemap:', e);
    }

    return [...staticPages, ...saintPages, ...churchPages, ...prayerPages];
}
