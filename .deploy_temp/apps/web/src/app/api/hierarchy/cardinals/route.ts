import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Cardinal {
    id: string;
    papalConclaveEligible: boolean;
    country: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const eligible = searchParams.get('eligible');

    try {
        const where: Record<string, unknown> = {};

        if (country) {
            where.country = { contains: country, mode: 'insensitive' };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { office: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (eligible === 'true') {
            where.papalConclaveEligible = true;
        }

        const cardinals = await db.cardinal.findMany({
            where,
            orderBy: { rank: 'asc' }
        });

        // Get unique countries for filtering UI
        const countries = await db.cardinal.findMany({
            select: { country: true },
            distinct: ['country'],
            orderBy: { country: 'asc' }
        });

        return NextResponse.json({
            total: cardinals.length,
            eligibleCount: cardinals.filter((c: Cardinal) => c.papalConclaveEligible).length,
            countries: countries.map((c: { country: string }) => c.country),
            cardinals
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
            }
        });

    } catch (error) {
        console.error('Cardinals API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
