import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { Church: true },
        });
        if (!user) return null;
        return { ...user, homeChurch: user.Church };
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
    }

    async updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        displayName?: string;
        bio?: string;
        avatarUrl?: string;
        language?: string;
        timezone?: string;
    }) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async setHomeChurch(userId: string, churchId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { homeChurchId: churchId },
        });
    }

    async updateNotificationSettings(userId: string, enabled: boolean) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { notificationsEnabled: enabled },
        });
    }
}
