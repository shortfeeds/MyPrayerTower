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
        // Expanded static pages
        { url: `${BASE_URL}/achievements`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/actions`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/advertise`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/art`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/bouquets`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${BASE_URL}/calendar`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${BASE_URL}/campaigns`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${BASE_URL}/candles`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
        { url: `${BASE_URL}/canon-law`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${BASE_URL}/catechism`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${BASE_URL}/challenges`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${BASE_URL}/chant`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/chaplets`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/church-dashboard`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${BASE_URL}/claim`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${BASE_URL}/cookies`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${BASE_URL}/devotional`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/dioceses`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/dmca`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${BASE_URL}/donate`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${BASE_URL}/encyclicals`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${BASE_URL}/examen`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/fasting`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/features`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/for-churches`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/glossary`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/groups`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${BASE_URL}/guidelines`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.4 },
        { url: `${BASE_URL}/hierarchy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/history`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/hymns`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.6 },
        { url: `${BASE_URL}/library`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${BASE_URL}/mass-offerings`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${BASE_URL}/mass-times`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${BASE_URL}/novenas`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${BASE_URL}/partners`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${BASE_URL}/pilgrimages`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/podcasts`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${BASE_URL}/press`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${BASE_URL}/quiz`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/stations`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/summa`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${BASE_URL}/testimonies`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${BASE_URL}/vatican-ii`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/wallpapers`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${BASE_URL}/year-in-review`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
    ];

    // Run all DB queries in parallel to avoid timeout
    const results = await Promise.allSettled([
        db.saint.findMany({ select: { id: true, updatedAt: true }, take: 1000 }),
        db.church.findMany({ select: { id: true, updatedAt: true }, take: 5000 }),
        db.prayer.findMany({ select: { id: true, updatedAt: true }, take: 500 })
    ]);

    const saintPages = results[0].status === 'fulfilled' ? results[0].value.map((s) => ({
        url: `${BASE_URL}/saints/${s.id}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6
    } as const)) : [];

    const churchPages = results[1].status === 'fulfilled' ? results[1].value.map((c) => ({
        url: `${BASE_URL}/churches/${c.id}`,
        lastModified: c.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6
    } as const)) : [];

    const prayerPages = results[2].status === 'fulfilled' ? results[2].value.map((p) => ({
        url: `${BASE_URL}/prayers/${p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6
    } as const)) : [];

    if (results[0].status === 'rejected') console.error('Sitemap saints error:', results[0].reason);
    if (results[1].status === 'rejected') console.error('Sitemap churches error:', results[1].reason);
    if (results[2].status === 'rejected') console.error('Sitemap prayers error:', results[2].reason);

    return [...staticPages, ...saintPages, ...churchPages, ...prayerPages];
}
