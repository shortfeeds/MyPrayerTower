'use server';

import { db } from '@/lib/db';
import { Memorial, MemorialsResponse } from '@/lib/types/memorials';
import { revalidatePath } from 'next/cache';
import { getUserFromCookie } from '@/lib/auth';

export async function getMemorials(page = 1, search = ''): Promise<MemorialsResponse> {
    try {
        const limit = 12;
        const skip = (page - 1) * limit;

        const where: any = {
            isPublic: true,
        };
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            db.memorial.findMany({
                where,
                include: {
                    owner: {
                        select: {
                            id: true,
                            displayName: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: [
                    { tier: 'desc' },
                    { createdAt: 'desc' },
                ],
            }),
            db.memorial.count({ where }),
        ]);

        const mappedItems: Memorial[] = items.map(m => ({
            id: m.id,
            firstName: m.firstName,
            lastName: m.lastName,
            birthDate: m.birthDate?.toISOString(),
            deathDate: m.deathDate?.toISOString(),
            biography: m.biography || undefined,
            photoUrl: m.photoUrl || undefined,
            owner: m.owner ? {
                displayName: m.owner.displayName || m.owner.firstName || 'Anonymous',
                firstName: m.owner.firstName || '',
                lastName: m.owner.lastName || '',
                avatarUrl: m.owner.avatarUrl || undefined,
            } : undefined,
            totalCandles: m.totalCandles,
            totalFlowers: m.totalFlowers,
            totalPrayers: m.totalPrayers,
            tier: (m.tier as 'BASIC' | 'PREMIUM') || 'BASIC',
            slug: m.slug,
        }));

        return {
            items: mappedItems,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit) || 1,
            },
        };
    } catch (error) {
        console.error('Error fetching memorials:', error);
        return {
            items: [],
            meta: { total: 0, page: 1, lastPage: 1 }
        };
    }
}

export async function createMemorial(data: any): Promise<Memorial> {
    const user = await getUserFromCookie().catch(() => null);

    try {
        let ownerId = user?.id;

        // Auto-provision or link owner without blocking guest users
        if (!ownerId) {
            const guestEmail = (data.creatorEmail || '').trim().toLowerCase() || 'memorial.guardian@myprayertower.com';
            let existingUser = await db.user.findUnique({ where: { email: guestEmail } }).catch(() => null);
            
            if (!existingUser) {
                // Check if any default user exists to attach to
                const defaultUser = await db.user.findFirst().catch(() => null);
                if (defaultUser) {
                    ownerId = defaultUser.id;
                } else {
                    const newGuest = await db.user.create({
                        data: {
                            id: `usr_guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                            email: guestEmail,
                            displayName: data.creatorName?.trim() || 'Memorial Guardian',
                            firstName: data.creatorName?.split(' ')[0] || 'Memorial',
                            lastName: data.creatorName?.split(' ').slice(1).join(' ') || 'Guardian',
                            passwordHash: 'guest_account',
                        }
                    });
                    ownerId = newGuest.id;
                }
            } else {
                ownerId = existingUser.id;
            }
        }

        const slugBase = `${data.firstName || 'beloved'}-${data.lastName || 'soul'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;

        const isPremium = data.tier === 'PREMIUM';

        const memorial = await db.memorial.create({
            data: {
                firstName: data.firstName?.trim() || '',
                lastName: data.lastName?.trim() || '',
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                deathDate: data.deathDate ? new Date(data.deathDate) : null,
                biography: data.biography?.trim() || '',
                photoUrl: data.photoUrl || null,
                slug: slug,
                ownerId: ownerId!,
                totalCandles: isPremium ? 10 : 0,
                totalFlowers: isPremium ? 5 : 0,
                totalPrayers: isPremium ? 25 : 0,
                isPublic: true,
                tier: isPremium ? 'PREMIUM' : 'BASIC',
                paymentId: data.paymentId || null,
                paidAt: isPremium ? new Date() : null,
            },
            include: {
                owner: true
            }
        });

        revalidatePath('/memorials');
        revalidatePath('/news/obituaries');

        return {
            id: memorial.id,
            firstName: memorial.firstName,
            lastName: memorial.lastName,
            birthDate: memorial.birthDate?.toISOString(),
            deathDate: memorial.deathDate?.toISOString(),
            biography: memorial.biography || undefined,
            photoUrl: memorial.photoUrl || undefined,
            owner: {
                displayName: memorial.owner?.displayName || memorial.owner?.firstName || 'Anonymous',
                firstName: memorial.owner?.firstName || '',
                lastName: memorial.owner?.lastName || '',
                avatarUrl: memorial.owner?.avatarUrl || undefined,
            },
            totalCandles: memorial.totalCandles,
            totalFlowers: memorial.totalFlowers,
            totalPrayers: memorial.totalPrayers,
            tier: (memorial.tier as 'BASIC' | 'PREMIUM') || 'BASIC',
            slug: memorial.slug,
        };
    } catch (e) {
        console.error('Failed to create memorial:', e);
        throw new Error('Failed to create memorial. Please ensure all required fields are filled.');
    }
}

export async function getMemorialById(id: string): Promise<Memorial | null> {
    try {
        const memorial = await db.memorial.findFirst({
            where: {
                OR: [
                    { id },
                    { slug: id }
                ]
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                },
                guestbook: {
                    where: { isApproved: true },
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                }
            },
        });

        if (!memorial) return null;

        return {
            id: memorial.id,
            firstName: memorial.firstName,
            lastName: memorial.lastName,
            birthDate: memorial.birthDate?.toISOString(),
            deathDate: memorial.deathDate?.toISOString(),
            biography: memorial.biography || undefined,
            photoUrl: memorial.photoUrl || undefined,
            owner: memorial.owner ? {
                displayName: memorial.owner.displayName || memorial.owner.firstName || 'Anonymous',
                firstName: memorial.owner.firstName || '',
                lastName: memorial.owner.lastName || '',
                avatarUrl: memorial.owner.avatarUrl || undefined,
            } : undefined,
            totalCandles: memorial.totalCandles,
            totalFlowers: memorial.totalFlowers,
            totalPrayers: memorial.totalPrayers,
            tier: (memorial.tier as 'BASIC' | 'PREMIUM') || 'BASIC',
            slug: memorial.slug,
            guestbook: memorial.guestbook?.map(g => ({
                id: g.id,
                guestName: g.guestName,
                message: g.message,
                createdAt: g.createdAt.toISOString(),
            })),
        };
    } catch (error) {
        console.error('Error fetching memorial by ID:', error);
        return null;
    }
}

export async function prayForMemorial(id: string): Promise<number> {
    try {
        const updated = await db.memorial.update({
            where: { id },
            data: {
                totalPrayers: { increment: 1 }
            },
            select: { totalPrayers: true }
        });
        revalidatePath(`/memorials/${id}`);
        return updated.totalPrayers;
    } catch (e) {
        console.error('Error praying for memorial:', e);
        return 0;
    }
}

export async function addMemorialCondolence(memorialId: string, guestName: string, message: string) {
    try {
        const user = await getUserFromCookie().catch(() => null);
        const entry = await db.memorialGuestbook.create({
            data: {
                memorialId,
                userId: user?.id || null,
                guestName: guestName.trim() || 'Faithful Friend',
                message: message.trim(),
                isApproved: true,
            }
        });
        revalidatePath(`/memorials/${memorialId}`);
        return { success: true, entry: { id: entry.id, guestName: entry.guestName, message: entry.message, createdAt: entry.createdAt.toISOString() } };
    } catch (e) {
        console.error('Error adding condolence:', e);
        return { success: false, error: 'Could not post tribute' };
    }
}

export async function upgradeMemorialToPremium(memorialId: string, paymentId?: string) {
    try {
        const updated = await db.memorial.update({
            where: { id: memorialId },
            data: {
                tier: 'PREMIUM',
                paymentId: paymentId || null,
                paidAt: new Date(),
                totalCandles: { increment: 10 },
                totalFlowers: { increment: 5 },
                totalPrayers: { increment: 25 },
            }
        });
        revalidatePath(`/memorials/${memorialId}`);
        revalidatePath('/memorials');
        revalidatePath('/news/obituaries');
        return { success: true, memorial: updated };
    } catch (e) {
        console.error('Error upgrading memorial to premium:', e);
        return { success: false, error: 'Failed to upgrade memorial' };
    }
}

export async function recordMemorialOffering(
    memorialId: string,
    offering: { candles?: number; flowers?: number; prayers?: number }
) {
    try {
        const data: any = {};
        if (offering.candles) data.totalCandles = { increment: offering.candles };
        if (offering.flowers) data.totalFlowers = { increment: offering.flowers };
        if (offering.prayers) data.totalPrayers = { increment: offering.prayers };

        const updated = await db.memorial.update({
            where: { id: memorialId },
            data,
        });
        revalidatePath(`/memorials/${memorialId}`);
        return { success: true, totalCandles: updated.totalCandles, totalPrayers: updated.totalPrayers };
    } catch (e) {
        console.error('Error recording memorial offering:', e);
        return { success: false };
    }
}
