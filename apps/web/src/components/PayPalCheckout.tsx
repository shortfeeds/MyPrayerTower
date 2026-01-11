'use client';

import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js';
import { useState } from 'react';

// Add helper type match
export interface PayPalFrontendItem {
    name: string;
    unitAmount: string;
    quantity: string;
    description?: string;
}

interface PayPalCheckoutProps {
    amount: number; // Amount in cents
    description: string;
    onSuccess: (details: PayPalSuccessDetails) => void;
    onError?: (error: any) => void;
    onCancel?: () => void;
    disabled?: boolean;
    referenceId?: string;
    items?: PayPalFrontendItem[];
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

export default function PayPalCheckout({
    amount,
    description,
    onSuccess,
    onError,
    onCancel,
    disabled = false,
    referenceId,
    items,
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
        <PayPalScriptProvider
            options={{
                clientId: clientId,
                currency: 'USD',
                intent: 'capture',
            }}
        >
            <div className={`w-full relative z-0 ${disabled || isProcessing ? 'opacity-70 pointer-events-none' : ''}`}>
                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-10 rounded-lg backdrop-blur-[2px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
                        {errorMessage}
                    </div>
                )}

                <PayPalButtons
                    key={referenceId || 'paypal-buttons'}
                    style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'pay',
                        height: 48,
                    }}
                    fundingSource={FUNDING.PAYPAL}
                    disabled={disabled || isProcessing}
                    createOrder={async (data, actions) => {
                        setIsProcessing(true);
                        setErrorMessage('');
                        try {
                            const response = await fetch('/api/paypal/create-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    amount,
                                    description,
                                    referenceId,
                                    items,
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
                            const response = await fetch('/api/paypal/capture-order', {
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
                        // Don't show generic error to user immediately, let them retry
                        if (onError) onError(err);
                    }}
                />

                <div className="mt-3">
                    <PayPalButtons
                        key={`${referenceId}-card`}
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
                                const response = await fetch('/api/paypal/create-order', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        amount,
                                        description,
                                        referenceId,
                                        items,
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
                                const response = await fetch('/api/paypal/capture-order', {
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
                </div>

                <p className="text-[10px] text-gray-500 text-center mt-3 opacity-70">
                    <span className="flex items-center justify-center gap-1">
                        🔒 SSL Secure Payment
                    </span>
                </p>
            </div>
        </PayPalScriptProvider>
    );
}
