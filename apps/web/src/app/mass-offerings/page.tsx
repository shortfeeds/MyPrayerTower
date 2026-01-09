'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Church, Heart, Sparkles, Check, Gift, X, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

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
        id: 'PERPETUAL',
        name: 'Perpetual Enrollment',
        icon: '🌟',
        price: 10000,
        description: 'Enrolled forever in daily Masses at our partner monasteries',
        popular: true,
        badge: 'BEST VALUE',
    },
    {
        id: 'NOVENA',
        name: 'Novena of Masses',
        icon: '💿',
        price: 7500,
        description: '9 consecutive Masses offered for your intention',
        popular: false,
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
    { id: 'candle', name: '🕯️ Virtual Candle', price: 500, description: '7-day candle on Prayer Wall' },
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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const totalAmount = calculateTotal();
            const intentionDetails = `For: ${intentionFor} (${isForLiving ? 'Living' : 'Deceased'}). ${selectedIntentions.length ? 'Intentions: ' + selectedIntentions.join(', ') : ''}. ${specialIntention ? 'Note: ' + specialIntention : ''}`;

            const response = await fetch('/api/mass-offerings/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offeringId: selectedType, // Backend expects offeringId
                    amount: totalAmount, // Send calculated total in cents
                    intention: intentionDetails, // Backend expects single intention string
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
                    recipientEmail: isGift ? recipientEmail : undefined,
                    recipientName: isGift ? recipientName : undefined,
                    giftMessage: isGift ? giftMessage : undefined,
                    includesVirtualCandle: addons.candle,
                    includesPrintedCard: addons.printedCard,
                    includesFramedCertificate: addons.framedCertificate,
                    printedCardShippingAddress: addons.printedCard || addons.framedCertificate ? shippingAddress : undefined,
                }),
            });

            const data = await response.json();

            if (data.success && data.payment_session_id) {
                // Initialize Cashfree
                const { load } = await import('@cashfreepayments/cashfree-js');
                const cashfree = await load({
                    mode: "production", // or "sandbox"
                });

                cashfree.checkout({
                    paymentSessionId: data.payment_session_id,
                    redirectTarget: "_self",
                });
            } else {
                alert(data.message || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 py-12 text-white">
                <div className="container mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Church className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Request a Holy Mass</h1>
                            <p className="text-white/80">Have a Mass offered for your intentions</p>
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
                                            <p className="text-amber-600 font-bold">${(type.price / 100).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full mt-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-lg transition-colors"
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
                                        <span className="block font-bold text-amber-600">+${(addon.price / 100).toFixed(2)}</span>
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

                {/* Step 4: Your Information & Checkout */}
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
                                    <span>${((selectedOffering?.price || 0) / 100).toFixed(2)}</span>
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
                                        <span>${(calculateTotal() / 100).toFixed(2)}</span>
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
                                        Request Mass - ${(calculateTotal() / 100).toFixed(2)}
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-4">
                            🔒 Secure payment powered by Cashfree
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
