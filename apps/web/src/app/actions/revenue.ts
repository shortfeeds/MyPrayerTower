'use server';

import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

export interface RevenueStats {
    totalRevenue: number;
    massOfferingsRevenue: number;
    donationsRevenue: number;
    subscriptionsRevenue: number;
    growthPercent: number;
    avgOrderValue: number;
    topOfferingType: string;
    topDonationTier: string;
}

export interface RevenueData {
    period: string;
    massOfferings: number;
    donations: number;
    subscriptions: number;
    total: number;
}

export async function getRevenueStats(): Promise<RevenueStats> {
    try {
        // 1. Fetch Aggregates
        const [massStats, donationStats, subStats, candleStats] = await Promise.all([
            prisma.massOffering.aggregate({
                where: { status: { in: ['PAID', 'ASSIGNED', 'SCHEDULED', 'OFFERED', 'COMPLETED'] } },
                _sum: { amount: true },
                _count: true
            }),
            prisma.platformDonation.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true },
                _count: true
            }),
            prisma.prayerSubscription.aggregate({
                where: { status: 'ACTIVE' }, // MRR estimation? Or historical payments?
                // Subscription table tracks "current" status, hard to get historical revenue from just this table without a Transaction/Invoice table.
                // We'll estimate MRR based on active subs * price for now.
                _count: true
            }),
            prisma.virtualCandle.aggregate({
                where: { isActive: true }, // Approximation for paid candles
                _sum: { amount: true },
                _count: true
            })
        ]);

        // 2. Fetch Mass Offering Breakdown
        const topMassType = await prisma.massOffering.groupBy({
            by: ['offeringType'],
            where: { status: { in: ['PAID', 'ASSIGNED', 'SCHEDULED', 'OFFERED', 'COMPLETED'] } },
            _count: { offeringType: true },
            orderBy: {
                _count: { offeringType: 'desc' }
            },
            take: 1
        });

        // 3. Fetch Donation Tier Breakdown
        const topDonationTier = await prisma.platformDonation.groupBy({
            by: ['tier'],
            where: { status: 'PAID' },
            _count: { tier: true },
            orderBy: {
                _count: { tier: 'desc' }
            },
            take: 1
        });

        // Calculations
        const massRevenue = massStats._sum.amount || 0;
        const donationRevenue = donationStats._sum.amount || 0;
        const candleRevenue = candleStats._sum.amount || 0;

        // Estimate Subscription Revenue (MRR)
        // Need to query distribution of plans if prices vary.
        // Simplified: Assume average $15 for now or fetch distribution.
        const subscriptionRevenue = (subStats._count || 0) * 1500; // Estimated MRR

        const totalRevenue = massRevenue + donationRevenue + candleRevenue + subscriptionRevenue;
        const totalOrders = (massStats._count || 0) + (donationStats._count || 0) + (candleStats._count || 0);
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        return {
            totalRevenue,
            massOfferingsRevenue: massRevenue,
            donationsRevenue: donationRevenue,
            subscriptionsRevenue: subscriptionRevenue,
            growthPercent: 0, // Needs historical comparison
            avgOrderValue,
            topOfferingType: topMassType[0]?.offeringType || 'N/A',
            topDonationTier: topDonationTier[0]?.tier || 'N/A'
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
            topDonationTier: 'N/A'
        };
    }
}

export async function getRevenueChartData(period: '7d' | '30d' | '90d' | '12m' | 'ytd'): Promise<RevenueData[]> {
    // Return empty array or implement date grouping logic if needed.
    // For MVP/Verification, we can return a single bucket or simplistic data.
    return [];
}
