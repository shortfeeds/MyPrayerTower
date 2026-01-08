import { Cashfree, CFEnvironment } from "cashfree-pg";

// Initialize Cashfree with v5+ API - methods are called on the instance
const isProduction = process.env.CASHFREE_ENVIRONMENT?.toUpperCase() === 'PRODUCTION';
const environment = isProduction ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

const cashfreeClient = new Cashfree(
    environment,
    process.env.CASHFREE_CLIENT_ID || '',
    process.env.CASHFREE_CLIENT_SECRET || ''
);

export { cashfreeClient };

export async function createOrder({
    orderId,
    amount,
    currency = 'USD',
    customerId,
    customerPhone,
    customerName,
    returnUrl
}: {
    orderId: string;
    amount: number;
    currency?: string;
    customerId: string;
    customerPhone: string;
    customerName?: string;
    returnUrl?: string;
}) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';
    // Cashfree Production requires HTTPS return URL
    const secureBaseUrl = process.env.CASHFREE_ENVIRONMENT?.toUpperCase() === 'PRODUCTION'
        ? baseUrl.replace('http://', 'https://')
        : baseUrl;

    const actualReturnUrl = returnUrl || `${secureBaseUrl}/api/payments/verify?order_id={order_id}`;

    const request = {
        order_amount: amount,
        order_currency: currency,
        order_id: orderId,
        customer_details: {
            customer_id: customerId,
            customer_phone: customerPhone,
            customer_name: customerName,
        },
        order_meta: {
            return_url: actualReturnUrl,
        }
    };

    try {
        // Use instance method, not static method
        const response = await cashfreeClient.PGCreateOrder(request);
        return response.data;
    } catch (error: any) {
        console.error("Cashfree Create Order Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create Cashfree order");
    }
}

export async function verifyOrder(orderId: string) {
    try {
        // Use instance method, not static method
        const response = await cashfreeClient.PGFetchOrder(orderId);
        return response.data;
    } catch (error: any) {
        console.error("Cashfree Verify Order Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to verify Cashfree order");
    }
}
