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
            (this.prisma.user as any).findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    displayName: true,
                    subscriptionTier: true,
                    emailVerified: true,
                    createdAt: true,
                    lastLoginAt: true,
                    totalPrayers: true,
                }
            }),
            this.prisma.user.count({ where })
        ]);

        return {
            users: users.map(u => ({
                ...u,
                isEmailVerified: u.emailVerified,
                prayerCount: (u as any).totalPrayers || 0,
            })),
            total,
            page,
            limit
        };
    }

    async getUser(id: string) {
        return (this.prisma.user as any).findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                displayName: true,
                subscriptionTier: true,
                emailVerified: true,
                createdAt: true,
                lastLoginAt: true,
                totalPrayers: true,
                role: true,
                isBanned: true,
                bannedReason: true,
            }
        });
    }

    async createUser(data: any) {
        // Basic implementation - requires password hashing import if real auth used
        const { password, role, ...userData } = data;
        return this.prisma.user.create({
            data: {
                ...userData,
                id: crypto.randomUUID(),
                role: role || 'USER',
                passwordHash: password ? 'hashed_placeholder' : undefined,
                updatedAt: new Date(),
            }
        });
    }

    async updateUser(id: string, data: any) {
        const { password, ...updateData } = data;

        if (password) {
            (updateData as any).passwordHash = 'hashed_placeholder';
        }

        return this.prisma.user.update({ 
            where: { id }, 
            data: {
                ...updateData,
                updatedAt: new Date(),
            } 
        });
    }

    async deleteUser(id: string) {
        return this.prisma.user.delete({ where: { id } });
    }

    async banUser(id: string, reason: string) {
        await (this.prisma.user as any).update({
            where: { id },
            data: {
                isBanned: true,
                bannedReason: reason,
            }
        });
        
        // Also persist in reports
        await this.prisma.userReport.create({
            data: {
                id: crypto.randomUUID(),
                reporterId: 'SYSTEM',
                reportedUserId: id,
                reason: 'OTHER',
                details: `BANNED: ${reason}`,
                status: 'RESOLVED',
                createdAt: new Date(),
            }
        });
        return { id, banned: true, reason };
    }

    async unbanUser(id: string) {
        return (this.prisma.user as any).update({
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
        return this.prisma.church.create({ 
            data: { 
                ...data, 
                slug,
                countryCode: data.countryCode || 'US', // Schema requires it
                updatedAt: new Date(),
            } 
        });
    }

    async updateChurch(id: string, data: any) {
        return this.prisma.church.update({ 
            where: { id }, 
            data: {
                ...data,
                updatedAt: new Date(),
            }
        });
    }

    async deleteChurch(id: string) {
        return this.prisma.church.delete({ where: { id } });
    }

    async unverifyAllChurches() {
        return this.prisma.church.updateMany({
            data: { isVerified: false, verifiedAt: null }
        });
    }



    // ===== MEMORIAL MANAGEMENT =====
    async getMemorials(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [memorials, total] = await Promise.all([
            this.prisma.memorial.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { owner: { select: { firstName: true, lastName: true, email: true } } }
            }),
            this.prisma.memorial.count()
        ]);

        return {
            memorials: memorials.map(m => ({
                ...m,
                isActive: m.isPublic,
                isPremium: m.tier === 'PREMIUM',
                totalOfferings: m.totalCandles + m.totalMasses + m.totalFlowers + m.totalPrayers,
                userName: m.owner ? `${m.owner.firstName} ${m.owner.lastName}` : 'Unknown'
            })),
            total,
            page,
            limit
        };
    }

    async createMemorial(data: any, adminId: string) {
        // Generate slug
        let slug = `${data.firstName}-${data.lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        // Ensure uniqueness with timestamp
        slug = `${slug}-${Date.now().toString().slice(-6)}`;

        const memorial = await this.prisma.memorial.create({
            data: {
                slug,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                deathDate: data.deathDate ? new Date(data.deathDate) : null,
                biography: data.biography,
                photoUrl: data.photoUrl,
                tier: data.isPremium ? 'PREMIUM' : 'BASIC',
                isPublic: data.isActive !== false, // Default to true
                ownerId: adminId,
                updatedAt: new Date(),
            }
        });

        return {
            ...memorial,
            isActive: memorial.isPublic,
            isPremium: memorial.tier === 'PREMIUM',
            totalOfferings: 0,
        };
    }

    async updateMemorial(id: string, data: any) {
        const updateData: any = {};
        if (data.firstName) updateData.firstName = data.firstName;
        if (data.lastName) updateData.lastName = data.lastName;
        if (data.birthDate) updateData.birthDate = new Date(data.birthDate);
        if (data.deathDate) updateData.deathDate = new Date(data.deathDate);
        if (data.biography !== undefined) updateData.biography = data.biography;
        if (data.photoUrl !== undefined) updateData.photoUrl = data.photoUrl;
        if (data.isPremium !== undefined) updateData.tier = data.isPremium ? 'PREMIUM' : 'BASIC';
        if (data.isActive !== undefined) updateData.isPublic = data.isActive;

        const memorial = await this.prisma.memorial.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date(),
            }
        });

        return {
            ...memorial,
            isActive: memorial.isPublic,
            isPremium: memorial.tier === 'PREMIUM',
        };
    }

    async deleteMemorial(id: string) {
        await this.prisma.memorial.delete({ where: { id } });
        return { id, deleted: true };
    }

    // ===== NOTIFICATION MANAGEMENT =====
    async getNotifications(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notification.count()
        ]);
        return { notifications, total, page, limit };
    }

    async getRecentNotifications() {
        const notifications = await this.prisma.notification.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
        });
        return { notifications, unreadCount: 0 };
    }

    async sendNotification(data: any) {
        return this.prisma.notification.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type || 'ALL',
                targetAudience: data.targetAudience || 'ALL',
                status: data.scheduledFor ? 'SCHEDULED' : 'SENT',
                scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
                sentAt: data.scheduledFor ? null : new Date(),
            }
        });
    }

    // ===== REPORTS =====
    // ===== REPORTS =====
    async getReports(page = 1, limit = 20, status?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (status) where.status = status;

        const [reports, total] = await Promise.all([
            this.prisma.userReport.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    User_UserReport_reporterIdToUser: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    }
                }
            }),
            this.prisma.userReport.count({ where })
        ]);

        return {
            reports: reports.map(r => ({
                id: r.id,
                type: 'USER_REPORT',
                reason: r.reason,
                description: r.details,
                status: r.status,
                createdAt: r.createdAt,
                reporter: {
                    id: r.User_UserReport_reporterIdToUser?.id,
                    name: `${r.User_UserReport_reporterIdToUser?.firstName || ''} ${r.User_UserReport_reporterIdToUser?.lastName || ''}`.trim(),
                    email: r.User_UserReport_reporterIdToUser?.email
                },
                targetType: 'USER',
                targetId: r.reportedUserId
            })),
            total,
            page,
            limit
        };
    }

    async updateReport(id: string, action: 'resolve' | 'dismiss') {
        const statusMap = {
            'resolve': 'RESOLVED',
            'dismiss': 'DISMISSED'
        };

        return this.prisma.userReport.update({
            where: { id },
            data: {
                status: statusMap[action] as any, // Cast to match enum
                resolvedAt: new Date()
            }
        });
    }


    // ===== ARTICLES CMS =====
    async getArticles(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [articles, total] = await Promise.all([
            this.prisma.article.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { firstName: true, lastName: true }
                    }
                }
            }),
            this.prisma.article.count({ where })
        ]);

        return { articles, total, page, limit };
    }

    async getArticle(id: string) {
        return this.prisma.article.findUnique({
            where: { id },
            include: { author: { select: { firstName: true, lastName: true } } }
        });
    }

    async createArticle(data: any, authorId: string) {
        // Generate unique slug
        let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        slug = `${slug}-${Date.now().toString().slice(-6)}`;

        return (this.prisma.article as any).create({
            data: {
                title: data.title,
                slug,
                content: data.content,
                excerpt: data.excerpt,
                category: data.category,
                coverImage: data.coverImage,
                isPublished: data.isPublished || false,
                publishedAt: data.isPublished ? new Date() : null,
                authorId
            }
        });
    }

    async updateArticle(id: string, data: any) {
        return (this.prisma.article as any).update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                category: data.category,
                coverImage: data.coverImage,
                isPublished: data.isPublished,
                publishedAt: data.isPublished ? new Date() : undefined
            }
        });
    }

    async deleteArticle(id: string) {
        return this.prisma.article.delete({ where: { id } });
    }

    async getUserReports(startDate?: string, endDate?: string) {
        const where: any = {};
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        try {
            const users = await this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    subscriptionTier: true,
                    createdAt: true,
                    lastLoginAt: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 100
            });

            // Parallel fetch stats for each user
            const userStats = await Promise.all(users.map(async (u) => {
                const [prayerCount, candleCount, totalSpent] = await Promise.all([
                    this.prisma.prayerAction.count({ where: { userId: u.id } }),
                    this.prisma.prayerCandle.count({ where: { userId: u.id } }),
                    this.prisma.purchaseEvent.aggregate({
                        where: { userId: u.id, status: 'COMPLETED' },
                        _sum: { amount: true }
                    })
                ]);

                return {
                    id: u.id,
                    email: u.email,
                    name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
                    subscriptionTier: u.subscriptionTier,
                    prayerCount,
                    candleCount,
                    totalSpent: (totalSpent._sum.amount || 0) / 100, // Convert cents to dollars
                    createdAt: u.createdAt,
                    lastActive: u.lastLoginAt,
                };
            }));

            return { users: userStats };
        } catch (err) {
            return { users: [] };
        }
    }

    async getRevenueReports(startDate?: string, endDate?: string) {
        // Calculate date range (default to last 30 days)
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Fetch completed purchase events
        const events = await this.prisma.purchaseEvent.findMany({
            where: {
                status: 'COMPLETED',
                purchasedAt: {
                    gte: start,
                    lte: end
                }
            },
            orderBy: { purchasedAt: 'desc' },
            include: {
                User: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        // 1. Calculate Total Revenue
        const totalRevenue = events.reduce((sum, e) => sum + (e.amount || 0), 0);

        // 2. Aggregate by Date (for charts)
        const revenueByDateMap = new Map<string, number>();
        // Initialize all dates in range with 0
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            revenueByDateMap.set(d.toISOString().split('T')[0], 0);
        }

        events.forEach(e => {
            const date = e.purchasedAt.toISOString().split('T')[0];
            const current = revenueByDateMap.get(date) || 0;
            revenueByDateMap.set(date, current + (e.amount || 0));
        });

        const revenueByDate = Array.from(revenueByDateMap.entries())
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // 3. Aggregate by Product Type
        const revenueByTypeMap = new Map<string, number>();
        events.forEach(e => {
            const type = e.productType || 'unknown';
            const current = revenueByTypeMap.get(type) || 0;
            revenueByTypeMap.set(type, current + (e.amount || 0));
        });

        const revenueByType = Array.from(revenueByTypeMap.entries())
            .map(([type, amount]) => ({ type, amount }));

        return {
            totalRevenue,
            transactionCount: events.length,
            averageOrderValue: events.length ? Math.round(totalRevenue / events.length) : 0,
            revenueByDate,
            revenueByType,
            recentTransactions: events.slice(0, 10).map(e => ({
                id: e.id,
                user: `${e.User?.firstName || ''} ${e.User?.lastName || ''}`.trim() || e.User?.email || 'Unknown',
                amount: e.amount || 0,
                status: e.status,
                date: e.purchasedAt,
                product: e.productId
            }))
        };
    }

    // ===== ABANDONED CART MANAGEMENT =====
    async getAbandonedCarts(
        page = 1,
        limit = 20,
        filters?: { type?: string; source?: string; converted?: boolean },
    ) {
        try {
            const skip = (page - 1) * limit;
            const where: any = {};

            if (filters?.type) where.type = filters.type;
            if (filters?.source) where.source = filters.source;
            if (filters?.converted !== undefined) where.converted = filters.converted;

            const [carts, total] = await Promise.all([
                this.prisma.abandonedCart.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.abandonedCart.count({ where }),
            ]);

            return {
                carts: await Promise.all(carts.map(async cart => ({
                    ...cart,
                    cartValue: await this.calculateCartValue(cart.data as any),
                }))),
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        } catch (err) {
            return { carts: [], total: 0, page: 1, totalPages: 0 };
        }
    }

    async getAbandonedCartStats() {
        try {
            const [total, today, converted, pending] = await Promise.all([
                this.prisma.abandonedCart.count(),
                this.prisma.abandonedCart.count({
                    where: {
                        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                    },
                }),
                this.prisma.abandonedCart.count({ where: { converted: true } }),
                this.prisma.abandonedCart.count({
                    where: { converted: false, reminderCount: { lt: 3 } },
                }),
            ]);

            return {
                total,
                today,
                converted,
                pending,
                conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : '0',
            };
        } catch (err) {
            return { total: 0, today: 0, converted: 0, pending: 0, conversionRate: '0' };
        }
    }

    async getAbandonedCart(id: string) {
        try {
            const cart = await this.prisma.abandonedCart.findUnique({ where: { id } });
            if (!cart) return { error: 'Cart not found' };

            return {
                ...cart,
                cartValue: await this.calculateCartValue(cart.data as any),
                items: this.parseCartItems(cart.data as any),
            };
        } catch (err) {
            return { error: 'Failed to fetch cart' };
        }
    }

    async createAbandonedCart(data: {
        type: string;
        email: string;
        name?: string;
        phone?: string;
        data: any;
        step: string;
        source?: string;
    }) {
        try {
            const cart = await this.prisma.abandonedCart.create({
                data: {
                    type: data.type,
                    email: data.email,
                    name: data.name,
                    phone: data.phone,
                    data: data.data,
                    step: data.step,
                },
            });
            return { success: true, cart };
        } catch (err) {
            return { success: false, error: 'Failed to create cart' };
        }
    }

    async sendCartReminder(id: string, options?: { email?: boolean; push?: boolean }) {
        try {
            const cart = await this.prisma.abandonedCart.findUnique({ where: { id } });
            if (!cart) return { success: false, error: 'Cart not found' };

            const cartValue = await this.calculateCartValue(cart.data as any);
            const items = this.parseCartItems(cart.data as any);

            // Update reminder count
            await this.prisma.abandonedCart.update({
                where: { id },
                data: {
                    reminderCount: { increment: 1 },
                    lastReminder: new Date(),
                },
            });

            const remindersSent: string[] = [];

            // Send email reminder (would integrate with email service)
            if (options?.email !== false) {
                console.log(`[ABANDONED CART] Email reminder to ${cart.email}: ${cart.type}, Value: $${cartValue.total}`);
                remindersSent.push('email');
            }

            // Send push notification (would integrate with notification service)
            if (options?.push !== false) {
                console.log(`[ABANDONED CART] Push notification for ${cart.email}: Complete your ${cart.type}`);
                remindersSent.push('push');
            }

            return {
                success: true,
                message: `Reminder sent via: ${remindersSent.join(', ')}`,
                cartValue,
                items,
            };
        } catch (err) {
            return { success: false, error: 'Failed to send reminder' };
        }
    }

    async sendBulkCartReminders(ids: string[], options?: { email?: boolean; push?: boolean }) {
        const results = await Promise.all(ids.map(id => this.sendCartReminder(id, options)));
        const successful = results.filter(r => r.success).length;
        return { success: true, sent: successful, total: ids.length };
    }

    async markCartConverted(id: string) {
        try {
            const cart = await this.prisma.abandonedCart.update({
                where: { id },
                data: { converted: true, convertedAt: new Date() },
            });
            return { success: true, cart };
        } catch (err) {
            return { success: false, error: 'Failed to update cart' };
        }
    }

    async deleteAbandonedCart(id: string) {
        try {
            await this.prisma.abandonedCart.delete({ where: { id } });
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete cart' };
        }
    }

    // ===== AD MANAGEMENT =====
    async getAdContainers() {
        return (this.prisma as any).adContainer.findMany({
            orderBy: { sectionKey: 'asc' }
        });
    }

    async upsertAdContainer(data: any) {
        const { id, ...adData } = data;
        
        if (id) {
            return (this.prisma as any).adContainer.update({
                where: { id },
                data: {
                    ...adData,
                    updatedAt: new Date()
                }
            });
        }

        return (this.prisma as any).adContainer.create({
            data: {
                ...adData,
                updatedAt: new Date()
            }
        });
    }

    async deleteAdContainer(id: string) {
        return (this.prisma as any).adContainer.delete({
            where: { id }
        });
    }

    // ===== OFFERINGS MANAGEMENT =====
    async getOfferingsStats() {
        const [massCount, candleCount, bouquetCount, donationCount] = await Promise.all([
            this.prisma.massOffering.count({ where: { status: 'PAID' as any } }),
            this.prisma.prayerCandle.count({ where: { paymentStatus: 'COMPLETED' } }),
            this.prisma.spiritualBouquet.count({ where: { paymentStatus: 'COMPLETED' } }),
            this.prisma.platformDonation.count({ where: { status: 'COMPLETED' } }),
        ]);

        return { massCount, candleCount, bouquetCount, donationCount };
    }

    async getMassOfferings(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { intention: { contains: search, mode: 'insensitive' as const } },
                { name: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        return this.prisma.massOffering.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }

    async getCandles(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { intention: { contains: search, mode: 'insensitive' as const } },
                { name: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        return this.prisma.prayerCandle.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }

    async getDonations(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { email: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        return this.prisma.platformDonation.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }

    async getSpiritualBouquets(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { recipientName: { contains: search, mode: 'insensitive' as const } },
                { creatorName: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        return this.prisma.spiritualBouquet.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }

    // Helper: Calculate cart value from cart data
    private async calculateCartValue(data: any): Promise<{ items: { name: string; price: number }[]; total: number }> {
        const items: { name: string; price: number }[] = [];
        let total = 0;

        if (!data) return { items, total };

        // Fetch current app settings for real pricing
        const settings = await this.getSettings();

        // Handle different cart types
        if (data.duration) {
            // Candle pricing from settings
            const candlePrices: Record<string, number> = {
                ONE_DAY: settings.candleOneDayPrice / 100,
                THREE_DAYS: settings.candleThreeDayPrice / 100,
                SEVEN_DAYS: settings.candleSevenDayPrice / 100,
                THIRTY_DAYS: settings.candleThirtyDayPrice / 100,
            };
            const price = candlePrices[data.duration] || 0;
            items.push({ name: `Candle (${data.duration})`, price });
            total += price;
        }

        if (data.massType) {
            // Mass offering pricing from settings
            const massPrices: Record<string, number> = {
                regular: settings.massRegularPrice / 100,
                expedited: settings.massExpeditedPrice / 100,
                novena: settings.massNovenaPrice / 100,
                gregorian: settings.massGregorianPrice / 100,
                perpetual: settings.massPerpetualPrice / 100,
            };
            const price = massPrices[data.massType] || 0;
            items.push({ name: `Mass Offering (${data.massType})`, price });
            total += price;
        }

        if (data.amount) {
            // Direct amount (donations)
            items.push({ name: 'Donation', price: data.amount });
            total += data.amount;
        }

        return { items, total };
    }

    // Helper: Parse cart items for display
    private parseCartItems(data: any): any[] {
        const items: any[] = [];

        if (!data) return items;

        if (data.intention) items.push({ label: 'Intention', value: data.intention });
        if (data.name) items.push({ label: 'Name', value: data.name });
        if (data.duration) items.push({ label: 'Duration', value: data.duration });
        if (data.massType) items.push({ label: 'Mass Type', value: data.massType });

        return items;
    }
}
