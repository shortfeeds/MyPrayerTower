'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ReportStatus, ReportReason } from '@prisma/client';

export type AdminReport = {
    id: string;
    reason: ReportReason;
    description: string | null;
    status: ReportStatus;
    targetType: string;
    targetId: string;
    createdAt: Date;
    reporterName: string;
    details?: string | null;
};

export async function getAdminReports(
    page: number = 1,
    limit: number = 20,
    status?: ReportStatus
): Promise<{ reports: AdminReport[], total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
        where.status = status;
    }

    const [reports, total] = await Promise.all([
        db.report.findMany({
            where,
            include: {
                reporter: {
                    select: { displayName: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        db.report.count({ where })
    ]);

    return {
        reports: reports.map(r => ({
            id: r.id,
            reason: r.reason,
            description: r.description,
            status: r.status,
            targetType: r.targetType,
            targetId: r.targetId,
            createdAt: r.createdAt,
            reporterName: r.reporter?.displayName || r.reporter?.email || 'Anonymous',
            details: r.details
        })),
        total
    };
}

export async function resolveReport(
    reportId: string,
    action: 'DISMISS' | 'RESOLVE' | 'WARN' | 'SUSPEND'
) {
    let newStatus: ReportStatus = 'RESOLVED';

    if (action === 'DISMISS') newStatus = 'DISMISSED';
    if (action === 'WARN') newStatus = 'WARNED';
    if (action === 'SUSPEND') newStatus = 'SUSPENDED';

    await db.report.update({
        where: { id: reportId },
        data: { status: newStatus }
    });

    // In a real system, you would also take action on the target (e.g. delete the post, ban the user)
    // For now, we just update the report status.

    revalidatePath('/admin/moderation');
}
