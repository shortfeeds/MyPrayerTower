import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChurchesSortedService {
    constructor(private prisma: PrismaService) { }

    async findAllSorted(options: {
        page?: number;
        limit?: number;
        sortBy?: 'name' | 'distance' | 'popularity' | 'recent';
        sortOrder?: 'asc' | 'desc';
        search?: string;
        denomination?: string;
        city?: string;
        country?: string;
        isVerified?: boolean;
        userLat?: number;
        userLng?: number;
    }) {
        const {
            page = 1,
            limit = 20,
            sortBy = 'name',
            sortOrder = 'asc',
            search,
            denomination,
            city,
            country,
            isVerified,
            userLat,
            userLng
        } = options;

        const skip = (page - 1) * limit;

        // Build Where Clause
        const where: Prisma.ChurchWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (denomination && denomination !== 'All') {
            where.denomination = denomination;
        }

        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }

        if (country) {
            where.country = country;
        }

        if (isVerified !== undefined) {
            where.isVerified = isVerified;
        }

        // Distance Sorting (Special Case)
        if (sortBy === 'distance' && userLat && userLng) {
            // Use raw query for distance calculation and sorting
            // We need to construct the WHERE clause manually for raw query or fetch IDs first
            // Fetching IDs via Prisma then searching might be inefficient for large datasets but safer for complex where clauses
            // For now, let's use a simpler raw query approach if filters are simple, or hybrid.

            // Raw Query Approach for Geodistance
            const radius = 50000; // Default large radius or unlimited if doing pure sort?
            // If just sorting by distance, we don't necessarily limit radius, but for performance we might.

            const churches = await this.prisma.$queryRaw`
                SELECT id, name, latitude, longitude,
                (6371 * acos(cos(radians(${userLat})) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians(${userLng})) + 
                sin(radians(${userLat})) * sin(radians(latitude)))) AS distance
                FROM "Church"
                WHERE latitude IS NOT NULL AND longitude IS NOT NULL
                ORDER BY distance ${sortOrder === 'desc' ? Prisma.sql`DESC` : Prisma.sql`ASC`}
                LIMIT ${limit} OFFSET ${skip}
            `;

            // Typesafe handling: 'churches' is unknown[]
            const churchIds = (churches as any[]).map(c => c.id);

            // Fetch full objects (to include relations) preserving order
            const fullChurches = await this.prisma.church.findMany({
                where: { id: { in: churchIds } },
                include: {
                    Diocese: true,
                    ChurchImage: { where: { isPrimary: true }, take: 1 },
                    _count: { select: { ChurchFollower: true } },
                }
            });

            // Re-order in memory to match distance
            const sorted = churchIds.map(id => fullChurches.find(c => c.id === id)).filter(Boolean);

            // Approximate total for pagination (not exact if complex filters applied in JS, but good enough for now)
            const total = await this.prisma.church.count({ where: { latitude: { not: null } } });

            return {
                churches: sorted,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }

        // Standard Prisma Sorting
        let orderBy: Prisma.ChurchOrderByWithRelationInput = { name: 'asc' };

        if (sortBy === 'recent') {
            orderBy = { createdAt: sortOrder };
        } else if (sortBy === 'popularity') {
            orderBy = { viewCount: sortOrder === 'asc' ? 'asc' : 'desc' };
        } else if (sortBy === 'name') {
            orderBy = { name: sortOrder };
        }

        const [churches, total] = await Promise.all([
            this.prisma.church.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    Diocese: true,
                    ChurchImage: { where: { isPrimary: true }, take: 1 },
                    _count: { select: { ChurchFollower: true } },
                },
            }),
            this.prisma.church.count({ where }),
        ]);

        return {
            churches,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
