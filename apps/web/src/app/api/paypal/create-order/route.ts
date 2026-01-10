import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, description, referenceId, metadata } = body;

        // amount is expected in cents, convert to dollars
        const dollarAmount = (amount / 100).toFixed(2);

        if (!amount || parseFloat(dollarAmount) < 0.01) {
            return NextResponse.json(
                { success: false, message: 'Invalid amount' },
                { status: 400 }
            );
        }

        console.log(`Creating PayPal order: $${dollarAmount} - ${description}`);

        const order = await createPayPalOrder(
            dollarAmount,
            description || 'MyPrayerTower Payment',
            referenceId
        );

        console.log('PayPal order created:', order.id);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            status: order.status,
        });

    } catch (error: any) {
        console.error('PayPal Create Order Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create PayPal order' },
            { status: 500 }
        );
    }
}
