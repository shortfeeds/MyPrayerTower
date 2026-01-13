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

        console.log(`Capturing Safe PayPal Order: ${orderId}`);

        // 1. Capture PayPal Payment
        const captureResult = await capturePayPalOrder(orderId);

        if (captureResult.status === 'COMPLETED') {
            const capture = captureResult.purchase_units[0]?.payments?.captures?.[0];

            // 2. Retrieve our DB Record ID
            // We passed it as referenceId (invoice_id) or custom_id when creating.
            // PayPal returns it in purchase_units[0].reference_id or custom_id.
            // Check captureResult.purchase_units[0]

            // NOTE: The 'createPayPalOrder' lib helper usually maps referenceId to invoice_id or custom_id.
            // We try to find the mass offering by matching the 'reference_id' returned by PayPal 
            // OR we can trust the client? NO. We must find it from PayPal data.

            // Fallback: If we can't find it in PayPal response (legacy lib issue), 
            // we might need to rely on the fact that we created it.
            // But let's look for purchase_units[0].reference_id (standard).
            const dbRecordId = captureResult.purchase_units?.[0]?.reference_id;
            // If createPayPalOrder puts it in custom_id:
            const customId = captureResult.purchase_units?.[0]?.custom_id;

            const targetId = dbRecordId || customId;

            if (targetId) {
                console.log(`Fulfilling Mass Offering: ${targetId}`);

                await prisma.massOffering.update({
                    where: { id: targetId },
                    data: {
                        status: 'PAID',
                        // Store capture details
                        // We don't have dedicated paypal columns in schema yet (only stripe/cashfree).
                        // We can reuse 'stripePaymentId' temporarily or leave blank?
                        // Schema has: stripePaymentId, cashfreePaymentId.
                        // Let's NOT hack it. We just update status.
                        paidAt: new Date(),
                    }
                });
            } else {
                console.warn('No reference ID found in PayPal order. Manual reconciliation needed.', orderId);
            }

            return NextResponse.json({
                success: true,
                orderId: captureResult.id,
                status: captureResult.status,
                // Return details for client display
                amount: capture?.amount?.value,
                currency: capture?.amount?.currency_code,
                payerName: captureResult.payer?.name?.given_name,
            });
        }

        return NextResponse.json({
            success: false,
            message: `Payment not completed. Status: ${captureResult.status}`,
        });

    } catch (error: any) {
        console.error('Mass Offering Payment Capture Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Capture failed' },
            { status: 500 }
        );
    }
}
