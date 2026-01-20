import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChurchTier, ClaimStatus } from '@prisma/client';

@Injectable()
export class ChurchPortalService {
    constructor(private prisma: PrismaService) { }

    // ============================================
    // CHURCH CLAIM & VERIFICATION
    // ============================================

    async getClaimStatus(churchId: string, userId: string) {
        const claim = await this.prisma.churchClaim.findFirst({
            where: { churchId, userId },
            orderBy: { createdAt: 'desc' }
        });

        if (!claim) {
            return { hasClaim: false, status: null };
        }

        return {
            hasClaim: true,
            status: claim.status,
            claimId: claim.id
        };
    }

    async initiateChurchClaim(
        churchId: string,
        userId: string,
        data: {
            claimantName: string;
            claimantTitle: string;
            claimantEmail: string;
            claimantPhone: string;
        }
    ) {
        // Check if already claimed
        const existingClaim = await this.prisma.churchClaim.findFirst({
            where: {
                churchId,
                status: { in: [ClaimStatus.APPROVED, ClaimStatus.UNDER_REVIEW] }
            }
        });

        if (existingClaim) {
            throw new BadRequestException('This church has already been claimed');
        }

        // Create claim
        const claim = await this.prisma.churchClaim.create({
            data: {
                churchId,
                userId,
                ...data,
                status: ClaimStatus.PENDING,
            }
        });

        // Generate and send email OTP (placeholder - implement actual email sending)
        const emailOtp = Math.random().toString().substring(2, 8);
        await this.prisma.churchClaim.update({
            where: { id: claim.id },
            data: {
                emailOtp,
                emailOtpExpires: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
            }
        });

        // TODO: Send actual email with OTP
        console.log(`[ChurchPortal] Email OTP for claim ${claim.id}: ${emailOtp}`);

        return {
            claimId: claim.id,
            message: 'Verification email sent. Please check your inbox.'
        };
    }

    async verifyClaimEmail(claimId: string, otp: string) {
        const claim = await this.prisma.churchClaim.findUnique({
            where: { id: claimId }
        });

        if (!claim) throw new NotFoundException('Claim not found');
        if (claim.emailOtp !== otp) throw new BadRequestException('Invalid OTP');
        if (claim.emailOtpExpires && claim.emailOtpExpires < new Date()) {
            throw new BadRequestException('OTP expired');
        }

        await this.prisma.churchClaim.update({
            where: { id: claimId },
            data: {
                emailVerified: true,
                emailVerifiedAt: new Date(),
                status: ClaimStatus.EMAIL_VERIFIED,
                emailOtp: null
            }
        });

        return { success: true, message: 'Email verified successfully' };
    }

    // ============================================
    // CHURCH SUBSCRIPTION & UPGRADE
    // ============================================

    async upgradeChurch(churchId: string, userId: string, tier: ChurchTier, paymentId: string) {
        // Verify user is admin of this church
        const isAdmin = await this.isChurchAdmin(churchId, userId);
        if (!isAdmin) {
            throw new ForbiddenException('You do not have permission to upgrade this church');
        }

        const tierPrices: Record<ChurchTier, number> = {
            UNCLAIMED: 0,
            BASIC: 99,
            PRO: 249,
            CATHEDRAL: 499,
            DIOCESE: 2499,
        };

        // Create or update subscription
        const subscription = await this.prisma.churchSubscription.upsert({
            where: { churchId },
            create: {
                churchId,
                tier,
                paidAmount: tierPrices[tier],
                paidAt: new Date(),
                stripePaymentId: paymentId,
                isActive: true,
                activatedAt: new Date(),
                announcementsLimit: tier === 'BASIC' ? 3 : null,
                adminsLimit: tier === 'BASIC' ? 1 : tier === 'PRO' ? 3 : 10,
            },
            update: {
                tier,
                paidAmount: tierPrices[tier],
                paidAt: new Date(),
                stripePaymentId: paymentId,
                isActive: true,
                activatedAt: new Date(),
                announcementsLimit: tier === 'BASIC' ? 3 : null,
                adminsLimit: tier === 'BASIC' ? 1 : tier === 'PRO' ? 3 : 10,
            }
        });

        // Also verify the church
        await this.prisma.church.update({
            where: { id: churchId },
            data: { isVerified: true, verifiedAt: new Date() }
        });

        return subscription;
    }

    async getSubscription(churchId: string) {
        return this.prisma.churchSubscription.findUnique({
            where: { churchId }
        });
    }

    // ============================================
    // ANNOUNCEMENTS
    // ============================================

    async createAnnouncement(
        churchId: string,
        userId: string,
        data: { title: string; content: string; imageUrl?: string; linkUrl?: string; linkText?: string }
    ) {
        if (!await this.isChurchAdmin(churchId, userId)) {
            throw new ForbiddenException('You must be a church admin to post announcements');
        }

        // Check announcement limit
        const subscription = await this.getSubscription(churchId);
        if (subscription?.announcementsLimit) {
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);

            const count = await this.prisma.churchAnnouncement.count({
                where: { churchId, createdAt: { gte: thisMonth } }
            });

            if (count >= subscription.announcementsLimit) {
                throw new ForbiddenException(
                    `You have reached your monthly announcement limit (${subscription.announcementsLimit}). Upgrade to unlock unlimited announcements.`
                );
            }
        }

        return this.prisma.churchAnnouncement.create({
            data: { churchId, ...data }
        });
    }

    async getAnnouncements(churchId: string, limit = 10) {
        return this.prisma.churchAnnouncement.findMany({
            where: { churchId, isPublished: true },
            orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
            take: limit
        });
    }

    // ============================================
    // FOLLOWERS
    // ============================================

    async followChurch(churchId: string, userId: string) {
        const existing = await this.prisma.churchFollower.findUnique({
            where: { churchId_userId: { churchId, userId } }
        });

        if (existing) {
            return { alreadyFollowing: true };
        }

        await this.prisma.churchFollower.create({
            data: { churchId, userId }
        });

        // Increment follower count
        await this.prisma.church.update({
            where: { id: churchId },
            data: { followerCount: { increment: 1 } }
        });

        return { success: true };
    }

    async unfollowChurch(churchId: string, userId: string) {
        const existing = await this.prisma.churchFollower.findUnique({
            where: { churchId_userId: { churchId, userId } }
        });

        if (!existing) {
            return { notFollowing: true };
        }

        await this.prisma.churchFollower.delete({
            where: { id: existing.id }
        });

        // Decrement follower count
        await this.prisma.church.update({
            where: { id: churchId },
            data: { followerCount: { decrement: 1 } }
        });

        return { success: true };
    }

    async getFollowers(churchId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [followers, total] = await Promise.all([
            this.prisma.churchFollower.findMany({
                where: { churchId },
                include: { User: { select: { id: true, displayName: true, avatarUrl: true } } },
                skip,
                take: limit,
                orderBy: { followedAt: 'desc' }
            }),
            this.prisma.churchFollower.count({ where: { churchId } })
        ]);

        return { followers, total, page, pages: Math.ceil(total / limit) };
    }

    // ============================================
    // ADMIN MANAGEMENT
    // ============================================

    async isChurchAdmin(churchId: string, userId: string): Promise<boolean> {
        const admin = await this.prisma.churchAdmin.findUnique({
            where: { churchId_userId: { churchId, userId } }
        });
        return !!admin;
    }

    async addChurchAdmin(churchId: string, userId: string, targetUserId: string, role: 'ADMIN' | 'EDITOR' | 'VIEWER' = 'EDITOR') {
        // Check if current user is owner or admin
        const currentAdmin = await this.prisma.churchAdmin.findUnique({
            where: { churchId_userId: { churchId, userId } }
        });

        if (!currentAdmin || !['OWNER', 'ADMIN'].includes(currentAdmin.role)) {
            throw new ForbiddenException('Only owners and admins can add new admins');
        }

        // Check admin limit
        const subscription = await this.getSubscription(churchId);
        const adminCount = await this.prisma.churchAdmin.count({ where: { churchId } });

        if (subscription && adminCount >= subscription.adminsLimit) {
            throw new ForbiddenException(`Admin limit reached (${subscription.adminsLimit}). Upgrade to add more admins.`);
        }

        return this.prisma.churchAdmin.create({
            data: {
                churchId,
                userId: targetUserId,
                role,
            }
        });
    }

    // ============================================
    // DASHBOARD DATA
    // ============================================

    async getDashboardStats(churchId: string, userId: string) {
        if (!await this.isChurchAdmin(churchId, userId)) {
            throw new ForbiddenException('Access denied');
        }

        const [church, subscription, announcements, followers, events] = await Promise.all([
            this.prisma.church.findUnique({
                where: { id: churchId },
                select: { viewCount: true, followerCount: true, name: true, isVerified: true }
            }),
            this.getSubscription(churchId),
            this.prisma.churchAnnouncement.count({ where: { churchId } }),
            this.prisma.churchFollower.count({ where: { churchId } }),
            this.prisma.churchEvent.count({
                where: { churchId, startDate: { gte: new Date() } }
            })
        ]);

        return {
            church,
            subscription,
            stats: {
                totalViews: church?.viewCount || 0,
                totalFollowers: followers,
                totalAnnouncements: announcements,
                upcomingEvents: events,
            }
        };
    }
}
