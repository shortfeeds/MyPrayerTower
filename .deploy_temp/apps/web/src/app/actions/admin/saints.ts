'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type AdminSaint = {
    id: string;
    name: string;
    title: string | null;
    feastDay: string | null;
    patronOf: string[];
    imageUrl: string | null;
    shortBio: string | null;
    slug: string;
};

export async function getAdminSaints(
    page: number = 1,
    limit: number = 20,
    search?: string
): Promise<{ saints: AdminSaint[], total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { title: { contains: search, mode: 'insensitive' } },
            { shortBio: { contains: search, mode: 'insensitive' } }
        ];
    }

    const [saints, total] = await Promise.all([
        db.saint.findMany({
            where,
            orderBy: { name: 'asc' },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                title: true,
                feastDay: true,
                patronOf: true,
                imageUrl: true,
                shortBio: true,
                slug: true
            }
        }),
        db.saint.count({ where })
    ]);

    return { saints, total };
}

// Minimal update for now - can expand to full edit form later
export async function toggleSaintFeatured(id: string) {
    // Schema doesn't have isFeatured for Saint yet, placeholder
    // If user wants full edit, we'd add updateSaint function
}

export async function deleteSaint(id: string) {
    await db.saint.delete({ where: { id } });
    revalidatePath('/admin/cms/saints');
}
