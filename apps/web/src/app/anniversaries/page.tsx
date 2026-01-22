'use client';

import { useState } from 'react';
import { Calendar, Heart, Gift, Clock, Check, ChevronLeft, Upload, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import for PayPal to avoid SSR issues
const PayPalCheckout = dynamic(
    () => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout),
    { ssr: false }
);

interface AnniversaryType {
    id: string;
    label: string;
    icon: any;
    description: string;
    color: string;
}

const TYPES: AnniversaryType[] = [
    { id: 'wedding', label: 'Wedding Anniversary', icon: Heart, description: 'Celebrate sacred union', color: 'from-rose-400 to-pink-500' },
    { id: 'death', label: 'Death Anniversary', icon: Clock, description: 'Remember a loved one', color: 'from-purple-400 to-indigo-500' },
    { id: 'birthday', label: 'Birthday Blessing', icon: Gift, description: 'Gift of life', color: 'from-amber-400 to-orange-500' },
    { id: 'ordination', label: 'Ordination / Vows', icon: Sparkles, description: 'Service to God', color: 'from-blue-400 to-cyan-500' },
];

export default function AnniversariesPage() {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        years: '',
        message: '',
        offering: 2500 // $25 default
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSuccess = () => {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getType = () => TYPES.find(t => t.id === selectedType);

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Immersive Hero */}
            <div className="relative bg-gray-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-medium mb-6">
                            Sacred Milestones
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            Remembering <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">Love</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Mark the days that matter most. Whether celebrating a union, honoring a life, or giving thanks for a birthday,
                            sanctify the moment with a special remembrance.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="container mx-auto px-4 -mt-20 relative z-20 pb-20">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Progress Bar */}
                    <div className="flex border-b border-gray-100">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-2 transition-all duration-500 ${step >= s
                                        ? 'bg-gradient-to-r from-rose-500 to-orange-500'
                                        : 'bg-gray-100'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="p-8 md:p-12">
                        {isSuccess ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Remembrance Registered</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Your anniversary has been recorded in our Book of Remembrance. May God's grace be with you on this special day.
                                </p>
                                <button
                                    onClick={() => { setIsSuccess(false); setStep(1); setSelectedType(''); setFormData({ ...formData, message: '', name: '' }); }}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition"
                                >
                                    Register Another
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Step 1: Selection */}
                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">What are we commemorating?</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {TYPES.map((type) => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`p-6 rounded-2xl border-2 text-left transition-all group ${selectedType === type.id
                                                            ? 'border-transparent ring-2 ring-offset-2 ring-rose-500 bg-gray-50'
                                                            : 'border-gray-100 hover:border-rose-200 hover:bg-rose-50'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl mb-4 bg-gradient-to-br ${type.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                                        <type.icon className="w-6 h-6" />
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 mb-1">{type.label}</h3>
                                                    <p className="text-sm text-gray-500">{type.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex justify-end pt-6">
                                            <button
                                                onClick={() => setStep(2)}
                                                disabled={!selectedType}
                                                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Details */}
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-4 mb-2">
                                            <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full">
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <h2 className="text-2xl font-serif font-bold text-gray-900">The Details</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name(s)</label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Create a remembrance for..."
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.date}
                                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                    />
                                                </div>
                                            </div>

                                            {selectedType === 'wedding' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Years Celebrating</label>
                                                    <input
                                                        type="number"
                                                        value={formData.years}
                                                        onChange={e => setFormData({ ...formData, years: e.target.value })}
                                                        placeholder="e.g. 25"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Offertory Contribution</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[1000, 2500, 5000].map((amount) => (
                                                        <button
                                                            key={amount}
                                                            onClick={() => setFormData({ ...formData, offering: amount })}
                                                            className={`py-3 rounded-xl border font-medium ${formData.offering === amount
                                                                    ? 'bg-rose-50 border-rose-500 text-rose-700'
                                                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            ${amount / 100}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">Offers simple support for the community.</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Special Message</label>
                                                <textarea
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                    placeholder="A prayer or note of varying length..."
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setStep(3)}
                                            disabled={!formData.name || !formData.date}
                                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg mt-4"
                                        >
                                            Review & Offer
                                        </button>
                                    </motion.div>
                                )}

                                {/* Step 3: Payment */}
                                {step === 3 && getType() && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-4 mb-2">
                                            <button onClick={() => setStep(2)} className="p-2 hover:bg-gray-100 rounded-full">
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <h2 className="text-2xl font-serif font-bold text-gray-900">Complete Offering</h2>
                                        </div>

                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getType()?.color} flex items-center justify-center text-white`}>
                                                    {(() => {
                                                        const Icon = getType()?.icon;
                                                        return Icon ? <Icon className="w-6 h-6" /> : null;
                                                    })()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{getType()?.label}</h3>
                                                    <p className="text-sm text-gray-600">For {formData.name}</p>
                                                </div>
                                                <div className="ml-auto font-bold text-xl text-gray-900">
                                                    ${formData.offering / 100}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 italic">"{formData.message || 'Remembrance in prayer'}"</p>
                                        </div>

                                        <div className="min-h-[150px]">
                                            <PayPalCheckout
                                                amount={formData.offering}
                                                description={`${getType()?.label} for ${formData.name}`}
                                                onSuccess={handleSuccess}
                                                onError={() => alert('Payment failed. Please try again.')}
                                            />
                                        </div>

                                        <p className="text-center text-xs text-gray-400 mt-4">
                                            Secure contribution via PayPal. Not tax deductible.
                                        </p>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
