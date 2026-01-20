'use server';

import { db } from '@/lib/db';
import { SacramentType, SacramentStatus, Prisma } from '@mpt/database';
import { revalidatePath } from 'next/cache';

export async function getSacramentRecords(
    churchId: string,
    filterType?: SacramentType
) {
    const where: Prisma.SacramentRecordWhereInput = {
        churchId,
    };

    if (filterType) {
        where.type = filterType;
    }

    const records = await db.sacramentRecord.findMany({
        where,
        orderBy: { date: 'desc' },
    });

    return records;
}

export async function getSacramentStats(churchId: string) {
    const baptisms = await db.sacramentRecord.count({
        where: { churchId, type: 'BAPTISM' },
    });
    const confirmations = await db.sacramentRecord.count({
        where: { churchId, type: 'CONFIRMATION' },
    });
    const marriages = await db.sacramentRecord.count({
        where: { churchId, type: 'MARRIAGE' },
    });

    return { baptisms, confirmations, marriages };
}

export async function createSacramentRecord(data: {
    churchId: string;
    type: SacramentType;
    candidateName: string;
    date: Date;
    minister?: string;
    status: SacramentStatus;
}) {
    try {
        const newRecord = await db.sacramentRecord.create({
            data: {
                churchId: data.churchId,
                type: data.type,
                candidateName: data.candidateName,
                date: data.date,
                minister: data.minister,
                status: data.status,
            },
        });

        revalidatePath('/dashboard/sacraments');
        return { success: true, data: newRecord };
    } catch (error) {
        console.error('Failed to create sacrament record:', error);
        return { success: false, error: 'Failed to create record' };
    }
}
