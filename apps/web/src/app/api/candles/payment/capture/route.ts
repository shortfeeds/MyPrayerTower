import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { notifyCandle } from '@/lib/email';

const prisma = db; // Alias for minimal refactor impact if used elsewhere

// Duration in hours
const DURATION_HOURS = {
    'ONE_DAY': 24,
    'THREE_DAYS': 72,
    'SEVEN_DAYS': 168,
    'THIRTY_DAYS': 720
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Missing Order ID' }, { status: 400 });
        }

        console.log(`Capturing Safe PayPal Candle Order: ${orderId}`);

        // 1. Capture PayPal Payment
        const captureResult = await capturePayPalOrder(orderId);

        if (captureResult.status === 'COMPLETED') {
            const capture = captureResult.purchase_units[0]?.payments?.captures?.[0];

            // 2. Retrieve DB Record ID
            const dbRecordId = captureResult.purchase_units?.[0]?.reference_id || captureResult.purchase_units?.[0]?.custom_id;

            if (dbRecordId) {
                console.log(`Lighting Candle: ${dbRecordId}`);

                // Fetch to get duration for expiry calculation
                const candle = await db.virtualCandle.findUnique({ where: { id: dbRecordId } });

                if (candle) {
                    const hours = DURATION_HOURS[candle.duration as keyof typeof DURATION_HOURS] || 24;
                    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

                    const updatedCandle = await db.virtualCandle.update({
                        where: { id: dbRecordId },
                        data: {
                            paymentStatus: 'PAID',
                            paymentId: capture?.id, // Use capture ID as payment ID
                            isActive: true,
                            litAt: new Date(),
                            expiresAt: expiresAt
                        }
                    });

                    // Send email notification
                    await notifyCandle({
                        candleType: updatedCandle.duration,
                        intention: updatedCandle.intention,
                        amount: updatedCandle.amount || 0,
                        name: updatedCandle.isAnonymous ? 'Anonymous' : (updatedCandle.name || 'Prayer Warrior'),
                        email: captureResult.payer?.email_address
                    });
                }
            } else {
                console.warn('No reference ID found in PayPal candle order.', orderId);
            }

            return NextResponse.json({
                success: true,
                orderId: captureResult.id,
                status: captureResult.status,
                amount: capture?.amount?.value,
                payerEmail: captureResult.payer?.email_address,
                payerName: captureResult.payer?.name?.given_name,
            });
        }

        return NextResponse.json({
            success: false,
            message: `Payment not completed. Status: ${captureResult.status}`,
        });

    } catch (error: any) {
        console.error('Candle Payment Capture Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Capture failed' },
            { status: 500 }
        );
    }
}
