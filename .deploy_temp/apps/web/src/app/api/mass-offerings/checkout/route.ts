import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { notifyMassOffering } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Mass Offering Checkout Request:', JSON.stringify(body, null, 2));
        const { offeringId, amount, intention, name, date, email, paypalOrderId, paypalPayerEmail } = body;

        if (!offeringId || !amount || !intention) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const orderId = paypalOrderId || `MASS_${randomUUID().slice(0, 8)}_${Date.now()}`;

        // Save mass offering to DB
        try {
            const { db } = await import('@/lib/db');
            await db.massOffering.create({
                data: {
                    orderNumber: orderId,
                    offeringType: offeringId.toUpperCase() as any, // Cast to enum
                    amount: amount,
                    intentionFor: intention,
                    email: email || '',
                    name: name || 'Guest',
                    phone: '9999999999',
                    status: paypalOrderId ? 'PAID' : 'PENDING_PAYMENT',
                    paidAt: paypalOrderId ? new Date() : null,
                    celebrationDate: date ? new Date(date) : null
                }
            });
        } catch (dbErr) {
            console.error('Failed to save mass offering to DB:', dbErr);
        }

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
            order_id: orderId,
        });

    } catch (error: any) {
        console.error('Mass Offering Checkout error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
