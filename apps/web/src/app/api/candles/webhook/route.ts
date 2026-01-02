import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Webhook for Cashfree payment notifications
export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        console.log('Candle webhook received:', JSON.stringify(payload, null, 2));

        // Verify Cashfree signature (in production)
        // const signature = request.headers.get('x-cashfree-signature');

        const { data } = payload;

        if (!data || !data.order) {
            return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
        }

        const { order } = data;
        const orderId = order.order_id;
        const paymentStatus = order.order_status;

        // Only process candle orders
        if (!orderId.startsWith('CANDLE-')) {
            return NextResponse.json({ success: true, message: 'Not a candle order' });
        }

        if (paymentStatus === 'PAID') {
            // Payment successful - candle should already be created
            // Update any pending candle records if needed
            console.log(`Candle payment successful for order: ${orderId}`);

            // You could update the candle record to mark it as "paid" here
            // await prisma.virtualCandle.updateMany({
            //     where: { orderId },
            //     data: { isPaid: true }
            // });
        } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
            console.log(`Candle payment ${paymentStatus} for order: ${orderId}`);
            // Could delete unpaid candle here if needed
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Candle webhook error:', error);
        return NextResponse.json(
            { success: false, message: 'Webhook processing error' },
            { status: 500 }
        );
    }
}
