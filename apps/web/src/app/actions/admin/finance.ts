'use server';

import { db } from '@/lib/db';

export interface AdminTransaction {
    id: string;
    type: 'MASS_OFFERING' | 'VIRTUAL_CANDLE' | 'DONATION' | 'SUBSCRIPTION';
    amount: number; // in cents
    currency: string;
    status: 'PAID' | 'PENDING' | 'FAILED';
    date: Date;
    userEmail?: string;
    userName?: string;
    description: string;
    paymentId?: string; // e.g. PayPal Order ID
}

export async function getFinancialTransactions(
    page: number = 1,
    limit: number = 20,
    filter?: 'ALL' | 'MASS_OFFERING' | 'VIRTUAL_CANDLE' | 'DONATION'
): Promise<{ transactions: AdminTransaction[], total: number }> {
    const skip = (page - 1) * limit;

    // 1. Fetch from each table separately (Union not supported natively in Prisma easily for independent tables)
    // We will fetch recent items from all 3 tables and sort in memory.
    // For a scalable solution, we would use a raw SQL UNION query.
    // Given current task constraint, let's use raw query for performance.

    /*
    UNION ALL schema:
    id, type, amount, currency, status, "createdAt" as date, "paymentId", description, "userId"
    */

    // Since we need to join with User table for email/name, a pure raw query is complex but best.

    // Simplification for MVP: Fetch top N from each, combine, sort, standard slice.
    // This is "okay" if data volume is low (< 10k records total).

    const [offerings, candles, donations] = await Promise.all([
        db.massOffering.findMany({
            where: filter === 'ALL' || filter === 'MASS_OFFERING' ? {} : { id: 'none' },
            take: 100,
            orderBy: { createdAt: 'desc' },
            include: { User: { select: { email: true, displayName: true } } }
        }),
        db.virtualCandle.findMany({
            where: filter === 'ALL' || filter === 'VIRTUAL_CANDLE' ? {} : { id: 'none' },
            take: 100,
            orderBy: { litAt: 'desc' },
            include: { User: { select: { email: true, displayName: true } } }
        }),
        db.donation.findMany({
            where: filter === 'ALL' || filter === 'DONATION' ? {} : { id: 'none' },
            take: 100,
            orderBy: { createdAt: 'desc' },
            include: { User: { select: { email: true, displayName: true } } }
        })
    ]);

    // Map to common interface
    const allTransactions: AdminTransaction[] = [
        ...offerings.map(o => ({
            id: o.id,
            type: 'MASS_OFFERING' as const,
            amount: o.amount,
            currency: o.currency,
            status: o.paymentStatus as any,
            date: o.createdAt,
            userEmail: o.User?.email,
            userName: o.User?.displayName || 'Guest',
            description: `Mass: ${o.intention.substring(0, 30)}...`,
            paymentId: o.paymentId || undefined
        })),
        ...candles.map(c => ({
            id: c.id,
            type: 'VIRTUAL_CANDLE' as const,
            amount: c.amount,
            currency: c.currency,
            status: c.paymentStatus as any,
            date: c.litAt,
            userEmail: c.User?.email,
            userName: c.User?.displayName || 'Guest',
            description: `Candle: ${c.intention.substring(0, 30)}...`,
            paymentId: c.paymentId || undefined
        })),
        ...donations.map(d => ({
            id: d.id,
            type: 'DONATION' as const,
            amount: d.amount,
            currency: d.currency,
            status: d.paymentStatus as any,
            date: d.createdAt,
            userEmail: d.User?.email,
            userName: d.User?.displayName || 'Guest',
            description: `Donation: ${d.type || 'General'}`,
            paymentId: d.paymentId || undefined
        }))
    ];

    // Sort by date desc
    allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Paginate in memory
    const paginated = allTransactions.slice(skip, skip + limit);

    return {
        transactions: paginated,
        total: allTransactions.length // Approx total of loaded subset
    };
}
