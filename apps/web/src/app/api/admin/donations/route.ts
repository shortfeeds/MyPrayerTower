import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || '30d';

        let dateFilter: Date | undefined;
        const now = new Date();
        if (period === '7d') {
            dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (period === '30d') {
            dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (period === '90d') {
            dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        }

        const where: any = {};
        if (dateFilter) {
            where.createdAt = { gte: dateFilter };
        }

        const [donations, totalCount, aggregate] = await Promise.all([
            db.platformDonation.findMany({
                where,
                take: 100,
                orderBy: { createdAt: 'desc' },
            }),
            db.platformDonation.count({ where }),
            db.platformDonation.aggregate({
                where,
                _sum: {
                    amount: true,
                },
            }),
        ]);

        const totalCents = aggregate._sum.amount || 0;
        const totalDollars = totalCents / 100;

        const stats = {
            totalDonations: totalDollars,
            totalDonationsFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(totalDollars),
            donationCount: totalCount,
            activeSubscriptions: 0,
            estimatedMRR: 0,
        };

        const formatted = donations.map((d) => ({
            id: d.id,
            orderNumber: d.orderNumber,
            amount: d.amount,
            tier: d.tier,
            name: d.isAnonymous ? 'Anonymous Donor' : d.name,
            email: d.isAnonymous ? '***@***.com' : d.email,
            isAnonymous: d.isAnonymous,
            status: d.status,
            createdAt: d.createdAt.toISOString(),
        }));

        return NextResponse.json({
            stats,
            donations: formatted,
            total: totalCount,
        });
    } catch (error: any) {
        console.error('Error fetching admin donations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch donations', details: error.message },
            { status: 500 }
        );
    }
}
