import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = (searchParams.get('status') || 'PENDING') as any; // Cast to Enum

    try {
        const skip = (page - 1) * limit;
        const where: any = { status };

        const [reports, total] = await Promise.all([
            db.report.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    reporter: {
                        select: {
                            id: true,
                            displayName: true,
                            email: true
                        }
                    }
                }
            }),
            db.report.count({ where })
        ]);

        return NextResponse.json({
            reports: reports.map(r => ({
                id: r.id,
                reason: r.reason,
                description: r.description || r.details,
                status: r.status,
                createdAt: r.createdAt.toISOString(),
                reporter: r.reporter ? {
                    id: r.reporter.id,
                    name: r.reporter.displayName || 'User',
                    email: r.reporter.email
                } : null,
                targetType: r.targetType,
                targetId: r.targetId,
                type: 'CONTENT_REPORT' // Frontend uses for badge
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
