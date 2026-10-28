import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
        const search = searchParams.get('search')?.trim() || '';

        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.OR = [
                { userEmail: { contains: search, mode: 'insensitive' } },
                { failureReason: { contains: search, mode: 'insensitive' } },
                { stripeSessionId: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            db.failedPayment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            }),
            db.failedPayment.count({ where }),
        ]);

        return NextResponse.json({
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        console.error('Error fetching failed payments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch failed payments', details: error.message },
            { status: 500 }
        );
    }
}
