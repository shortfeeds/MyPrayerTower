'use client';

import { useState } from 'react';
import { ChevronLeft, Heart, CreditCard, Check, Sparkles, Users, Crown } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { PayPalSuccessDetails } from '@/components/PayPalCheckout';

// Dynamic import to avoid SSR issues
const PayPalCheckout = dynamic(() => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout), { ssr: false });

// Donation tiers
const DONATION_TIERS = [
    { id: 'CANDLE', amount: 1000, label: '🕯️ Light a Candle', description: 'A small but meaningful gift' },
    { id: 'ROSARY', amount: 2000, label: '💿 Rosary Partner', description: 'Support our prayer ministry' },
    { id: 'SUPPORTER', amount: 5000, label: '⛪ Parish Supporter', description: 'Help sustain our mission' },
    { id: 'GUARDIAN', amount: 10000, label: '👼 Guardian Angel', description: 'A generous contribution' },
    { id: 'BENEFACTOR', amount: 25000, label: '🌟 Benefactor', description: 'Major supporter' },
    { id: 'PATRON', amount: 50000, label: '💎 Patron', description: 'Distinguished patron' },
];

// Subscription plans
const SUBSCRIPTION_PLANS = [
    {
        id: 'PRAYER_PARTNER',
        paypalPlanId: 'P-PRAYER_PARTNER_ID', // Replace with real PayPal Plan ID
        name: 'Prayer Partner',
        icon: '🙏',
        price: 999,
        perks: [
            '1 Mass offered monthly for your intention',
            'Name on our Daily Prayer List',
            '10% off all Mass offerings',
            'Monthly spiritual newsletter',
        ],
        popular: true,
    },
    {
        id: 'FAMILY_PLAN',
        paypalPlanId: 'P-FAMILY_PLAN_ID', // Replace with real PayPal Plan ID
        name: 'Family Plan',
        icon: '👨‍👩‍👧‍👦',
        price: 1999,
        perks: [
            '3 Masses offered monthly',
            'Entire family on Daily Prayer List',
            '15% off all Mass offerings',
            'Priority intention scheduling',
        ],
        popular: false,
    },
    {
        id: 'PATRON_CIRCLE',
        paypalPlanId: 'P-PATRON_CIRCLE_ID', // Replace with real PayPal Plan ID
        name: 'Patron Circle',
        icon: '💎',
        price: 4999,
        perks: [
            'Unlimited Mass requests',
            'Perpetual Enrollment included',
            '25% off all add-ons',
            'VIP support & recognition',
        ],
        popular: false,
    },
];

export default function DonatePage() {
    const [tab, setTab] = useState<'oneTime' | 'monthly'>('oneTime');
    const [selectedTier, setSelectedTier] = useState<string>('SUPPORTER');
    const [customAmount, setCustomAmount] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<string>('PRAYER_PARTNER');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentType, setPaymentType] = useState<'oneTime' | 'subscription'>('oneTime');
    const [successMessage, setSuccessMessage] = useState('');

    const selectedTierData = DONATION_TIERS.find(t => t.id === selectedTier);
    const selectedPlanData = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);

    const getAmount = () => {
        if (customAmount) return parseInt(customAmount) * 100; // Convert to cents
        return selectedTierData?.amount || 0;
    };

    const getTotal = () => {
        return getAmount();
    };

    const handleOneTimeDonation = () => {
        if (!email || !name) {
            alert('Please fill in your name and email');
            return;
        }
        setPaymentType('oneTime');
        setShowPaymentModal(true);
    };

    const handleSubscription = () => {
        if (!email || !name) {
            alert('Please fill in your name and email');
            return;
        }
        setPaymentType('subscription');
        setShowPaymentModal(true);
    };

    const handlePayPalSuccess = async (details: PayPalSuccessDetails) => {
        console.log('PayPal payment successful:', details);
        setShowPaymentModal(false);
        setSuccessMessage('🎉 Thank you for your generous donation! God bless you.');

        // Send notification
        fetch('/api/donations/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: paymentType === 'oneTime' ? getTotal() : (selectedPlanData?.price || 0),
                tier: paymentType === 'oneTime' ? (customAmount ? 'CUSTOM' : selectedTier) : selectedPlan,
                email,
                name,
                message,
                isAnonymous,
                isSubscription: paymentType === 'subscription',
                paypalOrderId: details.orderId,
                paypalPayerEmail: details.payerEmail,
            }),
        }).catch(err => console.log('Notification sent'));

        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handlePayPalError = (error: any) => {
        console.error('PayPal error:', error);
        alert('Payment failed. Please try again.');
    };



    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-2xl shadow-green-500/30 animate-bounce">
                    {successMessage}
                </div>
            )}

            {/* PayPal Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Heart className="w-6 h-6 text-rose-500" />
                                    Complete Donation
                                </h2>
                                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    ✕
                                </button>
                            </div>

                            <div className="bg-rose-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-rose-900 font-medium">
                                        {paymentType === 'oneTime' ? 'One-Time Donation' : selectedPlanData?.name}
                                    </span>
                                    <span className="text-2xl text-rose-600 font-bold">
                                        ${((paymentType === 'oneTime' ? getTotal() : (selectedPlanData?.price || 0)) / 100).toFixed(2)}
                                        {paymentType === 'subscription' && <span className="text-sm">/mo</span>}
                                    </span>
                                </div>
                            </div>

                            <PayPalCheckout
                                amount={paymentType === 'oneTime' ? getTotal() : undefined}
                                subscriptionPlanId={paymentType === 'subscription' ? selectedPlanData?.paypalPlanId : undefined}
                                description={paymentType === 'oneTime'
                                    ? `Donation to MyPrayerTower - ${customAmount ? 'Custom' : selectedTierData?.label}`
                                    : `${selectedPlanData?.name} Monthly Subscription`
                                }
                                onSuccess={handlePayPalSuccess}
                                onError={handlePayPalError}
                                onCancel={() => setShowPaymentModal(false)}
                                referenceId={`DONATE_${paymentType}_${Date.now()}`}
                            />

                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 text-sm"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 py-12 text-white">
                <div className="container mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Heart className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Support Our Mission</h1>
                            <p className="text-white/80">Your generosity helps us serve millions worldwide</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Tab Selector */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                    <button
                        onClick={() => setTab('oneTime')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${tab === 'oneTime'
                            ? 'bg-white shadow text-rose-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        ❤️ One-Time Gift
                    </button>
                    <button
                        onClick={() => setTab('monthly')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${tab === 'monthly'
                            ? 'bg-white shadow text-rose-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        ✨ Monthly Giving
                    </button>
                </div>

                {/* One-Time Donation */}
                {tab === 'oneTime' && (
                    <div className="animate-in fade-in">
                        {/* Amount Selection */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Gift</h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                {DONATION_TIERS.map(tier => (
                                    <button
                                        key={tier.id}
                                        onClick={() => { setSelectedTier(tier.id); setCustomAmount(''); }}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedTier === tier.id && !customAmount
                                            ? 'border-rose-500 bg-rose-50 shadow-lg'
                                            : 'border-gray-200 hover:border-rose-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{tier.label.split(' ')[0]}</div>
                                        <p className="font-bold text-gray-900">${(tier.amount / 100)}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(''); }}
                                    placeholder="Custom amount"
                                    min="1"
                                    className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl text-lg font-bold focus:outline-none ${customAmount
                                        ? 'border-rose-500 bg-rose-50'
                                        : 'border-gray-200 focus:border-rose-500'
                                        }`}
                                />

                            </div>
                        </div>

                        {/* Your Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Leave an encouraging message..."
                                        rows={2}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="w-5 h-5 text-rose-500 rounded"
                                    />
                                    <span className="text-gray-700">Make my donation anonymous</span>
                                </label>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-rose-50 rounded-2xl p-6 mb-6">
                            <div className="">
                                <div className="flex justify-between text-rose-900 font-bold text-xl">
                                    <span>Total</span>
                                    <div className="text-right">
                                        <span>${(getTotal() / 100).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleOneTimeDonation}
                            disabled={getAmount() < 100 || isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            {isSubmitting ? (
                                <span className="animate-spin">⏳</span>
                            ) : (
                                <>
                                    <Heart className="w-5 h-5" />
                                    Donate ${(getTotal() / 100).toFixed(2)}
                                </>
                            )}
                        </button>

                        <p className="text-center text-gray-500 text-sm mt-4">
                            🔒 Secure payment powered by PayPal
                        </p>
                    </div>
                )}

                {/* Monthly Subscriptions */}
                {tab === 'monthly' && (
                    <div className="animate-in fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Become a Prayer Partner</h2>
                            <p className="text-gray-600 mt-2">Join our community of regular supporters and receive exclusive spiritual benefits</p>
                        </div>

                        <div className="grid gap-4 mb-8">
                            {SUBSCRIPTION_PLANS.map(plan => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`relative p-6 rounded-2xl border-2 text-left transition-all ${selectedPlan === plan.id
                                        ? 'border-rose-500 bg-rose-50 shadow-lg'
                                        : 'border-gray-200 bg-white hover:border-rose-300'
                                        }`}
                                >
                                    {plan.popular && (
                                        <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            MOST POPULAR
                                        </span>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <span className="text-4xl">{plan.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
                                                {selectedPlan === plan.id && (
                                                    <Check className="w-5 h-5 text-rose-600" />
                                                )}
                                            </div>
                                            <p className="text-rose-600 font-bold text-lg mt-1">
                                                ${(plan.price / 100).toFixed(2)}/month
                                            </p>
                                            <ul className="mt-3 space-y-2">
                                                {plan.perks.map((perk, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-gray-600">
                                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        {perk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Your Info for Subscription */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubscription}
                            disabled={!selectedPlan || isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            {isSubmitting ? (
                                <span className="animate-spin">⏳</span>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Become a {selectedPlanData?.name} - ${((selectedPlanData?.price || 0) / 100).toFixed(2)}/mo
                                </>
                            )}
                        </button>

                        <p className="text-center text-gray-500 text-sm mt-4">
                            🔒 Secure subscription via PayPal. Cancel anytime.
                        </p>
                    </div>
                )}

                {/* Mass Offering CTA */}
                <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">⛪</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">Want to Request a Mass Intention?</h3>
                            <p className="text-gray-600">Have a Holy Mass offered for your loved ones.</p>
                        </div>
                        <Link
                            href="/mass-offerings"
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
                        >
                            Request Mass →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
