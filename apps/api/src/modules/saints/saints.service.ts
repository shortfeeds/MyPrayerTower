import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SaintsService {
    constructor(private prisma: PrismaService) { }

    async getTodaysSaint() {
        const today = new Date();
        return this.prisma.saint.findFirst({
            where: {
                feastMonth: today.getMonth() + 1,
                feastDayOfMonth: today.getDate(),
            },
        });
    }

    async getSaintsByMonth(month: number) {
        return this.prisma.saint.findMany({
            where: { feastMonth: month },
            orderBy: { feastDayOfMonth: 'asc' },
        });
    }

    async getSaintBySlug(slug: string) {
        return this.prisma.saint.findUnique({ where: { slug } });
    }

    async searchSaints(query: string) {
        return this.prisma.saint.findMany({
            where: { name: { contains: query, mode: 'insensitive' } },
            take: 20,
        });
    }
}
