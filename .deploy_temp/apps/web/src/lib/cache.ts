import { unstable_cache } from 'next/cache';
import { db } from './db';

// Cache tags for invalidation
export const CACHE_TAGS = {
    SAINTS: 'saints',
    CHURCHES: 'churches',
    PRAYERS: 'prayers',
    READINGS: 'readings',
    USER: 'user',
} as const;

// Cache durations in seconds
const CACHE_DURATIONS = {
    SHORT: 60 * 5,        // 5 minutes
    MEDIUM: 60 * 60,      // 1 hour
    LONG: 60 * 60 * 24,   // 24 hours
    WEEK: 60 * 60 * 24 * 7, // 1 week
};

// ============ SAINTS ============

export const getCachedSaints = unstable_cache(
    async (limit?: number) => {
        return db.saint.findMany({
            take: limit || 100,
            orderBy: { name: 'asc' },
        });
    },
    ['saints-list'],
    { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.SAINTS] }
);

export const getCachedSaintById = unstable_cache(
    async (id: string) => {
        return db.saint.findUnique({
            where: { id },
        });
    },
    ['saint-by-id'],
    { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.SAINTS] }
);

export const getCachedSaintOfTheDay = unstable_cache(
    async () => {
        const today = new Date();
        return db.saint.findFirst({
            where: {
                feastMonth: today.getMonth() + 1,
                feastDayOfMonth: today.getDate(),
            },
        });
    },
    ['saint-of-the-day'],
    { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.SAINTS] }
);

// ============ CHURCHES ============

export const getCachedChurches = unstable_cache(
    async (limit?: number) => {
        return db.church.findMany({
            take: limit || 50,
            orderBy: { name: 'asc' },
        });
    },
    ['churches-list'],
    { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.CHURCHES] }
);

export const getCachedChurchById = unstable_cache(
    async (id: string) => {
        return db.church.findUnique({
            where: { id },
        });
    },
    ['church-by-id'],
    { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.CHURCHES] }
);

// ============ PRAYERS ============

export const getCachedPrayers = unstable_cache(
    async (category?: string, limit?: number) => {
        return db.prayer.findMany({
            where: category ? { category } : undefined,
            take: limit || 50,
            orderBy: { title: 'asc' },
        });
    },
    ['prayers-list'],
    { revalidate: CACHE_DURATIONS.WEEK, tags: [CACHE_TAGS.PRAYERS] }
);

export const getCachedPrayerById = unstable_cache(
    async (id: string) => {
        return db.prayer.findUnique({
            where: { id },
        });
    },
    ['prayer-by-id'],
    { revalidate: CACHE_DURATIONS.WEEK, tags: [CACHE_TAGS.PRAYERS] }
);

export const getCachedPrayerCategories = unstable_cache(
    async () => {
        const result = await db.prayer.findMany({
            select: { category: true },
            distinct: ['category'],
        });
        return result.map(r => r.category).filter(Boolean);
    },
    ['prayer-categories'],
    { revalidate: CACHE_DURATIONS.WEEK, tags: [CACHE_TAGS.PRAYERS] }
);

// ============ DAILY READINGS ============

export const getCachedDailyReading = unstable_cache(
    async (date?: Date) => {
        const targetDate = date || new Date();
        targetDate.setHours(0, 0, 0, 0);

        return db.dailyReading.findUnique({
            where: { date: targetDate },
        });
    },
    ['daily-reading'],
    { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.READINGS] }
);

// ============ STATS ============

export const getCachedStats = unstable_cache(
    async () => {
        const [saintsCount, churchesCount, prayersCount] = await Promise.all([
            db.saint.count(),
            db.church.count(),
            db.prayer.count(),
        ]);

        return {
            saints: saintsCount,
            churches: churchesCount,
            prayers: prayersCount,
        };
    },
    ['stats'],
    { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.SAINTS, CACHE_TAGS.CHURCHES, CACHE_TAGS.PRAYERS] }
);
