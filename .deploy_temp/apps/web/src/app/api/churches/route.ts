import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { unstable_cache } from 'next/cache';

// Cache filter data for 1 hour (rarely changes)
const getCachedFilters = unstable_cache(
    async () => {
        const [countries, types, denominations] = await Promise.all([
            db.church.groupBy({
                by: ['countryCode', 'country'],
                _count: true,
                orderBy: { _count: { countryCode: 'desc' } },
                take: 50
            }),
            db.church.groupBy({
                by: ['type'],
                _count: true,
                orderBy: { _count: { type: 'desc' } }
            }),
            db.church.groupBy({
                by: ['denomination'],
                _count: true,
                orderBy: { _count: { denomination: 'desc' } },
                take: 20
            })
        ]);

        return {
            countries: countries.map(c => ({ code: c.countryCode, name: c.country, count: c._count })),
            types: types.map(t => ({ type: t.type, count: t._count })),
            denominations: denominations.map(d => ({ denomination: d.denomination, count: d._count }))
        };
    },
    ['church-filters'],
    { revalidate: 3600, tags: ['churches'] }
);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';
    const type = searchParams.get('type') || '';
    const denomination = searchParams.get('denomination') || '';
    const hasSchedule = searchParams.get('hasSchedule') || '';

    const user = await getUserFromCookie();

    try {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } },
                { state: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (country) {
            where.countryCode = country;
        }

        if (type) {
            where.type = type;
        }

        if (denomination) {
            where.denomination = { contains: denomination, mode: 'insensitive' };
        }

        if (hasSchedule === 'mass') {
            where.massSchedule = { not: null };
        } else if (hasSchedule === 'confession') {
            where.confessionSchedule = { not: null };
        } else if (hasSchedule === 'adoration') {
            where.adorationSchedule = { not: null };
        }

        // Fetch churches, count, and cached filters in parallel
        const [churches, total, filters] = await Promise.all([
            db.church.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { isVerified: 'desc' },
                    { followerCount: 'desc' },
                    { name: 'asc' }
                ],
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    city: true,
                    state: true,
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
                    shortDescription: true,  // Only fetch short description for listing
                    massSchedule: true,
                    confessionSchedule: true,
                    adorationSchedule: true,
                    viewCount: true,
                    followerCount: true,
                    primaryImageUrl: true,
                    Diocese: {
                        select: {
                            id: true,
                            name: true,
                            type: true
                        }
                    },
                    ...(user ? {
                        ChurchFollower: {
                            where: { userId: user.id },
                            select: { id: true }
                        }
                    } : {})
                }
            }),
            db.church.count({ where }),
            getCachedFilters()
        ]);

        const mappedChurches = churches.map((church: any) => ({
            ...church,
            isFollowed: church.ChurchFollower?.length > 0,
            ChurchFollower: undefined // Clean up
        }));

        const response = NextResponse.json({
            churches: mappedChurches,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            filters
        });

        // Add cache headers (30 seconds for personalized content)
        if (!user) {
            response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
        }

        return response;
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
