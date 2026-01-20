import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    lastPrayerDate: Date | null;
    streakActive: boolean;
}

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date | null;
    requirement: number;
    type: 'STREAK' | 'PRAYERS' | 'COMMUNITY' | 'SPECIAL';
}

const BADGES: Omit<Badge, 'unlockedAt'>[] = [
    // Streak Badges
    { id: 'streak_7', name: 'Week Warrior', description: '7-day prayer streak', icon: '🔥', requirement: 7, type: 'STREAK' },
    { id: 'streak_30', name: 'Monthly Devotion', description: '30-day prayer streak', icon: '⭐', requirement: 30, type: 'STREAK' },
    { id: 'streak_100', name: 'Century of Faith', description: '100-day prayer streak', icon: '💎', requirement: 100, type: 'STREAK' },
    { id: 'streak_365', name: 'Year of Grace', description: '365-day prayer streak', icon: '👑', requirement: 365, type: 'STREAK' },

    // Prayer Count Badges
    { id: 'prayers_10', name: 'Prayer Beginner', description: 'Submit 10 prayers', icon: '🙏', requirement: 10, type: 'PRAYERS' },
    { id: 'prayers_50', name: 'Prayer Warrior', description: 'Submit 50 prayers', icon: '⚔️', requirement: 50, type: 'PRAYERS' },
    { id: 'prayers_100', name: 'Prayer Champion', description: 'Submit 100 prayers', icon: '🏆', requirement: 100, type: 'PRAYERS' },

    // Community Badges
    { id: 'prayed_10', name: 'Community Support', description: 'Pray for 10 others', icon: '❤️', requirement: 10, type: 'COMMUNITY' },
    { id: 'prayed_100', name: 'Prayer Partner', description: 'Pray for 100 others', icon: '💕', requirement: 100, type: 'COMMUNITY' },

    // Special Badges
    { id: 'first_prayer', name: 'First Steps', description: 'Submit your first prayer', icon: '🌱', requirement: 1, type: 'SPECIAL' },
    { id: 'first_church', name: 'Parish Member', description: 'Follow your first church', icon: '⛪', requirement: 1, type: 'SPECIAL' },
];

@Injectable()
export class StreakService {
    private readonly logger = new Logger(StreakService.name);

    constructor(private prisma: PrismaService) { }

    async getUserStreak(userId: string): Promise<StreakData> {
        // Get user's prayer activity
        const prayers = await this.prisma.prayerRequest.findMany({
            where: { userId },
            select: { createdAt: true },
            orderBy: { createdAt: 'desc' }
        });

        if (prayers.length === 0) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                totalDays: 0,
                lastPrayerDate: null,
                streakActive: false,
            };
        }

        // Get unique prayer days
        const prayerDays = new Set(
            prayers.map(p => p.createdAt.toISOString().split('T')[0])
        );

        const sortedDays = Array.from(prayerDays).sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Calculate current streak
        let currentStreak = 0;
        let checkDate = sortedDays[0] === today || sortedDays[0] === yesterday ? sortedDays[0] : null;

        if (checkDate) {
            for (const day of sortedDays) {
                if (day === checkDate) {
                    currentStreak++;
                    checkDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
                } else if (day < checkDate) {
                    break;
                }
            }
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 1;
        const allDays = Array.from(prayerDays).sort();

        for (let i = 1; i < allDays.length; i++) {
            const diff = (new Date(allDays[i]).getTime() - new Date(allDays[i - 1]).getTime()) / 86400000;
            if (diff === 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        const streakActive = sortedDays[0] === today || sortedDays[0] === yesterday;

        return {
            currentStreak,
            longestStreak,
            totalDays: prayerDays.size,
            lastPrayerDate: prayers[0].createdAt,
            streakActive,
        };
    }

    async getUserBadges(userId: string): Promise<Badge[]> {
        const streakData = await this.getUserStreak(userId);

        // Get prayer counts
        const prayerCount = await this.prisma.prayerRequest.count({ where: { userId } });
        const prayedForCount = await this.prisma.prayerAction.count({
            where: { userId }
        });
        const followedChurches = await this.prisma.churchFollower.count({ where: { userId } });

        const badges: Badge[] = BADGES.map(badge => {
            let unlocked = false;

            switch (badge.type) {
                case 'STREAK':
                    unlocked = streakData.longestStreak >= badge.requirement;
                    break;
                case 'PRAYERS':
                    unlocked = prayerCount >= badge.requirement;
                    break;
                case 'COMMUNITY':
                    unlocked = prayedForCount >= badge.requirement;
                    break;
                case 'SPECIAL':
                    if (badge.id === 'first_prayer') unlocked = prayerCount >= 1;
                    if (badge.id === 'first_church') unlocked = followedChurches >= 1;
                    break;
            }

            return {
                ...badge,
                unlockedAt: unlocked ? new Date() : null, // In production, store actual unlock dates
            };
        });

        return badges;
    }

    async recordPrayerActivity(userId: string) {
        // This would be called after any prayer action
        // Can trigger streak updates, badge checks, etc.
        this.logger.log(`Recording prayer activity for user ${userId}`);

        // Check for new badges
        const badges = await this.getUserBadges(userId);
        const newBadges = badges.filter(b => b.unlockedAt);

        // In production, compare with stored badges and notify of new ones
        return { newBadges: newBadges.length };
    }

    // Daily job to reset broken streaks
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async processStreaks() {
        this.logger.log('Processing daily streak updates');
        // In production, this would update streak records in the database
    }
}
