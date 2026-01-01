import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

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

        // Filter by role (map to subscriptionTier for ADMIN check)
        if (role && role !== 'all') {
            if (role === 'ADMIN') {
                where.subscriptionTier = 'PREMIUM'; // Treat premium as admin-level
            } else if (role === 'USER') {
                where.subscriptionTier = 'FREE';
            }
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

        // Transform data to match client expectations
        const transformedUsers = users.map(user => {
            // Map subscription tier to role for UI
            let role = 'USER';
            if (user.subscriptionTier === 'PREMIUM' || user.subscriptionTier === 'PLUS') {
                role = 'PREMIUM';
            }

            return {
                id: user.id,
                name: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
                email: user.email,
                role: role,
                isVerified: !!user.emailVerified,
                isBanned: false, // We don't have a banned field yet, default to false
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt.toISOString(),
                lastLoginAt: user.lastLoginAt?.toISOString() || null,
                prayerRequests: user._count.PrayerRequest
            };
        });

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
