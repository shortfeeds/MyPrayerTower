'use server';

import { db } from '@/lib/db';
import { startOfMonth, subMonths, format, startOfDay, subDays } from 'date-fns';
 
// Hard Reset Date for Fresh App Start (April 2026)
const REVENUE_START_DATE = new Date('2026-04-01T00:00:00Z');

export interface RevenueBreakdown {
    type: string;
    amount: number;
    count: number;
}

export interface RevenueStats {
    totalRevenue: number;
    massOfferingsRevenue: number;
    donationsRevenue: number;
    subscriptionsRevenue: number;
    growthPercent: number;
    avgOrderValue: number;
    topOfferingType: string;
    topDonationTier: string;
    massBreakdown: RevenueBreakdown[];
    donationBreakdown: RevenueBreakdown[];
}

export interface RevenueData {
    period: string; // e.g. "Jan 2024" or "2024-01-15"
    massOfferings: number;
    donations: number;
    subscriptions: number;
    total: number;
}

export async function getRevenueStats(): Promise<RevenueStats> {
    try {
        // 1. Fetch Aggregates and Breakdowns in Parallel for Maximum Speed
        const [
            massStats, 
            donationStats, 
            subStats, 
            candleStats,
            massGroups,
            donationGroups
        ] = await Promise.all([
            db.massOffering.aggregate({
                where: { status: 'PAID', createdAt: { gte: REVENUE_START_DATE } },
                _sum: { amount: true },
                _count: true
            }),
            db.platformDonation.aggregate({
                where: { status: 'COMPLETED', createdAt: { gte: REVENUE_START_DATE } },
                _sum: { amount: true },
                _count: true
            }),
            db.purchaseEvent.aggregate({
                where: { status: 'COMPLETED', productType: 'subscription', purchasedAt: { gte: REVENUE_START_DATE } },
                _sum: { amount: true },
                _count: true
            }),
            db.prayerCandle.aggregate({
                where: { paymentStatus: 'PAID', litAt: { gte: REVENUE_START_DATE } },
                _sum: { amount: true },
                _count: true
            }),
            db.massOffering.groupBy({
                by: ['offeringType'],
                where: { status: 'PAID', createdAt: { gte: REVENUE_START_DATE } },
                _sum: { amount: true },
                _count: { offeringType: true },
                orderBy: { _sum: { amount: 'desc' } }
            }),
            db.platformDonation.groupBy({
                by: ['tier'],
                where: { status: 'COMPLETED', createdAt: { gte: REVENUE_START_DATE } },
                _sum: { amount: true },
                _count: { tier: true },
                orderBy: { _sum: { amount: 'desc' } }
            })
        ]);

        const massRevenue = massStats._sum?.amount || 0;
        const donationRevenue = (donationStats._sum?.amount || 0) + (candleStats._sum?.amount || 0);
        const subscriptionRevenue = subStats._sum?.amount || 0;

        const totalRevenue = massRevenue + donationRevenue + subscriptionRevenue;
        const totalOrders = (massStats._count || 0) + (donationStats._count || 0) + (candleStats._count || 0) + (subStats._count || 0);
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        // Map Mass Breakdowns
        const massBreakdown: RevenueBreakdown[] = massGroups.map(g => ({
            type: String(g.offeringType || 'Unknown'),
            amount: g._sum?.amount || 0,
            count: g._count?.offeringType || 0
        }));

        // Map Donation Breakdowns
        const donationBreakdown: RevenueBreakdown[] = donationGroups.map(g => ({
            type: String(g.tier || 'Custom'),
            amount: g._sum?.amount || 0,
            count: g._count?.tier || 0
        }));

        // Add Candle breakdown to donations if not present
        if (candleStats._count > 0) {
            donationBreakdown.push({
                type: 'VIRTUAL_CANDLE',
                amount: candleStats._sum?.amount || 0,
                count: candleStats._count || 0
            });
        }

        return {
            totalRevenue,
            massOfferingsRevenue: massRevenue,
            donationsRevenue: donationRevenue,
            subscriptionsRevenue: subscriptionRevenue,
            growthPercent: 0, // Calculated separately if needed
            avgOrderValue,
            topOfferingType: massBreakdown[0]?.type || 'N/A',
            topDonationTier: donationBreakdown[0]?.type || 'N/A',
            massBreakdown,
            donationBreakdown
        };

    } catch (error) {
        console.error('Failed to fetch revenue stats:', error);
        return {
            totalRevenue: 0,
            massOfferingsRevenue: 0,
            donationsRevenue: 0,
            subscriptionsRevenue: 0,
            growthPercent: 0,
            avgOrderValue: 0,
            topOfferingType: 'N/A',
            topDonationTier: 'N/A',
            massBreakdown: [],
            donationBreakdown: []
        };
    }
}

export async function getRevenueChartData(period: '7d' | '30d' | '90d' | '12m' | 'ytd'): Promise<RevenueData[]> {
    try {
        let startDate = new Date();
        let dateFormat = 'MMM d';

        if (period === '7d') startDate = subDays(new Date(), 7);
        if (period === '30d') startDate = subDays(new Date(), 30);
        if (period === '90d') startDate = subDays(new Date(), 90);
        if (period === '12m') {
            startDate = subMonths(new Date(), 12);
            dateFormat = 'MMM yyyy';
        }
        if (period === 'ytd') {
            startDate = new Date(new Date().getFullYear(), 0, 1);
            dateFormat = 'MMM yyyy';
        }

        // Ensure we never start before the Global Reset Date
        const effectiveStartDate = startDate < REVENUE_START_DATE ? REVENUE_START_DATE : startDate;
 
        // Fetch all raw records since startDate
        const [masses, donations, candles, subs] = await Promise.all([
            db.massOffering.findMany({
                where: { createdAt: { gte: effectiveStartDate }, status: 'PAID' },
                select: { createdAt: true, amount: true }
            }),
            db.donation.findMany({
                where: { createdAt: { gte: effectiveStartDate }, status: 'COMPLETED' },
                select: { createdAt: true, amount: true }
            }),
            db.prayerCandle.findMany({
                where: { litAt: { gte: effectiveStartDate }, paymentStatus: 'PAID' },
                select: { litAt: true, amount: true }
            }),
            db.purchaseEvent.findMany({
                where: { purchasedAt: { gte: effectiveStartDate }, status: 'COMPLETED' },
                select: { purchasedAt: true, amount: true }
            })
        ]);

        // Bucketize
        const buckets: Record<string, RevenueData> = {};

        const addToBucket = (date: Date, type: 'mass' | 'donation' | 'sub', amount: number) => {
            const key = format(date, dateFormat);
            if (!buckets[key]) {
                buckets[key] = {
                    period: key,
                    massOfferings: 0,
                    donations: 0,
                    subscriptions: 0,
                    total: 0
                };
            }
            if (type === 'mass') buckets[key].massOfferings += amount;
            if (type === 'donation') buckets[key].donations += amount;
            if (type === 'sub') buckets[key].subscriptions += amount;
            buckets[key].total += amount;
        };

        masses.forEach(m => addToBucket(m.createdAt, 'mass', m.amount));
        donations.forEach(d => addToBucket(d.createdAt, 'donation', d.amount));
        candles.forEach(c => addToBucket(c.litAt, 'donation', c.amount));
        subs.forEach(s => addToBucket(s.purchasedAt, 'sub', s.amount || 0));

        return Object.values(buckets);

    } catch (e) {
        console.error("Chart data error", e);
        return [];
    }
}
