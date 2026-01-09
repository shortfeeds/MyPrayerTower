import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/cashfree';
import { randomUUID } from 'crypto';
import { notifyCandle } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { duration, amount, intention, name, isAnonymous, email } = body;

        // Validate required fields
        if (!duration || !amount || !intention) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create a unique order ID
        const orderId = `CANDLE_${randomUUID().slice(0, 8)}_${Date.now()}`;

        // Customer details
        const customerId = name ? name.replace(/[^\w]/g, '_').substring(0, 20) : 'guest_user';
        const customerPhone = '9999999999';
        const customerName = name || 'Guest';

        const order = await createOrder({
            orderId,
            amount: Number((amount / 100).toFixed(2)), // Convert cents to dollars
            currency: 'USD',
            customerId,
            customerPhone,
            customerName
        });

        // Send admin notification
        notifyCandle({
            candleType: duration,
            intention,
            amount,
            name: customerName,
            email
        }).catch(err => console.error('Failed to send candle notification:', err));

        return NextResponse.json({
            success: true,
            payment_session_id: order.payment_session_id,
            order_id: order.order_id,
        });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
