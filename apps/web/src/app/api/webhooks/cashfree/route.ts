import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Cashfree Webhook Handler for Payment Events
 * 
 * Webhook URL: https://myprayertower.com/api/webhooks/cashfree
 * 
 * Events handled:
 * - PAYMENT_SUCCESS / ORDER_PAID
 * - PAYMENT_FAILED / PAYMENT_USER_DROPPED  
 * - SUBSCRIPTION_ACTIVATED
 * - SUBSCRIPTION_CANCELLED
 */

const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET || '';

/**
 * Verify webhook signature from Cashfree
 */
function verifySignature(signature: string, timestamp: string, rawBody: string): boolean {
    if (!CASHFREE_CLIENT_SECRET) {
        console.warn('CASHFREE_CLIENT_SECRET not configured - skipping signature verification');
        return process.env.NODE_ENV !== 'production'; // Allow in dev only
    }

    const payload = timestamp + rawBody;
    const expectedSignature = crypto
        .createHmac('sha256', CASHFREE_CLIENT_SECRET)
        .update(payload)
        .digest('base64');

    return signature === expectedSignature;
}

/**
 * Parse payment data from webhook
 */
function parsePaymentData(body: any) {
    const data = body.data || body;
    const order = data.order || {};
    const payment = data.payment || {};

    return {
        orderId: order.order_id || data.order_id || '',
        status: payment.payment_status || data.payment_status || 'PENDING',
        transactionId: payment.cf_payment_id || data.cf_payment_id || '',
        amount: (order.order_amount || data.amount || 0) * 100, // Convert to cents
        currency: order.order_currency || data.currency || 'USD',
        paymentMethod: payment.payment_method?.type || 'unknown',
        tags: order.order_tags || {},
    };
}

export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get('x-webhook-signature') || '';
        const timestamp = request.headers.get('x-webhook-timestamp') || '';
        const rawBody = await request.text();

        // Verify signature in production
        if (process.env.NODE_ENV === 'production') {
            if (!signature || !timestamp) {
                console.error('Missing webhook signature headers');
                return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
            }

            const isValid = verifySignature(signature, timestamp, rawBody);
            if (!isValid) {
                console.error('Invalid webhook signature');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        }

        const body = JSON.parse(rawBody);
        const eventType = body.type || body.event || '';

        console.log(`[Cashfree Webhook] Event: ${eventType}`);

        switch (eventType) {
            case 'PAYMENT_SUCCESS':
            case 'ORDER_PAID':
                await handlePaymentSuccess(body);
                break;

            case 'PAYMENT_FAILED':
            case 'PAYMENT_USER_DROPPED':
                await handlePaymentFailed(body);
                break;

            case 'SUBSCRIPTION_ACTIVATED':
            case 'SUBSCRIPTION_ACTIVE':
                await handleSubscriptionActivated(body);
                break;

            case 'SUBSCRIPTION_CANCELLED':
            case 'SUBSCRIPTION_EXPIRED':
                await handleSubscriptionCancelled(body);
                break;

            case 'REFUND_SUCCESS':
            case 'PAYMENT_REFUND':
                await handleRefund(body);
                break;

            default:
                console.log(`[Cashfree Webhook] Unhandled event: ${eventType}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('[Cashfree Webhook] Error:', error.message);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(event: any) {
    const data = parsePaymentData(event);
    const orderId = data.orderId;

    console.log(`[Cashfree] Payment success for order: ${orderId}`);

    // Determine order type from order ID prefix
    if (orderId.startsWith('MO-')) {
        // Mass Offering - Update database
        await updateMassOfferingStatus(orderId, data.transactionId, 'PAID');
        console.log(`[Cashfree] Mass Offering ${orderId} marked as paid`);

    } else if (orderId.startsWith('DON-')) {
        // Platform Donation
        await updateDonationStatus(orderId, data.transactionId, 'COMPLETED');
        console.log(`[Cashfree] Donation ${orderId} marked as completed`);

    } else {
        console.warn(`[Cashfree] Unknown order type for: ${orderId}`);
    }
}

/**
 * Handle failed payment  
 */
async function handlePaymentFailed(event: any) {
    const data = parsePaymentData(event);
    console.warn(`[Cashfree] Payment failed for order: ${data.orderId}`);

    // Update order status to FAILED
    if (data.orderId.startsWith('MO-')) {
        await updateMassOfferingStatus(data.orderId, '', 'PAYMENT_FAILED');
    } else if (data.orderId.startsWith('DON-')) {
        await updateDonationStatus(data.orderId, '', 'FAILED');
    }
}

/**
 * Handle subscription activation
 */
async function handleSubscriptionActivated(event: any) {
    const data = event.data || event;
    const subscriptionId = data.subscription?.subscription_id || data.subscription_id;
    console.log(`[Cashfree] Subscription activated: ${subscriptionId}`);

    // TODO: Create subscription record in database
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(event: any) {
    const data = event.data || event;
    const subscriptionId = data.subscription?.subscription_id || data.subscription_id;
    console.log(`[Cashfree] Subscription cancelled: ${subscriptionId}`);

    // TODO: Update subscription status in database
}

/**
 * Handle refund
 */
async function handleRefund(event: any) {
    const data = event.data || event;
    const orderId = data.order?.order_id || data.order_id;
    console.log(`[Cashfree] Refund processed for order: ${orderId}`);

    // TODO: Update order to REFUNDED status
}

/**
 * Update Mass Offering status in database
 */
async function updateMassOfferingStatus(orderNumber: string, transactionId: string, status: string) {
    // Call the backend API or directly update via Prisma
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    try {
        const response = await fetch(`${apiUrl}/api/v1/mass-offerings/webhook-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-secret': process.env.INTERNAL_WEBHOOK_SECRET || 'internal-secret',
            },
            body: JSON.stringify({ orderNumber, transactionId, status }),
        });

        if (!response.ok) {
            console.error(`Failed to update mass offering: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating mass offering:', error);
    }
}

/**
 * Update Donation status in database  
 */
async function updateDonationStatus(orderNumber: string, transactionId: string, status: string) {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    try {
        const response = await fetch(`${apiUrl}/api/v1/platform-donations/webhook-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-secret': process.env.INTERNAL_WEBHOOK_SECRET || 'internal-secret',
            },
            body: JSON.stringify({ orderNumber, transactionId, status }),
        });

        if (!response.ok) {
            console.error(`Failed to update donation: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating donation:', error);
    }
}
