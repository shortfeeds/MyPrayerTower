import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/cashfree';
import { randomUUID } from 'crypto';
import { notifyMassOffering } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Mass Offering Checkout Request:', JSON.stringify(body, null, 2));
        const { offeringId, amount, intention, name, date, email } = body;

        if (!offeringId || !amount || !intention) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const orderId = `MASS_${randomUUID().slice(0, 8)}_${Date.now()}`;
        const customerId = (name || 'guest').replace(/[^\w]/g, '_').substring(0, 20);

        const order = await createOrder({
            orderId,
            amount: Number((amount / 100).toFixed(2)),
            currency: 'USD',
            customerId,
            customerPhone: '9999999999',
            customerName: name || 'Guest'
        });

        // Send admin notification
        notifyMassOffering({
            offeringType: offeringId,
            intention,
            amount,
            name: name || 'Guest',
            email
        }).catch(err => console.error('Failed to send mass offering notification:', err));

        return NextResponse.json({
            success: true,
            payment_session_id: order.payment_session_id,
            order_id: order.order_id,
        });

    } catch (error: any) {
        console.error('Mass Offering Checkout error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
