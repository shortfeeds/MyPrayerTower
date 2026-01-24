'use server';

import { db } from '@/lib/db';

export async function getLibraryPrayers(page = 1, limit = 20, search?: string) {
    try {
        const skip = (page - 1) * limit;

        const where: any = {
            is_active: true,
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [prayers, total] = await Promise.all([
            db.prayer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { title: 'asc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true, // Needed for preview
                    category: true,
                    tags: true,
                }
            }),
            db.prayer.count({ where })
        ]);

        return {
            prayers: prayers.map(p => ({
                ...p,
                id: p.id.toString(), // Convert BigInt to string
                content: p.content.slice(0, 150) + (p.content.length > 150 ? '...' : '') // Preview only
            })),
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalItems: total
        };

    } catch (error) {
        console.error('Error fetching library prayers:', error);
        return { prayers: [], totalPages: 0, currentPage: 1, totalItems: 0 };
    }
}

export async function getAllPrayerSlugs() {
    try {
        const prayers = await db.prayer.findMany({
            where: { is_active: true },
            select: { slug: true }
        });
        return prayers
            .filter(p => p.slug) // Remove null slugs
            .map(p => p.slug as string);
    } catch (error) {
        console.error('Error fetching prayer slugs:', error);
        return [];
    }
}
