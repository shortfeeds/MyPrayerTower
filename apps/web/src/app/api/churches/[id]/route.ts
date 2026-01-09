import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const idOrSlug = params.id;

        // Try to find by id first, then by slug
        let church = await db.church.findUnique({
            where: { id: idOrSlug },
            include: {
                Diocese: {
                    select: { id: true, name: true, type: true }
                },
                ChurchImage: {
                    select: { id: true, url: true, caption: true, isPrimary: true },
                    orderBy: { sortOrder: 'asc' }
                },
                ChurchStaff: {
                    select: { id: true, name: true, title: true, imageUrl: true },
                    orderBy: { sortOrder: 'asc' }
                },
                ChurchEvent: {
                    where: { startDate: { gte: new Date() } },
                    select: { id: true, title: true, startDate: true, eventType: true },
                    orderBy: { startDate: 'asc' },
                    take: 5
                }
            }
        });

        // If not found by id, try by slug
        if (!church) {
            church = await db.church.findUnique({
                where: { slug: idOrSlug },
                include: {
                    Diocese: {
                        select: { id: true, name: true, type: true }
                    },
                    ChurchImage: {
                        select: { id: true, url: true, caption: true, isPrimary: true },
                        orderBy: { sortOrder: 'asc' }
                    },
                    ChurchStaff: {
                        select: { id: true, name: true, title: true, imageUrl: true },
                        orderBy: { sortOrder: 'asc' }
                    },
                    ChurchEvent: {
                        where: { startDate: { gte: new Date() } },
                        select: { id: true, title: true, startDate: true, eventType: true },
                        orderBy: { startDate: 'asc' },
                        take: 5
                    }
                }
            });
        }

        if (!church) {
            return NextResponse.json(
                { error: 'Church not found' },
                { status: 404 }
            );
        }

        // Increment view count (fire and forget)
        db.church.update({
            where: { id: church.id },
            data: { viewCount: { increment: 1 } }
        }).catch(() => { });

        return NextResponse.json(church);
    } catch (error: any) {
        console.error('Church Detail API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch church details' },
            { status: 500 }
        );
    }
}
