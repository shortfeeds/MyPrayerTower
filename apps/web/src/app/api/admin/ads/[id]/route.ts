import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT - Update ad
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Combine page and position for placement
        const placement = body.page && body.position ? `${body.page}-${body.position}` : undefined;
        const isGoogleAd = body.adSource === 'GOOGLE';

        const ad = await db.sponsoredContent.update({
            where: { id },
            data: {
                title: body.name,
                description: body.altText || body.name,
                imageUrl: isGoogleAd ? null : (body.imageUrl || undefined),
                linkUrl: isGoogleAd ? null : (body.linkUrl || undefined),
                ...(placement && { placement }),
                isActive: body.isActive,
                ...(body.startDate && { startDate: new Date(body.startDate) }),
                ...(body.endDate && { endDate: new Date(body.endDate) }),
                updatedAt: new Date(),
                // New fields
                adSource: body.adSource || 'OFFLINE',
                googleAdUnitId: isGoogleAd ? body.googleAdUnitId : null,
                priority: body.priority || 0,
            } as any
        });

        return NextResponse.json({ ad, success: true });
    } catch (error: any) {
        console.error('Admin Ads PUT Error:', error);
        return NextResponse.json({ error: 'Failed to update ad', message: error.message }, { status: 500 });
    }
}

// DELETE - Delete ad
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await db.sponsoredContent.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Admin Ads DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete ad', message: error.message }, { status: 500 });
    }
}
