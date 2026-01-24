'use server';

import { db } from '@/lib/db';

export async function getChurches(page = 1, limit = 12, query = '', filters: { denomination?: string; type?: string } = {}) {
    const skip = (page - 1) * limit;

    const where: any = {};
    const conditions: any[] = [];

    if (query) {
        conditions.push({
            OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { city: { contains: query, mode: 'insensitive' as const } },
                { state: { contains: query, mode: 'insensitive' as const } },
                { postalCode: { contains: query, mode: 'insensitive' as const } }
            ]
        });
    }

    if (filters.denomination) {
        conditions.push({ denomination: filters.denomination });
    }

    if (filters.type) {
        conditions.push({ type: filters.type });
    }

    if (conditions.length > 0) {
        where.AND = conditions;
    }

    // Explicitly select only non-problematic fields to avoid "column does not exist" errors
    const select = {
        id: true,
        name: true,
        slug: true,
        type: true,
        denomination: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        primaryImageUrl: true,
        isVerified: true,
        description: true,
        shortDescription: true,
        website: true,
        phone: true,
        email: true,
    };

    try {
        const [data, total] = await Promise.all([
            db.church.findMany({
                where,
                select,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            db.church.count({ where })
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        return { data: [], meta: { total: 0, page: 1, limit, totalPages: 0 } };
    }
}

export async function getChurchById(id: string) {
    try {
        const church = await db.church.findUnique({
            where: { id },
            include: {
                Diocese: true,
            }
        });
        return church;
    } catch (error) {
        console.error('Error fetching church:', error);
        return null;
    }
}
