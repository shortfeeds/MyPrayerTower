import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const verified = searchParams.get('verified');

    try {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (verified === 'true') {
            where.isVerified = true;
        } else if (verified === 'false') {
            where.isVerified = false;
        }

        const [churches, total] = await Promise.all([
            db.church.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    city: true,
                    country: true,
                    type: true,
                    isVerified: true,
                    address: true,
                    createdAt: true
                }
            }),
            db.church.count({ where })
        ]);

        return NextResponse.json({
            churches: churches.map(c => ({
                ...c,
                createdAt: c.createdAt.toISOString()
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Admin Churches GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch churches', churches: [], total: 0 }, { status: 500 });
    }
}
