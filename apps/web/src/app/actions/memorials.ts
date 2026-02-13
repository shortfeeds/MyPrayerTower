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
                include: { owner: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            db.memorial.count({ where }),
        ]);

        // Map Prisma result to our Interface
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
    const user = await getUserFromCookie();

    // If no user, we might allow anonymous creation if "owner" is optional in schema?
    // Schema: owner User @relation(...) -> Required.
    // So we MUST have a user.
    if (!user) {
        throw new Error('You must be logged in to create a memorial.');
    }

    try {
        // Generate a slug from name + timestamp
        const slugBase = `${data.firstName}-${data.lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const slug = `${slugBase}-${Date.now()}`;

        const memorial = await db.memorial.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                deathDate: data.deathDate ? new Date(data.deathDate) : null,
                biography: data.biography,
                photoUrl: data.photoUrl,
                slug: slug,
                ownerId: user.id,
                totalCandles: 0,
                totalFlowers: 0,
                isPublic: true,
                tier: 'BASIC', // Default from schema
            },
            include: {
                owner: true
            }
        });

        revalidatePath('/memorials');

        // Return formatted memorial
        return {
            id: memorial.id,
            firstName: memorial.firstName,
            lastName: memorial.lastName,
            birthDate: memorial.birthDate?.toISOString(),
            deathDate: memorial.deathDate?.toISOString(),
            biography: memorial.biography || undefined,
            photoUrl: memorial.photoUrl || undefined,
            owner: {
                displayName: memorial.owner.displayName || memorial.owner.firstName || 'Anonymous',
                firstName: memorial.owner.firstName || '',
                lastName: memorial.owner.lastName || '',
                avatarUrl: memorial.owner.avatarUrl || undefined,
            },
            totalCandles: memorial.totalCandles,
            totalFlowers: memorial.totalFlowers,
        };
    } catch (e) {
        console.error('Failed to create memorial:', e);
        throw new Error('Failed to create memorial');
    }
}
