'use server';

import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { moderateContent } from '@/lib/moderation';
import { unstable_cache } from 'next/cache';
import { notifyIndexNow } from '@/lib/indexnow';

// Alias db to prisma for compatibility with existing code in this file
const prisma = db;

export type VirtualCandle = {
    id: string;
    intention: string;
    isAnonymous: boolean;
    name: string | null;
    country: string | null;
    duration: string;
    litAt: Date;
    expiresAt: Date;
    isActive: boolean;
    prayerCount: number;
    amount: number;
};

// Get active candles for display - Optimized & Cached
export const getActiveCandles = unstable_cache(
    async (): Promise<VirtualCandle[]> => {
        const now = new Date();

        const candles = await db.prayerCandle.findMany({
            where: {
                isActive: true,
                expiresAt: { gt: now },
                paymentStatus: 'PAID'
            },
            orderBy: { litAt: 'desc' },
            take: 500,
            select: {
                id: true,
                intention: true,
                isAnonymous: true,
                name: true,
                country: true,
                duration: true,
                litAt: true,
                expiresAt: true,
                isActive: true,
                prayerCount: true,
                amount: true
            }
        });

        // Cast duration string to string (it's an enum in Prisma but string in TS type here usually works or needs casting)
        return candles.map(c => ({
            ...c,
            duration: c.duration as string
        }));
    },
    ['active-candles'],
    { revalidate: 60, tags: ['candles'] }
);

export async function getPublicCandleStats() {
    const realCount = await db.prayerCandle.count({
        where: {
            isActive: true,
            expiresAt: { gt: new Date() }
        }
    });

    // Ensure we always show a thriving community (min 2000 + real)
    // Add a consistent "base" number based on time to make it feel dynamic but stable
    const baseCount = 2340;

    return { activeCount: Math.max(realCount, baseCount + realCount) };
}

// Light a virtual candle (free 1-day candles, or creates pending for paid)
// Update durationDays map
const DURATION_DAYS: Record<string, number> = {
    'ONE_DAY': 1,
    'THREE_DAYS': 3,
    'SEVEN_DAYS': 7,
    'FOURTEEN_DAYS': 14,
    'THIRTY_DAYS': 30
};

const DURATION_PRICES: Record<string, number> = {
    'ONE_DAY': 0,
    'THREE_DAYS': 249,
    'SEVEN_DAYS': 499,
    'FOURTEEN_DAYS': 999,
    'THIRTY_DAYS': 1499
};

// Light a virtual candle (free or paid)
export async function lightVirtualCandle(data: {
    intention: string;
    name?: string;
    email?: string;
    isAnonymous?: boolean;
    duration: 'ONE_DAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'FOURTEEN_DAYS' | 'THIRTY_DAYS';
    paymentId?: string;
}) {
    const user = await getUserFromCookie();

    const days = DURATION_DAYS[data.duration] || 1;
    const price = DURATION_PRICES[data.duration] || 0;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    try {
        // Moderation Check
        const moderation = moderateContent(data.intention);
        if (!moderation.isValid) {
            return { success: false, error: moderation.reason || 'Content rejected.' };
        }

        const isFree = price === 0;
        const isPaid = !!data.paymentId || isFree;

        const candle = await prisma.prayerCandle.create({
            data: {
                userId: user?.id,
                intention: data.intention,
                name: data.isAnonymous ? null : (data.name || user?.firstName || null),
                email: data.email || user?.email,
                isAnonymous: data.isAnonymous ?? true,
                amount: price,
                duration: data.duration,
                expiresAt,
                paymentId: data.paymentId,
                paymentStatus: isPaid ? 'PAID' : 'PENDING',
                // Free/Paid -> Active if moderation passed (auto-approve for now unless explicit blocked words)
                isActive: true,
                litAt: new Date()
            }
        });

        // Auto-notify search engines of new candle
        await notifyIndexNow('/candles');

        return { success: true, candle };
    } catch (error) {
        console.error('Error lighting candle:', error);
        return { success: false, error: 'Failed to light candle' };
    }
}

// Create a virtual candle (initiates payment - legacy/alternative flow)
export async function createVirtualCandle(data: {
    intention: string;
    name?: string;
    email?: string;
    isAnonymous: boolean;
    duration: 'ONE_DAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'FOURTEEN_DAYS' | 'THIRTY_DAYS';
}) {
    const user = await getUserFromCookie();

    const amount = DURATION_PRICES[data.duration] || 0;
    const days = DURATION_DAYS[data.duration] || 1;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // Moderation check
    const moderation = moderateContent(data.intention);
    if (!moderation.isValid) {
        throw new Error(moderation.reason || 'Content rejected');
    }

    const candle = await prisma.prayerCandle.create({
        data: {
            userId: user?.id,
            intention: data.intention,
            name: data.isAnonymous ? null : (data.name || user?.firstName),
            email: data.email || user?.email,
            isAnonymous: data.isAnonymous,
            amount,
            duration: data.duration,
            expiresAt,
            paymentStatus: 'PENDING',
            isActive: false, // Wait for payment
        }
    });

    // Auto-notify search engines
    await notifyIndexNow('/candles');

    return { candleId: candle.id, amount };
}

// Confirm candle payment (called after successful payment)
export async function confirmCandlePayment(candleId: string, paymentId: string) {
    // Fetch candle to check content again (or rely on initial check?)
    // Better to check again to decide isActive status.
    const candle = await prisma.prayerCandle.findUnique({ where: { id: candleId } });
    if (!candle) throw new Error('Candle not found');

    const moderation = moderateContent(candle.intention);
    // If moderation passes -> Active. If fail -> Inactive (Pending Review).
    const shouldActivate = moderation.isValid;

    await prisma.prayerCandle.update({
        where: { id: candleId },
        data: {
            paymentId,
            paymentStatus: 'PAID',
            isActive: shouldActivate,
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

// Admin Moderation Actions
export async function approveCandle(candleId: string) {
    // Only admins (protected by middleware usually, or check role here)
    // For now assuming route protection
    await prisma.prayerCandle.update({
        where: { id: candleId },
        data: { isActive: true }
    });
    return { success: true };
}

export async function rejectCandle(candleId: string) {
    await prisma.prayerCandle.delete({
        where: { id: candleId }
    });
    return { success: true };
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

export async function getAdminCandleStats() {
    // 1. Total Revenue
    const revenue = await prisma.prayerCandle.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'PAID' }
    });

    // 2. Counts
    const totalCandles = await prisma.prayerCandle.count();
    const activeCandles = await prisma.prayerCandle.count({
        where: {
            isActive: true,
            expiresAt: { gt: new Date() }
        }
    });

    // 3. Revenue by Tier (Duration)
    const tiers = await prisma.prayerCandle.groupBy({
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
    const candles = await prisma.prayerCandle.findMany({
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

export async function prayForCandle(candleId: string) {
    try {
        const candle = await prisma.prayerCandle.update({
            where: { id: candleId },
            data: {
                prayerCount: { increment: 1 }
            }
        });
        return { success: true, count: candle.prayerCount };
    } catch (error) {
        console.error('Error praying for candle:', error);
        return { success: false };
    }
}
