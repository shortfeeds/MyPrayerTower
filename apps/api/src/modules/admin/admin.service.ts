import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ModerationStatus, ClaimStatus } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    // Dashboard stats
    async getDashboardStats() {
        const [users, churches, prayers, pendingPrayers, pendingClaims, recentPrayers] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.church.count(),
            this.prisma.prayerRequest.count({ where: { status: ModerationStatus.APPROVED } }),
            this.prisma.prayerRequest.count({ where: { status: ModerationStatus.PENDING } }),
            this.prisma.churchClaim.count({ where: { status: { in: [ClaimStatus.DOCUMENTS_SUBMITTED, ClaimStatus.UNDER_REVIEW] } } }),
            this.prisma.prayerRequest.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { firstName: true, lastName: true, email: true } } }
            }),
        ]);

        return { users, churches, prayers, pendingPrayers, pendingClaims, recentPrayers };
    }

    // Prayer moderation
    async getPendingPrayers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.prisma.prayerRequest.findMany({
            where: { status: ModerationStatus.PENDING },
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            skip,
            take: limit,
            orderBy: { createdAt: 'asc' },
        });
    }

    async approvePrayer(id: string, adminId: string) {
        return this.prisma.prayerRequest.update({
            where: { id },
            data: {
                status: ModerationStatus.APPROVED,
                moderatedBy: adminId,
                moderatedAt: new Date(),
            },
        });
    }

    async rejectPrayer(id: string, adminId: string, reason: string) {
        return this.prisma.prayerRequest.update({
            where: { id },
            data: {
                status: ModerationStatus.REJECTED,
                moderatedBy: adminId,
                moderatedAt: new Date(),
                rejectionReason: reason,
            },
        });
    }

    // Church claim review
    async getPendingClaims() {
        return this.prisma.churchClaim.findMany({
            where: { status: { in: [ClaimStatus.DOCUMENTS_SUBMITTED, ClaimStatus.UNDER_REVIEW] } },
            include: { Church: true, User: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }

    async approveClaim(claimId: string, adminId: string) {
        const claim = await this.prisma.churchClaim.update({
            where: { id: claimId },
            data: {
                status: ClaimStatus.APPROVED,
                reviewedBy: adminId,
                reviewedAt: new Date(),
            },
        });

        // Verify the church
        await this.prisma.church.update({
            where: { id: claim.churchId },
            data: {
                isVerified: true,
                verifiedAt: new Date(),
                claimedBy: claim.userId,
            },
        });

        return claim;
    }

    async rejectClaim(claimId: string, adminId: string, reason: string) {
        return this.prisma.churchClaim.update({
            where: { id: claimId },
            data: {
                status: ClaimStatus.REJECTED,
                reviewedBy: adminId,
                reviewedAt: new Date(),
                rejectionReason: reason,
            },
        });
    }

    // Settings
    async getSettings() {
        let settings = await this.prisma.appSettings.findUnique({
            where: { id: 'app_settings' }
        });

        if (!settings) {
            settings = await this.prisma.appSettings.create({
                data: { id: 'app_settings' }
            });
        }
        return settings;
    }

    async updateSettings(data: any) {
        return this.prisma.appSettings.update({
            where: { id: 'app_settings' },
            data
        });
    }
}
