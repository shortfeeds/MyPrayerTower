import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30'; // days

    try {
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // User growth over time
        const userGrowth = await db.user.groupBy({
            by: ['createdAt'],
            _count: true,
            where: {
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Prayer activity
        const prayerActivity = await db.prayerRequest.groupBy({
            by: ['createdAt'],
            _count: true,
            where: {
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Summary stats
        const [
            totalUsers,
            newUsersThisMonth,
            totalChurches,
            verifiedChurches,
            totalPrayers,
            pendingPrayers,
            totalAds,
            activeAds
        ] = await Promise.all([
            db.user.count(),
            db.user.count({ where: { createdAt: { gte: startDate } } }),
            db.church.count(),
            db.church.count({ where: { isVerified: true } }),
            db.prayerRequest.count(),
            db.prayerRequest.count({ where: { status: 'PENDING' } }),
            db.sponsoredContent.count(),
            db.sponsoredContent.count({ where: { isActive: true } })
        ]);

        // Ad performance
        const adStats = await db.sponsoredContent.aggregate({
            _sum: {
                impressions: true,
                clicks: true
            }
        });

        return NextResponse.json({
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
                totalClicks: adStats._sum.clicks || 0
            },
            userGrowth: userGrowth.map(item => ({
                date: item.createdAt,
                count: item._count
            })),
            prayerActivity: prayerActivity.map(item => ({
                date: item.createdAt,
                count: item._count
            }))
        });
    } catch (error: any) {
        console.error('Analytics GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
