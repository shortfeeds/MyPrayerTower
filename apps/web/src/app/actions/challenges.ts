'use server';

import { PrismaClient } from '@mpt/database';
import { cookies } from 'next/headers';
import { getUserFromCookie } from '@/lib/auth';

const prisma = new PrismaClient();

export type Challenge = {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    imageUrl: string | null;
    type: string;
    duration: number;
    startDate: Date | null;
    endDate: Date | null;
    isActive: boolean;
    isPremium: boolean;
    dailyAction: string;
    reward: string | null;
    participantCount: number;
    isJoined?: boolean;
    userProgress?: {
        currentDay: number;
        status: string;
    };
};

// Get all active challenges
export async function getChallenges(): Promise<Challenge[]> {
    const user = await getUserFromCookie();

    const challenges = await prisma.prayerChallenge.findMany({
        where: { isActive: true },
        orderBy: [
            { participantCount: 'desc' },
            { createdAt: 'desc' }
        ]
    });

    if (user) {
        const userChallenges = await prisma.userChallenge.findMany({
            where: { userId: user.id },
            select: { challengeId: true, currentDay: true, status: true }
        });

        const userChallengeMap = new Map(
            userChallenges.map(uc => [uc.challengeId, { currentDay: uc.currentDay, status: uc.status }])
        );

        return challenges.map(c => ({
            ...c,
            isJoined: userChallengeMap.has(c.id),
            userProgress: userChallengeMap.get(c.id)
        }));
    }

    return challenges;
}

// Get single challenge by slug
export async function getChallengeBySlug(slug: string): Promise<Challenge | null> {
    const user = await getUserFromCookie();

    const challenge = await prisma.prayerChallenge.findUnique({
        where: { slug }
    });

    if (!challenge) return null;

    if (user) {
        const userChallenge = await prisma.userChallenge.findUnique({
            where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } }
        });

        return {
            ...challenge,
            isJoined: !!userChallenge,
            userProgress: userChallenge ? {
                currentDay: userChallenge.currentDay,
                status: userChallenge.status
            } : undefined
        };
    }

    return challenge;
}

// Join a challenge
export async function joinChallenge(challengeId: string) {
    const user = await getUserFromCookie();
    if (!user) throw new Error('Please login to join a challenge');

    // Check if already joined
    const existing = await prisma.userChallenge.findUnique({
        where: { userId_challengeId: { userId: user.id, challengeId } }
    });

    if (existing) throw new Error('You have already joined this challenge');

    // Create user challenge and increment participant count
    await prisma.$transaction([
        prisma.userChallenge.create({
            data: {
                userId: user.id,
                challengeId,
                status: 'IN_PROGRESS'
            }
        }),
        prisma.prayerChallenge.update({
            where: { id: challengeId },
            data: { participantCount: { increment: 1 } }
        })
    ]);

    return { success: true };
}

// Check-in for today's challenge
export async function challengeCheckIn(challengeId: string, notes?: string) {
    const user = await getUserFromCookie();
    if (!user) throw new Error('Please login first');

    const userChallenge = await prisma.userChallenge.findUnique({
        where: { userId_challengeId: { userId: user.id, challengeId } },
        include: { Challenge: true }
    });

    if (!userChallenge) throw new Error('You have not joined this challenge');
    if (userChallenge.status !== 'IN_PROGRESS') throw new Error('Challenge is not in progress');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if already checked in today
    if (userChallenge.lastCheckIn) {
        const lastCheckInDate = new Date(userChallenge.lastCheckIn);
        const lastCheckInDay = new Date(lastCheckInDate.getFullYear(), lastCheckInDate.getMonth(), lastCheckInDate.getDate());
        if (lastCheckInDay.getTime() === today.getTime()) {
            throw new Error('You have already checked in today');
        }
    }

    const newDay = userChallenge.currentDay + 1;
    const isCompleted = newDay >= userChallenge.Challenge.duration;

    await prisma.$transaction([
        prisma.challengeCheckIn.create({
            data: {
                userChallengeId: userChallenge.id,
                day: newDay,
                notes
            }
        }),
        prisma.userChallenge.update({
            where: { id: userChallenge.id },
            data: {
                currentDay: newDay,
                lastCheckIn: now,
                streakCount: { increment: 1 },
                status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
                completedAt: isCompleted ? now : null
            }
        })
    ]);

    // Update user streak
    await prisma.user.update({
        where: { id: user.id },
        data: {
            streakCount: { increment: 1 },
            lastStreakUpdate: now
        }
    });

    return { success: true, day: newDay, isCompleted };
}

// Get leaderboard
export async function getLeaderboard(period: 'weekly' | 'monthly' = 'weekly') {
    const now = new Date();
    const year = now.getFullYear();
    const week = Math.ceil((now.getDate() + new Date(year, now.getMonth(), 1).getDay()) / 7);
    const month = now.getMonth() + 1;

    const periodKey = period === 'weekly'
        ? `weekly_${year}_${String(month).padStart(2, '0')}_${String(week).padStart(2, '0')}`
        : `monthly_${year}_${String(month).padStart(2, '0')}`;

    const entries = await prisma.leaderboard.findMany({
        where: { period: periodKey },
        orderBy: { score: 'desc' },
        take: 100,
        include: {
            User: {
                select: {
                    id: true,
                    displayName: true,
                    firstName: true,
                    avatarUrl: true
                }
            }
        }
    });

    return entries.map((entry, index) => ({
        rank: index + 1,
        score: entry.score,
        user: {
            id: entry.User.id,
            name: entry.User.displayName || entry.User.firstName || 'Anonymous',
            avatarUrl: entry.User.avatarUrl
        }
    }));
}

// Get user achievements
export async function getUserAchievements() {
    const user = await getUserFromCookie();
    if (!user) return [];

    const achievements = await prisma.userAchievement.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });

    return achievements;
}
