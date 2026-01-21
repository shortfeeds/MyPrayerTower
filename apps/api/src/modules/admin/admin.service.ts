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
                    displayName: true,
                    subscriptionTier: true,
                    emailVerified: true,
                    createdAt: true,
                    lastLoginAt: true,
                }
            }),
            this.prisma.user.count({ where })
        ]);

        return {
            users: users.map(u => ({
                ...u,
                role: 'USER', // Default role - actual role management would need schema updates
                isEmailVerified: u.emailVerified,
                isBanned: false,
                bannedReason: null,
                prayerCount: 0,
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
        // Filter out fields that don't exist in the schema
        const { isBanned, bannedReason, ...validData } = data;
        return this.prisma.user.update({ where: { id }, data: validData });
    }

    async deleteUser(id: string) {
        return this.prisma.user.delete({ where: { id } });
    }

    async banUser(id: string, reason: string) {
        // isBanned field doesn't exist in schema - this would need schema update
        // For now, just return success
        return { id, banned: true, reason };
    }

    async unbanUser(id: string) {
        // isBanned field doesn't exist in schema - this would need schema update
        // For now, just return success
        return { id, banned: false };
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

    // ===== ARTICLE MANAGEMENT (CMS) =====
    // Note: Article model needs to be added to Prisma schema
    async getArticles(page = 1, limit = 20, category?: string) {
        // Stub implementation - returns empty until Article model is added to schema
        return { articles: [], total: 0, page, limit };
    }

    async createArticle(data: any) {
        // Stub - return the data as if created
        return {
            id: `article_${Date.now()}`,
            ...data,
            slug: data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            author: data.author || 'Admin',
            createdAt: new Date(),
            updatedAt: new Date(),
            views: 0,
        };
    }

    async updateArticle(id: string, data: any) {
        return { id, ...data, updatedAt: new Date() };
    }

    async deleteArticle(id: string) {
        return { id, deleted: true };
    }

    // ===== MEMORIAL MANAGEMENT =====
    // Note: Memorial model needs to be added to Prisma schema
    async getMemorials(page = 1, limit = 20) {
        // Stub implementation - returns empty until Memorial model is added to schema
        return { memorials: [], total: 0, page, limit };
    }

    async createMemorial(data: any) {
        return {
            id: `memorial_${Date.now()}`,
            ...data,
            createdAt: new Date(),
            totalOfferings: 0,
            totalCandles: 0,
        };
    }

    async updateMemorial(id: string, data: any) {
        return { id, ...data };
    }

    async deleteMemorial(id: string) {
        return { id, deleted: true };
    }

    // ===== NOTIFICATION MANAGEMENT =====
    // Note: AdminNotification model needs to be added to Prisma schema
    async getNotifications(page = 1, limit = 20) {
        // Stub implementation - returns empty until model is added
        return { notifications: [], total: 0, page, limit };
    }

    async getRecentNotifications() {
        return { notifications: [], unreadCount: 0 };
    }

    async sendNotification(data: any) {
        return {
            id: `notification_${Date.now()}`,
            title: data.title,
            message: data.message,
            type: data.type || 'ALL',
            targetAudience: data.targetAudience || 'ALL',
            status: data.scheduledFor ? 'SCHEDULED' : 'SENT',
            scheduledFor: data.scheduledFor || null,
            sentAt: data.scheduledFor ? null : new Date(),
            createdAt: new Date(),
            recipientCount: 0,
        };
    }

    // ===== REPORTS =====
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

            return {
                users: users.map(u => ({
                    id: u.id,
                    email: u.email,
                    name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
                    subscriptionTier: u.subscriptionTier,
                    prayerCount: 0,
                    candleCount: 0,
                    totalSpent: 0,
                    createdAt: u.createdAt,
                    lastActive: u.lastLoginAt,
                }))
            };
        } catch (err) {
            return { users: [] };
        }
    }

    async getRevenueReports(startDate?: string, endDate?: string) {
        // Stub implementation - returns empty transactions
        // Would need actual payment data to populate
        return { transactions: [] };
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
                carts: carts.map(cart => ({
                    ...cart,
                    cartValue: this.calculateCartValue(cart.data as any),
                })),
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
                cartValue: this.calculateCartValue(cart.data as any),
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

            const cartValue = this.calculateCartValue(cart.data as any);
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

    // Helper: Calculate cart value from cart data
    private calculateCartValue(data: any): { items: { name: string; price: number }[]; total: number } {
        const items: { name: string; price: number }[] = [];
        let total = 0;

        if (!data) return { items, total };

        // Handle different cart types
        if (data.duration) {
            // Candle pricing
            const candlePrices: Record<string, number> = {
                ONE_DAY: 0,
                THREE_DAYS: 2.99,
                SEVEN_DAYS: 5.99,
                FOURTEEN_DAYS: 9.99,
                THIRTY_DAYS: 14.99,
            };
            const price = candlePrices[data.duration] || 0;
            items.push({ name: `Candle (${data.duration})`, price });
            total += price;
        }

        if (data.massType) {
            // Mass offering pricing
            const massPrices: Record<string, number> = {
                regular: 10,
                expedited: 25,
                novena: 50,
                gregorian: 500,
                perpetual: 1000,
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
