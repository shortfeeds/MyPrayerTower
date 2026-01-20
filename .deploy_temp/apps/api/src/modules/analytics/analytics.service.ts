import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get global platform analytics
     */
    async getPlatformStats() {
        const [users, churches, prayers, prayerActions, candles, testimonies] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.church.count(),
            this.prisma.prayerRequest.count({ where: { status: 'APPROVED' } }),
            this.prisma.prayerAction.count(),
            this.prisma.prayerCandle.count(),
            this.prisma.testimony.count({ where: { status: 'APPROVED' } }),
        ]);

        // Get trends (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [newUsers, newPrayers] = await Promise.all([
            this.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
            this.prisma.prayerRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        ]);

        return {
            totalUsers: users,
            totalChurches: churches,
            totalPrayers: prayers,
            totalPrayerActions: prayerActions,
            totalCandles: candles,
            totalTestimonies: testimonies,
            monthlyNewUsers: newUsers,
            monthlyNewPrayers: newPrayers,
        };
    }

    /**
     * Get prayer wall heatmap data
     */
    async getPrayerHeatmap(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const prayers = await this.prisma.prayerRequest.groupBy({
            by: ['createdAt'],
            where: { createdAt: { gte: startDate } },
            _count: true,
        });

        // Aggregate by date
        const heatmap: Record<string, number> = {};
        for (const p of prayers) {
            const date = p.createdAt.toISOString().split('T')[0];
            heatmap[date] = (heatmap[date] || 0) + p._count;
        }

        return Object.entries(heatmap).map(([date, count]) => ({ date, count }));
    }

    /**
     * Get top categories
     */
    async getTopCategories(limit = 10) {
        const categories = await this.prisma.prayerRequest.groupBy({
            by: ['category'],
            _count: true,
            orderBy: { _count: { category: 'desc' } },
            take: limit,
        });

        return categories.map(c => ({
            category: c.category || 'Other',
            count: c._count,
        }));
    }

    /**
     * Get geographic distribution
     */
    async getGeographicDistribution() {
        const countries = await this.prisma.church.groupBy({
            by: ['country'],
            _count: true,
            orderBy: { _count: { country: 'desc' } },
            take: 20,
        });

        return countries.map(c => ({
            country: c.country || 'Unknown',
            churches: c._count,
        }));
    }

    /**
     * Get user engagement metrics
     */
    async getUserEngagement() {
        // Active users (prayed in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [activeUsers, streakDistribution] = await Promise.all([
            this.prisma.user.count({
                where: { lastPrayerDate: { gte: sevenDaysAgo } },
            }),
            this.prisma.user.groupBy({
                by: ['currentStreak'],
                where: { currentStreak: { gt: 0 } },
                _count: true,
            }),
        ]);

        // Group streaks into buckets
        const streakBuckets = { '1-7': 0, '8-30': 0, '31-90': 0, '90+': 0 };
        for (const s of streakDistribution) {
            if (s.currentStreak <= 7) streakBuckets['1-7'] += s._count;
            else if (s.currentStreak <= 30) streakBuckets['8-30'] += s._count;
            else if (s.currentStreak <= 90) streakBuckets['31-90'] += s._count;
            else streakBuckets['90+'] += s._count;
        }

        return {
            weeklyActiveUsers: activeUsers,
            streakDistribution: streakBuckets,
        };
    }

    /**
     * Get revenue analytics
     */
    async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
        const where = {
            status: 'COMPLETED' as const,
            ...(startDate && endDate ? {
                createdAt: { gte: startDate, lte: endDate },
            } : {}),
        };

        const [subscriptions, donations] = await Promise.all([
            this.prisma.user.count({ where: { subscriptionTier: { not: 'free' } } }),
            this.prisma.donation.aggregate({
                where,
                _sum: { amount: true },
                _count: true,
            }),
        ]);

        return {
            premiumSubscribers: subscriptions,
            totalDonations: donations._sum.amount || 0,
            donationCount: donations._count,
            formattedDonations: `$${((donations._sum.amount || 0) / 100).toFixed(2)}`,
        };
    }
}
