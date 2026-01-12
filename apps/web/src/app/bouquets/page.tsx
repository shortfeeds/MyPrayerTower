'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart as BouquetHeart, Church, Star, Flower, ChevronLeft, Gift, Mail, Calendar, Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { PayPalSuccessDetails } from '@/components/PayPalCheckout';

// Dynamic import for PayPal to prevent hydration issues
const PayPalCheckout = dynamic(() => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout), { ssr: false });

const occasions = [
    'Birthday', 'Anniversary', 'Get Well Soon', 'In Sympathy', 'Congratulations',
    'Thinking of You', 'Thank You', 'Wedding', 'New Baby', 'Other'
];

export default function BouquetsPage() {
    const bouquetItems = [
        { id: 'prayer', name: 'Prayers', price: 0, icon: BouquetHeart, description: 'Offer daily prayers', subLabel: 'Your prayer intentions' },
        { id: 'mass', name: 'Holy Mass', price: 1000, icon: Church, description: 'Have a Mass offered for your intention' },
        { id: 'rosary', name: 'Rosary', price: 500, icon: Star, description: 'Pray a Rosary for the recipient' },
        { id: 'candle', name: 'Virtual Candle', price: 500, icon: Flower, description: 'Light a 5-day candle' },
    ];
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState<Record<string, number>>({
        mass: 0,
        rosary: 0,
        prayer: 1, // Default prayers to 1 as it's free and always included if building
        candle: 0,
    });
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [senderName, setSenderName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [occasion, setOccasion] = useState('');
    const [message, setMessage] = useState('');
    const [sendDate, setSendDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPayPal, setShowPayPal] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const totalItems = Object.values(selection).reduce((a, b) => a + b, 0);
    const totalPrice = bouquetItems.reduce((total, item) => {
        return total + (selection[item.id] * item.price);
    }, 0);

    const incrementItem = (id: string) => {
        setSelection(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const decrementItem = (id: string) => {
        setSelection(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
    };

    const handleSendBouquet = async () => {
        if (totalPrice > 0) {
            setShowPayPal(true);
            return;
        }

        await processCheckout();
    };

    const processCheckout = async (paypalDetails?: PayPalSuccessDetails) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/bouquets/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: selection,
                    recipientName,
                    recipientEmail,
                    senderName,
                    senderEmail,
                    message,
                    occasion,
                    sendDate,
                    isAnonymous: false,
                    paypalOrderId: paypalDetails?.orderId,
                    paypalPayerEmail: paypalDetails?.payerEmail,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(totalPrice > 0 ? 'Payment successful and bouquet sent!' : 'Bouquet sent successfully!');
                setStep(1);
                setSelection({ mass: 0, rosary: 0, prayer: 1, candle: 0 });
                setShowPayPal(false);
            } else {
                alert(data.message || 'Failed to send bouquet');
            }
        } catch (error) {
            console.error('Bouquet error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-cream-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="container mx-auto px-4 py-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 mb-6">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-medium">A Spiritual Gift</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Send a <span className="text-rose-600">Spiritual Bouquet</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A beautiful collection of prayers, Masses, and spiritual offerings for your loved ones.
                </p>
            </section>

            {/* Step Indicator */}
            <div className="container mx-auto px-4 mb-8">
                <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${step >= s ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {s}
                            </div>
                            <span className={`text-sm ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                                {s === 1 ? 'Build Bouquet' : s === 2 ? 'Recipient' : 'Review'}
                            </span>
                            {s < 3 && <div className="w-8 h-0.5 bg-gray-200" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <section className="container mx-auto px-4 pb-16">
                <div className="max-w-2xl mx-auto">
                    {step === 1 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
                                Build Your Bouquet
                            </h2>

                            <div className="space-y-4">
                                {bouquetItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-rose-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.description}</p>
                                                {(item as any).subLabel && (
                                                    <p className="text-sm font-medium text-green-600">{(item as any).subLabel}</p>
                                                )}
                                                {item.price > 0 && (
                                                    <p className="text-sm font-medium text-rose-600">${(item.price / 100).toFixed(2)}</p>
                                                )}
                                            </div>
                                            {item.id === 'prayer' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">Included</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => decrementItem(item.id)}
                                                        className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-semibold">{selection[item.id]}</span>
                                                    <button
                                                        onClick={() => incrementItem(item.id)}
                                                        className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-200 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            <div className="mt-6 p-4 bg-rose-50 rounded-xl">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Total Items</span>
                                    <span className="font-semibold text-gray-900">{totalItems}</span>
                                </div>
                                {totalPrice > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Price</span>
                                        <span className="font-bold text-rose-600">${(totalPrice / 100).toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={totalItems === 0}
                                className="w-full mt-6 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* PayPal Modal */}
                    {showPayPal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
                                    <button onClick={() => setShowPayPal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                                </div>
                                <PayPalCheckout
                                    amount={totalPrice}
                                    description={`Spiritual Bouquet for ${recipientName}`}
                                    onSuccess={(details) => processCheckout(details)}
                                    onError={(err) => alert('Payment failed. Please try again.')}
                                    onCancel={() => setShowPayPal(false)}
                                    referenceId={`BOUQUET_${Date.now()}`}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
                                Recipient Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient's Name</label>
                                    <input
                                        type="text"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        placeholder="e.g., John Smith"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient's Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={recipientEmail}
                                            onChange={(e) => setRecipientEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                                    <select
                                        value={occasion}
                                        onChange={(e) => setOccasion(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="">Select an occasion</option>
                                        {occasions.map((o) => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Request</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Share your specific prayer intention..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Intention</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={sendDate}
                                            onChange={(e) => setSendDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">When should we start offering these prayers? Returns blank for immediate start.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!recipientName || !recipientEmail}
                                    className="flex-1 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
                                >
                                    Review
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
                                Review & Send
                            </h2>

                            {/* Bouquet Card Preview */}
                            <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-xl p-6 mb-6 border border-rose-200">
                                <div className="text-center mb-4">
                                    <Flower className="w-12 h-12 text-rose-500 mx-auto mb-2" />
                                    <h3 className="font-display text-2xl font-bold text-gray-900">Spiritual Bouquet</h3>
                                    <p className="text-gray-600">for {recipientName}</p>
                                </div>

                                <div className="bg-white/50 rounded-lg p-4 mb-4">
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        {bouquetItems.filter(item => selection[item.id] > 0).map((item) => (
                                            <div key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <span>{item.name}</span>
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 rounded">x{selection[item.id]}</span>
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {item.price > 0
                                                        ? `$${((item.price * selection[item.id]) / 100).toFixed(2)}`
                                                        : 'Free'
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                        {totalPrice > 0 && (
                                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-rose-100 font-bold">
                                                <span className="text-gray-900">Total</span>
                                                <span className="text-rose-600">${(totalPrice / 100).toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {message && (
                                    <p className="text-center italic text-gray-600 text-sm">"{message}"</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleSendBouquet}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin">⏳</span>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Bouquet {totalPrice > 0 && `- $${(totalPrice / 100).toFixed(2)}`}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
