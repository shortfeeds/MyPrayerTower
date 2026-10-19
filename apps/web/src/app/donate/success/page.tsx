'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Heart, ArrowRight, Share2, Sparkles, Church, Flame } from 'lucide-react';

interface DonationData {
    orderNumber: string;
    amount: number;
    tier: string;
    status: string;
    createdAt: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order') || searchParams.get('orderNumber') || searchParams.get('session_id');
    const [donation, setDonation] = useState<DonationData | null>(null);
    const [loading, setLoading] = useState(!!orderNumber);

    useEffect(() => {
        if (orderNumber) {
            fetch(`/api/donations/order/${encodeURIComponent(orderNumber)}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setDonation(data);
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch donation receipt:', err);
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
            PRAYER_PARTNER: '🙏 Prayer Partner (Monthly)',
            FAMILY_PLAN: '👨‍👩‍👧‍👦 Family Plan (Monthly)',
            PATRON_CIRCLE: '💎 Patron Circle (Monthly)',
            CUSTOM: '❤️ Custom Gift',
        };
        return names[tier] || 'Offering';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <div className="animate-spin text-5xl">💝</div>
                    <p className="text-slate-600 font-medium">Retrieving confirmation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-slate-50 to-white py-16 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-200">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Thank You For Your Generosity</h1>
                    <p className="text-slate-600 mt-2 max-w-md mx-auto">
                        Your offering has been received with gratitude and prayer. May the Lord bless you abundantly.
                    </p>
                </div>

                {/* Donation Details */}
                {donation && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Confirmation Reference</p>
                                <p className="font-mono font-bold text-lg text-slate-800">{donation.orderNumber}</p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                                ✓ Completed
                            </span>
                        </div>

                        <hr className="my-4 border-slate-100" />

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Offering Type</span>
                                <span className="font-medium text-slate-900">{getTierName(donation.tier)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Amount</span>
                                <span className="font-serif font-bold text-2xl text-rose-600">
                                    ${Math.round(donation.amount / 100)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scripture / Pastoral Note */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-6 text-center">
                    <div className="text-4xl mb-3">🕊️</div>
                    <blockquote className="italic text-slate-700 font-serif text-lg mb-2">
                        "Give, and it will be given to you. Good measure, pressed down, shaken together, running over, will be put into your lap."
                    </blockquote>
                    <cite className="text-sm text-slate-500 font-medium">— Luke 6:38</cite>
                    <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                        Your support keeps our 24/7 global prayer tower open to all souls in need, sustains holy Mass intentions, and supports priests offering prayers worldwide.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.share) {
                                navigator.share({
                                    title: 'I supported MyPrayerTower',
                                    text: 'Join me in supporting this worldwide Catholic prayer sanctuary.',
                                    url: 'https://myprayertower.com/donate',
                                }).catch(() => {});
                            } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                navigator.clipboard.writeText('https://myprayertower.com/donate');
                                alert('Link copied to clipboard!');
                            }
                        }}
                        className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        Share Mission
                    </button>
                    <Link
                        href="/donate"
                        className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Heart className="w-4 h-4 text-rose-500" />
                        Make Another Gift
                    </Link>
                </div>

                {/* Next Steps */}
                <div className="space-y-3">
                    <Link
                        href="/mass-offerings"
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors shadow-sm group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Church className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900 block">Request a Mass Intention</span>
                                <span className="text-xs text-slate-500">Have a Holy Mass celebrated for your intention</span>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/candles"
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors shadow-sm group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                <Flame className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900 block">Light a Virtual Candle</span>
                                <span className="text-xs text-slate-500">Keep your intention burning bright in prayer</span>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 py-3 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                    >
                        Return to Sanctuary Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function DonateSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin text-4xl">💝</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
