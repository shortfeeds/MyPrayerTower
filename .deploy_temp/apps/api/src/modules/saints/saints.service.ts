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
    async update(id: string, data: any) {
        return this.prisma.saint.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }

    async delete(id: string) {
        return this.prisma.saint.delete({
            where: { id }
        });
    }

    async create(data: any) {
        // Generate ID if not present (assuming simple uuid/string strategy)
        // If imports needed, add them at top, but to avoid import mess in replace, 
        // we use a simple random string or rely on client sending it? 
        // Better to use crypto (available in Node global)
        const id = data.id || crypto.randomUUID();
        return this.prisma.saint.create({
            data: {
                ...data,
                id,
                updatedAt: new Date()
            }
        });
    }
}
