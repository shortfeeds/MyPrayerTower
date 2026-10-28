import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const church = await db.church.findUnique({
            where: { id },
        });

        if (!church) {
            return NextResponse.json({ error: 'Church not found' }, { status: 404 });
        }

        return NextResponse.json(church);
    } catch (error: any) {
        console.error('Admin Church GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch church', details: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body;

        if (action) {
            switch (action) {
                case 'verify':
                    await db.church.update({
                        where: { id },
                        data: { isVerified: true, verifiedAt: new Date() }
                    });
                    break;

                case 'unverify':
                    await db.church.update({
                        where: { id },
                        data: { isVerified: false, verifiedAt: null }
                    });
                    break;

                case 'delete':
                    await db.church.delete({ where: { id } });
                    break;

                default:
                    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
            }
            return NextResponse.json({ success: true, action });
        }

        // Full edit update
        const updateData: any = {};
        if (body.name) updateData.name = body.name.trim();
        if (body.address !== undefined) updateData.address = body.address.trim();
        if (body.city !== undefined) updateData.city = body.city.trim();
        if (body.country !== undefined) updateData.country = body.country.trim();
        if (body.website !== undefined) updateData.website = body.website;
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.email !== undefined) updateData.email = body.email;
        if (body.description !== undefined) updateData.description = body.description;
        if (typeof body.isVerified === 'boolean') updateData.isVerified = body.isVerified;

        const updatedChurch = await db.church.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, church: updatedChurch });
    } catch (error: any) {
        console.error('Admin Church Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform action', message: error.message }, { status: 500 });
    }
}
