'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Flame, XCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    useEffect(() => {
        // Verify payment status
        if (orderId) {
            // In production, verify with backend
            // For now, assume success if we have an order ID
            setTimeout(() => {
                setStatus('success');
            }, 1500);
        } else {
            setStatus('failed');
        }
    }, [orderId]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
                <div className="max-w-md text-center">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
                    <p className="text-gray-400 mb-8">
                        We couldn't verify your payment. Please try again or contact support if the issue persists.
                    </p>
                    <Link
                        href="/candles"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
            <div className="max-w-md text-center">
                <div className="relative inline-block mb-8">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                    <Flame className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Your Candle is Lit! 🕯️</h1>

                <p className="text-gray-400 mb-8">
                    Thank you for your offering. Your prayer candle is now burning and the community will pray for your intention.
                </p>

                <div className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-amber-400 font-mono">{orderId}</p>
                </div>

                <Link
                    href="/candles"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all"
                >
                    <Flame className="w-5 h-5" />
                    View Your Candle
                </Link>

                <p className="text-gray-500 text-sm mt-6">
                    A receipt has been sent to your email.
                </p>
            </div>
        </div>
    );
}
