'use server';

import { db } from '@/lib/db';
import { DioceseType } from '@prisma/client';

export interface DioceseDto {
    id: string;
    name: string;
    province: string;
    country: string;
    type: string;
    churchCount: number;
}

export async function getDioceses(query?: string, country?: string): Promise<DioceseDto[]> {
    const where: any = {};

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { region: { contains: query, mode: 'insensitive' } } // Mapping region to province logic
        ];
    }

    if (country && country !== 'All Countries') {
        where.country = country;
    }

    const dioceses = await db.diocese.findMany({
        where,
        take: 50, // Limit for performance
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { Church: true }
            }
        }
    });

    return dioceses.map(d => ({
        id: d.id,
        name: d.name,
        province: d.region || '',
        country: d.country,
        type: d.type.toLowerCase(),
        churchCount: d._count.Church
    }));
}
