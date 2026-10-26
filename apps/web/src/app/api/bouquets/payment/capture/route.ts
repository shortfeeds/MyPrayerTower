import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { notifyBouquet } from '@/lib/email';

const prisma = db;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Missing Order ID' }, { status: 400 });
        }

        console.log(`Capturing Safe PayPal Bouquet Order: ${orderId}`);

        // 1. Capture PayPal Payment
        const captureResult = await capturePayPalOrder(orderId);

        if (captureResult.status === 'COMPLETED') {
            const capture = captureResult.purchase_units[0]?.payments?.captures?.[0];
            const dbRecordId = captureResult.purchase_units?.[0]?.reference_id || captureResult.purchase_units?.[0]?.custom_id;

            if (dbRecordId) {
                console.log(`Fulfilling Bouquet: ${dbRecordId}`);

                const bouquet = await db.spiritualBouquet.update({
                    where: { id: dbRecordId },
                    data: {
                        paymentStatus: 'PAID',
                        paymentId: capture?.id,
                        sentAt: new Date(), // Used for immediate tracking, schedule delivery handled elsewhere
                    }
                });

                // Send email notification
                const prayerTypesList: string[] = [];
                if (bouquet.massesCount > 0) prayerTypesList.push(`${bouquet.massesCount} Masses`);
                if (bouquet.rosariesCount > 0) prayerTypesList.push(`${bouquet.rosariesCount} Rosaries`);
                if (bouquet.prayersCount > 0) prayerTypesList.push(`${bouquet.prayersCount} Prayers`);
                if (bouquet.candlesCount > 0) prayerTypesList.push(`${bouquet.candlesCount} Candles`);

                await notifyBouquet({
                    recipient: bouquet.recipientName,
                    sender: bouquet.creatorName,
                    prayerTypes: prayerTypesList,
                    amount: bouquet.amount || 0,
                    email: bouquet.creatorEmail
                });
            } else {
                console.warn('No reference ID found in PayPal bouquet order.', orderId);
            }

            return NextResponse.json({
                success: true,
                orderId: captureResult.id,
                status: captureResult.status,
                amount: capture?.amount?.value,
                payerEmail: captureResult.payer?.email_address,
            });
        }

        return NextResponse.json({
            success: false,
            message: `Payment not completed. Status: ${captureResult.status}`,
        });

    } catch (error: any) {
        console.error('Bouquet Payment Capture Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Capture failed' },
            { status: 500 }
        );
    }
}
