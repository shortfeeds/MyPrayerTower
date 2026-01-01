import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
                    reporterId: true,
                    reportedUserId: true,
                    reason: true,
                    details: true,
                    status: true,
                    createdAt: true,
                    resolvedBy: true,
                    resolvedAt: true,
                    User_UserReport_reporterIdToUser: {
                        select: {
                            id: true,
                            displayName: true,
                            email: true
                        }
                    },
                    User_UserReport_reportedUserIdToUser: {
                        select: {
                            id: true,
                            displayName: true,
                            email: true
                        }
                    }
                }
            }),
            db.userReport.count({ where })
        ]);

        return NextResponse.json({
            reports: reports.map(r => ({
                id: r.id,
                reason: r.reason,
                description: r.details,
                status: r.status,
                createdAt: r.createdAt.toISOString(),
                reporter: r.User_UserReport_reporterIdToUser ? {
                    id: r.User_UserReport_reporterIdToUser.id,
                    name: r.User_UserReport_reporterIdToUser.displayName,
                    email: r.User_UserReport_reporterIdToUser.email
                } : null,
                reported: r.User_UserReport_reportedUserIdToUser ? {
                    id: r.User_UserReport_reportedUserIdToUser.id,
                    name: r.User_UserReport_reportedUserIdToUser.displayName,
                    email: r.User_UserReport_reportedUserIdToUser.email
                } : null,
                type: 'USER_REPORT',
                targetType: 'user',
                targetId: r.reportedUserId
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
