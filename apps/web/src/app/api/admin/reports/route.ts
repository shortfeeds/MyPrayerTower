import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'PENDING';

    try {
        const skip = (page - 1) * limit;

        const where: any = { status };

        const [reports, total] = await Promise.all([
            db.userReport.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    type: true,
                    reason: true,
                    description: true,
                    status: true,
                    createdAt: true,
                    reporter: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    targetType: true,
                    targetId: true
                }
            }),
            db.userReport.count({ where })
        ]);

        return NextResponse.json({
            reports: reports.map(r => ({
                ...r,
                createdAt: r.createdAt.toISOString()
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Admin Reports GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch reports', reports: [], total: 0 }, { status: 500 });
    }
}
