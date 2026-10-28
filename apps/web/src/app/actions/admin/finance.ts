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
    paymentId?: string;
}

export async function getFinancialTransactions(
    page: number = 1,
    limit: number = 20,
    filter?: 'ALL' | 'MASS_OFFERING' | 'VIRTUAL_CANDLE' | 'DONATION'
): Promise<{ transactions: AdminTransaction[], total: number }> {
    const skip = (page - 1) * limit;

    const [offerings, candles, donations] = await Promise.all([
        db.massOffering.findMany({
            where: filter === 'ALL' || filter === 'MASS_OFFERING' ? {} : { id: 'none' },
            take: 100,
            orderBy: { createdAt: 'desc' }
        }).catch(() => []),
        db.prayerCandle.findMany({
            where: filter === 'ALL' || filter === 'VIRTUAL_CANDLE' ? {} : { id: 'none' },
            take: 100,
            orderBy: { litAt: 'desc' }
        }).catch(() => []),
        db.platformDonation.findMany({
            where: filter === 'ALL' || filter === 'DONATION' ? {} : { id: 'none' },
            take: 100,
            orderBy: { createdAt: 'desc' }
        }).catch(() => [])
    ]);

    // Map to common interface
    const allTransactions: AdminTransaction[] = [
        ...offerings.map((o: any) => ({
            id: o.id,
            type: 'MASS_OFFERING' as const,
            amount: o.amount || 0,
            currency: o.currency || 'USD',
            status: (o.paymentStatus || 'PENDING') as any,
            date: o.createdAt,
            userEmail: o.email,
            userName: o.name || 'Guest',
            description: `Mass: ${(o.intentionFor || o.specialIntention || 'Mass Intention').substring(0, 30)}...`,
            paymentId: o.paymentId || undefined
        })),
        ...candles.map((c: any) => ({
            id: c.id,
            type: 'VIRTUAL_CANDLE' as const,
            amount: c.amount || 0,
            currency: 'USD',
            status: (c.paymentStatus || 'PENDING') as any,
            date: c.litAt || c.createdAt,
            userEmail: c.email || undefined,
            userName: c.name || 'Guest',
            description: `Candle: ${(c.intention || 'Prayer Candle').substring(0, 30)}...`,
            paymentId: c.paymentId || undefined
        })),
        ...donations.map((d: any) => ({
            id: d.id,
            type: 'DONATION' as const,
            amount: d.amount || 0,
            currency: d.currency || 'USD',
            status: (d.status || 'PENDING') as any,
            date: d.createdAt,
            userEmail: d.email,
            userName: d.name || 'Donor',
            description: `Donation: ${d.tier || 'General'}`,
            paymentId: d.stripePaymentId || d.cashfreePaymentId || undefined
        }))
    ];

    // Sort descending by date
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total = allTransactions.length;
    const paginatedTransactions = allTransactions.slice(skip, skip + limit);

    return {
        transactions: paginatedTransactions,
        total
    };
}
