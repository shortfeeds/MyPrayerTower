import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { notifyDonation } from '@/lib/email';

const prisma = db;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Missing Order ID' }, { status: 400 });
        }

        console.log(`Capturing Safe PayPal Donation Order: ${orderId}`);

        // 1. Capture PayPal Payment
        const captureResult = await capturePayPalOrder(orderId);

        if (captureResult.status === 'COMPLETED') {
            const capture = captureResult.purchase_units[0]?.payments?.captures?.[0];
            const dbRecordId = captureResult.purchase_units?.[0]?.reference_id || captureResult.purchase_units?.[0]?.custom_id;

            if (dbRecordId) {
                const donation = await db.platformDonation.update({
                    where: { id: dbRecordId },
                    data: {
                        status: 'PAID',
                        // Store payment ID if we want, schema has stripePaymentId etc but no generic
                        // We can misuse one or just rely on logs/reconciliation
                        paidAt: new Date(),
                    }
                });

                // Send email notification
                await notifyDonation({
                    amount: donation.amount,
                    name: donation.donorName || captureResult.payer?.name?.given_name || 'Donor',
                    email: donation.donorEmail || captureResult.payer?.email_address,
                    message: donation.message || undefined
                });
            }

            return NextResponse.json({
                success: true,
                orderId: captureResult.id,
                status: captureResult.status,
            });
        }

        return NextResponse.json({
            success: false,
            message: `Payment not completed. Status: ${captureResult.status}`,
        });

    } catch (error: any) {
        console.error('Donation Payment Capture Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Capture failed' },
            { status: 500 }
        );
    }
}
