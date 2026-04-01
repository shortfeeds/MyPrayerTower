import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const getAnalytics = unstable_cache(
    async (days: number) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Raw queries for efficient date truncation and grouping
        const userGrowth = await db.$queryRaw`
            SELECT DATE("createdAt") as date, COUNT(*)::int as count 
            FROM "User" 
            WHERE "createdAt" >= ${startDate} 
            GROUP BY DATE("createdAt") 
            ORDER BY date ASC
        ` as { date: Date, count: number }[];

        const prayerActivity = await db.$queryRaw`
            SELECT DATE("createdAt") as date, COUNT(*)::int as count 
            FROM "PrayerRequest" 
            WHERE "createdAt" >= ${startDate} 
            GROUP BY DATE("createdAt") 
            ORDER BY date ASC
        ` as { date: Date, count: number }[];

        // Summary stats (parallel)
        const [
            totalUsers,
            newUsersThisMonth,
            totalChurches,
            verifiedChurches,
            totalPrayers,
            pendingPrayers,
            totalAds,
            activeAds,
            totalOfferings,
            totalDonations
        ] = await Promise.all([
            db.user.count(),
            db.user.count({ where: { createdAt: { gte: startDate } } }),
            db.church.count(),
            db.church.count({ where: { isVerified: true } }),
            db.prayerRequest.count(),
            db.prayerRequest.count({ where: { status: 'PENDING' } }),
            db.sponsoredContent.count(),
            db.sponsoredContent.count({ where: { isActive: true } }),
            db.massOffering.count({ where: { status: 'PAID' } }),
            db.platformDonation.count({ where: { status: 'COMPLETED' } })
        ]);

        // Financial data (Offerings and Platform Donations)
        const revenueStats = await Promise.all([
            db.massOffering.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true }
            }),
            db.platformDonation.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { amount: true }
            })
        ]);

        const totalRevenue = (revenueStats[0]._sum.amount || 0) + (revenueStats[1]._sum.amount || 0);

        const salesGrowth = await db.$queryRaw`
            SELECT date, SUM(count)::int as count FROM (
                SELECT DATE("createdAt") as date, COUNT(*)::int as count 
                FROM "MassOffering" 
                WHERE "status" = 'PAID' AND "createdAt" >= ${startDate}
                GROUP BY DATE("createdAt")
                UNION ALL
                SELECT DATE("createdAt") as date, COUNT(*)::int as count 
                FROM "PlatformDonation" 
                WHERE "status" = 'COMPLETED' AND "createdAt" >= ${startDate}
                GROUP BY DATE("createdAt")
            ) s
            GROUP BY date
            ORDER BY date ASC
        ` as { date: Date, count: number }[];

        // Ad performance
        const adStats = await db.sponsoredContent.aggregate({
            _sum: {
                impressions: true,
                clicks: true
            }
        });

        return {
            summary: {
                totalUsers,
                newUsersThisMonth,
                totalChurches,
                verifiedChurches,
                totalPrayers,
                pendingPrayers,
                totalAds,
                activeAds,
                totalImpressions: adStats._sum.impressions || 0,
                totalClicks: adStats._sum.clicks || 0,
                totalOfferings,
                totalDonations,
                totalRevenue,
                totalSales: totalOfferings + totalDonations
            },
            userGrowth: userGrowth.map(item => ({
                date: new Date(item.date).toISOString(),
                count: Number(item.count)
            })),
            prayerActivity: prayerActivity.map(item => ({
                date: new Date(item.date).toISOString(),
                count: Number(item.count)
            })),
            salesGrowth: salesGrowth.map(item => ({
                date: new Date(item.date).toISOString(),
                count: Number(item.count)
            }))
        };
    },
    ['admin-analytics'],
    { revalidate: 300, tags: ['analytics'] } // Cache for 5 minutes
);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30'; // days
    const days = parseInt(period);

    try {
        const data = await getAnalytics(days);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Analytics GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
