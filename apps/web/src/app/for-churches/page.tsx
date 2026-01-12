'use client';

import { useState } from 'react';
import { Check, Church, Star, Crown, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

type TierType = 'BASIC' | 'PRO' | 'CATHEDRAL';

const tiers: {
    id: TierType;
    name: string;
    price: number;
    description: string;
    icon: typeof Church;
    color: string;
    features: string[];
    cta: string;
    popular: boolean;
}[] = [
        {
            id: 'BASIC',
            name: 'Basic Parish',
            price: 99,
            description: 'Perfect for small parishes getting started online',
            icon: Church,
            color: 'bg-blue-500',
            features: [
                'Verified listing with badge',
                'Custom church profile page',
                'Mass & confession schedule',
                '3 announcements per month',
                'Unlimited followers',
                'Basic analytics',
                'Email support',
            ],
            cta: 'Get Started',
            popular: false,
        },
        {
            id: 'PRO',
            name: 'Pro Parish',
            price: 249,
            description: 'For active parishes wanting full engagement tools',
            icon: Star,
            color: 'bg-gold-500',
            features: [
                'Everything in Basic',
                'Unlimited announcements',
                'Push notifications to followers',
                'Event calendar with RSVP',
                '5 ministry sub-pages',
                'Staff directory',
                'Advanced analytics',
                'Priority support',
            ],
            cta: 'Upgrade to Pro',
            popular: true,
        },
        {
            id: 'CATHEDRAL',
            name: 'Cathedral',
            price: 499,
            description: 'Enterprise solution for large parishes & dioceses',
            icon: Crown,
            color: 'bg-purple-600',
            features: [
                'Everything in Pro',
                'Unlimited ministry pages',
                'Up to 10 admin users',
                'Custom branding',
                'Widget for website embed',
                'API access',
                'Newsletter export',
                'Volunteer management',
                'Dedicated account manager',
                'Featured search placement',
            ],
            cta: 'Get Cathedral',
            popular: false,
        },
    ];

export default function ChurchPricingPage() {
    const [loading, setLoading] = useState<TierType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async (tier: TierType) => {
        setLoading(tier);
        setError(null);

        try {
            // Check if user is logged in and has a church claimed
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login?redirect=/for-churches';
                return;
            }

            // Get the church ID from user's profile (simplified - in production, fetch from API)
            const churchId = localStorage.getItem('churchId');
            if (!churchId) {
                // Redirect to claim flow if no church claimed
                window.location.href = '/churches?action=claim';
                return;
            }

            const response = await fetch(`${API_URL}/payments/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    churchId,
                    tier,
                    successUrl: `${window.location.origin}/dashboard?payment=success`,
                    cancelUrl: `${window.location.origin}/for-churches?payment=cancelled`,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const data = await response.json();

            // Redirect to Stripe Checkout
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError('Failed to start checkout. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-primary-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                        <Building2 className="w-4 h-4" />
                        For Churches & Parishes
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Your Church's <span className="text-gold-400">Digital Home</span>
                    </h1>

                    <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
                        Claim your listing on MyPrayerTower and transform it into a complete digital presence.
                        Connect with parishioners, share announcements, and grow your community.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-400" />
                            <span>One-time payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-400" />
                            <span>No monthly fees</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="container mx-auto px-4 -mt-8 relative z-30">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
                        {error}
                    </div>
                </div>
            )}

            {/* Pricing Cards */}
            <div className="container mx-auto px-4 -mt-16 relative z-20 pb-20">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col ${tier.popular ? 'ring-2 ring-gold-500 scale-105' : ''
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-0 bg-gold-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="p-8">
                                <div className={`w-14 h-14 ${tier.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                                    <tier.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                                <p className="text-gray-500 text-sm mb-6">{tier.description}</p>

                                <div className="mb-8">
                                    <span className="text-5xl font-bold text-gray-900">${tier.price}</span>
                                    <span className="text-gray-500 ml-2">one-time</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto p-8 pt-0">
                                <button
                                    onClick={() => handleCheckout(tier.id)}
                                    disabled={loading !== null}
                                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${tier.popular
                                        ? 'bg-gold-500 hover:bg-gold-600 text-white shadow-lg shadow-gold-500/30'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {loading === tier.id ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        tier.cta
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Diocese CTA */}
            <div className="bg-primary-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Managing Multiple Parishes?</h2>
                    <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
                        Our Diocese License ($2,499) lets you manage all parishes under one dashboard.
                        Centralized announcements, cross-parish events, and diocesan analytics.
                    </p>
                    <Link
                        href="/contact?type=diocese"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-bold rounded-xl hover:bg-gold-50 transition-colors"
                    >
                        <Building2 className="w-5 h-5" />
                        Request Diocese Demo
                    </Link>
                </div>
            </div>

            {/* FAQ */}
            <div className="container mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

                <div className="max-w-3xl mx-auto space-y-6">
                    {[
                        { q: 'Is this a subscription?', a: 'No! All our plans are one-time payments. You pay once and get access to all features in your tier.' },
                        { q: 'Can I upgrade later?', a: 'Yes! You can upgrade from Basic to Pro or Cathedral at any time. You only pay the difference.' },
                        { q: 'How do I claim my church?', a: 'Search for your church on MyPrayerTower, click "Claim This Listing", and verify your identity via email/phone. It takes about 5 minutes.' },
                        { q: 'What if my church isn\'t listed?', a: 'No problem! You can add your church for free and then upgrade to unlock management features.' },
                    ].map((faq, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                            <p className="text-gray-600">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

