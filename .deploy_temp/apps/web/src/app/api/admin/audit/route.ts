import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Using SyncLog as a general activity log since AuditLog doesn't exist in schema
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type') || '';

    try {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (type) {
            where.type = type;
        }

        const [logs, total] = await Promise.all([
            db.syncLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { startedAt: 'desc' },
                select: {
                    id: true,
                    source: true,
                    type: true,
                    status: true,
                    startedAt: true,
                    completedAt: true,
                    recordsProcessed: true,
                    recordsCreated: true,
                    recordsUpdated: true,
                    recordsFailed: true,
                    errorMessage: true,
                    triggeredBy: true
                }
            }),
            db.syncLog.count({ where })
        ]);

        return NextResponse.json({
            logs,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Audit Log GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch logs', logs: [], total: 0 }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { source, type, status, details, triggeredBy } = body;

        const log = await db.syncLog.create({
            data: {
                id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                source: source || 'admin',
                type: type || 'action',
                status: status || 'COMPLETED',
                startedAt: new Date(),
                completedAt: new Date(),
                triggeredBy: triggeredBy || 'system',
                errorMessage: details || null
            }
        });

        return NextResponse.json({ success: true, log });
    } catch (error: any) {
        console.error('Audit Log POST Error:', error);
        return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
    }
}
