'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { ChevronLeft, Cross, Heart, Calendar, Users, Check, Loader2, Info, Sparkles, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const PayPalCheckout = dynamic(
    () => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center py-6 bg-gray-50 rounded-xl">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        ),
    }
);

interface MassType {
    id: string;
    name: string;
    description: string;
    price: number; // in cents
    popular?: boolean;
    color: string;
    icon: any;
    features: string[];
}

const massTypes: MassType[] = [
    {
        id: 'single',
        name: 'Single Mass',
        description: 'One Holy Mass offered for your intention',
        price: 1000,
        popular: true,
        color: 'from-blue-500 to-indigo-600',
        icon: Cross,
        features: ['Personal Intention', 'Scheduled Date', 'Digital Card']
    },
    {
        id: 'novena',
        name: 'Novena of Masses',
        description: '9 consecutive Masses for your intention',
        price: 7500,
        color: 'from-emerald-500 to-teal-600',
        icon: Sparkles,
        features: ['9 Days of Prayer', 'Powerful Intercession', 'Daily Remembrance']
    },
    {
        id: 'gregorian',
        name: 'Gregorian Masses',
        description: '30 consecutive Masses for a soul',
        price: 20000,
        color: 'from-purple-500 to-violet-600',
        icon: ShieldCheck,
        features: ['30 Days Consecutive', 'For Deceased Only', 'Top Priority']
    },
    {
        id: 'perpetual',
        name: 'Perpetual Enrollment',
        description: 'Permanent daily prayer inclusion',
        price: 10000,
        color: 'from-amber-400 to-orange-500',
        icon: Users,
        features: ['Daily Remembrance', 'Forever Included', 'Certificate Sent']
    },
];

const intentionTypes = [
    'Living Person',
    'Deceased Person',
    'Thanksgiving',
    'Special Intention',
    'Healing',
    'Family',
    'Vocations',
    'World Peace',
];

export default function MassOfferingsPage() {
    const [selectedMass, setSelectedMass] = useState<MassType | null>(null);
    const [intentionType, setIntentionType] = useState('');
    const [intentionFor, setIntentionFor] = useState('');
    const [requestedBy, setRequestedBy] = useState('');
    const [email, setEmail] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState(1);
    const [showPayPal, setShowPayPal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSuccess, setHasSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!selectedMass) return;
        if (selectedMass.price > 0 && !showPayPal) {
            setShowPayPal(true);
            return;
        }
        await processOrder();
    };

    const processOrder = useCallback(async () => {
        setIsSubmitting(true);
        try {
            // Here you would typically call your backend API
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
            setHasSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Mass offering error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Immersive Header */}
            <div className="relative bg-indigo-900 text-white pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544211604-faed3810ea38?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 transform scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 via-indigo-900/80 to-slate-50" />

                <div className="container mx-auto px-4 pt-8 md:pt-16 relative z-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-8 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back to Sanctuary
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-800/50 backdrop-blur border border-indigo-700 text-indigo-200 text-sm font-medium mb-6">
                            <Cross className="w-3.5 h-3.5 text-indigo-400" /> Sacred Tradition
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                            Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200">Holy Mass</span>
                        </h1>
                        <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                            Complete the greatest prayer of the Church. Have the Holy Sacrifice offered for your loved ones,
                            living or deceased, through our network of faithful priests.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
                <AnimatePresence mode='wait'>
                    {!hasSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-4xl mx-auto"
                        >
                            {/* Step Indicator */}
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-4 mb-8 flex justify-center gap-8 md:gap-16">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className={`flex items-center gap-3 ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {step > s ? <Check className="w-4 h-4" /> : s}
                                        </div>
                                        <span className="hidden md:block font-medium text-sm text-gray-900">
                                            {s === 1 ? 'Select Offering' : s === 2 ? 'Intention' : 'Confirm'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-3xl shadow-xl border border-indigo-50 overflow-hidden">
                                <div className="p-6 md:p-10">

                                    {/* STEP 1: SELECT MASS TYPE */}
                                    {step === 1 && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">Choose Offering Type</h2>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {massTypes.map((mass) => (
                                                    <button
                                                        key={mass.id}
                                                        onClick={() => setSelectedMass(mass)}
                                                        className={`relative p-1 rounded-3xl transition-all duration-300 group text-left h-full ${selectedMass?.id === mass.id ? 'ring-4 ring-indigo-100 scale-[1.02]' : 'hover:scale-[1.01]'
                                                            }`}
                                                    >
                                                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${mass.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                                                        <div className={`relative bg-white rounded-[20px] p-6 h-full border-2 transition-colors ${selectedMass?.id === mass.id ? 'border-transparent' : 'border-slate-100'
                                                            }`}>
                                                            {mass.popular && (
                                                                <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                                                                    Popular
                                                                </span>
                                                            )}
                                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mass.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                                                                <mass.icon className="w-6 h-6" />
                                                            </div>
                                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{mass.name}</h3>
                                                            <p className="text-sm text-gray-500 mb-4 h-10">{mass.description}</p>
                                                            <div className="flex flex-wrap gap-2 mb-6">
                                                                {mass.features.map(f => (
                                                                    <span key={f} className="text-[10px] px-2 py-1 bg-slate-50 rounded-md text-slate-600 font-medium">
                                                                        {f}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                                                <span className="text-xs font-medium text-slate-400">Offering</span>
                                                                <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${mass.color}`}>
                                                                    ${mass.price / 100}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {selectedMass?.id === mass.id && (
                                                            <div className="absolute inset-0 rounded-3xl border-2 border-indigo-500 pointer-events-none" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex justify-end mt-8">
                                                <button
                                                    onClick={() => selectedMass && setStep(2)}
                                                    disabled={!selectedMass}
                                                    className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: INTENTION DETAILS */}
                                    {step === 2 && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                            <div className="flex items-center gap-4 mb-8">
                                                <button onClick={() => setStep(1)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
                                                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                                                </button>
                                                <h2 className="text-2xl font-serif font-bold text-gray-900">Intention Details</h2>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mass Intention Type</label>
                                                        <select
                                                            value={intentionType}
                                                            onChange={(e) => setIntentionType(e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                                                        >
                                                            <option value="">Select Intention...</option>
                                                            {intentionTypes.map((t) => (
                                                                <option key={t} value={t}>{t}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">For Whom?</label>
                                                        <input
                                                            type="text"
                                                            value={intentionFor}
                                                            onChange={(e) => setIntentionFor(e.target.value)}
                                                            placeholder="Name (e.g. John Doe)"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Requested By</label>
                                                        <input
                                                            type="text"
                                                            value={requestedBy}
                                                            onChange={(e) => setRequestedBy(e.target.value)}
                                                            placeholder="Your Name"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email for Digital Card</label>
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="you@email.com"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date (Optional)</label>
                                                        <input
                                                            type="date"
                                                            value={preferredDate}
                                                            onChange={(e) => setPreferredDate(e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                        <p className="text-[10px] text-gray-400 mt-1">Based on availability.</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Special Notes</label>
                                                        <textarea
                                                            value={notes}
                                                            onChange={(e) => setNotes(e.target.value)}
                                                            rows={2}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Any specific requests..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-4 mt-8">
                                                <button
                                                    onClick={() => setStep(3)}
                                                    disabled={!intentionType || !intentionFor || !email}
                                                    className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: CONFIRM & PAY */}
                                    {step === 3 && selectedMass && (
                                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                            <div className="flex items-center gap-4 mb-8">
                                                <button onClick={() => setStep(2)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
                                                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                                                </button>
                                                <h2 className="text-2xl font-serif font-bold text-gray-900">Confirm Offering</h2>
                                            </div>

                                            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 mb-6">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex gap-4">
                                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedMass.color} flex items-center justify-center text-white shadow-lg`}>
                                                            <selectedMass.icon className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-lg">{selectedMass.name}</h3>
                                                            <p className="text-indigo-600 font-medium">For {intentionFor}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-gray-900">${selectedMass.price / 100}</div>
                                                        <div className="text-xs text-gray-500">Stipend</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm border-t border-indigo-100 pt-4">
                                                    <div>
                                                        <span className="block text-gray-500 text-xs uppercase tracking-wider">Type</span>
                                                        <span className="font-medium text-gray-900">{intentionType}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 text-xs uppercase tracking-wider">Requested By</span>
                                                        <span className="font-medium text-gray-900">{requestedBy || 'Anonymous'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {showPayPal ? (
                                                <div className="animate-fade-in">
                                                    <PayPalCheckout
                                                        amount={selectedMass.price}
                                                        description={`Mass Offering: ${selectedMass.name} for ${intentionFor}`}
                                                        onSuccess={processOrder}
                                                        onError={() => alert('Payment failed')}
                                                    />
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                    className={`w-full py-4 text-white font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${isSubmitting ? 'bg-gray-400' : `bg-gradient-to-r ${selectedMass.color}`
                                                        }`}
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Heart className="w-5 h-5 fill-white/20" />
                                                            <span>Complete Offering</span>
                                                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-amber-800 text-xs">
                                                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                                <p>
                                                    Mass offerings (stipends) are a voluntary contribution to support the clergy and the church.
                                                    They are not a purchase of God's grace, which is free.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden text-center p-12"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Offering Received</h2>
                            <p className="text-gray-600 mb-8">
                                Thank you. Your Mass intention has been recorded and will be offered by our partner priests. A confirmation card has been sent to your email.
                            </p>
                            <button
                                onClick={() => { setHasSuccess(false); setStep(1); setSelectedMass(null); setShowPayPal(false); }}
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition"
                            >
                                Request Another
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
