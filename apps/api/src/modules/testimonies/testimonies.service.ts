import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestimoniesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Submit a testimony
     */
    async submitTestimony(
        userId: string,
        data: {
            title: string;
            content: string;
            relatedPrayerId?: string;
            isAnonymous?: boolean;
        }
    ) {
        return this.prisma.testimony.create({
            data: {
                userId,
                title: data.title,
                content: data.content,
                relatedPrayerId: data.relatedPrayerId,
                isAnonymous: data.isAnonymous ?? false,
                status: 'PENDING', // Requires moderation
            },
        });
    }

    /**
     * Get approved testimonies
     */
    async getTestimonies(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [testimonies, total] = await Promise.all([
            this.prisma.testimony.findMany({
                where: { status: 'APPROVED' },
                include: {
                    user: {
                        select: { firstName: true, lastName: true },
                    },
                    _count: { select: { upvotes: true } },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.testimony.count({ where: { status: 'APPROVED' } }),
        ]);

        return {
            testimonies: testimonies.map(t => ({
                id: t.id,
                title: t.title,
                content: t.content,
                userName: t.isAnonymous ? 'Anonymous' : `${t.user.firstName} ${t.user.lastName?.charAt(0) || ''}.`,
                upvotes: t._count.upvotes,
                createdAt: t.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get featured testimonies
     */
    async getFeaturedTestimonies(limit = 5) {
        const testimonies = await this.prisma.testimony.findMany({
            where: {
                status: 'APPROVED',
                isFeatured: true,
            },
            include: {
                user: { select: { firstName: true, lastName: true } },
                _count: { select: { upvotes: true } },
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return testimonies.map(t => ({
            id: t.id,
            title: t.title,
            content: t.content,
            userName: t.isAnonymous ? 'Anonymous' : `${t.user.firstName} ${t.user.lastName?.charAt(0) || ''}.`,
            upvotes: t._count.upvotes,
        }));
    }

    /**
     * Upvote a testimony
     */
    async upvoteTestimony(testimonyId: string, userId: string) {
        const existing = await this.prisma.testimonyUpvote.findFirst({
            where: { testimonyId, userId },
        });

        if (existing) {
            // Remove upvote
            await this.prisma.testimonyUpvote.delete({
                where: { id: existing.id },
            });
            return { upvoted: false };
        }

        // Add upvote
        await this.prisma.testimonyUpvote.create({
            data: { testimonyId, userId },
        });
        return { upvoted: true };
    }

    /**
     * Moderate testimony (admin)
     */
    async moderateTestimony(testimonyId: string, action: 'approve' | 'reject' | 'feature') {
        const updates: any = {};

        if (action === 'approve') {
            updates.status = 'APPROVED';
        } else if (action === 'reject') {
            updates.status = 'REJECTED';
        } else if (action === 'feature') {
            updates.isFeatured = true;
        }

        return this.prisma.testimony.update({
            where: { id: testimonyId },
            data: updates,
        });
    }

    /**
     * Get user's testimonies
     */
    async getUserTestimonies(userId: string) {
        return this.prisma.testimony.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
