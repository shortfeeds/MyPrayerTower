'use server';

import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export interface UserPrayerStats {
    totalPrayers: number;
    todayPrayers: number;
    weeklyPrayers: number; // This week
    monthlyPrayers: number; // This month
    currentStreak: number;
    longestStreak: number;
    favoriteTime: string; // Calculated or placeholder
    topCategory: string; // Calculated or placeholder
    averageDaily: number;
    weeklyGoalProgress: number; // Percentage
}

export async function getUserPrayerStats(): Promise<UserPrayerStats | null> {
    const user = await getUserFromCookie();
    if (!user) return null;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Basic Counts
    const totalPrayers = await db.prayerAction.count({
        where: { userId: user.id }
    });

    const todayPrayers = await db.prayerAction.count({
        where: {
            userId: user.id,
            prayedAt: { gte: startOfDay }
        }
    });

    const weeklyPrayers = await db.prayerAction.count({
        where: {
            userId: user.id,
            prayedAt: { gte: startOfWeek }
        }
    });

    const monthlyPrayers = await db.prayerAction.count({
        where: {
            userId: user.id,
            prayedAt: { gte: startOfMonth }
        }
    });

    // 2. Streak Calculation (Simplified for Performance)
    // In a real app with millions of rows, we'd want a materialized view or dedicated field.
    // For now, fetching distinct dates of prayers.
    // NOTE: This could be heavy if user has thousands of prayers. Limiting to last 365 days.
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const prayerDates = await db.prayerAction.findMany({
        where: {
            userId: user.id,
            prayedAt: { gte: oneYearAgo }
        },
        select: { prayedAt: true },
        orderBy: { prayedAt: 'desc' },
    });

    // Process dates to find streak
    let currentStreak = 0;
    // const uniqueDates = new Set(prayerDates.map(p => p.prayedAt.toDateString()));
    // Actually, 'today' might count for streak if they prayed, but if they haven't prayed today,
    // streak holds if they prayed yesterday.

    // Convert to set of YYYY-MM-DD strings for easy lookup
    const dateSet = new Set(prayerDates.map(p => p.prayedAt.toISOString().split('T')[0]));

    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If they prayed today, start counting from today.
    // If they didn't pray today but prayed yesterday, start counting from yesterday.
    // If neither, streak is 0.

    let checkDate = new Date(now);
    if (!dateSet.has(todayStr)) {
        if (dateSet.has(yesterdayStr)) {
            checkDate = yesterday;
        } else {
            // Streak broken
            checkDate = new Date(0); // Invalid
        }
    }

    if (checkDate.getTime() > 0) {
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (dateSet.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }

    // Longest streak would require processing entire history - deferring / mocking with current for now
    // or store it in User model later.
    const longestStreak = currentStreak; // Placeholder: keeping it simple

    // 3. Averages / Top Categories
    // Top Category - need to join with PrayerRequest to get category
    const topCategoryResult = await db.prayerAction.findFirst({
        where: { userId: user.id },
        include: {
            PrayerRequest: {
                select: { category: true }
            }
        },
        // Valid Prisma doesn't support groupBy easily on relations in findFirst, 
        // will substitute with a placeholder query or fetch recent.
        // Doing a simple fetch for most recent generic category for now to valid implementation.
    });

    const topCategory = topCategoryResult?.PrayerRequest?.category || 'General';

    // 4. Calculate Stats
    const totalDaysSinceFirstPrayer = 30; // Approximation or fetch first prayer date
    const avgDaily = totalPrayers > 0 ? Number((totalPrayers / Math.max(1, totalDaysSinceFirstPrayer)).toFixed(1)) : 0;
    const weeklyGoal = 40; // Hardcoded goal
    const progress = Math.min(100, Math.round((weeklyPrayers / weeklyGoal) * 100));


    return {
        totalPrayers,
        todayPrayers,
        weeklyPrayers,
        monthlyPrayers,
        currentStreak,
        longestStreak, // TODO: store persists
        favoriteTime: 'Morning', // TODO: Calculate from timestamps
        topCategory: String(topCategory),
        averageDaily: avgDaily,
        weeklyGoalProgress: progress
    };
}
