import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, description, referenceId, metadata } = body;

        // 1. Create Pending Candle Record
        const candle = await prisma.virtualCandle.create({
            data: {
                intention: metadata.intention,
                isAnonymous: metadata.isAnonymous,
                name: metadata.name,
                email: metadata.email || '', // Optional in frontend?
                amount: amount, // in cents
                duration: metadata.duration,
                isActive: false, // Inactive until paid
                paymentStatus: 'PENDING',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // Default placeholder, updated on activation
            }
        });

        // 2. Create PayPal Order
        const dollarAmount = (amount / 100).toFixed(2);

        console.log(`Creating Safe PayPal Order for Candle ${candle.id}`);

        const order = await createPayPalOrder(
            dollarAmount,
            description || 'Virtual Candle',
            candle.id // Link DB ID
        );

        return NextResponse.json({
            success: true,
            orderId: order.id,
            status: order.status,
        });

    } catch (error: any) {
        console.error('Candle Payment Create Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
