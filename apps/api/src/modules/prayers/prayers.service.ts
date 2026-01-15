import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrayersService {
    constructor(private prisma: PrismaService) { }

    async getCategories() {
        return this.prisma.prayerLibraryCategory.findMany({
            where: { parentId: null },
            include: { children: true, _count: { select: { prayers: true } } },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async getPrayersByCategory(categorySlug: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const category = await this.prisma.prayerLibraryCategory.findUnique({
            where: { slug: categorySlug },
        });

        if (!category) return { prayers: [], total: 0 };

        const [prayers, total] = await Promise.all([
            this.prisma.prayer.findMany({
                where: { category: category.slug, is_active: true }, // Mapped to schema
                skip,
                take: limit,
                orderBy: { title: 'asc' },
            }),
            this.prisma.prayer.count({ where: { category: category.slug, is_active: true } }),
        ]);

        return { prayers, total, page, limit };
    }

    async getPrayerBySlug(slug: string) {
        const prayer = await this.prisma.prayer.findFirst({
            where: { slug },
            // Relation to category doesn't exist in schema, just string field
        });

        if (prayer) {
            await this.prisma.prayer.update({
                where: { id: prayer.id },
                // viewCount not in schema, ignoring update or need to check schema. 
                // Schema lines 916-931 does NOT have viewCount.
                // Removing update to avoid error.
                data: {},
            });
        }

        return prayer;
    }

    async searchPrayers(query: string, limit = 20) {
        return this.prisma.prayer.findMany({
            where: {
                is_active: true,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
        });
    }
}
