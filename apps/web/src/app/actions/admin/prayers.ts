'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ModerationStatus } from '@prisma/client';

export type AdminPrayerRequest = {
    id: string;
    title: string | null;
    content: string;
    category: string;
    status: ModerationStatus;
    userName: string;
    userEmail: string;
    createdAt: Date;
    prayerCount: number;
    visibility: string;
};

export async function getAdminPrayerRequests(
    page: number = 1,
    limit: number = 20,
    status?: ModerationStatus,
    search?: string
): Promise<{ prayers: AdminPrayerRequest[], total: number }> {
    try {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { displayName: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [prayers, total] = await Promise.all([
            db.prayerRequest.findMany({
                where,
                include: {
                    user: {
                        select: {
                            displayName: true,
                            firstName: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            db.prayerRequest.count({ where })
        ]);

        const mappedPrayers = prayers.map(p => ({
            id: p.id,
            title: p.title,
            content: p.content,
            category: p.category,
            status: p.status,
            userName: p.user?.displayName || p.user?.firstName || 'Anonymous',
            userEmail: p.user?.email || 'No Email',
            createdAt: p.createdAt,
            prayerCount: p.prayerCount,
            visibility: p.visibility
        }));

        return {
            prayers: mappedPrayers,
            total
        };
    } catch (error) {
        console.error('Error fetching admin prayer requests:', error);
        // Return empty state instead of crashing
        return { prayers: [], total: 0 };
    }
}

export async function updatePrayerStatus(
    prayerId: string,
    status: ModerationStatus,
    notes?: string
) {
    await db.prayerRequest.update({
        where: { id: prayerId },
        data: {
            status,
            moderatedAt: new Date(),
            moderationNotes: notes
            // In a real app, we'd add 'moderatedBy' here using the admin session
        }
    });

    revalidatePath('/admin/cms/prayers');
    revalidatePath('/admin/moderation');
}
