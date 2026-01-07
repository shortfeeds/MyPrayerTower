import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('user-id')?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                streakCount: true,
                longestStreak: true,
                lastStreakUpdate: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        const now = new Date();
        const lastUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null;

        // Simple day comparison (ignoring timezone for MVP, or assuming server time)
        // Ideally pass client timezone offset
        const isToday = lastUpdate &&
            lastUpdate.getDate() === now.getDate() &&
            lastUpdate.getMonth() === now.getMonth() &&
            lastUpdate.getFullYear() === now.getFullYear();

        const isYesterday = lastUpdate && (() => {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            return lastUpdate.getDate() === yesterday.getDate() &&
                lastUpdate.getMonth() === yesterday.getMonth() &&
                lastUpdate.getFullYear() === yesterday.getFullYear();
        })();

        let newStreak = user.streakCount;
        let newLongest = user.longestStreak;

        if (isToday) {
            // Already updated today, do nothing
            return NextResponse.json({
                success: true,
                streakCount: newStreak,
                longestStreak: newLongest,
                message: 'Streak already updated today'
            });
        }

        if (isYesterday || !lastUpdate) {
            // Prayed yesterday or first time, increment/start
            // Determine if first time (streak 0) -> becomes 1
            // If prayed yesterday (streak N) -> becomes N+1
            // If !lastUpdate (never prayed) -> becomes 1

            // Wait, if !lastUpdate, it's 1.
            // If isYesterday, increment.
            // Actually, if !lastUpdate, it's 1.

            if (isYesterday) {
                newStreak += 1;
            } else if (!lastUpdate) {
                newStreak = 1;
            } else {
                // Missed a day or more (logic covered below)
                // But wait, if it's not today, not yesterday, and lastUpdate exists...
                // It means missed streak.
            }
        }

        // Re-evaluating logic
        if (!lastUpdate) {
            newStreak = 1;
        } else if (isYesterday) {
            newStreak += 1;
        } else if (!isToday) {
            // Missed a day (or more), reset to 1
            newStreak = 1;
        }

        if (newStreak > newLongest) {
            newLongest = newStreak;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                streakCount: newStreak,
                longestStreak: newLongest,
                lastStreakUpdate: now,
            },
            select: {
                streakCount: true,
                longestStreak: true,
                lastStreakUpdate: true,
            }
        });

        return NextResponse.json({
            success: true,
            streakCount: updatedUser.streakCount,
            longestStreak: updatedUser.longestStreak,
            lastStreakUpdate: updatedUser.lastStreakUpdate,
            message: 'Streak updated'
        });

    } catch (error) {
        console.error('Streak update error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update streak' },
            { status: 500 }
        );
    }
}
