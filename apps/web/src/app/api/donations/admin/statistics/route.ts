import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const [totalCount, aggregate] = await Promise.all([
            db.platformDonation.count(),
            db.platformDonation.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);

        const totalCents = aggregate._sum.amount || 0;
        const totalDollars = totalCents / 100;

        return NextResponse.json({
            totalDonations: totalDollars,
            totalDonationsFormatted: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(totalDollars),
            donationCount: totalCount,
            activeSubscriptions: 0,
            estimatedMRR: 0,
        });
    } catch (error: any) {
        console.error('Error fetching donation stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
