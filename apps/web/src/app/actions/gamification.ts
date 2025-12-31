'use server';

import { PrismaClient } from '@mpt/database';
import { revalidatePath } from 'next/cache';
import { isToday, isYesterday } from 'date-fns';

const prisma = new PrismaClient();

export async function checkAndUpdateStreak(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                streakCount: true,
                lastStreakUpdate: true,
                longestStreak: true
            }
        });

        if (!user) return null;

        const now = new Date();
        const lastUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null;

        let newStreak = user.streakCount;
        let shouldUpdate = false;

        // If never updated
        if (!lastUpdate) {
            newStreak = 1;
            shouldUpdate = true;
        } else if (isToday(lastUpdate)) {
            // Already prayed today, no streak change
            shouldUpdate = false;
        } else if (isYesterday(lastUpdate)) {
            // Prayed yesterday, increment streak
            newStreak += 1;
            shouldUpdate = true;
        } else {
            // Missed a day (or more), reset to 1
            newStreak = 1;
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    streakCount: newStreak,
                    longestStreak: Math.max(newStreak, user.longestStreak),
                    lastStreakUpdate: now
                }
            });
            revalidatePath('/');
        }

        return {
            currentStreak: shouldUpdate ? newStreak : user.streakCount,
            prayedToday: isToday(lastUpdate || new Date(0)) || shouldUpdate
        };
    } catch (error) {
        console.error('Streak update failed:', error);
        return null;
    }
}
