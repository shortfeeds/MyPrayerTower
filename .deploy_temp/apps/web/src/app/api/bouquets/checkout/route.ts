import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { notifyBouquet } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, recipientName, senderName, senderEmail, message, scheduleDate, isAnonymous, occasion, paypalOrderId, paypalPayerEmail } = body;

        // items = { [id]: count }
        // Pricing logic must match frontend or DB
        const PRICES: Record<string, number> = {
            'mass': 1000,
            'rosary': 500,
            'prayer': 0,
            'candle': 500
        };

        let totalAmount = 0;
        const prayerTypes: string[] = [];
        Object.keys(items).forEach(key => {
            const count = items[key];
            if (count > 0) {
                prayerTypes.push(`${count}x ${key}`);
                if (PRICES[key]) {
                    totalAmount += (PRICES[key] * count);
                }
            }
        });

        if (totalAmount === 0 || paypalOrderId) {
            // Paid or Free bouquet - save to DB
            try {
                const { db } = await import('@/lib/db');
                const orderId = paypalOrderId || `BOUQUET_${randomUUID().slice(0, 8)}_${Date.now()}`;
                await db.spiritualBouquet.create({
                    data: {
                        id: orderId,
                        creatorName: senderName,
                        creatorEmail: senderEmail,
                        recipientName: recipientName || 'Unknown',
                        recipientEmail: recipientEmail || 'Unknown',
                        occasion: occasion || 'Other',
                        message: message || '',
                        massesCount: items.mass || 0,
                        rosariesCount: items.rosary || 0,
                        prayersCount: items.prayer || 0,
                        candlesCount: items.candle || 0,
                        amount: totalAmount,
                        paymentStatus: totalAmount === 0 || paypalOrderId ? 'COMPLETED' : 'PENDING',
                        sentAt: new Date(),
                    }
                });

                // Send notification
                notifyBouquet({
                    recipient: recipientName || 'Unknown',
                    sender: senderName || 'Anonymous',
                    prayerTypes,
                    amount: totalAmount,
                    email: senderEmail
                }).catch(err => console.error('Failed to send bouquet notification:', err));

                return NextResponse.json({
                    success: true,
                    message: totalAmount === 0 ? 'Free bouquet processed' : 'Paid bouquet processed',
                    order_id: orderId
                });
            } catch (dbErr) {
                console.error('Failed to save bouquet to DB:', dbErr);
                return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
            }
        }

        if (!senderName || !senderEmail) {
            return NextResponse.json(
                { success: false, message: 'Sender name and email are required' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            amount: totalAmount / 100 // Dollars for PayPal
        });

    } catch (error: any) {
        console.error('Bouquet Checkout error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
