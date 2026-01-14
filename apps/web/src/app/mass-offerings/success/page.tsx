'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, Share2, Heart, ArrowRight } from 'lucide-react';

interface MassOfferingData {
    orderNumber: string;
    offeringType: string;
    amount: number;
    intentionFor: string;
    additionalNames: string[];
    isForLiving: boolean;
    categories: string[];
    status: string;
    certificateUrl?: string;
    createdAt: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');
    const [offering, setOffering] = useState<MassOfferingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderNumber) {
            fetch(`/api/mass-offerings/order/${orderNumber}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setOffering(data);
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [orderNumber]);

    const getOfferingTypeName = (type: string) => {
        const names: Record<string, string> = {
            REGULAR: 'Single Mass',
            PERPETUAL: 'Perpetual Enrollment',
            NOVENA: 'Novena of Masses',
            GREGORIAN: 'Gregorian Masses',
            EXPEDITED: 'Expedited Mass',
        };
        return names[type] || 'Mass Offering';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin text-4xl">✨</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
                    <p className="text-gray-600 mt-2">Your Mass intention has been received</p>
                </div>

                {/* Order Details */}
                {offering && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order Number</p>
                                <p className="font-mono font-bold text-lg">{offering.orderNumber}</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                {offering.status === 'PAID' ? '✓ Received' : offering.status}
                            </span>
                        </div>

                        <hr className="my-4" />

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Offering Type</span>
                                <span className="font-medium">{getOfferingTypeName(offering.offeringType)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Intention For</span>
                                <span className="font-medium">
                                    {offering.intentionFor}
                                    {offering.isForLiving ? ' (Living)' : ' (Deceased)'}
                                </span>
                            </div>
                            {offering.additionalNames.length > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Also For</span>
                                    <span className="font-medium">{offering.additionalNames.join(', ')}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount</span>
                                <span className="font-bold text-lg">${Math.round(offering.amount / 100)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* What's Next */}
                <div className="bg-amber-50 rounded-2xl p-6 mb-6">
                    <h2 className="font-bold text-lg text-amber-900 mb-3">What Happens Next?</h2>
                    <ol className="space-y-3 text-amber-800">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                            <span>We'll assign your intention to one of our partner monasteries</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                            <span>You'll receive an email when the Mass is scheduled</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                            <span>A digital Mass card will be sent to your email</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                            <span>We'll notify you when the Mass has been celebrated</span>
                        </li>
                    </ol>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {offering?.certificateUrl && (
                        <a
                            href={offering.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Download Card
                        </a>
                    )}
                    <button
                        onClick={() => {
                            navigator.share?.({
                                title: 'Mass Intention Request',
                                text: `I just requested a Mass intention through MyPrayerTower!`,
                                url: window.location.href,
                            });
                        }}
                        className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                        Share
                    </button>
                </div>

                {/* More Actions */}
                <div className="space-y-3">
                    <Link
                        href="/mass-offerings"
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⛪</span>
                            <span className="font-medium text-gray-900">Request Another Mass</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link
                        href="/donate"
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-rose-300 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">❤️</span>
                            <span className="font-medium text-gray-900">Make a Donation</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function MassOfferingsSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">✨</div></div>}>
            <SuccessContent />
        </Suspense>
    );
}
