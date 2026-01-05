'use server';

import { PrismaClient } from '@mpt/database';
import { getUserFromCookie } from '@/lib/auth';

const prisma = new PrismaClient();

export type VirtualCandle = {
    id: string;
    intention: string;
    isAnonymous: boolean;
    name: string | null;
    duration: string;
    litAt: Date;
    expiresAt: Date;
    isActive: boolean;
};

// Get active candles for display
export async function getActiveCandles(): Promise<VirtualCandle[]> {
    const now = new Date();

    const candles = await prisma.virtualCandle.findMany({
        where: {
            isActive: true,
            expiresAt: { gt: now },
            paymentStatus: 'PAID'
        },
        orderBy: { litAt: 'desc' },
        take: 50
    });

    return candles;
}

// Light a virtual candle (free 1-day candles, or creates pending for paid)
export async function lightVirtualCandle(data: {
    intention: string;
    name?: string;
    email?: string;
    isAnonymous?: boolean;
    duration: 'ONE_DAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'THIRTY_DAYS';
}) {
    const user = await getUserFromCookie();

    const durationDays: Record<string, number> = {
        'ONE_DAY': 1,
        'THREE_DAYS': 3,
        'SEVEN_DAYS': 7,
        'THIRTY_DAYS': 30
    };

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (durationDays[data.duration] || 1));

    try {
        // For FREE 1-day candles, auto-approve
        const isFree = data.duration === 'ONE_DAY';

        const candle = await prisma.virtualCandle.create({
            data: {
                userId: user?.id,
                intention: data.intention,
                name: data.isAnonymous ? null : (data.name || user?.firstName || null),
                email: data.email || user?.email,
                isAnonymous: data.isAnonymous ?? true,
                amount: isFree ? 0 : 199, // $1.99 for paid
                duration: data.duration,
                expiresAt,
                paymentStatus: isFree ? 'PAID' : 'PENDING',
                isActive: isFree,
                litAt: isFree ? new Date() : new Date()
            }
        });

        return { success: true, candle };
    } catch (error) {
        console.error('Error lighting candle:', error);
        return { success: false, error: 'Failed to light candle' };
    }
}

// Create a virtual candle (initiates payment)
export async function createVirtualCandle(data: {
    intention: string;
    name?: string;
    email?: string;
    isAnonymous: boolean;
    duration: 'ONE_DAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'THIRTY_DAYS';
}) {
    const user = await getUserFromCookie();

    const durationPrices = {
        'ONE_DAY': 199,      // $1.99
        'THREE_DAYS': 499,   // $4.99
        'SEVEN_DAYS': 999,   // $9.99
        'THIRTY_DAYS': 2499  // $24.99
    };

    const durationDays = {
        'ONE_DAY': 1,
        'THREE_DAYS': 3,
        'SEVEN_DAYS': 7,
        'THIRTY_DAYS': 30
    };

    const amount = durationPrices[data.duration];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays[data.duration]);

    const candle = await prisma.virtualCandle.create({
        data: {
            userId: user?.id,
            intention: data.intention,
            name: data.isAnonymous ? null : (data.name || user?.firstName),
            email: data.email || user?.email,
            isAnonymous: data.isAnonymous,
            amount,
            duration: data.duration,
            expiresAt,
            paymentStatus: 'PENDING'
        }
    });

    // Return candle ID for payment flow
    return { candleId: candle.id, amount };
}

// Confirm candle payment (called after successful payment)
export async function confirmCandlePayment(candleId: string, paymentId: string) {
    await prisma.virtualCandle.update({
        where: { id: candleId },
        data: {
            paymentId,
            paymentStatus: 'PAID',
            isActive: true,
            litAt: new Date()
        }
    });

    return { success: true };
}

// Daily Examen functions
export async function saveExamenEntry(data: {
    gratitude: string;
    review: string;
    sorrow: string;
    tomorrow: string;
}) {
    const user = await getUserFromCookie();
    if (!user) throw new Error('Please login to save your examen');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already submitted today
    const existing = await prisma.examenEntry.findFirst({
        where: {
            userId: user.id,
            date: { gte: today }
        }
    });

    if (existing) {
        // Update existing entry
        await prisma.examenEntry.update({
            where: { id: existing.id },
            data: {
                gratitude: data.gratitude,
                review: data.review,
                sorrow: data.sorrow,
                tomorrow: data.tomorrow
            }
        });
    } else {
        // Create new entry
        await prisma.examenEntry.create({
            data: {
                userId: user.id,
                date: new Date(),
                ...data
            }
        });

        // Update streak
        await prisma.user.update({
            where: { id: user.id },
            data: {
                streakCount: { increment: 1 },
                lastStreakUpdate: new Date()
            }
        });
    }

    return { success: true };
}

export async function getExamenHistory() {
    const user = await getUserFromCookie();
    if (!user) return [];

    const entries = await prisma.examenEntry.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 30
    });

    return entries;
}

// Confession log functions
export async function logConfession(data: {
    date: Date;
    churchId?: string;
    notes?: string;
}) {
    const user = await getUserFromCookie();
    if (!user) throw new Error('Please login first');

    await prisma.confessionLog.create({
        data: {
            userId: user.id,
            date: data.date,
            churchId: data.churchId,
            notes: data.notes
        }
    });

    // Update user's last confession date
    await prisma.user.update({
        where: { id: user.id },
        data: { lastConfessionAt: data.date }
    });

    return { success: true };
}

export async function getConfessionLogs() {
    const user = await getUserFromCookie();
    if (!user) return [];

    const logs = await prisma.confessionLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 20,
        include: {
            Church: {
                select: { name: true, city: true }
            }
        }
    });

    return logs;
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

export async function getAdminCandleStats() {
    // 1. Total Revenue
    const revenue = await prisma.virtualCandle.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'PAID' }
    });

    // 2. Counts
    const totalCandles = await prisma.virtualCandle.count();
    const activeCandles = await prisma.virtualCandle.count({
        where: {
            isActive: true,
            expiresAt: { gt: new Date() }
        }
    });

    // 3. Revenue by Tier (Duration)
    const tiers = await prisma.virtualCandle.groupBy({
        by: ['duration'],
        _sum: { amount: true },
        _count: true,
        where: { paymentStatus: 'PAID' }
    });

    return {
        totalRevenue: revenue._sum.amount || 0,
        totalCandles,
        activeCandles,
        expiredCandles: totalCandles - activeCandles,
        byTier: tiers.map(t => ({
            duration: t.duration,
            count: t._count,
            revenue: t._sum.amount || 0
        }))
    };
}

export async function getCandlesForAdmin(page = 1, limit = 50) {
    const candles = await prisma.virtualCandle.findMany({
        orderBy: { litAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        select: {
            id: true,
            name: true,
            intention: true,
            duration: true,
            amount: true,
            isActive: true, // This field exists in create, assuming schema matches
            litAt: true,
            expiresAt: true,
            paymentStatus: true,
            isAnonymous: true
        }
    });

    // Manual check for "active" status logic regarding expiry if db field isn't auto-updated
    const now = new Date();
    return candles.map(c => ({
        ...c,
        isExpired: new Date(c.expiresAt) < now,
        // Ensure name is properly resolved
        displayName: c.isAnonymous ? 'Anonymous' : (c.name || 'Unknown')
    }));
}
