'use client';

import { PayPalScriptProvider as PayPalProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js';
import { useState } from 'react';

// Add helper type match
export interface PayPalFrontendItem {
    name: string;
    unitAmount: string;
    quantity: string;
    description?: string;
}

interface PayPalCheckoutProps {
    amount?: number; // Amount in cents (for one-time)
    description: string;
    onSuccess: (details: PayPalSuccessDetails) => void;
    onError?: (error: any) => void;
    onCancel?: () => void;
    disabled?: boolean;
    referenceId?: string;
    items?: PayPalFrontendItem[];
    subscriptionPlanId?: string; // If provided, handles subscription
    createOrderUrl?: string;
    captureOrderUrl?: string;
    metadata?: any;
    buttonLabel?: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment' | 'subscribe' | 'donate';
}

export interface PayPalSuccessDetails {
    orderId: string;
    captureId: string;
    amount: string;
    currency: string;
    payerEmail: string;
    payerName: string | null;
    status: string;
}

// LIVE Client ID - Hardcoded for stability as per user confirmation
const LIVE_CLIENT_ID = 'AZ3c6O0DJtvSCjr7LTBRSgugVnLfCJSZmIeB27xEFsgslNkjTu7wR92V1E-K2luCnN4ZIAreeCvx1-Fc';

export function PayPalCheckout({
    amount,
    description,
    onSuccess,
    onError,
    onCancel,
    disabled = false,
    referenceId,
    items,
    subscriptionPlanId,
    createOrderUrl = '/api/paypal/create-order',
    captureOrderUrl = '/api/paypal/capture-order',
    metadata,
    buttonLabel = 'paypal', // Default to just "PayPal" logo to be less transactional than "Pay with..."
}: PayPalCheckoutProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Prioritize the hardcoded live ID, fallback to env var
    const clientId = LIVE_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-center text-sm">
                Payment configuration missing. Please contact support.
            </div>
        );
    }

    return (
        <PayPalProvider
            options={{
                clientId: clientId,
                currency: 'USD',
                intent: subscriptionPlanId ? 'subscription' : 'capture',
                vault: subscriptionPlanId ? true : false,
            }}
        >
            <div className={`w-full relative z-0 ${disabled || isProcessing ? 'opacity-70 pointer-events-none' : ''}`}>
                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-10 rounded-lg backdrop-blur-[2px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                    </div>
                )}

                {/* Guest Checkout Header */}
                <div className="mb-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">No account needed</p>
                    <p className="text-sm text-gray-700 dark:text-white/80 font-medium">Pay securely with card or PayPal</p>
                </div>

                {/* Email Field (Required for Guest) */}
                {!subscriptionPlanId && (
                    <div className="mb-4">
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5 ml-1">Email for receipt</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-white/20">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
                        {errorMessage}
                    </div>
                )}

                {/* CARD BUTTON FIRST (Guest Checkout) */}
                {!subscriptionPlanId && (
                    <PayPalButtons
                        key={`${referenceId}-card-primary`}
                        style={{
                            layout: 'vertical',
                            color: 'black',
                            shape: 'rect',
                            label: 'pay',
                            height: 48,
                        }}
                        fundingSource={FUNDING.CARD}
                        disabled={disabled || isProcessing}
                        createOrder={async (data, actions) => {
                            setIsProcessing(true);
                            setErrorMessage('');
                            try {
                                const response = await fetch(createOrderUrl, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        amount,
                                        description,
                                        referenceId,
                                        items,
                                        metadata,
                                    }),
                                });

                                const responseData = await response.json();

                                if (!responseData.success || !responseData.orderId) {
                                    throw new Error(responseData.message || 'Failed to initialize payment');
                                }

                                return responseData.orderId;
                            } catch (error: any) {
                                setIsProcessing(false);
                                console.error('PayPal Create Order Error:', error);
                                setErrorMessage(error.message || 'Failed to start payment');
                                if (onError) onError(error);
                                throw error;
                            }
                        }}
                        onApprove={async (data, actions) => {
                            try {
                                const response = await fetch(captureOrderUrl, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ orderId: data.orderID }),
                                });

                                const captureData = await response.json();

                                if (captureData.success) {
                                    onSuccess({
                                        orderId: captureData.orderId,
                                        captureId: captureData.captureId,
                                        amount: captureData.amount,
                                        currency: captureData.currency,
                                        payerEmail: captureData.payerEmail,
                                        payerName: captureData.payerName,
                                        status: captureData.status,
                                    });
                                } else {
                                    throw new Error(captureData.message || 'Payment capture failed');
                                }
                            } catch (error: any) {
                                console.error('PayPal Capture Error:', error);
                                setErrorMessage('Payment confirmed but processing failed. Please contact support.');
                                if (onError) onError(error);
                            } finally {
                                setIsProcessing(false);
                            }
                        }}
                        onCancel={() => {
                            setIsProcessing(false);
                            if (onCancel) onCancel();
                        }}
                        onError={(err) => {
                            setIsProcessing(false);
                            console.error('PayPal Button Error:', err);
                            if (onError) onError(err);
                        }}
                    />
                )}

                {/* Divider */}
                {!subscriptionPlanId && (
                    <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="px-4 text-xs text-gray-500">or</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>
                )}

                {/* PAYPAL BUTTON SECOND */}
                <PayPalButtons
                    key={subscriptionPlanId ? `sub-${subscriptionPlanId}` : (referenceId || 'paypal-buttons')}
                    style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: subscriptionPlanId ? 'subscribe' : buttonLabel,
                        height: 48,
                    }}
                    fundingSource={FUNDING.PAYPAL}
                    disabled={disabled || isProcessing}
                    createSubscription={subscriptionPlanId ? (data, actions) => {
                        return actions.subscription.create({
                            plan_id: subscriptionPlanId,
                        });
                    } : undefined}
                    createOrder={!subscriptionPlanId ? async (data, actions) => {
                        setIsProcessing(true);
                        setErrorMessage('');
                        try {
                            const response = await fetch(createOrderUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    amount,
                                    description,
                                    referenceId,
                                    items,
                                    metadata, // Pass metadata if creating custom order
                                }),
                            });

                            const responseData = await response.json();

                            if (!responseData.success || !responseData.orderId) {
                                throw new Error(responseData.message || 'Failed to initialize payment');
                            }

                            return responseData.orderId;
                        } catch (error: any) {
                            setIsProcessing(false);
                            console.error('PayPal Create Order Error:', error);
                            setErrorMessage(error.message || 'Failed to start payment');
                            if (onError) onError(error);
                            throw error;
                        }
                    } : undefined}
                    onApprove={async (data, actions) => {
                        if (subscriptionPlanId) {
                            setIsProcessing(true);
                            try {
                                onSuccess({
                                    orderId: data.subscriptionID || '',
                                    captureId: data.subscriptionID || '',
                                    amount: String(amount || 0),
                                    currency: 'USD',
                                    payerEmail: '', // Payer details are less accessible for subs directly here
                                    payerName: 'Subscriber',
                                    status: 'ACTIVE',
                                });
                            } catch (error: any) {
                                console.error('Subscription Success Callback Error:', error);
                                if (onError) onError(error);
                            } finally {
                                setIsProcessing(false);
                            }
                        } else {
                            try {
                                const response = await fetch(captureOrderUrl, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ orderId: data.orderID }),
                                });

                                const captureData = await response.json();

                                if (captureData.success) {
                                    onSuccess({
                                        orderId: captureData.orderId,
                                        captureId: captureData.captureId,
                                        amount: captureData.amount,
                                        currency: captureData.currency,
                                        payerEmail: captureData.payerEmail,
                                        payerName: captureData.payerName,
                                        status: captureData.status,
                                    });
                                } else {
                                    throw new Error(captureData.message || 'Payment capture failed');
                                }
                            } catch (error: any) {
                                console.error('PayPal Capture Error:', error);
                                setErrorMessage('Payment confirmed but processing failed. Please contact support.');
                                if (onError) onError(error);
                            } finally {
                                setIsProcessing(false);
                            }
                        }
                    }}
                    onCancel={() => {
                        setIsProcessing(false);
                        if (onCancel) onCancel();
                    }}
                    onError={(err) => {
                        setIsProcessing(false);
                        console.error('PayPal Button Error:', err);
                        if (onError) onError(err);
                    }}
                />

                <p className="text-[10px] text-gray-500 text-center mt-4 opacity-70">
                    <span className="flex items-center justify-center gap-1">
                        🔒 SSL Secure Payment
                    </span>
                    <span className="block mt-1 text-[9px] leading-tight">
                        All offerings are voluntary and support prayer, remembrance, and platform operations.
                    </span>
                </p>
            </div>
        </PayPalProvider>
    );
}
