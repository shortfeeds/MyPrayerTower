'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ChevronRight, Lock, CheckCircle, Smartphone } from 'lucide-react';
import dynamic from 'next/dynamic';
import { type PayPalSuccessDetails } from '@/components/PayPalCheckout';
import { lightVirtualCandle } from '@/app/actions/spiritual';

// Dynamic import for PayPal
const PayPalCheckout = dynamic(() => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout), { ssr: false });

interface CreateCandleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

import Image from 'next/image';

const DURATIONS = [
    { value: 'ONE_DAY', label: 'Humble Prayer', daysLabel: '1 Day', hours: 24, price: 0, priceDisplay: 'Free', tier: 'free', desc: 'A simple prayer for today', image: '/images/candles/humble.png', spiritual: 'A humble beginning', tierBadge: '' },
    { value: 'THREE_DAYS', label: 'Devotion Votive', daysLabel: '3 Days', hours: 72, price: 249, priceDisplay: '$2.49', tier: 'standard', desc: 'Sincere devotion with Cross', image: '/images/candles/devotion_glow.png', spiritual: '✞ Your faith grows stronger', tierBadge: '' },
    { value: 'SEVEN_DAYS', label: 'Sacred Altar', daysLabel: '7 Days', hours: 168, price: 499, priceDisplay: '$4.99', tier: 'premium', desc: 'Carried to God\'s altar', image: '/images/candles/altar.png', spiritual: '⛪ Presented before the Lord', tierBadge: 'Popular' },
    { value: 'FOURTEEN_DAYS', label: 'Blessed Marian', daysLabel: '14 Days', hours: 336, price: 999, priceDisplay: '$9.99', tier: 'premium', desc: 'Under Our Lady\'s protection', image: '/images/candles/marian_glow.png', spiritual: '✨ Mary intercedes for you', tierBadge: 'Best Value', bestValue: true },
    { value: 'THIRTY_DAYS', label: 'Divine Cathedral', daysLabel: '30 Days', hours: 720, price: 1499, priceDisplay: '$14.99', tier: 'premium', desc: 'Angels carry your prayer to Heaven', image: '/images/candles/divine.png', spiritual: '🕊️ Your prayer ascends to Heaven', tierBadge: 'Most Powerful' },
];

export function CandleCreationModal({ isOpen, onClose, onSuccess }: CreateCandleModalProps) {
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

    const selectedTier = DURATIONS.find(d => d.value === formData.duration) || DURATIONS[0];

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
                                <h4 className="font-semibold text-gray-900 mb-1 text-base">Choose Your Candle</h4>
                                <p className="text-xs text-gray-600 mb-3">Premium candles have greater visibility and prayers</p>
                                <div className="space-y-2 mb-4">
                                    {DURATIONS.map((tier) => {
                                        const isSelected = formData.duration === tier.value;
                                        return (
                                            <button
                                                key={tier.value}
                                                onClick={() => setFormData({ ...formData, duration: tier.value })}
                                                className={`relative w-full flex items-center justify-between p-2.5 rounded-lg border-2 transition-all ${isSelected
                                                    ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400'
                                                    : tier.tier === 'premium'
                                                        ? 'border-amber-200 hover:border-amber-400 bg-amber-50/30'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                            >
                                                {/* Badge */}
                                                {tier.tierBadge && (
                                                    <div className="absolute -top-1.5 right-3 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-bold rounded-full">
                                                        {tier.tierBadge}
                                                    </div>
                                                )}
                                                {/* Selected check */}
                                                {isSelected && (
                                                    <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow">
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-left">
                                                    <div className="relative w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-300 overflow-hidden shrink-0">
                                                        <Image
                                                            src={tier.image}
                                                            alt={tier.label}
                                                            fill
                                                            className="object-contain p-0.5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={`font-bold text-sm ${isSelected ? 'text-amber-800' : 'text-gray-900'}`}>{tier.label}</span>
                                                            <span className={`text-[10px] px-1 py-0.5 rounded font-medium ${isSelected ? 'bg-amber-200 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>{tier.daysLabel}</span>
                                                        </div>
                                                        <div className={`text-[11px] ${isSelected ? 'text-amber-700' : 'text-gray-500'}`}>{tier.spiritual}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 ml-1">
                                                    <div className={`font-bold text-base ${tier.price === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                                        {tier.priceDisplay}
                                                    </div>
                                                    {tier.price === 0 && (
                                                        <div className="text-[9px] text-green-600 font-semibold">Start</div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 shadow-lg shadow-amber-200 active:scale-95 transition-all"
                                    >
                                        {selectedTier.price === 0 ? 'Light Candle' : 'Proceed to Offering'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Lock className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <h4 className="font-bold text-xl text-gray-900">Secure Offering</h4>
                                    <p className="text-gray-500 text-sm">Amount: {selectedTier.priceDisplay}</p>
                                </div>

                                <div className="min-h-[150px]">
                                    <PayPalCheckout
                                        amount={selectedTier.price}
                                        currency="USD"
                                        onSuccess={handlePayPalSuccess}
                                        onError={(err) => setError(err.message)}
                                    />
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-900"
                                >
                                    Go Back
                                </button>
                            </motion.div>
                        )}

                        {/* Loading Overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                                <div className="text-center">
                                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    <p className="text-amber-600 font-medium">Lighting your candle...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

