import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/cashfree';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, recipientName, senderName, senderEmail, message, scheduleDate, isAnonymous } = body;

        // items = { [id]: count }
        // Pricing logic must match frontend or DB
        const PRICES: Record<string, number> = {
            'mass': 1000,
            'rosary': 0,
            'prayer': 0,
            'candle': 499
        };

        let totalAmount = 0;
        Object.keys(items).forEach(key => {
            const count = items[key];
            if (count > 0 && PRICES[key]) {
                totalAmount += (PRICES[key] * count);
            }
        });

        if (totalAmount === 0) {
            // Free bouquet?
            return NextResponse.json({
                success: true,
                message: 'Free bouquet processed',
                // handle logic for free items
            });
        }

        const orderId = `BOUQUET_${randomUUID().slice(0, 8)}_${Date.now()}`;
        const customerId = (senderName || 'sender').replace(/[^\w]/g, '_').substring(0, 20);

        // Convert totalAmount (cents) to dollars
        const dollarAmount = Number((totalAmount / 100).toFixed(2));

        const order = await createOrder({
            orderId,
            amount: dollarAmount,
            currency: 'USD',
            customerId,
            customerPhone: '9999999999',
            customerName: senderName || 'Sender'
        });

        return NextResponse.json({
            success: true,
            payment_session_id: order.payment_session_id,
            order_id: order.order_id,
        });

    } catch (error: any) {
        console.error('Bouquet Checkout error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
