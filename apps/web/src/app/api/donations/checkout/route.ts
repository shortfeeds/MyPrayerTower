import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/cashfree';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Donation Checkout Request:', JSON.stringify(body, null, 2));
        const { amount, tier, email, name, message, isAnonymous, coversFee } = body;

        // amount is in cents
        if (!amount || amount < 50) { // Minimum 50 cents
            return NextResponse.json(
                { success: false, message: 'Invalid donation amount' },
                { status: 400 }
            );
        }

        const orderId = `DONATE_${randomUUID().slice(0, 8)}_${Date.now()}`;
        const customerId = (name || 'donor').replace(/[^\w]/g, '_').substring(0, 20);

        // Convert cents to dollars
        const dollarAmount = Number((amount / 100).toFixed(2));

        const order = await createOrder({
            orderId,
            amount: dollarAmount,
            currency: 'USD',
            customerId,
            customerPhone: '9999999999',
            customerName: name || 'Donor'
        });

        return NextResponse.json({
            success: true,
            payment_session_id: order.payment_session_id,
            order_id: order.order_id,
            url: null
        });

    } catch (error: any) {
        console.error('Donation Checkout error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
