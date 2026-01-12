import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { notifyCandle } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { duration, amount, intention, name, isAnonymous, email, paypalOrderId, paypalPayerEmail } = body;

        // Validate required fields
        if (!duration || !amount || !intention) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create a unique order ID
        const orderId = paypalOrderId || `CANDLE_${randomUUID().slice(0, 8)}_${Date.now()}`;

        // Customer details
        const customerName = name || 'Guest';

        // Save candle to DB
        try {
            const { db } = await import('@/lib/db');

            // Calculate expiry
            const now = new Date();
            const expiresAt = new Date(now);
            if (duration === 'ONE_DAY') expiresAt.setDate(now.getDate() + 1);
            else if (duration === 'THREE_DAYS') expiresAt.setDate(now.getDate() + 3);
            else if (duration === 'SEVEN_DAYS') expiresAt.setDate(now.getDate() + 7);
            else if (duration === 'THIRTY_DAYS') expiresAt.setDate(now.getDate() + 30);
            else expiresAt.setDate(now.getDate() + 3); // Default

            await db.virtualCandle.create({
                data: {
                    id: orderId,
                    intention,
                    isAnonymous: !!isAnonymous,
                    name: customerName,
                    email: email || '',
                    amount: amount,
                    duration: duration,
                    litAt: now,
                    expiresAt: expiresAt,
                    isActive: paypalOrderId ? true : false,
                    paymentStatus: paypalOrderId ? 'PAID' : 'PENDING'
                }
            });
        } catch (dbErr) {
            console.error('Failed to save candle to DB:', dbErr);
        }

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
            order_id: orderId,
        });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
