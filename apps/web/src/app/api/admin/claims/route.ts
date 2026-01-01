import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || '';

    try {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [claims, total] = await Promise.all([
            db.churchClaim.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    Church: {
                        select: { name: true }
                    },
                    User: {
                        select: { displayName: true, email: true }
                    }
                }
            }),
            db.churchClaim.count({ where })
        ]);

        const transformedClaims = claims.map(claim => ({
            id: claim.id,
            churchId: claim.churchId,
            churchName: claim.Church.name,
            claimerName: claim.User?.displayName || 'Unknown',
            claimerEmail: claim.User?.email || claim.contactEmail,
            status: claim.status,
            createdAt: claim.createdAt.toISOString()
        }));

        return NextResponse.json({
            claims: transformedClaims,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Claims GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch claims', claims: [], total: 0 }, { status: 500 });
    }
}
