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
                where: { categoryId: category.id, isPublished: true },
                skip,
                take: limit,
                orderBy: { title: 'asc' },
            }),
            this.prisma.prayer.count({ where: { categoryId: category.id, isPublished: true } }),
        ]);

        return { prayers, total, page, limit };
    }

    async getPrayerBySlug(slug: string) {
        const prayer = await this.prisma.prayer.findUnique({
            where: { slug },
            include: { category: true },
        });

        if (prayer) {
            await this.prisma.prayer.update({
                where: { id: prayer.id },
                data: { viewCount: { increment: 1 } },
            });
        }

        return prayer;
    }

    async searchPrayers(query: string, limit = 20) {
        return this.prisma.prayer.findMany({
            where: {
                isPublished: true,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
        });
    }
}
