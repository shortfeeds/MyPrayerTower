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
