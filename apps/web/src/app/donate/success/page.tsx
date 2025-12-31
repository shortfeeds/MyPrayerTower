'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Heart, ArrowRight, Share2 } from 'lucide-react';

interface DonationData {
    orderNumber: string;
    amount: number;
    tier: string;
    status: string;
    createdAt: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');
    const [donation, setDonation] = useState<DonationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderNumber) {
            fetch(`/api/donations/order/${orderNumber}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setDonation(data);
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [orderNumber]);

    const getTierName = (tier: string) => {
        const names: Record<string, string> = {
            CANDLE: '🕯️ Light a Candle',
            ROSARY: '📿 Rosary Partner',
            SUPPORTER: '⛪ Parish Supporter',
            GUARDIAN: '👼 Guardian Angel',
            BENEFACTOR: '🌟 Benefactor',
            PATRON: '💎 Patron',
            CORNERSTONE: '🏆 Cornerstone',
            CUSTOM: '❤️ Custom Amount',
        };
        return names[tier] || 'Donation';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin text-4xl">💝</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
                    <p className="text-gray-600 mt-2">Your generous donation has been received</p>
                </div>

                {/* Donation Details */}
                {donation && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Confirmation</p>
                                <p className="font-mono font-bold text-lg">{donation.orderNumber}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                ✓ Completed
                            </span>
                        </div>

                        <hr className="my-4" />

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gift Type</span>
                                <span className="font-medium">{getTierName(donation.tier)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount</span>
                                <span className="font-bold text-xl text-rose-600">${(donation.amount / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Impact Message */}
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 mb-6 text-center">
                    <div className="text-4xl mb-3">🙏</div>
                    <h2 className="font-bold text-lg text-gray-900 mb-2">Your Gift Makes a Difference</h2>
                    <p className="text-gray-600">
                        Your generosity helps us continue serving millions of Catholics worldwide through prayer,
                        spiritual resources, and community building. May God bless you abundantly!
                    </p>
                </div>

                {/* Receipt Notice */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                        📧 A receipt has been sent to your email. Please save it for your tax records.
                    </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => {
                            navigator.share?.({
                                title: 'I just donated to MyPrayerTower!',
                                text: 'Join me in supporting this amazing Catholic community!',
                                url: 'https://myprayertower.com/donate',
                            });
                        }}
                        className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                        Share
                    </button>
                    <Link
                        href="/donate"
                        className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Heart className="w-5 h-5" />
                        Give Again
                    </Link>
                </div>

                {/* More Actions */}
                <div className="space-y-3">
                    <Link
                        href="/mass-offerings"
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⛪</span>
                            <span className="font-medium text-gray-900">Request a Mass Intention</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link
                        href="/prayers"
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📿</span>
                            <span className="font-medium text-gray-900">Explore Prayers</span>
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

export default function DonateSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">💝</div></div>}>
            <SuccessContent />
        </Suspense>
    );
}
