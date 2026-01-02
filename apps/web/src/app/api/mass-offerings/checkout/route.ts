import { NextRequest, NextResponse } from 'next/server';

// Mass Offering Checkout API
// Note: This requires Cashfree API keys to be configured in environment variables
// CASHFREE_APP_ID and CASHFREE_SECRET_KEY

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            offeringType,
            intentionFor,
            additionalNames,
            isForLiving,
            categories,
            specialIntention,
            offeredBy,
            tributeMessage,
            email,
            name,
            phone,
            isGift,
            recipientEmail,
            recipientName,
            giftMessage,
            includesVirtualCandle,
            includesPrintedCard,
            includesFramedCertificate,
            printedCardShippingAddress,
        } = body;

        // Validate required fields
        if (!offeringType || !intentionFor || !email || !name) {
            return NextResponse.json(
                { error: 'Missing required fields: offeringType, intentionFor, email, name' },
                { status: 400 }
            );
        }

        // Calculate amount
        const PRICES: Record<string, number> = {
            'REGULAR': 1500,
            'PERPETUAL': 10000,
            'NOVENA': 7500,
            'GREGORIAN': 25000,
        };

        let amount = PRICES[offeringType] || 1500;
        if (includesVirtualCandle) amount += 500;
        if (includesPrintedCard) amount += 1000;
        if (includesFramedCertificate) amount += 3500;

        // Check if Cashfree is configured
        const appId = process.env.CASHFREE_APP_ID;
        const secretKey = process.env.CASHFREE_SECRET_KEY;

        if (!appId || !secretKey) {
            // Return mock response for development
            console.warn('Cashfree not configured - returning mock session for development');
            return NextResponse.json({
                error: 'Payment gateway not configured. Please contact support or try again later.',
                developmentMode: true,
            }, { status: 503 });
        }

        // Generate unique order ID
        const orderId = `MASS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create Cashfree order
        const cashfreeUrl = process.env.NODE_ENV === 'production'
            ? 'https://api.cashfree.com/pg/orders'
            : 'https://sandbox.cashfree.com/pg/orders';

        const orderPayload = {
            order_id: orderId,
            order_amount: amount / 100, // Convert from cents to dollars
            order_currency: 'USD',
            customer_details: {
                customer_id: email.replace(/[^a-zA-Z0-9]/g, '_'),
                customer_email: email,
                customer_phone: phone || '+1000000000',
                customer_name: name,
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006'}/mass-offerings/success?order_id={order_id}`,
                notify_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006'}/api/webhooks/cashfree`,
            },
            order_note: `Mass Offering: ${offeringType} for ${intentionFor}`,
        };

        const response = await fetch(cashfreeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': appId,
                'x-client-secret': secretKey,
                'x-api-version': '2022-09-01',
            },
            body: JSON.stringify(orderPayload),
        });

        const data = await response.json();

        if (data.payment_session_id) {
            return NextResponse.json({
                paymentSessionId: data.payment_session_id,
                orderId: orderId,
            });
        } else {
            console.error('Cashfree error:', data);
            return NextResponse.json(
                { error: data.message || 'Failed to create payment session' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
