import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        const church = await db.church.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                address: true,
                city: true,
                country: true,
                phone: true,
                website: true,
                email: true,
                description: true,
                isVerified: true,
                massSchedule: true,
                confessionSchedule: true,
                latitude: true,
                longitude: true,
                denomination: true,
                state: true,
                postalCode: true,
                dioceseId: true,
                followerCount: true,
                viewCount: true,
                primaryImageUrl: true,
                updatedAt: true,
            }
        });

        if (!church) {
            return NextResponse.json(
                { error: 'Church not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(church);
    } catch (error: any) {
        console.error('Church Detail API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch church details' },
            { status: 500 }
        );
    }
}
