// PayPal server-side helpers for creating and capturing orders
// Uses PayPal REST API v2

const PAYPAL_BASE_URL = process.env.PAYPAL_ENVIRONMENT === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

interface PayPalOrder {
    id: string;
    status: string;
    links: Array<{ href: string; rel: string; method: string }>;
}

interface PayPalCaptureResult {
    id: string;
    status: string;
    purchase_units: Array<{
        payments: {
            captures: Array<{
                id: string;
                status: string;
                amount: { currency_code: string; value: string };
            }>;
        };
    }>;
    payer: {
        email_address: string;
        payer_id: string;
        name?: { given_name: string; surname: string };
    };
}

/**
 * Get PayPal access token using client credentials
 */
async function getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('PayPal OAuth Error:', error);
        throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * Simple item interface for our internal use
 */
export interface PayPalItem {
    name: string;
    unitAmount: string; // "10.00"
    quantity: string;   // "1"
    description?: string;
}

/**
 * Create a PayPal order
 * @param amount Amount in USD (as a decimal string, e.g. "10.00")
 * @param description Order description
 * @param referenceId Optional reference ID for your records
 * @param items Optional list of items for detailed receipt
 */
export async function createPayPalOrder(
    amount: string,
    description: string,
    referenceId?: string,
    items?: PayPalItem[]
): Promise<PayPalOrder> {
    const accessToken = await getAccessToken();

    // Base purchase unit structure
    const purchaseUnit: any = {
        reference_id: referenceId || `ORDER_${Date.now()}`,
        description: description.substring(0, 127), // PayPal has 127 char limit
        amount: {
            currency_code: 'USD',
            value: amount,
        },
    };

    // If items are provided, we must include breakdown
    if (items && items.length > 0) {
        // Calculate item total
        const itemTotal = items.reduce((sum, item) => {
            return sum + (parseFloat(item.unitAmount) * parseInt(item.quantity));
        }, 0).toFixed(2);

        // Sanity check: item total must match main amount for normal flows
        // (ignoring tax/shipping for now as per current simple model)
        if (itemTotal === amount) {
            purchaseUnit.amount.breakdown = {
                item_total: {
                    currency_code: 'USD',
                    value: itemTotal
                }
            };

            purchaseUnit.items = items.map(item => ({
                name: item.name.substring(0, 127),
                unit_amount: {
                    currency_code: 'USD',
                    value: item.unitAmount
                },
                quantity: item.quantity,
                description: item.description ? item.description.substring(0, 127) : undefined,
                category: 'DIGITAL_GOODS' // Default for our prayers/donations
            }));
        } else {
            console.warn(`PayPal Item mismatch: Total $${amount} vs Item Total $${itemTotal}. Omitting items to prevent error.`);
        }
    }

    const orderData = {
        intent: 'CAPTURE',
        purchase_units: [purchaseUnit],
        application_context: {
            brand_name: 'MyPrayerTower',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/payment-success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/payment-cancelled`,
        },
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('PayPal Create Order Error:', error);
        throw new Error('Failed to create PayPal order');
    }

    return response.json();
}

/**
 * Capture a PayPal order (finalize the payment)
 * @param orderId The PayPal order ID to capture
 */
export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureResult> {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('PayPal Capture Order Error:', error);
        throw new Error('Failed to capture PayPal payment');
    }

    return response.json();
}

/**
 * Get order details
 * @param orderId The PayPal order ID
 */
export async function getPayPalOrder(orderId: string): Promise<any> {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('PayPal Get Order Error:', error);
        throw new Error('Failed to get PayPal order details');
    }

    return response.json();
}
