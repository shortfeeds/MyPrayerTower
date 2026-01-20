import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { notifyDonation } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Donation Checkout Request:', JSON.stringify(body, null, 2));
        const { amount, tier, email, name, message, isAnonymous, paypalOrderId, paypalPayerEmail } = body;

        // amount is in cents
        if (!amount || amount < 50) { // Minimum 50 cents
            return NextResponse.json(
                { success: false, message: 'Invalid donation amount' },
                { status: 400 }
            );
        }

        const orderId = paypalOrderId || `DONATE_${randomUUID().slice(0, 8)}_${Date.now()}`;

        // Save donation to DB
        try {
            const { db } = await import('@/lib/db');
            const { isSubscription } = body;

            await db.platformDonation.create({
                data: {
                    orderNumber: orderId,
                    amount: amount,
                    email: email || '',
                    name: name || 'Anonymous',
                    phone: '9999999999',
                    message: message || '',
                    tier: isSubscription ? 'CUSTOM' : (tier || 'CUSTOM') as any,
                    isAnonymous: !!isAnonymous,
                    coversFee: false, // Feature removed
                    isRecurring: !!isSubscription,
                    recurringPlan: isSubscription ? (tier as any) : null,
                    status: paypalOrderId ? 'PAID' : 'PENDING',
                    paidAt: paypalOrderId ? new Date() : null,
                }
            });
        } catch (dbErr) {
            console.error('Failed to save donation to DB:', dbErr);
        }

        // Send admin notification
        notifyDonation({
            amount,
            name: name || 'Anonymous',
            email,
            message,
            tier
        }).catch(err => console.error('Failed to send donation notification:', err));

        return NextResponse.json({
            success: true,
            order_id: orderId,
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
