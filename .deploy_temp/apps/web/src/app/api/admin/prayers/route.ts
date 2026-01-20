import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    try {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (status === 'pending') {
            where.status = 'PENDING';
        } else if (status === 'approved') {
            where.status = 'APPROVED';
        } else if (status === 'rejected') {
            where.status = 'REJECTED';
        }

        const [prayers, total] = await Promise.all([
            db.prayerRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    isAnonymous: true,
                    status: true,
                    prayerCount: true,
                    createdAt: true,
                    User: {
                        select: {
                            id: true,
                            displayName: true,
                            email: true
                        }
                    }
                }
            }),
            db.prayerRequest.count({ where })
        ]);

        return NextResponse.json({
            prayers: prayers.map(p => ({
                id: p.id,
                title: p.title,
                content: p.content,
                isAnonymous: p.isAnonymous,
                isApproved: p.status === 'APPROVED',
                isFlagged: p.status === 'REJECTED', // Map REJECTED to flagged for UI
                prayerCount: p.prayerCount,
                createdAt: p.createdAt.toISOString(),
                user: p.User ? { id: p.User.id, name: p.User.displayName, email: p.User.email } : null
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Admin Prayers GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch prayers', prayers: [], total: 0 }, { status: 500 });
    }
}
