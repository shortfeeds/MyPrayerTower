import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChurchesService {
    constructor(private prisma: PrismaService) { }

    async findAll(options: {
        page?: number;
        limit?: number;
        search?: string;
        denomination?: string;
        city?: string;
        country?: string;
        isVerified?: boolean;
    }) {
        const { page = 1, limit = 20, search, denomination, city, country, isVerified } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.ChurchWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (denomination) {
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

        const [churches, total] = await Promise.all([
            this.prisma.church.findMany({
                where,
                skip,
                take: limit,
                include: {
                    Diocese: true,
                    ChurchImage: { where: { isPrimary: true }, take: 1 },
                    _count: { select: { ChurchFollower: true } },
                },
                orderBy: { name: 'asc' },
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

    async findNearby(latitude: number, longitude: number, radiusKm: number = 25, limit: number = 20) {
        // Using raw SQL for geo queries
        const churches = await this.prisma.$queryRaw`
      SELECT 
        c.*,
        (6371 * acos(cos(radians(${latitude})) * cos(radians(c.latitude)) * 
        cos(radians(c.longitude) - radians(${longitude})) + 
        sin(radians(${latitude})) * sin(radians(c.latitude)))) AS distance
      FROM "Church" c
      WHERE c.latitude IS NOT NULL 
        AND c.longitude IS NOT NULL
      HAVING distance < ${radiusKm}
      ORDER BY distance
      LIMIT ${limit}
    `;

        return churches;
    }

    async findById(id: string) {
        const church = await this.prisma.church.findUnique({
            where: { id },
            include: {
                Diocese: true,
                ChurchImage: { orderBy: { sortOrder: 'asc' } },
                ChurchStaff: { orderBy: { sortOrder: 'asc' } },
                ChurchEvent: {
                    where: { startDate: { gte: new Date() }, isPublished: true },
                    orderBy: { startDate: 'asc' },
                    take: 10,
                },
                _count: { select: { ChurchFollower: true } },
            },
        });

        if (church) {
            // Increment view count
            await this.prisma.church.update({
                where: { id },
                data: { viewCount: { increment: 1 } },
            });
        }

        return church;
    }

    async findBySlug(slug: string) {
        return this.prisma.church.findUnique({
            where: { slug },
            include: {
                Diocese: true,
                ChurchImage: { orderBy: { sortOrder: 'asc' } },
                ChurchStaff: { orderBy: { sortOrder: 'asc' } },
                ChurchEvent: {
                    where: { startDate: { gte: new Date() }, isPublished: true },
                    orderBy: { startDate: 'asc' },
                    take: 10,
                },
            },
        });
    }

    async getDenominations() {
        const result = await this.prisma.church.groupBy({
            by: ['denomination'],
            _count: { denomination: true },
            orderBy: { _count: { denomination: 'desc' } },
        });

        return result.map((r) => ({
            name: r.denomination,
            count: r._count.denomination,
        }));
    }

    async getCountries() {
        const result = await this.prisma.church.groupBy({
            by: ['country', 'countryCode'],
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
        });

        return result.map((r) => ({
            name: r.country,
            code: r.countryCode,
            count: r._count.country,
        }));
    }

    async create(data: Prisma.ChurchCreateInput) {
        return this.prisma.church.create({ data });
    }

    async update(id: string, data: Prisma.ChurchUpdateInput) {
        return this.prisma.church.update({
            where: { id },
            data,
        });
    }
}
