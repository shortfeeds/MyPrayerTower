import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const partners = await db.massPartner.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: {
                        MassOffering: true,
                    },
                },
            },
        });

        return NextResponse.json({ partners });
    } catch (error: any) {
        console.error('Error fetching mass partners:', error);
        return NextResponse.json(
            { error: 'Failed to fetch partners', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, location, country, contactEmail, contactName, stipendAmount, dailyCapacity, isActive } = body;

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const partner = await db.massPartner.create({
            data: {
                name: name.trim(),
                location: location || null,
                country: country || null,
                contactEmail: contactEmail || null,
                contactName: contactName || null,
                stipendAmount: parseInt(stipendAmount || '800'),
                dailyCapacity: parseInt(dailyCapacity || '10'),
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json({ success: true, partner }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating mass partner:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
