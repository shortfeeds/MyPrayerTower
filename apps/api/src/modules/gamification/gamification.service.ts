import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: number;
    type: 'prayers' | 'streak' | 'churches' | 'community';
}

@Injectable()
export class GamificationService {
    // Badge definitions
    readonly BADGES: Badge[] = [
        // Prayer badges
        { id: 'first_prayer', name: 'First Prayer', description: 'Submit your first prayer request', icon: '🙏', requirement: 1, type: 'prayers' },
        { id: 'devoted', name: 'Devoted', description: 'Submit 10 prayer requests', icon: '✨', requirement: 10, type: 'prayers' },
        { id: 'faithful', name: 'Faithful', description: 'Submit 50 prayer requests', icon: '🕯️', requirement: 50, type: 'prayers' },
        { id: 'prayer_warrior', name: 'Prayer Warrior', description: 'Submit 100 prayer requests', icon: '⚔️', requirement: 100, type: 'prayers' },

        // Streak badges
        { id: 'week_streak', name: 'Weekly Devotion', description: '7-day prayer streak', icon: '🔥', requirement: 7, type: 'streak' },
        { id: 'month_streak', name: 'Monthly Devotion', description: '30-day prayer streak', icon: '💎', requirement: 30, type: 'streak' },
        { id: 'quarter_streak', name: 'Steadfast', description: '90-day prayer streak', icon: '👑', requirement: 90, type: 'streak' },
        { id: 'year_streak', name: 'Legendary', description: '365-day prayer streak', icon: '🏆', requirement: 365, type: 'streak' },

        // Church badges
        { id: 'explorer', name: 'Explorer', description: 'Save 5 churches', icon: '🗺️', requirement: 5, type: 'churches' },
        { id: 'pilgrim', name: 'Pilgrim', description: 'Save 25 churches', icon: '🚶', requirement: 25, type: 'churches' },

        // Community badges
        { id: 'helper', name: 'Helper', description: 'Pray for 10 others', icon: '🤝', requirement: 10, type: 'community' },
        { id: 'intercessor', name: 'Intercessor', description: 'Pray for 100 others', icon: '🌟', requirement: 100, type: 'community' },
        { id: 'community_pillar', name: 'Community Pillar', description: 'Pray for 500 others', icon: '🏛️', requirement: 500, type: 'community' },
    ];

    constructor(private prisma: PrismaService) { }

    /**
     * Get user's gamification stats
     */
    async getUserStats(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                currentStreak: true,
                longestStreak: true,
                lastPrayerDate: true,
                totalPrayers: true,
                totalPrayedFor: true,
                level: true,
                xp: true,
            },
        });

        const badges = await this.prisma.userBadge.findMany({
            where: { userId },
            orderBy: { earnedAt: 'desc' },
        });

        const savedChurches = await this.prisma.savedChurch.count({
            where: { userId },
        });

        return {
            user,
            badges: badges.map(b => ({
                ...this.BADGES.find(badge => badge.id === b.badgeId),
                earnedAt: b.earnedAt,
            })),
            availableBadges: this.BADGES.filter(
                badge => !badges.some(b => b.badgeId === badge.id)
            ),
            stats: {
                prayers: user?.totalPrayers || 0,
                streak: user?.currentStreak || 0,
                longestStreak: user?.longestStreak || 0,
                savedChurches,
                prayedFor: user?.totalPrayedFor || 0,
                level: user?.level || 1,
                xp: user?.xp || 0,
                xpToNextLevel: this.getXpForLevel((user?.level || 1) + 1),
            },
        };
    }

    /**
     * Record prayer activity and update streak
     */
    async recordPrayerActivity(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { lastPrayerDate: true, currentStreak: true, longestStreak: true, xp: true, level: true },
        });

        if (!user) return;

        const lastPrayer = user.lastPrayerDate ? new Date(user.lastPrayerDate) : null;
        lastPrayer?.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let newStreak = user.currentStreak || 0;

        if (!lastPrayer || lastPrayer < yesterday) {
            // Streak broken, start new
            newStreak = 1;
        } else if (lastPrayer.getTime() === yesterday.getTime()) {
            // Continue streak
            newStreak += 1;
        }
        // If same day, don't update streak

        const newXp = (user.xp || 0) + 10; // 10 XP per prayer
        const newLevel = this.calculateLevel(newXp);

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                lastPrayerDate: today,
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, user.longestStreak || 0),
                totalPrayers: { increment: 1 },
                xp: newXp,
                level: newLevel,
            },
        });

        // Check for new badges
        await this.checkAndAwardBadges(userId);

        return { streak: newStreak, xp: newXp, level: newLevel };
    }

    /**
     * Record praying for someone else
     */
    async recordPrayedForOther(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                totalPrayedFor: { increment: 1 },
                xp: { increment: 5 }, // 5 XP for praying for others
            },
        });

        await this.checkAndAwardBadges(userId);
    }

    /**
     * Check and award earned badges
     */
    async checkAndAwardBadges(userId: string) {
        const stats = await this.getUserStats(userId);
        const earnedBadgeIds = stats.badges.map((b: any) => b.id);
        const newBadges: Badge[] = [];

        for (const badge of this.BADGES) {
            if (earnedBadgeIds.includes(badge.id)) continue;

            let earned = false;

            switch (badge.type) {
                case 'prayers':
                    earned = stats.stats.prayers >= badge.requirement;
                    break;
                case 'streak':
                    earned = stats.stats.longestStreak >= badge.requirement;
                    break;
                case 'churches':
                    earned = stats.stats.savedChurches >= badge.requirement;
                    break;
                case 'community':
                    earned = stats.stats.prayedFor >= badge.requirement;
                    break;
            }

            if (earned) {
                await this.prisma.userBadge.create({
                    data: { userId, badgeId: badge.id },
                });
                newBadges.push(badge);
            }
        }

        return newBadges;
    }

    /**
     * Get leaderboard
     */
    async getLeaderboard(type: 'streak' | 'prayers' | 'community' = 'streak', limit = 50) {
        const orderBy = type === 'streak' ? 'currentStreak'
            : type === 'prayers' ? 'totalPrayers'
                : 'totalPrayedFor';

        return this.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                currentStreak: true,
                totalPrayers: true,
                totalPrayedFor: true,
                level: true,
            },
            orderBy: { [orderBy]: 'desc' },
            take: limit,
        });
    }

    /**
     * Reset broken streaks daily
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async resetBrokenStreaks() {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        await this.prisma.user.updateMany({
            where: {
                lastPrayerDate: { lt: twoDaysAgo },
                currentStreak: { gt: 0 },
            },
            data: { currentStreak: 0 },
        });
    }

    private calculateLevel(xp: number): number {
        // Level formula: level = floor(sqrt(xp / 100)) + 1
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }

    private getXpForLevel(level: number): number {
        return Math.pow(level - 1, 2) * 100;
    }
}
