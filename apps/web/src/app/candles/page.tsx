'use client';

import { useState, useEffect, useMemo } from 'react';
import { getActiveCandles, prayForCandle, getPublicCandleStats } from '@/app/actions/spiritual';
import { CandleHero } from '@/components/candles/CandleHero';
import { CandleStats } from '@/components/candles/CandleStats';
import { CandleCreationModal } from '@/components/candles/CandleCreationModal';
import { PrayerCompletionModal } from '@/components/prayer/PrayerCompletionModal';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Heart, Clock, Crown, Star, Sparkles } from 'lucide-react';
import Image from 'next/image';

import { TIER_CONFIG, SAMPLE_CANDLES, Candle, CandleTier } from '@/components/candles/CandleData';

// Candle Card Component
function CandleCard({ candle, onPray }: { candle: Candle; onPray: (id: string) => void }) {
    const [justPrayed, setJustPrayed] = useState(false);

    let configKey = '1_day';
    if (candle.duration === 'THIRTY_DAYS') configKey = '30_days';
    else if (candle.duration === 'FOURTEEN_DAYS') configKey = '14_days';
    else if (candle.duration === 'SEVEN_DAYS') configKey = '7_days';
    else if (candle.duration === 'THREE_DAYS') configKey = '3_days';

    const tierConfig = TIER_CONFIG[configKey];
    if (!tierConfig) return null;

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
    const [activeCount, setActiveCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [prayerCompleteOpen, setPrayerCompleteOpen] = useState(false);

    useEffect(() => {
        const fetchCandles = async () => {
            try {
                // Fetch stats and candles in parallel
                const [candlesData, stats] = await Promise.all([
                    getActiveCandles(),
                    getPublicCandleStats()
                ]);

                setActiveCount(stats.activeCount);

                const mapped: Candle[] = candlesData.map(c => {
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
                        duration: c.duration,
                        country: c.country || undefined
                    };
                });

                // Use sample data combined with real if available
                if (mapped.length === 0) {
                    setCandles(SAMPLE_CANDLES);
                } else {
                    setCandles(mapped);
                }
            } catch (err) {
                console.error('Failed to load candles', err);
                setCandles(SAMPLE_CANDLES);
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

    const handlePrayForCandle = async (candleId: string) => {
        try {
            // Optimistic update
            setCandles(prev => prev.map(c =>
                c.id === candleId
                    ? { ...c, prayerCount: c.prayerCount + 1 }
                    : c
            ));

            // Show completion modal
            setPrayerCompleteOpen(true);

            // Server action (fire and forget mostly, or log error if fails)
            await prayForCandle(candleId);
        } catch (error) {
            console.error('Prayer failed:', error);
            // Revert on failure if needed, but for prayer counts usually fine to ignore
        }
    };

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
                            <span className="block text-2xl font-bold text-white mb-1">{activeCount > 0 ? activeCount.toLocaleString() : candles.length}</span>
                            Active Candles
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 space-y-20">
                <SmartAdSlot page="candles" position="top" />

                {/* Iterating all tiers relative to their importance/order */}
                {Object.entries(TIER_CONFIG).sort((a, b) => {
                    const order = ['30_days', '14_days', '7_days', '3_days', '1_day'];
                    return order.indexOf(a[0]) - order.indexOf(b[0]);
                }).map(([key, config]) => {
                    // Map tiers to the grouping keys used in state
                    let groupKey: keyof typeof groupedCandles | undefined;
                    if (key === '30_days') groupKey = 'royal';
                    else if (key === '14_days') groupKey = 'premium';
                    else if (key === '7_days') groupKey = 'taper';
                    else if (key === '3_days') groupKey = 'votive';
                    else if (key === '1_day') groupKey = 'tealight';

                    const candlesInTier = groupKey ? groupedCandles[groupKey] : [];

                    return (
                        <section key={key}>
                            <div className="flex flex-col items-center justify-center gap-2 mb-10">
                                <div className="flex items-center gap-4">
                                    {key === '30_days' && <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700" />}
                                    <h2 className={`text-2xl font-serif ${config.color.includes('amber') ? 'text-amber-500' :
                                        config.color.includes('blue') ? 'text-blue-300' :
                                            config.color.includes('red') ? 'text-red-300' : 'text-neutral-400'
                                        }`}>
                                        {config.badge ? `${config.badge} ` : '🕯️ '}
                                        {config.label} Candles
                                    </h2>
                                    {key === '30_days' && <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700" />}
                                </div>
                                <p className="text-neutral-500 text-sm">
                                    {config.spiritualMessage}
                                </p>
                            </div>

                            {candlesInTier.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {candlesInTier.slice(0, 10).map(c => <CandleCard key={c.id} candle={c} onPray={handlePrayForCandle} />)}
                                    </div>
                                    {candlesInTier.length > 10 && (
                                        <p className="text-center text-neutral-600 mt-4 text-sm">+ {candlesInTier.length - 10} more candles burning</p>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/50">
                                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 opacity-50">
                                        <Flame className="w-8 h-8 text-neutral-600" />
                                    </div>
                                    <p className="text-neutral-400 font-medium mb-2">No {config.tierLabel.toLowerCase()} candles burning yet</p>
                                    <button
                                        onClick={() => setIsCreationModalOpen(true)}
                                        className="text-sm text-amber-500 hover:text-amber-400 underline decoration-amber-500/30 underline-offset-4"
                                    >
                                        Be the first to light one
                                    </button>
                                </div>
                            )}
                        </section>
                    );
                })}
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

            {/* Universal Prayer Completion Modal */}
            <PrayerCompletionModal
                isOpen={prayerCompleteOpen}
                onClose={() => setPrayerCompleteOpen(false)}
            />

        </div>
    );
}
