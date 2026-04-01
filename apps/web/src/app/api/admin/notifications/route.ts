import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-key-change-this-in-prod'
);

async function verifyAdmin(request: NextRequest) {
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

export async function GET(request: NextRequest) {
    if (!(await verifyAdmin(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch recent user reports as "notifications" for the admin
        const reports = await db.userReport.findMany({
            where: {
                status: 'PENDING',
            },
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                User_UserReport_reporterIdToUser: {
                    select: {
                        displayName: true,
                        email: true,
                    },
                },
            },
        });

        const notifications = reports.map(report => ({
            id: report.id,
            title: `New User Report: ${report.reason}`,
            message: report.details || `A new report was filed against a user.`,
            isRead: false,
            createdAt: report.createdAt.toISOString(),
            type: 'REPORT',
        }));

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error('Admin Notifications API Error:', error);
        return NextResponse.json({ notifications: [] }, { status: 500 });
    }
}
