'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, Heart } from 'lucide-react';

const OFFERING_LABELS: Record<string, { label: string; icon: string }> = {
    CANDLE_SMALL: { label: 'Small Candle', icon: '🕯️' },
    CANDLE_MEDIUM: { label: 'Candle', icon: '🕯️' },
    CANDLE_LARGE: { label: 'Large Candle', icon: '🕯️' },
    FLOWERS: { label: 'Flowers', icon: '🌹' },
    PRAYER_CARD: { label: 'Prayer Card', icon: '🙏' },
    FLORAL_BOUQUET: { label: 'Floral Bouquet', icon: '💐' },
    ROSARY_DECADE: { label: 'Rosary Decade', icon: '📿' },
    ROSARY_FULL: { label: 'Full Rosary', icon: '📿' },
    SPIRITUAL_BOUQUET_GARDEN: { label: 'Garden of Grace', icon: '💝' },
    SPIRITUAL_BOUQUET_HEAVENLY: { label: 'Heavenly Tribute', icon: '💝' },
    SPIRITUAL_BOUQUET_ETERNAL: { label: 'Eternal Peace', icon: '💝' },
    SPIRITUAL_BOUQUET_LEGACY: { label: 'Legacy Remembrance', icon: '💝' },
};

export default function OfferingSuccessPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const memorialSlug = params.id as string;

    const orderId = searchParams.get('order_id');
    const offeringType = searchParams.get('type') || '';
    const message = searchParams.get('message') || '';
    const isAnonymous = searchParams.get('anonymous') === 'true';
    const guestName = searchParams.get('guest_name') || '';
    const guestEmail = searchParams.get('guest_email') || '';

    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [memorial, setMemorial] = useState<any>(null);

    useEffect(() => {
        async function processOffering() {
            if (!orderId) {
                setStatus('failed');
                return;
            }

            try {
                // Create the offering record
                const res = await fetch(`/api/memorials/${memorialSlug}/offerings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: offeringType,
                        amount: 0, // Will be calculated
                        message: decodeURIComponent(message),
                        isAnonymous,
                        guestName: decodeURIComponent(guestName),
                        guestEmail: decodeURIComponent(guestEmail),
                        transactionId: orderId,
                        paymentSource: 'cashfree',
                    }),
                });

                if (res.ok) {
                    // Fetch memorial for display
                    const memRes = await fetch(`/api/memorials/${memorialSlug}`);
                    const memData = await memRes.json();
                    setMemorial(memData);
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Error processing offering:', error);
                setStatus('failed');
            }
        }

        processOffering();
    }, [orderId, memorialSlug, offeringType, message, isAnonymous, guestName, guestEmail]);

    const offering = OFFERING_LABELS[offeringType] || { label: 'Offering', icon: '🎁' };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900">Processing Your Tribute...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-lg mx-auto text-center">
                    {/* Success Icon */}
                    <div className="text-6xl mb-6">{offering.icon}</div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                        Thank You for Your Tribute
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Your <strong>{offering.label}</strong> has been added to the memorial
                        {memorial && (
                            <> for <strong>{memorial.firstName} {memorial.lastName}</strong></>
                        )}.
                    </p>

                    {message && (
                        <div className="bg-amber-50 rounded-2xl p-6 mb-8 text-left">
                            <p className="text-amber-800 italic">"{decodeURIComponent(message)}"</p>
                        </div>
                    )}

                    <Link
                        href={`/memorials/${memorialSlug}`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-lg"
                    >
                        <Heart className="w-5 h-5" />
                        Return to Memorial
                    </Link>
                </div>
            </div>
        </div>
    );
}
