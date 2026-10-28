import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, location, country, contactEmail, contactName, stipendAmount, dailyCapacity, isActive } = body;

        const updateData: any = {};
        if (name) updateData.name = name.trim();
        if (location !== undefined) updateData.location = location;
        if (country !== undefined) updateData.country = country;
        if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
        if (contactName !== undefined) updateData.contactName = contactName;
        if (stipendAmount !== undefined) updateData.stipendAmount = parseInt(stipendAmount);
        if (dailyCapacity !== undefined) updateData.dailyCapacity = parseInt(dailyCapacity);
        if (isActive !== undefined) updateData.isActive = isActive;

        const partner = await db.massPartner.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({ success: true, partner });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await db.massPartner.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
