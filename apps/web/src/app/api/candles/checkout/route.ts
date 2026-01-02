import { NextRequest, NextResponse } from 'next/server';

// Cashfree payment integration for virtual candles - USD pricing
export async function POST(request: NextRequest) {
    try {
        const { duration, amount, intention, name, isAnonymous } = await request.json();

        // Validate required fields
        if (!duration || !intention) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate amount for paid durations (USD cents)
        const pricingMap: Record<string, number> = {
            'THREE_DAYS': 299,   // $2.99
            'SEVEN_DAYS': 599,   // $5.99
            'THIRTY_DAYS': 1499, // $14.99
        };

        const expectedAmount = pricingMap[duration];
        if (expectedAmount && amount !== expectedAmount) {
            return NextResponse.json(
                { success: false, message: 'Invalid amount' },
                { status: 400 }
            );
        }

        // For free candles, just return success
        if (duration === 'ONE_DAY' || amount === 0) {
            return NextResponse.json({
                success: true,
                orderId: `FREE-${Date.now()}`,
                message: 'Free candle - no payment required',
            });
        }

        // Get Cashfree credentials
        const appId = process.env.CASHFREE_APP_ID;
        const secretKey = process.env.CASHFREE_SECRET_KEY;

        if (!appId || !secretKey) {
            // Development mode - mock payment success
            if (process.env.NODE_ENV === 'development') {
                console.log('DEV MODE: Mocking payment for candle', { duration, amount });
                return NextResponse.json({
                    success: true,
                    orderId: `DEV-CANDLE-${Date.now()}`,
                    message: 'Development mode - payment mocked',
                });
            }

            return NextResponse.json(
                { success: false, message: 'Payment gateway not configured' },
                { status: 500 }
            );
        }

        // Generate unique order ID
        const orderId = `CANDLE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Cashfree API request
        const cashfreeUrl = process.env.CASHFREE_ENV === 'production'
            ? 'https://api.cashfree.com/pg/orders'
            : 'https://sandbox.cashfree.com/pg/orders';

        const durationLabels: Record<string, string> = {
            'THREE_DAYS': '3-Day',
            'SEVEN_DAYS': '7-Day',
            'THIRTY_DAYS': '30-Day',
        };

        const response = await fetch(cashfreeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': appId,
                'x-client-secret': secretKey,
            },
            body: JSON.stringify({
                order_id: orderId,
                order_amount: (amount / 100).toFixed(2), // Convert cents to dollars
                order_currency: 'USD',
                customer_details: {
                    customer_id: `candle-${Date.now()}`,
                    customer_name: isAnonymous ? 'Anonymous' : (name || 'Anonymous'),
                    customer_email: 'candle@myprayertower.com',
                    customer_phone: '9999999999',
                },
                order_meta: {
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/candles/payment-success?order_id={order_id}`,
                    notify_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/api/candles/webhook`,
                },
                order_note: `${durationLabels[duration] || duration} Prayer Candle - ${intention.slice(0, 50)}`,
            }),
        });

        const data = await response.json();

        if (response.ok && data.payment_session_id) {
            // Return Cashfree checkout URL
            const checkoutUrl = process.env.CASHFREE_ENV === 'production'
                ? `https://payments.cashfree.com/pg/view/order/${data.cf_order_id}`
                : `https://sandbox.cashfree.com/pg/view/order/${data.cf_order_id}`;

            return NextResponse.json({
                success: true,
                orderId: orderId,
                cfOrderId: data.cf_order_id,
                paymentSessionId: data.payment_session_id,
                paymentUrl: checkoutUrl,
            });
        }

        console.error('Cashfree error:', data);
        return NextResponse.json(
            { success: false, message: data.message || 'Failed to create payment order' },
            { status: 500 }
        );

    } catch (error) {
        console.error('Candle checkout error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
