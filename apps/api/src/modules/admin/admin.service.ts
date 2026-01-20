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

    // ===== USER MANAGEMENT =====
    async getUsers(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { email: { contains: search, mode: 'insensitive' as const } },
                { firstName: { contains: search, mode: 'insensitive' as const } },
                { lastName: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    subscriptionTier: true,
                    isEmailVerified: true,
                    isBanned: true,
                    bannedReason: true,
                    createdAt: true,
                    lastLoginAt: true,
                    _count: { select: { prayerRequests: true } }
                }
            }),
            this.prisma.user.count({ where })
        ]);

        return {
            users: users.map(u => ({
                ...u,
                prayerCount: u._count.prayerRequests,
                _count: undefined
            })),
            total,
            page,
            limit
        };
    }

    async createUser(data: any) {
        return this.prisma.user.create({ data });
    }

    async updateUser(id: string, data: any) {
        return this.prisma.user.update({ where: { id }, data });
    }

    async deleteUser(id: string) {
        return this.prisma.user.delete({ where: { id } });
    }

    async banUser(id: string, reason: string) {
        return this.prisma.user.update({
            where: { id },
            data: { isBanned: true, bannedReason: reason }
        });
    }

    async unbanUser(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: { isBanned: false, bannedReason: null }
        });
    }

    // ===== CHURCH MANAGEMENT =====
    async getChurches(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { city: { contains: search, mode: 'insensitive' as const } },
                { country: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        const [churches, total] = await Promise.all([
            this.prisma.church.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.church.count({ where })
        ]);

        return { churches, total, page, limit };
    }

    async createChurch(data: any) {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return this.prisma.church.create({ data: { ...data, slug } });
    }

    async updateChurch(id: string, data: any) {
        return this.prisma.church.update({ where: { id }, data });
    }

    async deleteChurch(id: string) {
        return this.prisma.church.delete({ where: { id } });
    }

    async unverifyAllChurches() {
        return this.prisma.church.updateMany({
            data: { isVerified: false, verifiedAt: null }
        });
    }
}
