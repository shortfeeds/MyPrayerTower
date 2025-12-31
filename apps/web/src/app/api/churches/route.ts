import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';

    try {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (country) {
            where.countryCode = country;
        }

        const [churches, total] = await Promise.all([
            db.church.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    city: true,
                    country: true,
                    countryCode: true,
                    postalCode: true,
                    latitude: true,
                    longitude: true,
                    type: true,
                    denomination: true,
                    isVerified: true,
                    address: true,
                    phone: true,
                    email: true,
                    website: true,
                    description: true,
                    massSchedule: true,
                    viewCount: true,
                    followerCount: true,
                    primaryImageUrl: true,
                }
            }),
            db.church.count({ where })
        ]);

        return NextResponse.json({
            churches,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        console.error('Churches API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch churches',
            message: error.message,
            churches: [],
            total: 0
        }, { status: 500 });
    }
}
