'use server';

import { PrismaClient } from '@mpt/database';
import { getTodaysCelebrations, LiturgicalDay } from '@/lib/romcal';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export interface HomeData {
    liturgicalDay: LiturgicalDay;
    reading: any | null;
    saint: any | null;
    user: {
        firstName: string | null;
        streak: number;
        prayedToday: boolean;
    } | null;
}

export async function getLiturgicalData(): Promise<LiturgicalDay> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        return await getTodaysCelebrations();
    } catch (e) {
        console.error('Error fetching liturgical day:', e);
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
}

export async function getDailyReading() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.dailyReading.findUnique({
        where: { date: today },
    });
}

export async function getSaintOfTheDay(celebrationName?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let saint = null;

    // Try to match by celebration name
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

    // Try to match by today's feast day
    if (!saint) {
        saint = await prisma.saint.findFirst({
            where: {
                feastMonth: today.getMonth() + 1,
                feastDayOfMonth: today.getDate(),
            }
        });
    }

    // ALWAYS show a saint - fallback to a random popular saint
    if (!saint) {
        // Get a saint based on day of year for consistency (same saint all day)
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        const saintCount = await prisma.saint.count();
        const skipIndex = dayOfYear % Math.max(saintCount, 1);

        saint = await prisma.saint.findFirst({
            skip: skipIndex,
            take: 1,
            orderBy: { id: 'asc' }
        });
    }

    return saint;
}

export async function getUserHomeStreamData() {
    // Mock user data
    return {
        firstName: 'Ronald',
        streak: 12,
        prayedToday: false,
    };
}

export async function getHomeData(): Promise<HomeData> {
    // Parallel fetch for better performance
    const liturgicalDay = await getLiturgicalData();

    // We can run reading and saint fetch in parallel
    // Saint fetch might benefit from liturgical data, but we can also just fetch by date as fallback in parallel
    // To be most accurate, we wait for liturgicalDay to get the celebration name

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

export async function getRandomTrendingPrayers(limit = 10) {
    try {
        // Get count of active prayers
        const count = await prisma.prayer.count({
            where: { is_active: true }
        });

        // Get random valid offsets
        const maxOffset = Math.max(0, count - limit);
        const randomSkip = Math.floor(Math.random() * maxOffset);

        // For better randomness if table is small, we could fetch all IDs and pick random,
        // but skipping by a random amount is a decent approximation for now if we want "trending" which usually implies a set.
        // Actually, to make it truly random each load (10 random items), we need a different approach.
        // If the table is small (<1000), fetching all IDs is fine.

        let prayers;

        if (count <= limit) {
            prayers = await prisma.prayer.findMany({
                where: { is_active: true },
                take: limit,
            });
        } else {
            // Use raw query for true randomness which is efficient for larger datasets too
            // CAST(id AS TEXT) is needed because BigInt cannot be serialized directly by queryRaw in some versions/configs easily
            // adjusting to use findMany with random ID selection or just shuffling 

            // Strategy: fetch all IDs (lightweight), pick 10 random IDs, then fetch those.
            const allIds = await prisma.prayer.findMany({
                where: { is_active: true },
                select: { id: true }
            });

            const shuffled = allIds.sort(() => 0.5 - Math.random());
            const selectedIds = shuffled.slice(0, limit).map(p => p.id);

            prayers = await prisma.prayer.findMany({
                where: { id: { in: selectedIds } }
            });
        }

        // Transform for UI
        return prayers.map(p => ({
            id: p.id.toString(), // Handle BigInt
            title: p.title,
            subtitle: p.category_label || p.category, // Fallback
            slug: p.slug || '',
            // Generate some consistent but varied metadata based on ID
            users: (100 + (Number(p.id) % 900) * 3).toLocaleString('en-US'),
        }));

    } catch (error) {
        console.error('Error fetching trending prayers:', error);
        return [];
    }
}
