import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, PrayerPartnerStatus } from '@prisma/client';

@Injectable()
export class PrayerPartnersService {
    constructor(
        private prisma: PrismaService,
        private notifications: NotificationsService,
    ) { }

    async invitePartner(requesterId: string, email: string) {
        const receiver = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!receiver) {
            throw new NotFoundException('User with this email not found');
        }

        if (receiver.id === requesterId) {
            throw new BadRequestException('You cannot invite yourself');
        }

        // Check existing request
        const existing = await this.prisma.prayerPartner.findFirst({
            where: {
                OR: [
                    { requesterId, receiverId: receiver.id },
                    { requesterId: receiver.id, receiverId: requesterId },
                ],
            },
        });

        if (existing) {
            if (existing.status === PrayerPartnerStatus.PENDING) {
                throw new BadRequestException('A request is already pending');
            }
            if (existing.status === PrayerPartnerStatus.ACCEPTED) {
                throw new BadRequestException('You are already partners');
            }
            // If rejected/blocked, we might allow re-invite or not. 
            // For now, allow re-invite if REJECTED, but maybe not BLOCKED.
            if (existing.status === PrayerPartnerStatus.BLOCKED) {
                throw new BadRequestException('Unable to send request');
            }
            // Delete old request to create new one? Or update?
            // Let's delete old one
            await this.prisma.prayerPartner.delete({ where: { id: existing.id } });
        }

        const request = await this.prisma.prayerPartner.create({
            data: {
                requesterId,
                receiverId: receiver.id,
                status: PrayerPartnerStatus.PENDING,
            },
            include: { requester: true },
        });

        // Notify receiver
        await this.notifications.createNotification({
            userId: receiver.id,
            type: NotificationType.PRAYER_PARTNER_REQUEST, // Ensure this enum exists or map to correct one
            title: 'New Prayer Partner Request',
            body: `${request.requester.firstName} wants to be your prayer partner.`,
            data: { requestId: request.id },
        });

        return request;
    }

    async respondToInvite(userId: string, requestId: string, accept: boolean) {
        const request = await this.prisma.prayerPartner.findUnique({
            where: { id: requestId },
            include: { receiver: true, requester: true },
        });

        if (!request) throw new NotFoundException('Request not found');
        if (request.receiverId !== userId) throw new BadRequestException('Not your request');
        if (request.status !== PrayerPartnerStatus.PENDING) throw new BadRequestException('Request already processed');

        const status = accept ? PrayerPartnerStatus.ACCEPTED : PrayerPartnerStatus.REJECTED;

        const updated = await this.prisma.prayerPartner.update({
            where: { id: requestId },
            data: { status },
        });

        if (accept) {
            // Notify requester
            await this.notifications.createNotification({
                userId: request.requesterId,
                type: NotificationType.PRAYER_PARTNER_ACCEPTED, // Ensure enum matches
                title: 'Prayer Partner Accepted',
                body: `${request.receiver.firstName} accepted your request.`,
                data: { partnerId: updated.id },
            });
        }

        return updated;
    }

    async getPartners(userId: string) {
        const rawPartners = await this.prisma.prayerPartner.findMany({
            where: {
                OR: [{ requesterId: userId }, { receiverId: userId }],
                status: PrayerPartnerStatus.ACCEPTED,
            },
            include: {
                requester: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, email: true } },
                receiver: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, email: true } },
            },
        });

        return rawPartners.map(p => {
            const isRequester = p.requesterId === userId;
            return {
                id: p.id,
                partner: isRequester ? p.receiver : p.requester,
                since: p.updatedAt,
            };
        });
    }

    async getPendingRequests(userId: string) {
        return this.prisma.prayerPartner.findMany({
            where: {
                receiverId: userId,
                status: PrayerPartnerStatus.PENDING,
            },
            include: {
                requester: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            },
        });
    }

    async removePartner(userId: string, partnerId: string) {
        const relation = await this.prisma.prayerPartner.findUnique({
            where: { id: partnerId },
        });

        if (!relation) throw new NotFoundException('Partner connection not found');
        if (relation.requesterId !== userId && relation.receiverId !== userId) {
            throw new BadRequestException('Not authorized');
        }

        return this.prisma.prayerPartner.delete({
            where: { id: partnerId },
        });
    }
}
