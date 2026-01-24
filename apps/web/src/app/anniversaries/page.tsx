'use client';

import { useState, useEffect } from 'react';
import { Calendar, Heart, Gift, Clock, Check, ChevronLeft, Upload, Loader2, Sparkles, Flame, ScrollText, Flower, DollarSign, Plus, Church, CircleDot, Users } from 'lucide-react';
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
    bgGradient: string;
}

const TYPES: AnniversaryType[] = [
    { id: 'wedding', label: 'Wedding Anniversary', icon: Heart, description: 'Celebrate the sacrament of Holy Matrimony', color: 'text-rose-600', bgGradient: 'from-rose-50 to-pink-50' },
    { id: 'death', label: 'Death Anniversary', icon: Clock, description: 'Pray for the repose of a soul', color: 'text-purple-600', bgGradient: 'from-purple-50 to-indigo-50' },
    { id: 'birthday', label: 'Birthday Blessing', icon: Gift, description: 'Give thanks for the gift of life', color: 'text-amber-600', bgGradient: 'from-amber-50 to-orange-50' },
    { id: 'ordination', label: 'Ordination / Vows', icon: Sparkles, description: 'Honor a vocation to serve God', color: 'text-blue-600', bgGradient: 'from-blue-50 to-cyan-50' },
];

const ADDONS = [
    { id: 'prayers', label: 'Community Prayer Support', price: 0, icon: Users, description: 'Our faithful community unites in prayer for your intention.' },
    { id: 'mass', label: 'Solemn Mass Intention', price: 1000, icon: Church, description: 'The Holy Sacrifice of the Mass offered specifically for your intention.' },
    { id: 'rosary', label: 'Holy Rosary Invocation', price: 500, icon: CircleDot, description: 'A complete Rosary offered by our prayer warriors, invoking Our Lady\'s intercession.' },
    { id: 'candle', label: 'Light a Vigil Candle', price: 500, icon: Flame, description: 'A sacred flame burning for 7 days as a constant sign of your enduring love.' },
    { id: 'flowers', label: 'Spiritual Flower Bouquet', price: 500, icon: Flower, description: 'A beautiful digital floral tribute to adorn the virtual altar in memory of this day.' },
];

export default function AnniversariesPage() {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string>('');
    const [customAmount, setCustomAmount] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        years: '',
        message: '',
        offering: 2500, // Default $25
        isCustomAmount: false,
        addons: [] as string[]
    });

    const [isSuccess, setIsSuccess] = useState(false);

    // Calculate total including add-ons
    const calculateTotal = () => {
        let total = formData.offering;
        formData.addons.forEach(addonId => {
            const addon = ADDONS.find(a => a.id === addonId);
            if (addon) total += addon.price;
        });
        return total;
    };

    const handleSuccess = () => {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleAddon = (id: string) => {
        if (formData.addons.includes(id)) {
            setFormData({ ...formData, addons: formData.addons.filter(a => a !== id) });
        } else {
            setFormData({ ...formData, addons: [...formData.addons, id] });
        }
    };

    const getType = () => TYPES.find(t => t.id === selectedType);

    // Auto-update custom amount logic
    useEffect(() => {
        if (formData.isCustomAmount && customAmount) {
            const num = parseInt(customAmount.replace(/[^0-9]/g, '')) * 100; // Convert to cents
            if (!isNaN(num)) {
                setFormData(prev => ({ ...prev, offering: num }));
            }
        }
    }, [customAmount, formData.isCustomAmount]);

    return (
        <div className="min-h-screen bg-stone-50 selection:bg-gold-500/20">
            {/* Sacred Hero */}
            <div className="relative bg-sacred-900 text-white pt-28 pb-24 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/anniversary_header.png"
                        alt="Sacred Sanctuary"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                </div>
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-sacred-900/50 via-sacred-900/80 to-sacred-900" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold tracking-widest uppercase mb-6 text-gold-400 shadow-lg">
                            <Clock className="w-3 h-3" />
                            Liturgical Anniversaries
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl">
                            Sacred <span className="text-gold-400 font-serif italic">Milestones</span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
                            Consecrate this moment in time. Create a perpetual remembrance in the presence of God for those you love.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="container mx-auto px-4 -mt-20 relative z-20 pb-20">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl shadow-gray-900/10 overflow-hidden border border-gray-100">

                    {/* Progress Bar */}
                    <div className="bg-gray-50 border-b border-gray-100 px-8 py-4 flex items-center justify-between text-sm font-medium text-gray-400">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-sacred-800' : ''}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 1 ? 'border-sacred-800 bg-sacred-800 text-white' : 'border-gray-300'}`}>1</span>
                            Occasion
                        </div>
                        <div className="h-px bg-gray-200 w-16" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-sacred-800' : ''}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 2 ? 'border-sacred-800 bg-sacred-800 text-white' : 'border-gray-300'}`}>2</span>
                            Sacred Details
                        </div>
                        <div className="h-px bg-gray-200 w-16" />
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-sacred-800' : ''}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 3 ? 'border-sacred-800 bg-sacred-800 text-white' : 'border-gray-300'}`}>3</span>
                            Offering
                        </div>
                    </div>

                    <div className="p-8 md:p-12 min-h-[500px]">
                        {isSuccess ? (
                            <div className="text-center py-12 animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Check className="w-12 h-12 text-green-600" />
                                </div>
                                <h2 className="text-4xl font-serif font-bold text-sacred-900 mb-4">Your Intentions are Received</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                                    Your offering has been placed on the altar of prayer. May God's grace abound to you and your loved ones.
                                </p>
                                <button
                                    onClick={() => { setIsSuccess(false); setStep(1); setSelectedType(''); setFormData({ ...formData, message: '', name: '', addons: [] }); }}
                                    className="px-8 py-3 bg-sacred-900 text-gold-50 rounded-xl font-bold hover:bg-sacred-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Offer Another Intention
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Step 1: Selection */}
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 text-center">What are we commemorating?</h2>
                                        <p className="text-gray-500 text-center mb-10">Select the sacred occasion for this remembrance.</p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {TYPES.map((type) => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`
                                                        relative p-8 rounded-3xl border-2 text-left transition-all duration-300 group overflow-hidden
                                                        ${selectedType === type.id
                                                            ? 'border-gold-500 bg-white ring-4 ring-gold-500/10 shadow-xl'
                                                            : 'border-transparent bg-gray-50 hover:bg-white hover:shadow-lg hover:border-gray-200'
                                                        }
                                                    `}
                                                >
                                                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                                        <type.icon className="w-32 h-32" />
                                                    </div>

                                                    <div className={`w-14 h-14 rounded-2xl mb-6 bg-gradient-to-br ${type.bgGradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                        <type.icon className={`w-7 h-7 ${type.color}`} />
                                                    </div>
                                                    <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">{type.label}</h3>
                                                    <p className="text-sm text-gray-500 leading-relaxed max-w-[90%] relative z-10">{type.description}</p>

                                                    {selectedType === type.id && (
                                                        <div className="absolute top-4 right-4 text-gold-500">
                                                            <Check className="w-6 h-6" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex justify-center pt-10">
                                            <button
                                                onClick={() => setStep(2)}
                                                disabled={!selectedType}
                                                className="w-full md:w-auto px-12 py-4 bg-sacred-900 text-white rounded-full font-bold hover:bg-sacred-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                Proceed to Details
                                                <ChevronLeft className="w-4 h-4 rotate-180" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Details & Add-ons */}
                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                                            <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <div>
                                                <h2 className="text-2xl font-serif font-bold text-gray-900">Sacred Intentions</h2>
                                                <p className="text-sm text-gray-500">Whom shall we remember before the Altar?</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Form Fields */}
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Primary Intention For</label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="e.g. John & Mary Smith"
                                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all font-medium text-lg"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sacred Date</label>
                                                        <input
                                                            type="date"
                                                            value={formData.date}
                                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                                                        />
                                                    </div>
                                                    {selectedType === 'wedding' && (
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Years</label>
                                                            <input
                                                                type="text"
                                                                value={formData.years}
                                                                onChange={e => setFormData({ ...formData, years: e.target.value })}
                                                                placeholder="25"
                                                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Prayer Request / Note</label>
                                                    <textarea
                                                        value={formData.message}
                                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                        placeholder="Your special prayer request to be laid before the Lord..."
                                                        rows={4}
                                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Offertory & Addons */}
                                            <div className="bg-stone-50 rounded-3xl p-6 md:p-8 space-y-8">
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                                        <Gift className="w-4 h-4 text-gold-600" />
                                                        Sacrificial Gift
                                                    </label>

                                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                                        {[1000, 2500, 5000].map((amount) => (
                                                            <button
                                                                key={amount}
                                                                onClick={() => { setFormData({ ...formData, offering: amount, isCustomAmount: false }); setCustomAmount(''); }}
                                                                className={`py-3 rounded-xl border font-bold transition-all ${formData.offering === amount && !formData.isCustomAmount
                                                                    ? 'bg-sacred-900 border-sacred-900 text-white shadow-lg'
                                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                ${amount / 100}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Custom Amount Input */}
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                            <DollarSign className="w-4 h-4" />
                                                        </div>
                                                        <input
                                                            type="number"
                                                            placeholder="Custom Gift"
                                                            value={customAmount}
                                                            onChange={(e) => {
                                                                setCustomAmount(e.target.value);
                                                                setFormData({ ...formData, isCustomAmount: true });
                                                            }}
                                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${formData.isCustomAmount ? 'border-gold-500 ring-2 ring-gold-500/20 bg-white' : 'border-gray-200 bg-white/50'}`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Sacred Add-ons */}
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                                        <Sparkles className="w-4 h-4 text-gold-600" />
                                                        Spiritual Additions
                                                    </label>
                                                    <div className="space-y-3">
                                                        {ADDONS.map(addon => (
                                                            <button
                                                                key={addon.id}
                                                                onClick={() => toggleAddon(addon.id)}
                                                                className={`w-full flex items-center p-3 rounded-xl border transition-all bg-white hover:shadow-md ${formData.addons.includes(addon.id) ? 'border-gold-500 ring-1 ring-gold-500 bg-gold-50/10' : 'border-gray-200'}`}
                                                            >
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 ${formData.addons.includes(addon.id) ? 'bg-gold-100 text-gold-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                    <addon.icon className="w-5 h-5" />
                                                                </div>
                                                                <div className="text-left flex-1 min-w-0">
                                                                    <div className="font-bold text-gray-900 text-sm truncate">{addon.label}</div>
                                                                    <div className="text-xs text-gray-500 line-clamp-1">{addon.description}</div>
                                                                </div>
                                                                <div className={`font-bold text-sm ml-2 whitespace-nowrap ${addon.price === 0 ? 'text-sacred-600' : 'text-gray-900'}`}>
                                                                    {addon.price === 0 ? 'Included' : `+$${addon.price / 100}`}
                                                                </div>
                                                                <div className={`ml-3 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${formData.addons.includes(addon.id) ? 'bg-gold-500 border-gold-500' : 'border-gray-300'}`}>
                                                                    {formData.addons.includes(addon.id) && <Check className="w-3 h-3 text-white" />}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                onClick={() => setStep(3)}
                                                disabled={!formData.name || !formData.date}
                                                className="w-full md:w-auto px-12 py-4 bg-sacred-900 text-white rounded-full font-bold hover:bg-sacred-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                Review Offering
                                                <ChevronLeft className="w-4 h-4 rotate-180" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Checkout */}
                                {step === 3 && getType() && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 max-w-2xl mx-auto">
                                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-8">
                                            <button onClick={() => setStep(2)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <div>
                                                <h2 className="text-2xl font-serif font-bold text-gray-900">Offering of the Heart</h2>
                                                <p className="text-sm text-gray-500">Confirm Your Sacrifice</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-sacred-50 to-white rounded-3xl p-8 border border-gray-100 shadow-lg relative overflow-hidden">
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div>
                                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Sacrificial Offering</h3>
                                                        <div className="text-4xl font-serif font-bold text-sacred-900">
                                                            ${(calculateTotal() / 100).toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getType()?.bgGradient} flex items-center justify-center shadow-sm`}>
                                                        {(() => {
                                                            const Icon = getType()?.icon;
                                                            return Icon ? <Icon className={`w-7 h-7 ${getType()?.color}`} /> : null;
                                                        })()}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 border-t border-gray-100 pt-6">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Base Intentions</span>
                                                        <span className="font-bold text-gray-900">${(formData.offering / 100).toFixed(2)}</span>
                                                    </div>
                                                    {formData.addons.map(addonId => {
                                                        const addon = ADDONS.find(a => a.id === addonId);
                                                        return addon ? (
                                                            <div key={addon.id} className="flex justify-between text-sm">
                                                                <span className="text-gray-600 flex items-center gap-2"><Plus className="w-3 h-3" /> {addon.label}</span>
                                                                <span className="font-bold text-gray-900">{addon.price === 0 ? 'Included' : `$${(addon.price / 100).toFixed(2)}`}</span>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                    <div className="pt-4 border-t border-gray-200 flex justify-between text-lg font-bold">
                                                        <span className="text-sacred-900">Total Gift</span>
                                                        <span className="text-sacred-900">${(calculateTotal() / 100).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-gray-100">
                                            <PayPalCheckout
                                                amount={calculateTotal()}
                                                description={`Anniversary: ${getType()?.label} - ${formData.name}`}
                                                onSuccess={handleSuccess}
                                                onError={() => alert('Payment failed. Please try again.')}
                                            />
                                        </div>
                                        <p className="text-center text-xs text-gray-400 mt-4 max-w-sm mx-auto">
                                            Your offering aids the Church's mission and sustains this ministry of prayer. May God reward your generosity.
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
