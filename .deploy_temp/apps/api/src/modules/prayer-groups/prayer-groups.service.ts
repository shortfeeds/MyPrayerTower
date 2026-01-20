import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrayerGroupsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new prayer group
     */
    async createGroup(userId: string, data: { name: string; description?: string; isPrivate?: boolean }) {
        const group = await this.prisma.prayerGroup.create({
            data: {
                name: data.name,
                description: data.description,
                isPrivate: data.isPrivate ?? true,
                createdBy: userId,
                members: {
                    create: {
                        userId,
                        role: 'ADMIN',
                    },
                },
            },
            include: {
                members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
            },
        });

        return group;
    }

    /**
     * Get user's prayer groups
     */
    async getUserGroups(userId: string) {
        return this.prisma.prayerGroup.findMany({
            where: {
                members: { some: { userId } },
            },
            include: {
                members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
                _count: { select: { prayers: true, members: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    /**
     * Get group by ID
     */
    async getGroup(groupId: string, userId: string) {
        const group = await this.prisma.prayerGroup.findFirst({
            where: {
                id: groupId,
                OR: [
                    { isPrivate: false },
                    { members: { some: { userId } } },
                ],
            },
            include: {
                members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
                prayers: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    include: { user: { select: { id: true, firstName: true } } },
                },
            },
        });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        return group;
    }

    /**
     * Invite user to group
     */
    async inviteToGroup(groupId: string, inviterId: string, inviteeEmail: string) {
        // Verify inviter is admin
        const membership = await this.prisma.prayerGroupMember.findFirst({
            where: { groupId, userId: inviterId, role: 'ADMIN' },
        });

        if (!membership) {
            throw new ForbiddenException('Only admins can invite members');
        }

        // Find user by email
        const invitee = await this.prisma.user.findUnique({
            where: { email: inviteeEmail },
        });

        if (!invitee) {
            throw new NotFoundException('User not found');
        }

        // Create pending invitation
        return this.prisma.prayerGroupInvite.create({
            data: {
                groupId,
                inviterId,
                inviteeId: invitee.id,
                status: 'PENDING',
            },
        });
    }

    /**
     * Accept group invitation
     */
    async acceptInvite(inviteId: string, userId: string) {
        const invite = await this.prisma.prayerGroupInvite.findFirst({
            where: { id: inviteId, inviteeId: userId, status: 'PENDING' },
        });

        if (!invite) {
            throw new NotFoundException('Invitation not found');
        }

        // Add member and update invite
        await this.prisma.$transaction([
            this.prisma.prayerGroupMember.create({
                data: {
                    groupId: invite.groupId,
                    userId,
                    role: 'MEMBER',
                },
            }),
            this.prisma.prayerGroupInvite.update({
                where: { id: inviteId },
                data: { status: 'ACCEPTED' },
            }),
        ]);

        return { success: true };
    }

    /**
     * Add prayer to group
     */
    async addGroupPrayer(groupId: string, userId: string, content: string) {
        // Verify membership
        const membership = await this.prisma.prayerGroupMember.findFirst({
            where: { groupId, userId },
        });

        if (!membership) {
            throw new ForbiddenException('Must be a member to add prayers');
        }

        return this.prisma.groupPrayer.create({
            data: {
                groupId,
                userId,
                content,
            },
        });
    }

    /**
     * Leave group
     */
    async leaveGroup(groupId: string, userId: string) {
        await this.prisma.prayerGroupMember.deleteMany({
            where: { groupId, userId },
        });

        return { success: true };
    }
}
