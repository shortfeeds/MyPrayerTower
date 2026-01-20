import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Order ID is required' },
                { status: 400 }
            );
        }

        console.log(`Capturing PayPal order: ${orderId}`);

        const captureResult = await capturePayPalOrder(orderId);

        console.log('PayPal order captured:', captureResult.id, captureResult.status);

        // Check if payment was successful
        if (captureResult.status === 'COMPLETED') {
            const capture = captureResult.purchase_units[0]?.payments?.captures?.[0];

            return NextResponse.json({
                success: true,
                orderId: captureResult.id,
                status: captureResult.status,
                captureId: capture?.id,
                amount: capture?.amount?.value,
                currency: capture?.amount?.currency_code,
                payerEmail: captureResult.payer?.email_address,
                payerName: captureResult.payer?.name
                    ? `${captureResult.payer.name.given_name} ${captureResult.payer.name.surname}`
                    : null,
            });
        }

        return NextResponse.json({
            success: false,
            message: `Payment not completed. Status: ${captureResult.status}`,
            status: captureResult.status,
        });

    } catch (error: any) {
        console.error('PayPal Capture Order Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to capture PayPal payment' },
            { status: 500 }
        );
    }
}
