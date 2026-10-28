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

        if (role && role !== 'ALL' && role !== 'all') {
            if (role === 'ADMIN') {
                where.subscriptionTier = 'PREMIUM';
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
                    notificationsEnabled: true,
                    createdAt: true,
                    lastLoginAt: true,
                    _count: {
                        select: { PrayerRequest: true }
                    }
                }
            }),
            db.user.count({ where })
        ]);

        const transformedUsers = users.map(user => {
            let userRole = 'USER';
            if (user.subscriptionTier === 'PREMIUM' || user.subscriptionTier === 'PLUS') {
                userRole = 'PREMIUM';
            }

            return {
                id: user.id,
                name: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
                firstName: user.firstName || user.displayName?.split(' ')[0] || 'User',
                lastName: user.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email,
                role: userRole,
                subscriptionTier: user.subscriptionTier,
                isVerified: !!user.emailVerified,
                isEmailVerified: !!user.emailVerified,
                isBanned: user.notificationsEnabled === false,
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, firstName, lastName, role } = body;

        if (!email?.trim()) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const existing = await db.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        });

        if (existing) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
        }

        const user = await db.user.create({
            data: {
                email: email.trim().toLowerCase(),
                firstName: firstName?.trim() || null,
                lastName: lastName?.trim() || null,
                displayName: `${firstName || ''} ${lastName || ''}`.trim() || null,
                subscriptionTier: role === 'ADMIN' ? 'PREMIUM' : 'FREE',
                emailVerified: true,
            }
        });

        return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (error: any) {
        console.error('Admin User POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
