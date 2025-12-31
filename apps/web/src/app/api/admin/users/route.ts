import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const tier = searchParams.get('tier') || '';

    try {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { displayName: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (tier) {
            where.subscriptionTier = tier;
        }

        const [users, total] = await Promise.all([
            db.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    displayName: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    subscriptionTier: true,
                    emailVerified: true,
                    avatarUrl: true,
                    createdAt: true,
                    lastLoginAt: true,
                    _count: {
                        select: { PrayerRequest: true }
                    }
                }
            }),
            db.user.count({ where })
        ]);

        // Transform data
        const transformedUsers = users.map(user => ({
            id: user.id,
            name: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
            email: user.email,
            tier: user.subscriptionTier,
            isVerified: !!user.emailVerified,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt.toISOString(),
            lastLoginAt: user.lastLoginAt?.toISOString() || null,
            prayerCount: user._count.PrayerRequest
        }));

        return NextResponse.json({
            users: transformedUsers,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Admin Users GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch users', users: [], total: 0 }, { status: 500 });
    }
}

