'use client';

import { useState, useEffect, useMemo } from 'react';
import { getActiveCandles, prayForCandle } from '@/app/actions/spiritual';
import { CandleHero } from '@/components/candles/CandleHero';
import { CandleStats } from '@/components/candles/CandleStats';
import { CandleCreationModal } from '@/components/candles/CandleCreationModal';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Heart, Clock, Crown, Star, Sparkles } from 'lucide-react';
import Image from 'next/image';

// Candle tier types
type CandleTier = 'free' | 'basic' | 'standard' | 'premium';

interface Candle {
    id: string;
    userName: string;
    intention: string;
    remainingHours: number;
    prayerCount: number;
    tier: CandleTier;
    litAt: string;
    duration: string;
}

// Tier configuration - Spiritual progression to encourage upgrades
const TIER_CONFIG: Record<string, { label: string; days: number; color: string; icon: any; badge: string; image: string; tierLabel: string; spiritualMessage: string }> = {
    '30_days': {
        label: 'Divine Cathedral',
        days: 30,
        color: 'from-amber-500 to-yellow-600',
        icon: Crown,
        badge: '🕊️ Heavenly',
        image: '/images/candles/divine.png',
        tierLabel: 'Premium',
        spiritualMessage: 'Your prayer ascends to Heaven'
    },
    '14_days': {
        label: 'Blessed Marian',
        days: 14,
        color: 'from-blue-400 to-blue-600',
        icon: Crown,
        badge: '✨ Blessed',
        image: '/images/candles/marian_glow.png',
        tierLabel: 'Premium',
        spiritualMessage: 'Under Our Lady\'s protection'
    },
    '7_days': {
        label: 'Sacred Altar',
        days: 7,
        color: 'from-amber-300 to-amber-500',
        icon: Star,
        badge: '⛪ Sacred',
        image: '/images/candles/altar.png',
        tierLabel: 'Premium',
        spiritualMessage: 'Carried to the altar of God'
    },
    '3_days': {
        label: 'Devotion Votive',
        days: 3,
        color: 'from-red-400 to-red-600',
        icon: Sparkles,
        badge: '',
        image: '/images/candles/devotion_glow.png',
        tierLabel: 'Standard',
        spiritualMessage: 'A sincere offering'
    },
    '1_day': {
        label: 'Humble Prayer',
        days: 1,
        color: 'from-gray-400 to-gray-500',
        icon: Flame,
        badge: '',
        image: '/images/candles/humble.png',
        tierLabel: 'Free',
        spiritualMessage: 'A simple prayer'
    },
};

// Candle Card Component
function CandleCard({ candle, onPray }: { candle: Candle; onPray: (id: string) => void }) {
    const [justPrayed, setJustPrayed] = useState(false);

    let configKey = '1_day';
    if (candle.duration === 'THIRTY_DAYS') configKey = '30_days';
    else if (candle.duration === 'FOURTEEN_DAYS') configKey = '14_days';
    else if (candle.duration === 'SEVEN_DAYS') configKey = '7_days';
    else if (candle.duration === 'THREE_DAYS') configKey = '3_days';

    const tierConfig = TIER_CONFIG[configKey];
    const isPremium = ['THIRTY_DAYS', 'FOURTEEN_DAYS', 'SEVEN_DAYS'].includes(candle.duration);

    const handlePray = () => {
        setJustPrayed(true);
        onPray(candle.id);
        setTimeout(() => setJustPrayed(false), 2000);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl group ${isPremium ? 'shadow-amber-900/20' : ''
                }`}
        >
            {/* Image Area */}
            <div className={`relative aspect-[3/4] w-full bg-black flex items-end justify-center overflow-hidden`}>
                {/* Glow behind candle for Premium */}
                {isPremium && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-[60px] animate-pulse" />
                )}

                <Image
                    src={tierConfig.image}
                    alt={tierConfig.label}
                    fill
                    className={`object-contain transition-transform duration-700 group-hover:scale-105 mix-blend-screen ${candle.duration === 'THIRTY_DAYS' ? 'p-0 scale-110' : 'p-4'
                        }`}
                    sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Additional Sparkles for Royal */}
                {candle.duration === 'THIRTY_DAYS' && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-200/10 rounded-full blur-xl mix-blend-screen"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, delay: i, repeat: Infinity }}
                            />
                        ))}
                    </div>
                )}

                {/* Badge */}
                {tierConfig.badge && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-[10px] font-bold text-white rounded shadow-lg uppercase tracking-wider z-10">
                        {tierConfig.badge}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-4 relative">
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isPremium ? 'text-amber-500' : 'text-neutral-400'
                        }`}>
                        {tierConfig.tierLabel}
                    </span>
                    <div className="flex items-center gap-1 text-neutral-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{candle.remainingHours}h left</span>
                    </div>
                </div>

                {/* Spiritual Message */}
                <p className={`text-xs mb-2 ${isPremium ? 'text-amber-400/80' : 'text-neutral-500'}`}>
                    ✞ {tierConfig.spiritualMessage}
                </p>

                <p className="text-gray-300 font-serif text-sm italic leading-relaxed line-clamp-2 mb-4">
                    "{candle.intention}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                    <span className="text-xs text-neutral-500 font-medium">{candle.userName}</span>
                    <button
                        onClick={handlePray}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${justPrayed
                            ? 'bg-rose-900/30 text-rose-500'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                            }`}
                    >
                        <Heart className={`w-3.5 h-3.5 ${justPrayed ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{candle.prayerCount + (justPrayed ? 1 : 0)}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// Main Page
export default function CandlesPage() {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

    useEffect(() => {
        const fetchCandles = async () => {
            try {
                const data = await getActiveCandles();
                const mapped: Candle[] = data.map(c => {
                    const expiresAt = new Date(c.expiresAt);
                    const now = new Date();
                    const hours = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));

                    return {
                        id: c.id,
                        userName: c.isAnonymous ? 'Anonymous' : (c.name || 'Prayer Warrior'),
                        intention: c.intention,
                        remainingHours: hours,
                        prayerCount: c.prayerCount || 0,
                        tier: 'basic',
                        litAt: new Date(c.litAt).toISOString(),
                        duration: c.duration
                    };
                });
                setCandles(mapped);
            } catch (err) {
                console.error('Failed to load candles', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCandles();
    }, []);

    // Grouping
    const groupedCandles = useMemo(() => ({
        royal: candles.filter(c => c.duration === 'THIRTY_DAYS'),
        premium: candles.filter(c => c.duration === 'FOURTEEN_DAYS'),
        taper: candles.filter(c => c.duration === 'SEVEN_DAYS'),
        votive: candles.filter(c => c.duration === 'THREE_DAYS'),
        tealight: candles.filter(c => c.duration === 'ONE_DAY'),
    }), [candles]);

    const totalPrayers = candles.reduce((sum, c) => sum + c.prayerCount, 0);

    return (
        <div className="min-h-screen bg-black text-gray-100 selection:bg-amber-500/30">
            {/* Header / Hero */}
            <div className="relative border-b border-neutral-800 bg-neutral-950 pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 border border-amber-800/50 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <Flame className="w-3.5 h-3.5" />
                        Sacred Light
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-2xl">
                        Light a Virtual Candle
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
                        Join our community of prayer. Light a candle to represent your intentions and let the light of faith shine before the Lord.
                    </p>

                    <button
                        onClick={() => setIsCreationModalOpen(true)}
                        className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                    >
                        <Flame className="w-5 h-5 fill-white" />
                        Light Your Candle
                    </button>

                    <div className="mt-12 flex justify-center gap-8 text-sm font-medium text-neutral-500">
                        <div>
                            <span className="block text-2xl font-bold text-white mb-1">{totalPrayers.toLocaleString()}</span>
                            Prayers Offered
                        </div>
                        <div className="w-px h-12 bg-neutral-800" />
                        <div>
                            <span className="block text-2xl font-bold text-white mb-1">{candles.length}</span>
                            Active Candles
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 space-y-20">
                <SmartAdSlot page="candles" position="top" />

                {/* 30-Day Royal Section */}
                {groupedCandles.royal.length > 0 && (
                    <section>
                        <div className="flex flex-col items-center justify-center gap-2 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700" />
                                <h2 className="text-2xl font-serif text-amber-500">🕊️ Divine Cathedral Candles</h2>
                                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700" />
                            </div>
                            <p className="text-amber-400/60 text-sm">Angels carry your prayers to Heaven</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {groupedCandles.royal.slice(0, 10).map(c => <CandleCard key={c.id} candle={c} onPray={() => { }} />)}
                        </div>
                        {groupedCandles.royal.length > 10 && (
                            <p className="text-center text-amber-400/60 mt-4 text-sm">+ {groupedCandles.royal.length - 10} more candles burning</p>
                        )}
                    </section>
                )}

                {/* 14-Day Premium Section */}
                {groupedCandles.premium.length > 0 && (
                    <section>
                        <div className="flex flex-col items-center justify-center gap-2 mb-10">
                            <h2 className="text-2xl font-serif text-blue-300">✨ Blessed Marian Candles</h2>
                            <p className="text-blue-400/60 text-sm">Under Our Lady of Guadalupe's protection</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {groupedCandles.premium.slice(0, 10).map(c => <CandleCard key={c.id} candle={c} onPray={() => { }} />)}
                        </div>
                        {groupedCandles.premium.length > 10 && (
                            <p className="text-center text-blue-400/60 mt-4 text-sm">+ {groupedCandles.premium.length - 10} more candles burning</p>
                        )}
                    </section>
                )}

                {/* 7-Day Taper Section */}
                {groupedCandles.taper.length > 0 && (
                    <section>
                        <div className="flex flex-col items-center justify-center gap-2 mb-10">
                            <h2 className="text-2xl font-serif text-amber-100/80">⛪ Sacred Altar Candles</h2>
                            <p className="text-neutral-400 text-sm">Presented before the Lord at His altar</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {groupedCandles.taper.slice(0, 10).map(c => <CandleCard key={c.id} candle={c} onPray={() => { }} />)}
                        </div>
                        {groupedCandles.taper.length > 10 && (
                            <p className="text-center text-amber-100/60 mt-4 text-sm">+ {groupedCandles.taper.length - 10} more candles burning</p>
                        )}
                    </section>
                )}

                {/* 3-Day Devotion Section */}
                {groupedCandles.votive.length > 0 && (
                    <section>
                        <div className="flex flex-col items-center justify-center gap-2 mb-10">
                            <h2 className="text-2xl font-serif text-red-300">✞ Devotion Votive Candles</h2>
                            <p className="text-red-400/60 text-sm">A sincere offering of faith</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {groupedCandles.votive.slice(0, 10).map(c => <CandleCard key={c.id} candle={c} onPray={() => { }} />)}
                        </div>
                        {groupedCandles.votive.length > 10 && (
                            <p className="text-center text-red-400/60 mt-4 text-sm">+ {groupedCandles.votive.length - 10} more candles burning</p>
                        )}
                    </section>
                )}

                {/* 1-Day Free Section */}
                {groupedCandles.tealight.length > 0 && (
                    <section>
                        <div className="flex flex-col items-center justify-center gap-2 mb-10">
                            <h2 className="text-2xl font-serif text-neutral-400">🕯️ Humble Prayer Candles</h2>
                            <p className="text-neutral-500 text-sm">A simple prayer for today</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {groupedCandles.tealight.slice(0, 10).map(c => <CandleCard key={c.id} candle={c} onPray={() => { }} />)}
                        </div>
                        {groupedCandles.tealight.length > 10 && (
                            <p className="text-center text-neutral-400/60 mt-4 text-sm">+ {groupedCandles.tealight.length - 10} more candles burning</p>
                        )}
                    </section>
                )}
            </div>

            <CandleCreationModal
                isOpen={isCreationModalOpen}
                onClose={() => setIsCreationModalOpen(false)}
                onSuccess={() => window.location.reload()}
            />

            {/* Floating Action Button for Mobile/Quick Access */}
            <AnimatePresence>
                {!isCreationModalOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsCreationModalOpen(true)}
                        className="fixed bottom-24 right-6 z-40 p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] border-2 border-white/20 flex items-center gap-2 group"
                    >
                        <Flame className="w-6 h-6 fill-white animate-pulse" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap font-bold">
                            Light Candle
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

        </div>
    );
}
