import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30';

    try {
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get Mass Offerings stats
        const [
            totalOfferings,
            pendingOfferings,
            completedOfferings,
            totalRevenue,
            recentOfferings
        ] = await Promise.all([
            db.massOffering.count(),
            db.massOffering.count({ where: { status: 'PENDING' } }),
            db.massOffering.count({ where: { status: 'COMPLETED' } }),
            db.massOffering.aggregate({
                _sum: { amount: true }
            }),
            db.massOffering.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    orderNumber: true,
                    offeringType: true,
                    amount: true,
                    intentionFor: true,
                    status: true,
                    createdAt: true
                }
            })
        ]);

        // Get Platform Donations stats
        const [
            totalDonations,
            donationRevenue,
            recentDonations
        ] = await Promise.all([
            db.platformDonation.count(),
            db.platformDonation.aggregate({
                _sum: { amount: true }
            }),
            db.platformDonation.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    tier: true,
                    amount: true,
                    donorName: true,
                    status: true,
                    createdAt: true
                }
            })
        ]);

        return NextResponse.json({
            massOfferings: {
                total: totalOfferings,
                pending: pendingOfferings,
                completed: completedOfferings,
                revenue: totalRevenue._sum.amount || 0,
                recent: recentOfferings.map(o => ({
                    ...o,
                    amount: o.amount / 100, // Convert cents to dollars
                    createdAt: o.createdAt.toISOString()
                }))
            },
            donations: {
                total: totalDonations,
                revenue: donationRevenue._sum.amount || 0,
                recent: recentDonations.map(d => ({
                    ...d,
                    amount: d.amount / 100,
                    createdAt: d.createdAt.toISOString()
                }))
            }
        });
    } catch (error: any) {
        console.error('Mass Offerings API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch data',
            massOfferings: { total: 0, pending: 0, completed: 0, revenue: 0, recent: [] },
            donations: { total: 0, revenue: 0, recent: [] }
        }, { status: 500 });
    }
}
