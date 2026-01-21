import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MemorialsService {
    constructor(private prisma: PrismaService) { }

    async findAll(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = {
            isPublic: true,
            isActive: true, // Assuming isActive exists based on AdminController
        };

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { biography: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.memorial.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: {
                        select: {
                            id: true,
                            displayName: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        },
                    },
                },
            }),
            this.prisma.memorial.count({ where }),
        ]);

        return {
            items,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        return this.prisma.memorial.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
                photos: {
                    orderBy: { sortOrder: 'asc' },
                },
                offerings: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
                guestbook: {
                    where: { isApproved: true },
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }

    async create(data: any) {
        // Fallback to first user or specific admin if no ownerId provided (for demo/improvisation)
        let ownerId = data.ownerId;
        if (!ownerId) {
            const defaultUser = await this.prisma.user.findFirst();
            if (defaultUser) {
                ownerId = defaultUser.id;
            }
        }

        return this.prisma.memorial.create({
            data: {
                ...data,
                ownerId, // Enforce ownerId
                isPublic: true,
                isActive: true,
            },
        });
    }
}
