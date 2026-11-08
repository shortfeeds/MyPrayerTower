'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getUserFromCookie } from '@/lib/auth';
import { notifyIndexNow } from '@/lib/indexnow';
import { moderateContent } from '@/lib/moderation';
import { validateHoneypot, validateTimeTrap, inspectSpamContent } from '@/lib/spam-protection';

// Alias db to prisma for compatibility
const prisma = db;

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
                user: { // relation name is lowercase
                    select: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                },
                _count: {
                    select: { prayerActions: true } // relation name is lowercase
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
                user: p.isAnonymous ? null : p.user, // Use p.user
                prayerCount: p.prayerCount + (p._count?.prayerActions || 0), // Use p._count.prayerActions
                createdAt: p.createdAt,
                isAnswered: p.isAnswered,
                status: p.status,
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

        // 1. Anti-Spam: Honeypot check
        const honeypot = formData.get('website') as string;
        const honeypotSecondary = formData.get('website_url') as string;
        if (!validateHoneypot(honeypot, honeypotSecondary)) {
            console.warn('[SPAM SHIELD] Prayer request honeypot caught bot');
            return { success: false, message: 'Spam detected.' };
        }

        // 2. Anti-Spam: Time-trap check
        const timeToken = formData.get('_f_time') as string;
        if (timeToken && !validateTimeTrap(timeToken, 2.0)) {
            console.warn('[SPAM SHIELD] Prayer request sub-human submission speed');
            return { success: false, message: 'Submission too rapid. Please try again.' };
        }

        // 3. Anti-Spam: Keyword and promotional link inspection
        const spamCheck = inspectSpamContent({ message: content });
        if (spamCheck.isSpam) {
            return { success: false, message: spamCheck.reason || 'Content rejected as promotional or spam.' };
        }

        // 4. Content Moderation (profanity & link filtering)
        const moderation = moderateContent(content);
        if (!moderation.isValid) {
            return { success: false, message: moderation.reason || 'Content rejected.' };
        }

        const user = await getUserFromCookie();
        if (!user) {
            return { success: false, message: 'You must be logged in to post a prayer request.' };
        }
        const userId = user.id;

        // Convert category to uppercase enum
        const categoryEnum = category.toUpperCase();
        const visibilityEnum = visibility.toUpperCase();

        const prayer = await prisma.prayerRequest.create({
            data: {
                id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
                content,
                category: categoryEnum as any,
                visibility: visibilityEnum as any,
                userId: userId,
                // All free listings sent to admin panel (PENDING)
                status: 'PENDING',
                updatedAt: new Date(),
            }
        });

        revalidatePath('/prayer-wall');

        // Auto-notify search engines of new content
        await notifyIndexNow('/prayer-wall');

        return { success: true, message: 'Prayer request submitted for review!' };

    } catch (error) {
        console.error('Error submitting prayer:', error);
        return { success: false, message: 'Failed to submit prayer.' };
    }
}

export async function prayForRequest(prayerId: string) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return { success: false, message: 'Please login to pray.' };
        }
        const userId = user.id;

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
                    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
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

export async function markPrayerAnswered(prayerId: string) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return { success: false, message: 'Unauthorized' };
        }
        const userId = user.id;

        // Check if user owns the prayer
        const prayer = await prisma.prayerRequest.findUnique({
            where: { id: prayerId },
            select: { userId: true }
        });

        if (!prayer || prayer.userId !== userId) {
            return { success: false, message: 'Unauthorized' };
        }

        await prisma.prayerRequest.update({
            where: { id: prayerId },
            data: {
                isAnswered: true,
                answeredAt: new Date()
            }
        });

        revalidatePath('/prayer-wall');
        return { success: true };
    } catch (error) {
        console.error('Error marking answered:', error);
        return { success: false, message: 'Failed to update prayer' };
    }
}

export async function reportPrayer(prayerId: string, reason: string) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return { success: false, message: 'Please login to report.' };
        }
        const userId = user.id;

        const validReasons = ['SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'IMPERSONATION', 'MALICIOUS_LINKS', 'OTHER'];
        const reasonEnum = validReasons.includes(reason) ? reason : 'OTHER';

        await prisma.report.create({
            data: {
                reason: reasonEnum as any,
                status: 'PENDING',
                targetType: 'PRAYER_REQUEST',
                targetId: prayerId,
                reporterId: userId,
                description: `Reported for ${reason}`,
            }
        });

        return { success: true, message: 'Report submitted for review' };
    } catch (error) {
        console.error('Error reporting:', error);
    }
}

export async function getUserPrayerRequests() {
    try {
        const user = await getUserFromCookie();
        if (!user) return [];

        const prayers = await prisma.prayerRequest.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
                isAnswered: true,
                answeredAt: true
            }
        });

        return prayers.map(p => ({
            ...p,
            date: new Date(p.createdAt).toLocaleDateString(),
            status: p.isAnswered ? 'ANSWERED' : 'ACTIVE'
        }));

    } catch (error) {
        console.error('Error fetching user prayers:', error);
        return [];
    }
}
