import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const idOrSlug = params.id;

        // Try to find by ID first, then by slug
        let saint = await db.saint.findUnique({
            where: { id: idOrSlug },
            select: {
                id: true,
                name: true,
                slug: true,
                title: true,
                feastDay: true,
                feastMonth: true,
                feastDayOfMonth: true,
                biography: true,
                shortBio: true,
                imageUrl: true,
                patronOf: true,
                bornDate: true,
                diedDate: true,
                canonizedDate: true,
            }
        });

        // If not found by ID, try by slug
        if (!saint) {
            saint = await db.saint.findUnique({
                where: { slug: idOrSlug },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    title: true,
                    feastDay: true,
                    feastMonth: true,
                    feastDayOfMonth: true,
                    biography: true,
                    shortBio: true,
                    imageUrl: true,
                    patronOf: true,
                    bornDate: true,
                    diedDate: true,
                    canonizedDate: true,
                }
            });
        }

        if (!saint) {
            return NextResponse.json(
                { error: 'Saint not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(saint);
    } catch (error: any) {
        console.error('Saint Detail API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch saint details' },
            { status: 500 }
        );
    }
}
