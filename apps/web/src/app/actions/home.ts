'use server';

import { PrismaClient } from '@mpt/database';
import { getTodaysCelebrations, LiturgicalDay } from '@/lib/romcal';
import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';

const prisma = new PrismaClient();

// --- Types ---

export interface HomeData {
    liturgicalDay: LiturgicalDay;
    reading: SerializedDailyReading | null;
    saint: SerializedSaint | null;
    user: {
        firstName: string | null;
        streak: number;
        prayedToday: boolean;
    } | null;
}

export interface SerializedDailyReading {
    id: string;
    date: string; // ISO string
    citation: string;
    text: string;
    // Keep other fields if needed, but ensure they are serializable
    liturgicalColor?: string | null;
    feastName?: string | null;
}

export interface SerializedSaint {
    id: string;
    name: string;
    slug: string;
    title: string;
    imageUrl: string | null;
    shortBio: string;
    // Serialized dates if needed, or omit if not used
}

// --- Cached Data Fetchers ---

/**
 * Get Liturgical Data (Cached 24h)
 */
export const getLiturgicalData = unstable_cache(
    async (): Promise<LiturgicalDay> => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log('[Home] Fetching Liturgical Data');
        try {
            return await getTodaysCelebrations();
        } catch (e) {
            console.error('Error fetching liturgical day:', e);
            // Fallback
            return {
                date: today.toISOString().split('T')[0],
                season: 'Ordinary Time',
                seasonKey: 'ORDINARY_TIME',
                seasonColor: '#008000',
                weekOfSeason: 1,
                dayOfWeek: 'Sunday',
                celebrations: [],
                isHolyDayOfObligation: false,
            };
        }
    },
    ['home-liturgical-data'],
    { revalidate: 86400, tags: ['liturgical'] }
);

/**
 * Get Daily Reading (Cached 24h)
 * Serializes dates and maps fields for UI
 */
export const getDailyReading = unstable_cache(
    async (): Promise<SerializedDailyReading | null> => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log('[Home] Fetching Daily Reading');

        try {
            const reading = await prisma.dailyReading.findUnique({
                where: { date: today },
            });

            if (!reading) return null;

            // Map and Serialize
            return {
                id: reading.id,
                date: reading.date.toISOString(),
                // Map gospelRef/gospel to citation/text as expected by widgets
                citation: reading.gospelRef || reading.firstReadingRef || "Daily Reading",
                text: reading.gospel || reading.firstReading || "Read full text...",
                liturgicalColor: reading.liturgicalColor,
                feastName: reading.feastName
            };
        } catch (error) {
            console.error('Error fetching daily reading:', error);
            return null;
        }
    },
    ['home-daily-reading'], // Add date specific key if we want to force refresh daily? unstable_cache handles reval
    { revalidate: 3600, tags: ['readings'] } // Revalidate hourly to catch updates
);

/**
 * Get Saint of the Day (Cached 24h)
 * Serializes dates and maps fields
 */
export const getSaintOfTheDay = unstable_cache(
    async (celebrationName?: string): Promise<SerializedSaint | null> => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log('[Home] Fetching Saint of Day');

        try {
            let saint = null;

            // 1. Try by celebration name
            if (celebrationName) {
                saint = await prisma.saint.findFirst({
                    where: {
                        name: {
                            contains: celebrationName.replace('St. ', 'Saint '),
                            mode: 'insensitive',
                        }
                    }
                });
            }

            // 2. Try by feast date
            if (!saint) {
                saint = await prisma.saint.findFirst({
                    where: {
                        feastMonth: today.getMonth() + 1,
                        feastDayOfMonth: today.getDate(),
                    }
                });
            }

            // 3. Fallback to daily rotation
            if (!saint) {
                const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
                const saintCount = await prisma.saint.count();
                if (saintCount > 0) {
                    const skipIndex = dayOfYear % saintCount;
                    saint = await prisma.saint.findFirst({
                        skip: skipIndex,
                        take: 1,
                        orderBy: { id: 'asc' }
                    });
                }
            }

            if (!saint) return null;

            return {
                id: saint.id,
                name: saint.name,
                slug: saint.slug,
                title: saint.title || "Saint of God",
                imageUrl: saint.imageUrl,
                shortBio: saint.shortBio || (saint.biography ? saint.biography.substring(0, 150) + "..." : "Pray for us.")
            };

        } catch (error) {
            console.error('Error fetching saint:', error);
            return null;
        }
    },
    ['home-saint-of-day'],
    { revalidate: 3600, tags: ['saints'] }
);

/**
 * Get Random Trending Prayers (Cached 1h)
 * Ensures serializable ID
 */
export const getRandomTrendingPrayers = unstable_cache(
    async (limit = 10) => {
        console.log('[Home] Fetching Trending Prayers');
        try {
            const count = await prisma.prayer.count({
                where: { is_active: true }
            });

            if (count === 0) return [];

            let prayers;

            // Strategy: Get IDs to pick randomly
            // Using findMany with take/skip is slow for large offsets, 
            // but for "trending" we might just want "popular" ones? 
            // The previous logic tried random skip. Let's keep it simple and safe.

            if (count <= limit) {
                prayers = await prisma.prayer.findMany({
                    where: { is_active: true },
                    take: limit,
                });
            } else {
                // Fetch a batch of IDs (e.g. up to 1000) and pick random ones from JS
                // optimize: limit ID fetch
                const ids = await prisma.prayer.findMany({
                    where: { is_active: true },
                    select: { id: true },
                    take: 1000 // Sample size
                });

                // Shuffle in memory
                const shuffled = ids.sort(() => 0.5 - Math.random()).slice(0, limit);
                const selectedIds = shuffled.map(p => p.id);

                prayers = await prisma.prayer.findMany({
                    where: { id: { in: selectedIds } }
                });
            }

            return prayers.map(p => ({
                id: p.id.toString(), // CRITICAL: BigInt -> String
                title: p.title,
                subtitle: p.category_label || p.category,
                slug: p.slug || '',
                users: (100 + (Number(p.id) % 900) * 3).toLocaleString('en-US'),
            }));

        } catch (error) {
            console.error('Error fetching trending prayers:', error);
            return [];
        }
    },
    ['home-trending-prayers'],
    { revalidate: 3600, tags: ['prayers'] }
);

// --- User Data (Not cached globally, specific to user) ---

export async function getUserHomeStreamData() {
    // This cannot be cached with unstable_cache easily as it depends on cookies
    // Could use request memoization if needed
    const user = await cookies().then(c => c.get('user_session'));

    // Mock or Real fetch
    // Implementation of real fetch if needed

    // Returning dummy for now as per original file, or basic user if we had auth
    return {
        firstName: 'Friend', // Default
        streak: 0,
        prayedToday: false,
    };
}

export async function getHomeData(): Promise<HomeData> {
    const liturgicalDay = await getLiturgicalData();

    const [reading, saint, user] = await Promise.all([
        getDailyReading(),
        getSaintOfTheDay(liturgicalDay.celebrations[0]?.name),
        getUserHomeStreamData()
    ]);

    return {
        liturgicalDay,
        reading,
        saint,
        user,
    };
}
