import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum ReportReason {
    SPAM = 'SPAM',
    HARASSMENT = 'HARASSMENT',
    INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
    IMPERSONATION = 'IMPERSONATION',
    MALICIOUS_LINKS = 'MALICIOUS_LINKS',
    OTHER = 'OTHER',
}

@Injectable()
export class ReportBlockService {
    private readonly logger = new Logger(ReportBlockService.name);

    constructor(private prisma: PrismaService) { }

    // Report a user
    async reportUser(
        reporterId: string,
        reportedUserId: string,
        reason: ReportReason,
        details?: string
    ) {
        if (reporterId === reportedUserId) {
            throw new BadRequestException('You cannot report yourself');
        }

        // Check if already reported
        const existing = await this.prisma.userReport.findFirst({
            where: {
                reporterId,
                reportedUserId,
                status: 'PENDING'
            }
        });

        if (existing) {
            throw new BadRequestException('You already have a pending report for this user');
        }

        const report = await this.prisma.userReport.create({
            data: {
                reporterId,
                reportedUserId,
                reason,
                details,
                status: 'PENDING',
            }
        });

        this.logger.log(`User ${reporterId} reported user ${reportedUserId} for ${reason}`);

        return { success: true, reportId: report.id };
    }

    // Block a user
    async blockUser(userId: string, blockedUserId: string) {
        if (userId === blockedUserId) {
            throw new BadRequestException('You cannot block yourself');
        }

        // Check if already blocked
        const existing = await this.prisma.userBlock.findFirst({
            where: { userId, blockedUserId }
        });

        if (existing) {
            throw new BadRequestException('User is already blocked');
        }

        await this.prisma.userBlock.create({
            data: { userId, blockedUserId }
        });

        this.logger.log(`User ${userId} blocked user ${blockedUserId}`);

        return { success: true, message: 'User blocked' };
    }

    // Unblock a user
    async unblockUser(userId: string, blockedUserId: string) {
        const block = await this.prisma.userBlock.findFirst({
            where: { userId, blockedUserId }
        });

        if (!block) {
            throw new BadRequestException('User is not blocked');
        }

        await this.prisma.userBlock.delete({
            where: { id: block.id }
        });

        return { success: true, message: 'User unblocked' };
    }

    // Get blocked users
    async getBlockedUsers(userId: string) {
        return this.prisma.userBlock.findMany({
            where: { userId },
            include: {
                blockedUser: {
                    select: { id: true, displayName: true, email: true }
                }
            }
        });
    }

    // Check if user is blocked
    async isBlocked(userId: string, targetUserId: string): Promise<boolean> {
        const block = await this.prisma.userBlock.findFirst({
            where: {
                OR: [
                    { userId, blockedUserId: targetUserId },
                    { userId: targetUserId, blockedUserId: userId }
                ]
            }
        });

        return !!block;
    }

    // Admin: Get pending reports
    async getPendingReports(limit = 20) {
        return this.prisma.userReport.findMany({
            where: { status: 'PENDING' },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                reporter: { select: { id: true, displayName: true, email: true } },
                reportedUser: { select: { id: true, displayName: true, email: true } }
            }
        });
    }

    // Admin: Resolve report
    async resolveReport(reportId: string, action: 'DISMISSED' | 'WARNED' | 'SUSPENDED', adminId: string) {
        return this.prisma.userReport.update({
            where: { id: reportId },
            data: {
                status: action,
                resolvedBy: adminId,
                resolvedAt: new Date()
            }
        });
    }
}
