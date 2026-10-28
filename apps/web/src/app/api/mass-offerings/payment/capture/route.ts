import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { notifyMassOffering } from '@/lib/email';
import { dispatchServerNotification } from '@/lib/serverNotifications';

const prisma = db;

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

            const dbRecordId = (captureResult.purchase_units?.[0] as any)?.reference_id;
            const customId = (captureResult.purchase_units?.[0] as any)?.custom_id;
            const targetId = dbRecordId || customId;

            if (targetId) {
                console.log(`Fulfilling Mass Offering: ${targetId}`);

                const offering = await prisma.massOffering.update({
                    where: { id: targetId },
                    data: {
                        status: 'PAID',
                        paidAt: new Date(),
                    }
                });

                // Send email notification
                await notifyMassOffering({
                    offeringType: offering.offeringType,
                    intention: offering.intentionFor,
                    amount: offering.amount,
                    name: offering.name,
                    email: offering.email
                });

                // In-App & Push Notification
                if (offering.userId) {
                    await dispatchServerNotification({
                        userId: offering.userId,
                        title: 'Holy Mass Intention Consecrated',
                        body: `Your Holy Mass offering for "${offering.intentionFor}" has been accepted and scheduled for celebration.`,
                        type: 'MASS_OFFERING_UPDATE',
                        data: { link: '/my-vigils', orderNumber: offering.orderNumber }
                    });
                }
            } else {
                console.warn('No reference ID found in PayPal order. Manual reconciliation needed.', orderId);
            }

            return NextResponse.json({
                success: true,
                orderId: captureResult.id,
                status: captureResult.status,
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
