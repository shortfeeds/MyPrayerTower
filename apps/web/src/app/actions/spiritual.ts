'use server';

import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { moderateContent } from '@/lib/moderation';
import { unstable_cache } from 'next/cache';
import { notifyIndexNow } from '@/lib/indexnow';
import { sendVigilConfirmationEmail, sendMassConfirmationEmail } from '@/lib/email';

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

        // Send spiritual confirmation email if email provided
        if (candle.email) {
            sendVigilConfirmationEmail({
                email: candle.email,
                name: candle.name || undefined,
                intention: candle.intention,
                durationDays: days,
            }).catch(e => console.error('Vigil email error:', e));
        }

        return { success: true, candle };
    } catch (error) {
        console.error('Error lighting candle:', error);
        return { success: false, error: 'Failed to light candle' };
    }
}

// Light multiple virtual candles (bulk creation)
export async function lightBulkCandles(data: {
    intentions: string[];
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
        const results = [];
        const isFree = price === 0;
        const isPaid = !!data.paymentId || isFree;

        // Process each intention
        for (const intention of data.intentions) {
            // Moderation Check
            const moderation = moderateContent(intention);
            if (!moderation.isValid) {
                // If one fails, we continue with others for bulk, but log the failure
                console.warn('Moderation failed for one intention in bulk request:', moderation.reason);
                continue;
            }

            const candle = await prisma.prayerCandle.create({
                data: {
                    userId: user?.id,
                    intention: intention,
                    name: data.isAnonymous ? null : (data.name || user?.firstName || null),
                    email: data.email || user?.email,
                    isAnonymous: data.isAnonymous ?? true,
                    amount: price,
                    duration: data.duration,
                    expiresAt,
                    paymentId: data.paymentId,
                    paymentStatus: isPaid ? 'PAID' : 'PENDING',
                    isActive: true,
                    litAt: new Date()
                }
            });
            results.push(candle);
        }

        if (results.length > 0) {
            await notifyIndexNow('/candles');

            const targetEmail = data.email || user?.email;
            if (targetEmail && data.intentions[0]) {
                sendVigilConfirmationEmail({
                    email: targetEmail,
                    name: data.name || user?.firstName || undefined,
                    intention: data.intentions.join('; '),
                    durationDays: days,
                }).catch(e => console.error('Bulk vigil email error:', e));
            }
        }

        return { success: true, count: results.length, candles: results };
    } catch (error) {
        console.error('Error lighting bulk candles:', error);
        return { success: false, error: 'Failed to light candles' };
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

export async function submitMassOffering(data: {
    offeringTypeId: string;
    intentionFor: string;
    intentionType?: string;
    requestedBy?: string;
    email: string;
    notes?: string;
    paymentId?: string;
}) {
    try {
        const typeMap: Record<string, { type: 'REGULAR' | 'NOVENA' | 'GREGORIAN' | 'PERPETUAL'; amount: number; label: string }> = {
            single: { type: 'REGULAR', amount: 1000, label: 'Single Mass' },
            novena: { type: 'NOVENA', amount: 7500, label: 'Novena of Masses' },
            gregorian: { type: 'GREGORIAN', amount: 20000, label: 'Gregorian Masses' },
            perpetual: { type: 'PERPETUAL', amount: 10000, label: 'Perpetual Enrollment' },
        };

        const config = typeMap[data.offeringTypeId] || typeMap.single;
        const user = await getUserFromCookie();

        const mass = await db.massOffering.create({
            data: {
                offeringType: config.type,
                amount: config.amount,
                currency: 'usd',
                intentionFor: data.intentionFor.trim(),
                specialIntention: data.notes?.trim() || null,
                offeredBy: data.requestedBy?.trim() || null,
                name: data.requestedBy?.trim() || 'Faithful Soul',
                email: data.email.trim(),
                userId: user?.id || null,
                status: 'PAID',
                paidAt: new Date(),
                isForLiving: data.intentionType !== 'Deceased Person',
            }
        });

        // Trigger confirmation email
        sendMassConfirmationEmail({
            email: data.email.trim(),
            intentionFor: data.intentionFor.trim(),
            requestedBy: data.requestedBy?.trim(),
            massTypeName: config.label,
        }).catch(err => console.error('Failed to trigger mass confirmation email:', err));

        return {
            success: true,
            massOfferingId: mass.id,
            orderNumber: mass.orderNumber,
            offeringType: config.label
        };
    } catch (error) {
        console.error('Error submitting mass offering:', error);
        return { success: false, error: 'Could not record mass offering' };
    }
}

export async function getUserSanctuaryVigils() {
    const user = await getUserFromCookie();
    if (!user) {
        return { candles: [], massOfferings: [] };
    }

    try {
        const [candles, massOfferings] = await Promise.all([
            db.prayerCandle.findMany({
                where: {
                    OR: [
                        { userId: user.id },
                        user.email ? { email: user.email } : { id: 'impossible_id' }
                    ],
                    isActive: true,
                },
                orderBy: { litAt: 'desc' },
                take: 20
            }),
            db.massOffering.findMany({
                where: {
                    OR: [
                        { userId: user.id },
                        user.email ? { email: user.email } : { id: 'impossible_id' }
                    ]
                },
                orderBy: { createdAt: 'desc' },
                take: 20
            })
        ]);

        return {
            candles: candles.map(c => ({
                id: c.id,
                intention: c.intention,
                name: c.name,
                duration: c.duration,
                litAt: c.litAt.toISOString(),
                expiresAt: c.expiresAt.toISOString(),
                isActive: c.isActive && new Date(c.expiresAt) > new Date(),
                prayerCount: c.prayerCount
            })),
            massOfferings: massOfferings.map(m => ({
                id: m.id,
                orderNumber: m.orderNumber,
                offeringType: m.offeringType,
                intentionFor: m.intentionFor,
                offeredBy: m.offeredBy,
                status: m.status,
                createdAt: m.createdAt.toISOString(),
                celebrationDate: m.celebrationDate ? m.celebrationDate.toISOString() : null,
                celebrant: m.celebrant
            }))
        };
    } catch (err) {
        console.error('Error fetching user vigils:', err);
        return { candles: [], massOfferings: [] };
    }
}

export async function createSpiritualBouquet(data: {
    creatorName: string;
    creatorEmail: string;
    recipientName: string;
    recipientEmail: string;
    occasion: string;
    message?: string;
    massesCount: number;
    rosariesCount: number;
    prayersCount: number;
    candlesCount: number;
    amount: number; // in cents
    paymentId?: string;
}) {
    try {
        const user = await getUserFromCookie();

        const bouquet = await db.spiritualBouquet.create({
            data: {
                creatorId: user?.id || null,
                creatorName: data.creatorName.trim(),
                creatorEmail: data.creatorEmail.trim(),
                recipientName: data.recipientName.trim(),
                recipientEmail: data.recipientEmail.trim(),
                occasion: data.occasion || 'Spiritual Blessing',
                message: data.message?.trim() || null,
                massesCount: data.massesCount || 0,
                rosariesCount: data.rosariesCount || 0,
                prayersCount: data.prayersCount || 0,
                candlesCount: data.candlesCount || 0,
                amount: data.amount,
                paymentId: data.paymentId || null,
                paymentStatus: data.amount === 0 || data.paymentId ? 'PAID' : 'PENDING',
                sentAt: new Date(),
            }
        });

        // Automatically light a 7-day Sanctuary Candle if requested in bouquet
        if (data.candlesCount > 0) {
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            await db.prayerCandle.create({
                data: {
                    intention: `Spiritual Bouquet for ${data.recipientName} (${data.occasion})`,
                    name: data.creatorName,
                    email: data.creatorEmail,
                    isAnonymous: false,
                    duration: 'SEVEN_DAYS',
                    amount: data.candlesCount * 499,
                    isActive: true,
                    litAt: new Date(),
                    expiresAt: expires,
                    paymentStatus: 'PAID'
                }
            }).catch(e => console.error('Error auto-lighting bouquet candle:', e));
        }

        return { success: true, bouquetId: bouquet.id };
    } catch (error) {
        console.error('Error creating spiritual bouquet:', error);
        return { success: false, error: 'Failed to create spiritual bouquet' };
    }
}

export async function getActiveTabernacleLamp() {
    try {
        const lamp = await db.prayerCandle.findFirst({
            where: {
                isActive: true,
                expiresAt: { gt: new Date() },
                OR: [
                    { duration: 'THIRTY_DAYS' },
                    { intention: { contains: 'Tabernacle' } }
                ]
            },
            orderBy: { litAt: 'desc' },
            select: {
                id: true,
                name: true,
                intention: true,
                litAt: true,
                expiresAt: true,
                duration: true,
                prayerCount: true
            }
        });

        if (lamp) {
            return {
                id: lamp.id,
                sponsorFamily: lamp.name || 'The Faithful Communion',
                intention: lamp.intention,
                litAt: lamp.litAt.toISOString(),
                expiresAt: lamp.expiresAt.toISOString(),
                prayerCount: lamp.prayerCount
            };
        }

        // Sacred default for continuous reverence
        const defaultExpires = new Date();
        defaultExpires.setDate(defaultExpires.getDate() + 6);
        return {
            id: 'tabernacle-perpetual',
            sponsorFamily: 'The Friends of the Sanctuary',
            intention: 'Perpetual Adoration and Peace for the Whole World',
            litAt: new Date().toISOString(),
            expiresAt: defaultExpires.toISOString(),
            prayerCount: 842
        };
    } catch (error) {
        console.error('Error fetching tabernacle lamp:', error);
        return null;
    }
}
