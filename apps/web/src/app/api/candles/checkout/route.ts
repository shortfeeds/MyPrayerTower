import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { notifyCandle } from '@/lib/email';
import { getUserFromCookie } from '@/lib/auth';
import { dispatchServerNotification } from '@/lib/serverNotifications';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { duration, amount, intention, name, isAnonymous, email, paypalOrderId, paypalPayerEmail } = body;

        // Validate required fields
        if (!duration || amount === undefined || !intention) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create a unique order ID
        const orderId = paypalOrderId || `CANDLE_${randomUUID().slice(0, 8)}_${Date.now()}`;

        // Customer details
        const customerName = name || (isAnonymous ? 'Anonymous Devotee' : 'Guest');

        const user = await getUserFromCookie().catch(() => null);

        // Calculate expiry
        const now = new Date();
        const expiresAt = new Date(now);
        if (duration === 'ONE_DAY' || duration === 'FREE') expiresAt.setDate(now.getDate() + 1);
        else if (duration === 'THREE_DAYS' || duration === '3_DAYS') expiresAt.setDate(now.getDate() + 3);
        else if (duration === 'SEVEN_DAYS' || duration === '7_DAYS') expiresAt.setDate(now.getDate() + 7);
        else if (duration === 'FOURTEEN_DAYS' || duration === '14_DAYS') expiresAt.setDate(now.getDate() + 14);
        else if (duration === 'THIRTY_DAYS' || duration === '30_DAYS') expiresAt.setDate(now.getDate() + 30);
        else expiresAt.setDate(now.getDate() + 7); // Default

        const normalizedDuration = (duration === 'FREE' ? 'ONE_DAY' :
            duration === '3_DAYS' ? 'THREE_DAYS' :
            duration === '7_DAYS' ? 'SEVEN_DAYS' :
            duration === '14_DAYS' ? 'FOURTEEN_DAYS' :
            duration === '30_DAYS' ? 'THIRTY_DAYS' : duration);

        const isPaid = Boolean(paypalOrderId || amount === 0);

        // Save candle to DB
        let createdCandle: any = null;
        try {
            const { db } = await import('@/lib/db');

            createdCandle = await db.prayerCandle.create({
                data: {
                    id: orderId,
                    userId: user?.id || null,
                    intention,
                    isAnonymous: !!isAnonymous,
                    name: customerName,
                    email: email || (user as any)?.email || '',
                    amount: Math.round(Number(amount) * 100),
                    duration: normalizedDuration,
                    litAt: now,
                    expiresAt: expiresAt,
                    isActive: isPaid,
                    paymentStatus: isPaid ? 'PAID' : 'PENDING'
                }
            });

            // Instant cache purge for live sanctuary view
            try {
                revalidatePath('/candles');
                revalidateTag('candles');
            } catch {
                // ignore
            }

            // Dispatch notification if paid/free and user exists
            if (isPaid && user?.id) {
                await dispatchServerNotification({
                    userId: user.id,
                    title: 'Votive Candle Lit in Sanctuary',
                    body: `Your vigil for "${intention.slice(0, 45)}..." is now burning brightly in the sanctuary.`,
                    type: 'SYSTEM',
                    data: { link: '/my-vigils', candleId: orderId }
                });
            }
        } catch (dbErr) {
            console.error('Failed to save candle to DB:', dbErr);
        }

        // Send admin notification
        notifyCandle({
            candleType: normalizedDuration,
            intention,
            amount: Number(amount),
            name: customerName,
            email: email || undefined
        }).catch(err => console.error('Failed to send candle notification:', err));

        return NextResponse.json({
            success: true,
            order_id: orderId,
            candle: createdCandle ? {
                id: createdCandle.id,
                expiresAt: createdCandle.expiresAt.toISOString(),
            } : undefined
        });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
