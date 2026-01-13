import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, description, referenceId, metadata } = body;

        // 1. Create Pending Bouquet Record
        const bouquet = await prisma.spiritualBouquet.create({
            data: {
                creatorName: metadata.senderName,
                creatorEmail: metadata.senderEmail,
                recipientName: metadata.recipientName,
                recipientEmail: metadata.recipientEmail,
                occasion: metadata.occasion,
                message: metadata.message,
                sendDate: metadata.sendDate ? new Date(metadata.sendDate) : undefined,

                // Items
                massesCount: metadata.items.mass || 0,
                rosariesCount: metadata.items.rosary || 0,
                prayersCount: metadata.items.prayer || 0,
                candlesCount: metadata.items.candle || 0,

                amount: amount,
                paymentStatus: 'PENDING',
            }
        });

        // 2. Create PayPal Order
        const dollarAmount = (amount / 100).toFixed(2);

        console.log(`Creating Safe PayPal Order for Bouquet ${bouquet.id}`);

        const order = await createPayPalOrder(
            dollarAmount,
            description || 'Spiritual Bouquet',
            bouquet.id
        );

        return NextResponse.json({
            success: true,
            orderId: order.id,
            status: order.status,
        });

    } catch (error: any) {
        console.error('Bouquet Payment Create Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
