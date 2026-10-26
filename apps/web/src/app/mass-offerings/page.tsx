'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, Cross, Heart, Calendar, Users, Check, Loader2, Info, Sparkles, ShieldCheck, Church, Share2, Copy, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { SACRED_COPY } from '@/lib/sacred-copy';
import { useAppMode } from '@/contexts/AppModeContext';
import { trackHubAction } from '@/lib/analytics';
import { submitMassOffering } from '@/app/actions/spiritual';
import { SacredCertificate } from '@/components/certificates/SacredCertificate';
import { CertificateModal } from '@/components/certificates/CertificateModal';

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
    // popular?: boolean; // Removed for reverence
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
        // popular: true, // Removed for reverence
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
        description: '30 consecutive uninterrupted Masses for a departed soul',
        price: 20000,
        color: 'from-purple-500 to-violet-600',
        icon: ShieldCheck,
        features: ['Pope St. Gregory Tradition', '30 Consecutive Days', 'For Departed Souls', 'Full Digital Certificate']
    },
    {
        id: 'perpetual',
        name: 'Perpetual Enrollment',
        description: 'Permanent daily prayer inclusion in Holy Masses forever',
        price: 10000,
        color: 'from-amber-400 to-orange-500',
        icon: Users,
        features: ['Enrolled Forever', 'Daily Holy Mass', 'Living or Deceased', 'Perpetual Digital Parchment']
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

function MassOfferingSearchParamsHandler({
    onIntentionFound
}: {
    onIntentionFound: (intention: string) => void;
}) {
    const searchParams = useSearchParams();
    const intention = searchParams.get('intention');

    useEffect(() => {
        if (intention) {
            onIntentionFound(intention);
        }
    }, [intention, onIntentionFound]);

    return null;
}

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
    const [copied, setCopied] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);

    const handleIntentionFound = useCallback((intention: string) => {
        setSelectedMass(massTypes[0]); // Default to Single Mass ($10)
        setIntentionType('Special Intention');
        setIntentionFor(intention);
        setNotes(`Intention from prayer: ${intention}`);
        setStep(2); // Directly jump to step 2 so user sees intention pre-populated
    }, []);

    // Sacred Pause State
    const [isSacredPausing, setIsSacredPausing] = useState(false);
    const [stillnessStage, setStillnessStage] = useState<'lifting' | 'offered'>('lifting');

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
        setIsSacredPausing(true);
        setStillnessStage('lifting');

        try {
            // SACRED PAUSE: Reflective delay before API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const res = await submitMassOffering({
                offeringTypeId: selectedMass?.id || 'single',
                intentionFor,
                intentionType,
                requestedBy,
                email,
                notes,
            });

            // Store in localStorage for "My Sacred Vigils" portal
            try {
                const existing = JSON.parse(localStorage.getItem('mpt_user_mass_offerings') || '[]');
                const newRecord = {
                    id: (res.success && res.massOfferingId) ? res.massOfferingId : `mass_${Date.now()}`,
                    orderNumber: (res.success && res.orderNumber) ? res.orderNumber : `MPT-${Math.floor(100000 + Math.random() * 900000)}`,
                    intentionFor: intentionFor.trim(),
                    offeringType: selectedMass?.name || 'Single Mass',
                    requestedBy: requestedBy.trim() || 'Faithful Soul',
                    submittedAt: new Date().toISOString(),
                    status: 'SCHEDULED'
                };
                localStorage.setItem('mpt_user_mass_offerings', JSON.stringify([newRecord, ...existing]));
            } catch {
                // Ignore storage issues in private window
            }

            // SACRED PAUSE: Assurance stage
            setStillnessStage('offered');
            await new Promise(resolve => setTimeout(resolve, 1500));

            setHasSuccess(true);
            trackHubAction('mass_offering_success', 'Revenue');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Mass offering error:', error);
            setIsSacredPausing(false);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedMass, intentionFor, intentionType, requestedBy, email, notes]);

    const { isNativeApp } = useAppMode();

    return (
        <div className={`min-h-screen font-sans ${isNativeApp ? 'bg-[#0a0612]' : 'bg-slate-50'}`}>
            {/* Immersive Header */}
            <div className={`relative pb-32 overflow-hidden ${isNativeApp ? 'bg-[#120821]' : 'bg-indigo-900 text-white'}`}>
                <div className="absolute inset-0 bg-[url('/images/mass-hero.jpg')] bg-cover bg-center opacity-20 transform scale-105" />
                <div className={`absolute inset-0 ${isNativeApp ? 'bg-gradient-to-b from-[#120821]/40 via-[#120821]/80 to-[#0a0612]' : 'bg-gradient-to-b from-indigo-900/40 via-indigo-900/80 to-slate-50'}`} />

                <div className="container mx-auto px-4 pt-8 md:pt-16 relative z-10 text-center">
                    <Link href={isNativeApp ? "/app" : "/"} className={`inline-flex items-center gap-2 mb-8 transition-colors ${isNativeApp ? 'text-[#d4af37] active:scale-95' : 'text-indigo-200 hover:text-white'}`}>
                        <ChevronLeft className="w-4 h-4" /> {isNativeApp ? "Back to Sanctuary" : "Back to Home"}
                    </Link>
                    <div className="flex flex-col items-center justify-center gap-4 mb-4">
                      <div className={`p-3 rounded-2xl ${isNativeApp ? 'bg-[#d4af37]/20 shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'bg-white/10'}`}>
                        <Church className={`w-8 h-8 ${isNativeApp ? 'text-[#d4af37]' : 'text-white'}`} />
                      </div>
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-serif font-black mb-4 drop-shadow-xl ${isNativeApp ? 'text-white' : 'text-white'}`}>
                      {SACRED_COPY.massPage?.title || "Holy Mass Intentions"}
                    </h1>
                    <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isNativeApp ? 'text-white/60' : 'text-indigo-100'}`}>
                      {SACRED_COPY.massPage?.subtitle || "Have a Holy Mass offered for your intentions, loved ones, or in thanksgiving."}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
                <Suspense fallback={null}>
                    <MassOfferingSearchParamsHandler onIntentionFound={handleIntentionFound} />
                </Suspense>

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
                                                            {/* Popular badge removed for reverence */}
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

                                            {/* Gregorian Tradition & Perpetual Memorial Banner */}
                                            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200/80 text-left">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                                                        <ShieldCheck className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-serif font-bold text-gray-900 text-sm md:text-base">
                                                            ☩ About Gregorian Masses (30 Consecutive Days)
                                                        </h4>
                                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                            Originating from Pope St. Gregory the Great in the 6th Century, a series of 30 uninterrupted daily Masses is the most solemn and efficacious spiritual sacrifice the Church offers for the release of a departed soul from Purgatory into Heavenly glory. You receive an official digital commemorative certificate upon scheduling.
                                                        </p>
                                                    </div>
                                                </div>
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

                                            {/* Humble Process Steps - Added for Refinement */}
                                            <div className="mt-16 pt-12 border-t border-gray-100">
                                                <h3 className="text-center font-serif font-bold text-gray-900 mb-8">How it Works</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                    {SACRED_COPY.massOfferings.process.map((p, i) => (
                                                        <div key={i} className="flex flex-col items-center text-center">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-serif font-bold mb-3">
                                                                {p.step}
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{p.label}</h4>
                                                            <p className="text-xs text-gray-500 max-w-[120px]">{p.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
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

                                            {notes.startsWith('Intention from prayer:') && (
                                                <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3 text-sm text-indigo-950">
                                                    <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                                                    <div>
                                                        <p className="font-semibold text-indigo-900">Your prayer intention has been carried forward to the altar.</p>
                                                        <p className="text-xs text-indigo-700">Single Holy Mass ($10) pre-selected. Please provide your details below.</p>
                                                    </div>
                                                </div>
                                            )}

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

                            {/* Sacred Pause Overlay */}
                            {isSacredPausing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md"
                                >
                                    <div className="text-center p-6">
                                        {stillnessStage === 'lifting' ? (
                                            <>
                                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse mx-auto">
                                                    <Heart className="w-8 h-8 text-indigo-600" />
                                                </div>
                                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                                                    Receiving your offering...
                                                </h3>
                                                <p className="text-gray-500 font-medium">
                                                    Entrusting your intention to the Lord.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 scale-110 transition-transform mx-auto">
                                                    <Check className="w-8 h-8 text-green-600" />
                                                </div>
                                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                                                    Offering Received
                                                </h3>
                                                <p className="text-gray-500 font-medium">
                                                    Your Mass intention has been recorded.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-xl mx-auto space-y-6"
                        >
                            {/* Sacred Consecration Certificate (Renaissance / Papal Layout) */}
                            <div className="relative group cursor-pointer" onClick={() => setIsCertModalOpen(true)}>
                                <SacredCertificate
                                    type="mass-offering"
                                    theme="cathedral-gold"
                                    title="HOLY MASS OFFERING CERTIFICATE"
                                    latinTitle="Sacrificium Sanctissimum Missae"
                                    recipientName={intentionFor || 'Special Intention'}
                                    donorName={requestedBy || 'Faithful Soul'}
                                    dedicatedDetail={`${selectedMass?.name || 'Single Mass'} • Offertory Sacrifice`}
                                    intention={notes || `Holy Mass requested for ${intentionFor}`}
                                    celebrantOrSanctuary="Sanctuary of Perpetual Adoration & Sacred Altars"
                                />
                                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xl flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Click to Customize &amp; Download High-Res
                                    </span>
                                </div>
                            </div>

                            {/* Social Sharing & Action Bar */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col gap-3">
                                <p className="text-xs text-gray-500 font-serif italic text-center">
                                    Your offering has been recorded. Save your commemorative memorabilia or share with family:
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCertModalOpen(true)}
                                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download Certificate (PNG)</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsCertModalOpen(true)}
                                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span>Share Memorabilia</span>
                                    </button>

                                    <a
                                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                            `🍷 A Holy Mass has been requested on MyPrayerTower for this intention: "${intentionFor}". May God bless and protect you. \n\n📱 Free app: https://www.myprayertower.com/app \nJoin Telegram: https://t.me/myprayertower`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                                        title="Share on WhatsApp"
                                    >
                                        <span>💬</span>
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const copyMsg = `🍷 A Holy Mass has been requested on MyPrayerTower for this intention: "${intentionFor}". \n\n📱 Free app: https://www.myprayertower.com/app \nJoin Telegram: https://t.me/myprayertower`;
                                            navigator.clipboard.writeText(copyMsg);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2500);
                                        }}
                                        className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                                        title="Copy Message"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                    <Link
                                        href="/my-vigils"
                                        className="w-full sm:w-auto text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                    >
                                        <span>🕯️</span>
                                        <span>View in My Sacred Vigils</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHasSuccess(false);
                                            setStep(1);
                                            setSelectedMass(null);
                                            setShowPayPal(false);
                                        }}
                                        className="w-full sm:w-auto text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium transition-all"
                                    >
                                        Request Another Mass
                                    </button>
                                </div>
                            </div>

                            {/* Fullscreen High-Resolution Certificate Modal with Theme Switcher */}
                            <CertificateModal
                                isOpen={isCertModalOpen}
                                onClose={() => setIsCertModalOpen(false)}
                                type="mass-offering"
                                title="HOLY MASS OFFERING CERTIFICATE"
                                latinTitle="Sacrificium Sanctissimum Missae"
                                recipientName={intentionFor || 'Special Intention'}
                                donorName={requestedBy || 'Faithful Soul'}
                                dedicatedDetail={`${selectedMass?.name || 'Single Mass'} • Offertory Sacrifice`}
                                intention={notes || `Holy Mass requested for ${intentionFor}`}
                                celebrantOrSanctuary="Sanctuary of Perpetual Adoration & Sacred Altars"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Structured Data for LLMs */}
            <Script
                id="schema-mass-offerings"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        name: 'Holy Mass Offerings',
                        provider: {
                            '@type': 'Organization',
                            name: 'MyPrayerTower'
                        },
                        description: 'Request a Holy Mass intention online for a living or deceased person, thanksgiving, or special intentions.',
                        offers: massTypes.map(m => ({
                            '@type': 'Offer',
                            name: m.name,
                            description: m.description,
                            price: m.price / 100,
                            priceCurrency: 'USD'
                        }))
                    })
                }}
            />
        </div>
    );
}
