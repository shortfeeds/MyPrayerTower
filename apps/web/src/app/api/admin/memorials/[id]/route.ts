import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const memorial = await db.memorial.findUnique({
            where: { id: params.id },
            include: {
                owner: true,
                offerings: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        return NextResponse.json(memorial);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const updateData: any = {};

        if (typeof body.isActive === 'boolean') {
            updateData.isPublic = body.isActive;
        }
        if (typeof body.isVerified === 'boolean') {
            updateData.isVerified = body.isVerified;
        }
        if (typeof body.isPremium === 'boolean') {
            updateData.tier = body.isPremium ? 'PREMIUM' : 'BASIC';
        }
        if (body.tier) {
            updateData.tier = body.tier;
        }
        if (body.firstName) updateData.firstName = body.firstName;
        if (body.lastName) updateData.lastName = body.lastName;
        if (body.shortBio !== undefined) updateData.shortBio = body.shortBio;
        if (body.biography !== undefined) updateData.biography = body.biography;

        const updated = await db.memorial.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({ success: true, memorial: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return PUT(request, { params });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await db.memorial.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
