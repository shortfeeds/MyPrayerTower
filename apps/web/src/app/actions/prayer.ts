'use server';

import { PrismaClient } from '@mpt/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Schemas
const createPrayerSchema = z.object({
    content: z.string().min(5, "Prayer request must be at least 5 characters"),
    category: z.enum(['HEALTH', 'FAMILY', 'WORK', 'FINANCES', 'RELATIONSHIPS', 'GRIEF', 'THANKSGIVING', 'SPIRITUAL', 'WORLD', 'OTHER']),
    visibility: z.enum(['PUBLIC', 'ANONYMOUS', 'PRIVATE']),
    userId: z.string(), // In real app, get from session
});

export async function getPrayerRequests(page = 1, limit = 10, category?: string) {
    try {
        const offset = (page - 1) * limit;

        const whereClause: any = {
            visibility: { not: 'PRIVATE' },
            status: { not: 'REJECTED' }, // Show PENDING for now for immediate feedback, or filter to APPROVED
        };

        if (category && category !== 'All') {
            whereClause.category = category.toUpperCase();
        }

        const prayers = await prisma.prayerRequest.findMany({
            where: whereClause,
            include: {
                User: { // Relation name is User
                    select: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                },
                _count: {
                    select: { PrayerAction: true } // Relation name is PrayerAction
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        // Transform for frontend
        return {
            prayers: prayers.map(p => ({
                id: p.id,
                content: p.content,
                category: p.category.charAt(0) + p.category.slice(1).toLowerCase(),
                visibility: p.visibility.toLowerCase(),
                user: p.isAnonymous ? null : p.User, // Use p.User
                prayerCount: p.prayerCount + (p._count?.PrayerAction || 0), // Use p._count.PrayerAction
                createdAt: p.createdAt,
                isAnswered: p.isAnswered,
            })),
            hasMore: prayers.length === limit
        };

    } catch (error) {
        console.error('Error fetching prayers:', error);
        return { prayers: [], hasMore: false };
    }
}

export async function submitPrayerRequest(prevState: any, formData: FormData) {
    try {
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const visibility = formData.get('visibility') as string;
        const userId = 'user_abc123'; // TODO: Replace with real auth user ID

        // Convert category to uppercase enum
        const categoryEnum = category.toUpperCase();
        const visibilityEnum = visibility.toUpperCase();

        const prayer = await prisma.prayerRequest.create({
            data: {
                id: randomUUID(),
                content,
                category: categoryEnum as any,
                visibility: visibilityEnum as any,
                userId: userId, // Mock user ID for now
                status: 'PENDING', // Moderated by admin
                updatedAt: new Date(),
            }
        });

        revalidatePath('/prayer-wall');
        return { success: true, message: 'Prayer request submitted!' };

    } catch (error) {
        console.error('Error submitting prayer:', error);
        return { success: false, message: 'Failed to submit prayer.' };
    }
}

export async function prayForRequest(prayerId: string) {
    try {
        const userId = 'user_abc123'; // TODO: Real auth

        // Check if already prayed (uniqueness constraint)
        const existing = await prisma.prayerAction.findUnique({
            where: {
                prayerRequestId_userId: {
                    prayerRequestId: prayerId,
                    userId
                }
            }
        });

        if (existing) {
            return { success: false, message: 'You already prayed for this.' };
        }

        await prisma.$transaction([
            prisma.prayerAction.create({
                data: {
                    id: randomUUID(),
                    prayerRequestId: prayerId,
                    userId
                }
            }),
            prisma.prayerRequest.update({
                where: { id: prayerId },
                data: { prayerCount: { increment: 1 } }
            }),
            // Increment user streak?
            prisma.user.update({
                where: { id: userId },
                data: { streakCount: { increment: 1 } }
            })
        ]);

        revalidatePath('/prayer-wall');
        return { success: true };
    } catch (error) {
        console.error('Error praying:', error);
        return { success: false };
    }
}
