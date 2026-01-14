'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Church, Heart, Sparkles, Check, Gift, X, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { PayPalSuccessDetails } from '@/components/PayPalCheckout';

// Dynamic import to avoid SSR issues
const PayPalCheckout = dynamic(() => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout), { ssr: false });

import { SACRED_COPY } from '@/lib/sacred-copy';

// Offering types with pricing
const OFFERING_TYPES = [
    {
        id: 'REGULAR',
        name: 'Single Mass',
        icon: '⛪',
        price: 1000,
        description: 'A single Holy Mass offered for your intention',
        popular: false,
    },
    {
        id: 'NOVENA',
        name: 'Novena of Masses',
        icon: '💿',
        price: 7500,
        description: '9 consecutive Masses offered for your intention',
        popular: true,
        badge: 'POPULAR',
    },
    {
        id: 'PERPETUAL',
        name: 'Perpetual Enrollment',
        icon: '🌟',
        price: 10000,
        description: 'Enrolled in the Perpetual Mass Association, sharing in daily Masses forever',
        popular: false,
        badge: 'BEST VALUE',
    },
    {
        id: 'GREGORIAN',
        name: 'Gregorian Masses',
        icon: '🙏',
        price: 20000,
        description: '30 consecutive Masses for the deceased (traditional devotion)',
        popular: false,
    },
];

// Intention categories
const LIVING_INTENTIONS = [
    { value: 'THANKSGIVING', label: 'Thanksgiving / Gratitude' },
    { value: 'GOOD_HEALTH', label: 'Good Health' },
    { value: 'HEALING', label: 'Healing' },
    { value: 'BIRTHDAY_BLESSING', label: 'Birthday Blessing' },
    { value: 'WEDDING_ANNIVERSARY', label: 'Wedding Anniversary' },
    { value: 'SAFE_TRAVEL', label: 'Safe Travel' },
    { value: 'EXAM_SUCCESS', label: 'Exam Success' },
    { value: 'CAREER_SUCCESS', label: 'Career Success' },
    { value: 'FAMILY_PEACE', label: 'Family Peace' },
    { value: 'PROTECTION', label: 'Protection' },
    { value: 'CONVERSION', label: 'Conversion' },
];

const DECEASED_INTENTIONS = [
    { value: 'REPOSE_OF_SOUL', label: 'Repose of the Soul' },
    { value: 'ALL_SOULS', label: 'All Souls / Poor Souls' },
    { value: 'DEATH_ANNIVERSARY', label: 'Death Anniversary' },
    { value: 'RECENTLY_DECEASED', label: 'Recently Deceased' },
    { value: 'FORGOTTEN_SOULS', label: 'Forgotten Souls' },
    { value: 'PURGATORY', label: 'Souls in Purgatory' },
];

// Add-ons
const ADDONS = [
    { id: 'candle', name: '🕯️ Virtual Candle', price: 499, description: '7-day candle on Prayer Wall' },
    { id: 'printedCard', name: '📮 Printed Mass Card', price: 1000, description: 'Beautiful card mailed to you' },
    { id: 'framedCertificate', name: '🖼️ Framed Certificate', price: 3500, description: 'Premium framed memorial' },
];

export default function MassOfferingsPage() {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string>('REGULAR');
    const [isForLiving, setIsForLiving] = useState(false);
    const [intentionFor, setIntentionFor] = useState('');
    const [additionalNames, setAdditionalNames] = useState<string[]>([]);
    const [selectedIntentions, setSelectedIntentions] = useState<string[]>([]);
    const [specialIntention, setSpecialIntention] = useState('');
    const [offeredBy, setOfferedBy] = useState('');
    const [tributeMessage, setTributeMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isGift, setIsGift] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [giftMessage, setGiftMessage] = useState('');
    const [addons, setAddons] = useState({ candle: false, printedCard: false, framedCertificate: false });
    const [shippingAddress, setShippingAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const selectedOffering = OFFERING_TYPES.find(o => o.id === selectedType);
    const intentionOptions = isForLiving ? LIVING_INTENTIONS : DECEASED_INTENTIONS;

    const calculateTotal = () => {
        let total = selectedOffering?.price || 0;
        if (addons.candle) total += 500;
        if (addons.printedCard) total += 1000;
        if (addons.framedCertificate) total += 3500;
        return total;
    };



    const toggleIntention = (value: string) => {
        setSelectedIntentions(prev =>
            prev.includes(value)
                ? prev.filter(i => i !== value)
                : [...prev, value]
        );
    };

    const addName = () => {
        if (additionalNames.length < 5) {
            setAdditionalNames([...additionalNames, '']);
        }
    };

    const updateName = (index: number, value: string) => {
        const updated = [...additionalNames];
        updated[index] = value;
        setAdditionalNames(updated);
    };

    const removeName = (index: number) => {
        setAdditionalNames(additionalNames.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!name.trim() || !email.trim()) {
            alert('Please fill in your name and email');
            return;
        }
        if (!intentionFor.trim()) {
            alert('Please specify who the intention is for');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePayPalSuccess = async (details: PayPalSuccessDetails) => {
        console.log('PayPal payment successful:', details);
        setShowPaymentModal(false);
        setSuccessMessage('🙏 Your Mass offering has been submitted! You will receive a confirmation email.');

        const totalAmount = calculateTotal();
        const intentionDetails = `For: ${intentionFor} (${isForLiving ? 'Living' : 'Deceased'}). ${selectedIntentions.length ? 'Intentions: ' + selectedIntentions.join(', ') : ''}. ${specialIntention ? 'Note: ' + specialIntention : ''}`;



        // Reset form
        setStep(1);
        setIntentionFor('');
        setSelectedIntentions([]);
        setSpecialIntention('');
        setTimeout(() => setSuccessMessage(''), 7000);
    };

    const handlePayPalError = (error: any) => {
        console.error('PayPal error:', error);
        alert('Payment failed. Please try again.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-2xl shadow-green-500/30 animate-bounce">
                    {successMessage}
                </div>
            )}

            {/* PayPal Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Church className="w-6 h-6 text-amber-500" />
                                    Complete Your Offering
                                </h2>
                                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    ✕
                                </button>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-amber-900 font-medium">{selectedOffering?.name}</span>
                                    <span className="text-xl text-amber-600 font-bold">
                                        ${Math.round(calculateTotal() / 100)}
                                    </span>
                                </div>
                                <p className="text-xs text-amber-700 truncate">For: {intentionFor}</p>
                            </div>

                            <PayPalCheckout
                                amount={calculateTotal()}
                                description={`${selectedOffering?.name} - For ${intentionFor.substring(0, 30)}`}
                                onSuccess={handlePayPalSuccess}
                                onError={handlePayPalError}
                                onCancel={() => setShowPaymentModal(false)}
                                referenceId={`MASS_${selectedType}_${Date.now()}`}
                                createOrderUrl="/api/mass-offerings/payment/create"
                                captureOrderUrl="/api/mass-offerings/payment/capture"
                                metadata={{
                                    offeringType: selectedType,
                                    intentionFor,
                                    additionalNames: additionalNames.filter(n => n.trim()),
                                    isForLiving,
                                    categories: selectedIntentions,
                                    specialIntention,
                                    offeredBy,
                                    tributeMessage,
                                    email,
                                    name,
                                    phone,
                                    isGift,
                                    recipientEmail,
                                    recipientName,
                                    giftMessage,
                                    includesVirtualCandle: addons.candle,
                                    includesPrintedCard: addons.printedCard,
                                    includesFramedCertificate: addons.framedCertificate,
                                    printedCardShippingAddress: shippingAddress
                                }}
                            />

                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 text-sm"
                            >
                                ← Back to form
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="relative bg-slate-900 py-16 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-700/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />

                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-gold-200 hover:text-white mb-6 transition-colors text-sm font-medium tracking-wide uppercase">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20 text-white">
                            <Church className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">Request a Holy Mass</h1>
                            <p className="text-lg text-slate-300 max-w-xl">Have a Mass offered for your intentions. A timeless Catholic tradition of prayer and remembrance.</p>
                            {/* Reassurance */}
                            <p className="text-sm text-slate-400 mt-3 italic">
                                "The Mass is the most perfect form of prayer." — Pope Paul VI. There is no obligation — your prayer alone is pleasing to God.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={`h-2 w-16 rounded-full transition-all ${s <= step ? 'bg-amber-500' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 pb-12 max-w-3xl">
                {/* Step 1: Choose Offering Type */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Offering</h2>

                        <div className="grid gap-4">
                            {OFFERING_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`relative p-6 rounded-2xl border-2 text-left transition-all ${selectedType === type.id
                                        ? 'border-amber-500 bg-amber-50 shadow-lg'
                                        : 'border-gray-200 bg-white hover:border-amber-300'
                                        }`}
                                >
                                    {type.badge && (
                                        <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {type.badge}
                                        </span>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <span className="text-4xl">{type.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-gray-900">{type.name}</h3>
                                                {selectedType === type.id && (
                                                    <Check className="w-5 h-5 text-amber-600" />
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1">{type.description}</p>
                                            <p className="text-amber-600 font-bold">${Math.round(type.price / 100)}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* About Mass Intentions Explainer */}
                        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <h3 className="font-serif font-bold text-lg text-slate-900 mb-3">
                                {SACRED_COPY.massOfferings.aboutTitle}
                            </h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                {SACRED_COPY.massOfferings.aboutDescription}
                            </p>

                            {/* 4-Step Process */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {SACRED_COPY.massOfferings.process.map((step: any) => (
                                    <div key={step.step} className="text-center p-3 bg-white rounded-xl border border-slate-100">
                                        <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                                            {step.step}
                                        </div>
                                        <p className="font-medium text-xs text-slate-900">{step.label}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reassurance near CTA */}
                        <p className="text-center text-sm text-slate-500 mt-4 italic">
                            {SACRED_COPY.massOfferings.reassurance}
                        </p>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full mt-4 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-lg transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Intention Details */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Intention Details</h2>

                        {/* Living or Deceased */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3">This intention is for:</label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setIsForLiving(true); setSelectedIntentions([]); }}
                                    className={`flex-1 py-4 px-6 rounded-xl border-2 font-medium transition-all ${isForLiving
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    ✨ Living Person
                                </button>
                                <button
                                    onClick={() => { setIsForLiving(false); setSelectedIntentions([]); }}
                                    className={`flex-1 py-4 px-6 rounded-xl border-2 font-medium transition-all ${!isForLiving
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    🕯️ Deceased Person
                                </button>
                            </div>
                        </div>

                        {/* Name(s) */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Name of Person(s) for the Intention *
                            </label>
                            <input
                                type="text"
                                value={intentionFor}
                                onChange={(e) => setIntentionFor(e.target.value)}
                                placeholder="e.g., John Smith"
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />

                            {/* Additional names */}
                            {additionalNames.map((n, index) => (
                                <div key={index} className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={n}
                                        onChange={(e) => updateName(index, e.target.value)}
                                        placeholder="Additional name"
                                        className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <button
                                        onClick={() => removeName(index)}
                                        className="p-4 text-red-500 hover:bg-red-50 rounded-xl"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}

                            {additionalNames.length < 5 && (
                                <button
                                    onClick={addName}
                                    className="mt-2 text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add another name
                                </button>
                            )}
                        </div>

                        {/* Intention Categories (multi-select) */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Select Intention Type(s)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {intentionOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => toggleIntention(opt.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedIntentions.includes(opt.value)
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {selectedIntentions.includes(opt.value) && '✓ '}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Special Intention (custom text) */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Special Intention (Optional)
                            </label>
                            <textarea
                                value={specialIntention}
                                onChange={(e) => setSpecialIntention(e.target.value)}
                                placeholder="Any specific intention or notes..."
                                rows={3}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Offered By */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Offered By (for the Mass card)
                            </label>
                            <input
                                type="text"
                                value={offeredBy}
                                onChange={(e) => setOfferedBy(e.target.value)}
                                placeholder="Your name (appears on Mass card)"
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Tribute Message */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Personal Message (Optional)
                            </label>
                            <textarea
                                value={tributeMessage}
                                onChange={(e) => setTributeMessage(e.target.value)}
                                placeholder="A personal message for the Mass card..."
                                rows={2}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!intentionFor.trim()}
                                className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Add-ons & Gift Option */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enhance Your Offering</h2>

                        {/* Add-ons */}
                        <div className="space-y-3 mb-8">
                            {ADDONS.map(addon => (
                                <label
                                    key={addon.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${(addons as any)[addon.id]
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-gray-200 hover:border-amber-300'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={(addons as any)[addon.id]}
                                        onChange={(e) => setAddons({ ...addons, [addon.id]: e.target.checked })}
                                        className="w-5 h-5 text-amber-500 rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{addon.name}</p>
                                        <p className="text-sm text-gray-500">{addon.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-amber-600">+${Math.round(addon.price / 100)}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Shipping address for physical items */}
                        {(addons.printedCard || addons.framedCertificate) && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    📦 Shipping Address
                                </label>
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Full shipping address for printed items..."
                                    rows={3}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>
                        )}

                        {/* Gift Option */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isGift}
                                    onChange={(e) => setIsGift(e.target.checked)}
                                    className="w-5 h-5 text-pink-500 rounded"
                                />
                                <div className="flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-pink-500" />
                                    <span className="font-medium text-gray-900">This is a Gift</span>
                                </div>
                            </label>
                            <p className="text-sm text-gray-600 mt-1 ml-8">
                                Send the digital Mass card to someone else
                            </p>

                            {isGift && (
                                <div className="mt-4 space-y-3 ml-8">
                                    <input
                                        type="text"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        placeholder="Recipient's name"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                    <input
                                        type="email"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        placeholder="Recipient's email"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                    <textarea
                                        value={giftMessage}
                                        onChange={(e) => setGiftMessage(e.target.value)}
                                        placeholder="Personal message for recipient..."
                                        rows={2}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Your Information & Offering */}
                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Complete Your Request</h2>

                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Your Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Your phone number"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-amber-50 rounded-2xl p-6 mb-6">
                            <h3 className="font-bold text-lg text-amber-900 mb-4">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-amber-800">
                                    <span>{selectedOffering?.icon} {selectedOffering?.name}</span>
                                    <span>${Math.round((selectedOffering?.price || 0) / 100)}</span>
                                </div>
                                {addons.candle && (
                                    <div className="flex justify-between text-amber-800">
                                        <span>🕯️ Virtual Candle</span>
                                        <span>$5.00</span>
                                    </div>
                                )}
                                {addons.printedCard && (
                                    <div className="flex justify-between text-amber-800">
                                        <span>📮 Printed Card</span>
                                        <span>$10.00</span>
                                    </div>
                                )}
                                {addons.framedCertificate && (
                                    <div className="flex justify-between text-amber-800">
                                        <span>🖼️ Framed Certificate</span>
                                        <span>$35.00</span>
                                    </div>
                                )}
                                <hr className="border-amber-200 my-2" />
                                <div className="flex justify-between text-amber-900 font-bold text-lg">
                                    <span>Total</span>
                                    <div className="text-right">
                                        <span>${Math.round(calculateTotal() / 100)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-amber-700">
                                <p><strong>For:</strong> {intentionFor} {isForLiving ? '(Living)' : '(Deceased)'}</p>
                                {selectedIntentions.length > 0 && (
                                    <p><strong>Intentions:</strong> {selectedIntentions.map(i => intentionOptions.find(o => o.value === i)?.label).join(', ')}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!name.trim() || !email.trim() || isSubmitting}
                                className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                {isSubmitting ? (
                                    <span className="animate-spin">⏳</span>
                                ) : (
                                    <>
                                        <Heart className="w-5 h-5" />
                                        Request Mass - ${Math.round(calculateTotal() / 100)}
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-4">
                            🔒 Secure payment powered by PayPal
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
