'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, MapPin, BookOpen, Heart, Crown, Minus, Plus, Type, Gift, X, Euro } from 'lucide-react';
import Link from 'next/link';
import { MassOfferingCTA } from '@/components/giving/MassOfferingCTA';
import { ShareButtons } from '@/components/social/ShareButtons';
import { SmartAdSlot } from '@/components/ads';
import { PayPalCheckout } from '@/components/PayPalCheckout';
import { motion, AnimatePresence } from 'framer-motion';
import { SACRED_COPY } from '@/lib/sacred-copy';

// ... imports

interface Saint {
    id: string;
    name: string;
    slug: string | null;
    title: string | null;
    feastMonth: number | null;
    feastDayOfMonth: number | null;
    feastDay: string | null;
    bornDate: string | null;
    diedDate: string | null;
    biography: string | null;
    shortBio: string | null;
    patronOf: string[] | null;
    imageUrl: string | null;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TEXT_SIZES = [
    { label: 'S', class: 'text-base leading-relaxed' },
    { label: 'M', class: 'text-lg leading-relaxed' },
    { label: 'L', class: 'text-xl leading-loose' },
    { label: 'XL', class: 'text-2xl leading-loose' },
];

export function SaintProfile({ saint }: { saint: Saint }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showMassModal, setShowMassModal] = useState(false);
    const [amount, setAmount] = useState(15);
    const [intention, setIntention] = useState(`In honor of ${saint.name}`);

    // const [textSizeIndex, setTextSizeIndex] = useState(1); // Removed for density reduction

    // Sacred Pause State
    const [isSacredPausing, setIsSacredPausing] = useState(false);
    const [stillnessStage, setStillnessStage] = useState<'lifting' | 'offered'>('lifting');

    const handleIntercession = async () => {
        setIsSacredPausing(true);
        setStillnessStage('lifting');

        // 1. LIFTING (2.5s)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // 2. OFFERED (2s)
        setStillnessStage('offered');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Close
        setIsSacredPausing(false);
        // Optional: Scroll to prayer or show a gentle toast?
        // For now, the experience concludes with the "Offered" state fading out.
    };

    useEffect(() => {
        // Load saved preference
        const saved = localStorage.getItem('mpt-text-size');
        if (saved) setTextSizeIndex(parseInt(saved, 10) || 1);
    }, []);

    const handleTextSize = (delta: number) => {
        const newIndex = Math.max(0, Math.min(TEXT_SIZES.length - 1, textSizeIndex + delta));
        setTextSizeIndex(newIndex);
        localStorage.setItem('mpt-text-size', String(newIndex));
    };

    const feastDate = saint.feastMonth && saint.feastDayOfMonth
        ? `${MONTHS[saint.feastMonth - 1]} ${saint.feastDayOfMonth}`
        : saint.feastDay;

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
            {/* Premium Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-20 w-64 h-64 bg-yellow-300 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-20 w-80 h-80 bg-rose-400 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 pt-28 pb-20 px-4">
                    <div className="container mx-auto">
                        <Link href="/saints" className="inline-flex items-center gap-2 text-amber-100 hover:text-white mb-8 transition-colors group">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Saints
                        </Link>

                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Saint Image */}
                            <div className="w-40 h-40 lg:w-48 lg:h-48 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-2xl flex-shrink-0">
                                {saint.imageUrl ? (
                                    <img src={saint.imageUrl} alt={saint.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Crown className="w-20 h-20 text-white/60" />
                                )}
                            </div>

                            <div className="flex-1">
                                <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-3">{saint.name}</h1>
                                {saint.title && (
                                    <p className="text-xl text-amber-100 mb-4">{saint.title}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-6 text-amber-100">
                                    {feastDate && (
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                                            <Calendar className="w-4 h-4 text-amber-100" />
                                            <span className="font-semibold text-white">Feast: {feastDate}</span>
                                        </div>
                                    )}
                                    {(saint.bornDate || saint.diedDate) && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            <span>{saint.bornDate || '?'} - {saint.diedDate || '?'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 flex-shrink-0">
                                <button
                                    onClick={handleIntercession}
                                    className="px-6 py-3 bg-white text-amber-900 font-serif font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                                    <span>{SACRED_COPY.saints.prayWith}</span>
                                </button>
                                <button
                                    onClick={() => setShowMassModal(true)}
                                    className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2"
                                >
                                    <Gift className="w-5 h-5" />
                                    <span className="hidden sm:inline">Offer Mass</span>
                                </button>
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`p-4 rounded-2xl transition-all shadow-lg ${isFavorite ? 'bg-white text-rose-500' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20'}`}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-rose-500' : ''}`} />
                                </button>
                                <ShareButtons
                                    url={typeof window !== 'undefined' ? window.location.href : `https://myprayertower.com/saints/${saint.slug}`}
                                    title={saint.name}
                                    description={`Learn about ${saint.name}, ${saint.title || 'Saint'} - Patron of ${saint.patronOf?.join(', ') || 'the faithful'}`}
                                    variant="compact"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-4">
                <SmartAdSlot page="saints" position="top" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Text Size Controls Removed for Density Reduction */}

                        {/* Biography */}
                        {(saint.biography || saint.shortBio) && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <BookOpen className="w-6 h-6 text-amber-500" />
                                    Biography
                                </h2>
                                <div className={`text-gray-700 whitespace-pre-line text-lg leading-relaxed`}>
                                    {saint.biography || saint.shortBio}
                                </div>
                            </div>
                        )}

                        {/* Default Prayer */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200/50">
                            <h2 className="text-2xl font-serif font-bold text-amber-800 mb-6">🙏 Prayer to {saint.name}</h2>
                            <p className="text-amber-900/80 italic text-lg leading-relaxed font-serif">
                                O glorious {saint.name}, through your intercession may we grow in virtue and faith.
                                Help us to follow your holy example and to lead lives worthy of our calling.
                                Pray for us that we may persevere in our journey toward eternal life. Amen.
                            </p>
                        </div>

                        {/* End of Content Ad */}
                        <SmartAdSlot page="saints" position="inline" />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Patron Of */}
                        {saint.patronOf && saint.patronOf.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">Patron Saint Of</h3>
                                <div className="flex flex-wrap gap-2">
                                    {saint.patronOf.map((patron: string, i: number) => (
                                        <span key={i} className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium">
                                            {patron}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Facts */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Facts</h3>
                            <dl className="space-y-4">
                                {feastDate && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Feast Day</dt>
                                        <dd className="font-semibold text-gray-900">{feastDate}</dd>
                                    </div>
                                )}
                                {saint.bornDate && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Born</dt>
                                        <dd className="font-semibold text-gray-900">{saint.bornDate}</dd>
                                    </div>
                                )}
                                {saint.diedDate && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Died</dt>
                                        <dd className="font-semibold text-gray-900">{saint.diedDate}</dd>
                                    </div>
                                )}
                                {saint.title && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Title</dt>
                                        <dd className="font-semibold text-gray-900">{saint.title}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Mass Offering CTA */}
                        <MassOfferingCTA
                            variant="sidebar"
                            context="saint"
                            intentionFor={`In honor of ${saint.name}`}
                        />

                        {/* Sidebar Ad */}
                        <SmartAdSlot page="saints" position="sidebar" />
                    </div>
                </div>
            </div>

            {/* Mass Offering Modal */}
            {showMassModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative">
                            <button
                                onClick={() => setShowMassModal(false)}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Gift className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold">Offer a Mass</h3>
                            </div>
                            <p className="text-amber-100 text-sm">
                                Have a Mass said for your intention or in memory/honor of a loved one.
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Intention Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mass Intention
                                </label>
                                <textarea
                                    value={intention}
                                    onChange={(e) => setIntention(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none bg-gray-50 font-medium"
                                    rows={3}
                                />
                            </div>

                            {/* Offering Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Offering Amount
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[10, 15, 25].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setAmount(amt)}
                                            className={`py-2 px-3 rounded-xl border-2 font-semibold transition-all ${amount === amt
                                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                : 'border-gray-100 hover:border-amber-200 text-gray-600'
                                                }`}
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PayPal Checkout */}
                            <div className="pt-2">
                                <PayPalCheckout
                                    amount={amount * 100} // Convert to cents
                                    description={`Mass Offering: ${intention}`}
                                    onSuccess={(details) => {
                                        alert('Thank you! Your Mass offering has been received.');
                                        setShowMassModal(false);
                                    }}
                                />
                                <p className="text-xs text-center text-gray-400 mt-3">
                                    Secure payment via PayPal. 100% goes to the mission.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sacred Pause Overlay */}
            <AnimatePresence>
                {isSacredPausing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md"
                    >
                        <div className="text-center p-8 max-w-md">
                            {stillnessStage === 'lifting' ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                                        <Heart className="w-10 h-10 text-rose-500 animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                                        {SACRED_COPY.saints.intercession}
                                    </h3>
                                    <p className="text-gray-500 font-medium">
                                        Asking {saint.name} to pray with you...
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                                        <Crown className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                                        United in Prayer
                                    </h3>
                                    <p className="text-gray-500 font-medium">
                                        Your intention is lifted up.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
