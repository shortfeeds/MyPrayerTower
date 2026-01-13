import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, description, referenceId, metadata } = body;

        // 1. Create Pending Donation Record
        const donation = await prisma.platformDonation.create({
            data: {
                amount: amount,
                tier: metadata.tier === 'CUSTOM' ? 'CUSTOM' : (metadata.tier || 'CUSTOM'),
                email: metadata.email,
                name: metadata.name,
                message: metadata.message,
                isAnonymous: metadata.isAnonymous,
                currency: 'usd',
                status: 'PENDING',
            }
        });

        // 2. Create PayPal Order
        const dollarAmount = (amount / 100).toFixed(2);

        console.log(`Creating Safe PayPal Order for Donation ${donation.id}`);

        const order = await createPayPalOrder(
            dollarAmount,
            description || 'Donation',
            donation.id
        );

        return NextResponse.json({
            success: true,
            orderId: order.id,
            status: order.status,
        });

    } catch (error: any) {
        console.error('Donation Payment Create Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
