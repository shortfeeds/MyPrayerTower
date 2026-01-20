'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ChevronRight, Lock, CheckCircle, Smartphone } from 'lucide-react';
import dynamic from 'next/dynamic';
import { type PayPalSuccessDetails } from '@/components/PayPalCheckout';
import { lightVirtualCandle } from '@/app/actions/spiritual';

// Dynamic import for PayPal
const PayPalCheckout = dynamic(() => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout), { ssr: false });

import { SACRED_COPY } from '@/lib/sacred-copy';

interface CreateCandleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

import Image from 'next/image';

import { usePricing } from '@/contexts/PricingContext';

const DEFAULT_DURATIONS = [
    { value: 'ONE_DAY', label: 'Humble Prayer', daysLabel: '1 Day', hours: 24, price: 0, priceDisplay: 'Free', tier: 'free', desc: 'A simple prayer for today', image: '/images/candles/humble.png', spiritual: 'A humble beginning', tierBadge: '' },
    { value: 'THREE_DAYS', label: 'Devotion Votive', daysLabel: '3 Days', hours: 72, price: 299, priceDisplay: '$2.99', tier: 'standard', desc: 'Sincere devotion with Cross', image: '/images/candles/devotion_glow.png', spiritual: '✞ Your faith grows stronger', tierBadge: '' },
    { value: 'SEVEN_DAYS', label: 'Sacred Altar', daysLabel: '7 Days', hours: 168, price: 599, priceDisplay: '$5.99', tier: 'premium', desc: 'Carried to God\'s altar', image: '/images/candles/altar.png', spiritual: '⛪ Presented before the Lord', tierBadge: 'Popular' },
    { value: 'FOURTEEN_DAYS', label: 'Blessed Marian', daysLabel: '14 Days', hours: 336, price: 999, priceDisplay: '$9.99', tier: 'premium', desc: 'Under Our Lady\'s protection', image: '/images/candles/marian_glow.png', spiritual: '✨ Mary intercedes for you', tierBadge: 'Best Value', bestValue: true },
    { value: 'THIRTY_DAYS', label: 'Divine Cathedral', daysLabel: '30 Days', hours: 720, price: 1499, priceDisplay: '$14.99', tier: 'premium', desc: 'Angels carry your prayer to Heaven', image: '/images/candles/divine.png', spiritual: '🕊️ Your prayer ascends to Heaven', tierBadge: 'Most Powerful' },
];

export function CandleCreationModal({ isOpen, onClose, onSuccess }: CreateCandleModalProps) {
    const { prices, formatPrice } = usePricing();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        intention: '',
        name: '',
        isAnonymous: false,
        duration: 'ONE_DAY',
        email: '' // Optional for receipt
    });

    // Merge default structure with dynamic prices
    const durations = DEFAULT_DURATIONS.map(d => {
        let dynamicPrice = d.price;
        if (prices?.candles) {
            if (d.value === 'ONE_DAY') dynamicPrice = prices.candles.oneDay;
            if (d.value === 'THREE_DAYS') dynamicPrice = prices.candles.threeDay;
            if (d.value === 'SEVEN_DAYS') dynamicPrice = prices.candles.sevenDay;
            if (d.value === 'THIRTY_DAYS') dynamicPrice = prices.candles.thirtyDay;
            // Note: Fourteen days currently doesn't have a specific setting, using default or closest approximation
        }
        return {
            ...d,
            price: dynamicPrice,
            priceDisplay: formatPrice(dynamicPrice)
        };
    });

    const selectedTier = durations.find(d => d.value === formData.duration) || durations[0];

    const handleSubmit = async () => {
        if (selectedTier.price === 0) {
            // Free candle
            setLoading(true);
            try {
                await lightVirtualCandle({
                    intention: formData.intention,
                    isAnonymous: formData.isAnonymous,
                    duration: formData.duration,
                    name: formData.isAnonymous ? 'Anonymous' : formData.name
                });
                onSuccess();
                onClose();
            } catch (err: any) {
                setError(err.message || 'Failed to light candle');
            } finally {
                setLoading(false);
            }
        } else {
            // Proceed to payment (PayPal component handles the rest)
            setStep(3);
        }
    };

    const handlePayPalSuccess = async (details: PayPalSuccessDetails) => {
        setLoading(true);
        try {
            await lightVirtualCandle({
                intention: formData.intention,
                isAnonymous: formData.isAnonymous,
                duration: formData.duration,
                name: formData.isAnonymous ? 'Anonymous' : formData.name,
                paymentId: details.orderID
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to verify payment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                            <Flame className="w-5 h-5 fill-white animate-pulse" />
                            Light a Candle
                        </h3>
                        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        {/* Step 1: Intention */}
                        {step === 1 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Intention</label>
                                        <textarea
                                            value={formData.intention}
                                            onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
                                            placeholder="I pray for..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all min-h-[100px] text-gray-900 bg-white placeholder-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-gray-900 bg-white placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="anon"
                                            checked={formData.isAnonymous}
                                            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                            className="rounded text-amber-600 focus:ring-amber-500"
                                        />
                                        <label htmlFor="anon" className="text-sm text-gray-600">Pray anonymously</label>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!formData.intention}
                                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Tier Selection */}
                        {step === 2 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                {/* Meaning First - Above Everything */}
                                <div className="bg-amber-50/80 border border-amber-200/50 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-amber-800 text-center italic font-medium">
                                        {SACRED_COPY.candleFlow.meaningFirst}
                                    </p>
                                </div>

                                <h4 className="font-semibold text-gray-900 mb-1 text-base">Select Your Offering</h4>
                                <p className="text-xs text-gray-500 mb-4">
                                    {SACRED_COPY.candleFlow.noObligation}
                                </p>

                                <div className="space-y-2 mb-4">
                                    {durations.map((tier) => {
                                        const isSelected = formData.duration === tier.value;
                                        return (
                                            <button
                                                key={tier.value}
                                                onClick={() => setFormData({ ...formData, duration: tier.value })}
                                                className={`relative w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${isSelected
                                                    ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-400'
                                                    : 'border-gray-100 hover:border-amber-200 bg-white hover:bg-amber-50/30'
                                                    }`}
                                            >
                                                {/* Badge */}
                                                {tier.tierBadge && (
                                                    <div className="absolute -top-2 right-4 px-2 py-0.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[9px] font-bold rounded-full shadow-sm uppercase tracking-wider">
                                                        {tier.tierBadge}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 text-left">
                                                    <div className={`relative w-12 h-12 rounded-lg border overflow-hidden shrink-0 ${isSelected ? 'border-amber-300' : 'border-gray-200'}`}>
                                                        <Image
                                                            src={tier.image}
                                                            alt={tier.label}
                                                            fill
                                                            className="object-contain p-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-serif font-bold ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>{tier.label}</span>
                                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{tier.daysLabel}</span>
                                                        </div>
                                                        <div className="text-xs text-amber-700/80 italic mt-0.5">{tier.spiritual}</div>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <div className={`font-medium ${tier.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                        {tier.price === 0 ? 'Free' : tier.priceDisplay}
                                                    </div>
                                                    {tier.price > 0 && (
                                                        <div className="text-[10px] text-gray-400">offering</div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start mb-4">
                                    <div className="p-1 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        {SACRED_COPY.offerings.transparency}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all"
                                    >
                                        {selectedTier.price === 0 ? 'Light Candle' : 'Make Offering'}
                                    </button>
                                </div>

                                {/* Reassurance After Selection */}
                                <p className="text-center text-xs text-gray-400 mt-4 italic">
                                    {SACRED_COPY.candleFlow.afterSelection}
                                </p>
                            </motion.div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <Lock className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <h4 className="font-serif font-bold text-xl text-gray-900 mb-1">Secure Offering</h4>
                                    <p className="text-gray-500 text-sm">
                                        Your offering of <span className="font-semibold text-gray-900">{selectedTier.priceDisplay}</span> helps sustain this sanctuary.
                                    </p>
                                </div>

                                <div className="min-h-[150px] relative z-0">
                                    <PayPalCheckout
                                        amount={selectedTier.price}
                                        currency="USD"
                                        onSuccess={handlePayPalSuccess}
                                        onError={(err) => setError(err.message)}
                                    />
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="mt-6 w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Change Selection
                                </button>
                            </motion.div>
                        )}

                        {/* Loading Overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <h5 className="text-lg font-serif font-bold text-gray-900 mb-1">Lighting your candle...</h5>
                                    <p className="text-gray-500 text-sm">May your prayer rise like incense.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

