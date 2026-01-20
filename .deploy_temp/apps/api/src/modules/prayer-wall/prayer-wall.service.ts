import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ModerationStatus, PrayerVisibility, Prisma } from '@prisma/client';

@Injectable()
export class PrayerWallService {
    constructor(private prisma: PrismaService) { }

    // Public prayer wall - only approved, public prayers
    async getPublicPrayers(options: {
        page?: number;
        limit?: number;
        category?: string;
    }) {
        const { page = 1, limit = 20, category } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.PrayerRequestWhereInput = {
            status: ModerationStatus.APPROVED,
            visibility: { in: [PrayerVisibility.PUBLIC, PrayerVisibility.ANONYMOUS] },
        };

        if (category) {
            where.category = category as any;
        }

        const [prayers, total] = await Promise.all([
            this.prisma.prayerRequest.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        },
                    },
                    _count: { select: { prayerActions: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.prayerRequest.count({ where }),
        ]);

        // Hide user info for anonymous prayers
        const processedPrayers = prayers.map((prayer) => ({
            ...prayer,
            user: prayer.visibility === PrayerVisibility.ANONYMOUS ? null : prayer.user,
            prayerCount: prayer._count.prayerActions,
        }));

        return {
            prayers: processedPrayers,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Submit new prayer request (goes to pending)
    async submitPrayerRequest(
        userId: string,
        data: {
            title?: string;
            content: string;
            category: string;
            visibility: string;
            churchId?: string;
        },
    ) {
        return this.prisma.prayerRequest.create({
            data: {
                userId,
                title: data.title,
                content: data.content,
                category: data.category as any,
                visibility: data.visibility as PrayerVisibility,
                churchId: data.churchId,
                status: ModerationStatus.PENDING, // Always starts as pending
            },
        });
    }

    // Pray for a request
    async prayForRequest(userId: string, prayerRequestId: string) {
        // Check if prayer exists and is public
        const prayer = await this.prisma.prayerRequest.findUnique({
            where: { id: prayerRequestId },
        });

        if (!prayer) {
            throw new NotFoundException('Prayer request not found');
        }

        if (prayer.status !== ModerationStatus.APPROVED) {
            throw new ForbiddenException('Cannot pray for unapproved prayer');
        }

        // Check if already prayed
        const existingAction = await this.prisma.prayerAction.findUnique({
            where: {
                prayerRequestId_userId: {
                    prayerRequestId,
                    userId,
                },
            },
        });

        if (existingAction) {
            return { alreadyPrayed: true, prayerCount: prayer.prayerCount };
        }

        // Create prayer action and increment count
        await this.prisma.$transaction([
            this.prisma.prayerAction.create({
                data: { prayerRequestId, userId },
            }),
            this.prisma.prayerRequest.update({
                where: { id: prayerRequestId },
                data: { prayerCount: { increment: 1 } },
            }),
        ]);

        // TODO: Send notification to prayer owner

        return { success: true, prayerCount: prayer.prayerCount + 1 };
    }

    // Mark prayer as answered
    async markAnswered(userId: string, prayerRequestId: string, testimony?: string) {
        const prayer = await this.prisma.prayerRequest.findUnique({
            where: { id: prayerRequestId },
        });

        if (!prayer) {
            throw new NotFoundException('Prayer request not found');
        }

        if (prayer.userId !== userId) {
            throw new ForbiddenException('Not your prayer request');
        }

        return this.prisma.prayerRequest.update({
            where: { id: prayerRequestId },
            data: {
                isAnswered: true,
                answeredAt: new Date(),
                testimony,
            },
        });
    }

    // Get user's own prayers
    async getUserPrayers(userId: string) {
        return this.prisma.prayerRequest.findMany({
            where: { userId },
            include: {
                _count: { select: { prayerActions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get answered prayers (testimonies)
    async getAnsweredPrayers(limit: number = 10) {
        return this.prisma.prayerRequest.findMany({
            where: {
                isAnswered: true,
                status: ModerationStatus.APPROVED,
                testimony: { not: null },
            },
            include: {
                user: {
                    select: { firstName: true, lastName: true, avatarUrl: true },
                },
            },
            orderBy: { answeredAt: 'desc' },
            take: limit,
        });
    }
}
