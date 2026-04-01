import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-key-change-this-in-prod'
);

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.isAdmin === true;
    } catch (error) {
        return false;
    }
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = (searchParams.get('status') || 'PENDING') as any; // Cast to Enum

    try {
        const skip = (page - 1) * limit;
        const where: any = { status };

        const [reports, total] = await Promise.all([
            db.userReport.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    User_UserReport_reporterIdToUser: {
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
                    name: r.User_UserReport_reporterIdToUser.displayName || 'User',
                    email: r.User_UserReport_reporterIdToUser.email
                } : null,
                targetType: 'USER', // UserReport is specifically for users
                targetId: r.reportedUserId,
                type: 'USER_REPORT'
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
