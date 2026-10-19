import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { orderNumber } = await context.params;

        if (!orderNumber) {
            return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
        }

        const donation = await db.platformDonation.findFirst({
            where: {
                OR: [
                    { orderNumber: orderNumber },
                    { id: orderNumber },
                ],
            },
            select: {
                orderNumber: true,
                amount: true,
                currency: true,
                tier: true,
                status: true,
                createdAt: true,
                isAnonymous: true,
                name: true,
            },
        });

        if (!donation) {
            return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
        }

        return NextResponse.json(donation);
    } catch (error: any) {
        console.error('Error fetching donation order:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve donation order' },
            { status: 500 }
        );
    }
}
