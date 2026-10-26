import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const [
            totalBouquets,
            paidBouquets,
            pendingBouquets,
            revenueAgg,
            massesAgg,
            rosariesAgg,
            prayersAgg,
            candlesAgg,
            recentBouquets
        ] = await Promise.all([
            db.spiritualBouquet.count(),
            db.spiritualBouquet.count({ where: { paymentStatus: 'PAID' } }),
            db.spiritualBouquet.count({ where: { paymentStatus: 'PENDING' } }),
            db.spiritualBouquet.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { amount: true }
            }),
            db.spiritualBouquet.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { massesCount: true }
            }),
            db.spiritualBouquet.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { rosariesCount: true }
            }),
            db.spiritualBouquet.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { prayersCount: true }
            }),
            db.spiritualBouquet.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { candlesCount: true }
            }),
            db.spiritualBouquet.findMany({
                take: 50,
                orderBy: { sendDate: 'desc' },
                select: {
                    id: true,
                    creatorName: true,
                    creatorEmail: true,
                    recipientName: true,
                    recipientEmail: true,
                    occasion: true,
                    message: true,
                    massesCount: true,
                    rosariesCount: true,
                    prayersCount: true,
                    candlesCount: true,
                    amount: true,
                    paymentStatus: true,
                    paymentId: true,
                    sentAt: true,
                    sendDate: true
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                total: totalBouquets,
                paid: paidBouquets,
                pending: pendingBouquets,
                revenue: (revenueAgg._sum.amount || 0) / 100,
                massesCount: massesAgg._sum.massesCount || 0,
                rosariesCount: rosariesAgg._sum.rosariesCount || 0,
                prayersCount: prayersAgg._sum.prayersCount || 0,
                candlesCount: candlesAgg._sum.candlesCount || 0,
            },
            bouquets: recentBouquets.map(b => ({
                ...b,
                amount: (b.amount || 0) / 100,
                sentAt: b.sentAt ? b.sentAt.toISOString() : null,
                sendDate: b.sendDate ? b.sendDate.toISOString() : null
            }))
        });
    } catch (error: any) {
        console.error('Admin Bouquets API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch bouquets',
            stats: { total: 0, paid: 0, pending: 0, revenue: 0, massesCount: 0, rosariesCount: 0, prayersCount: 0, candlesCount: 0 },
            bouquets: []
        }, { status: 500 });
    }
}
