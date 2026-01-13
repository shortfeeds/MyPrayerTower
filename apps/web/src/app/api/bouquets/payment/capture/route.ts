import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

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

                await prisma.spiritualBouquet.update({
                    where: { id: dbRecordId },
                    data: {
                        paymentStatus: 'PAID',
                        paymentId: capture?.id,
                        sentAt: new Date(), // Used for immediate tracking, schedule delivery handled elsewhere
                    }
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
