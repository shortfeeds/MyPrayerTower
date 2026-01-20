'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Heart, Share2 } from 'lucide-react';

export default function MemorialPaymentSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const memorialId = searchParams.get('memorial_id');

    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [memorial, setMemorial] = useState<any>(null);

    useEffect(() => {
        async function verifyPayment() {
            if (!orderId || !memorialId) {
                setStatus('failed');
                return;
            }

            try {
                // Verify payment
                const verifyRes = await fetch(`/api/memorials/verify-payment?order_id=${orderId}&memorial_id=${memorialId}`);
                const verifyData = await verifyRes.json();

                if (verifyData.success) {
                    // Fetch memorial details
                    const memRes = await fetch(`/api/memorials/${memorialId}`);
                    const memData = await memRes.json();
                    setMemorial(memData);
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Payment verification failed:', error);
                setStatus('failed');
            }
        }

        verifyPayment();
    }, [orderId, memorialId]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900">Verifying Payment...</h2>
                    <p className="text-gray-500">Please wait while we confirm your payment.</p>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                    <p className="text-gray-500 mb-6">
                        We couldn't verify your payment. Please try again or contact support.
                    </p>
                    <Link
                        href="/memorials/create"
                        className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Success Animation */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 border-4 border-green-200 rounded-full animate-ping opacity-50" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                        Memorial Created Successfully!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Your memorial for <strong>{memorial?.firstName} {memorial?.lastName}</strong> is now live.
                        Share it with family and friends to gather tributes.
                    </p>

                    {/* Memorial Preview Card */}
                    {memorial && (
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                                    {memorial.photoUrl ? (
                                        <img src={memorial.photoUrl} alt={memorial.firstName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Heart className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">{memorial.firstName} {memorial.lastName}</h3>
                                    <p className="text-sm text-gray-500">{memorial.shortBio}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={`/memorials/${memorial?.slug}`}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-lg"
                        >
                            <Heart className="w-5 h-5" />
                            View Memorial
                        </Link>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `In Memory of ${memorial?.firstName} ${memorial?.lastName}`,
                                        text: `Remember ${memorial?.firstName} with prayers and tributes`,
                                        url: window.location.origin + `/memorials/${memorial?.slug}`,
                                    });
                                }
                            }}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-full"
                        >
                            <Share2 className="w-5 h-5" />
                            Share with Family
                        </button>
                    </div>

                    {/* Next Steps */}
                    <div className="mt-12 bg-amber-50 rounded-2xl p-6 text-left">
                        <h3 className="font-bold text-amber-800 mb-3">What's Next?</h3>
                        <ul className="space-y-2 text-amber-700 text-sm">
                            <li>• Share the memorial link with family and friends</li>
                            <li>• Invite others to add photos and memories</li>
                            <li>• Light a candle or request a Mass for your loved one</li>
                            <li>• Return on anniversaries to add new tributes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
