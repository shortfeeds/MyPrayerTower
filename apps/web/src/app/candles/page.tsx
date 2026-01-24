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
    country?: string;
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

                // If no candles from DB, use sample data
                if (mapped.length === 0) {
                    const sampleCandles: Candle[] = [
                        // 30-day Divine Cathedral
                        { id: 'sample-1', userName: 'Maria S.', intention: 'For my mother\'s healing from cancer', remainingHours: 720, prayerCount: 342, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'US' },
                        { id: 'sample-2', userName: 'Anonymous', intention: 'Thanksgiving for answered prayers', remainingHours: 650, prayerCount: 289, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'MX' },

                        // 14-day Blessed Marian
                        { id: 'sample-3', userName: 'John M.', intention: 'Guidance for my family during difficult times', remainingHours: 310, prayerCount: 156, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'CA' },
                        { id: 'sample-4', userName: 'Sarah K.', intention: 'For peace in our troubled world', remainingHours: 280, prayerCount: 198, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'GB' },

                        // 7-day Sacred Altar
                        { id: 'sample-6', userName: 'Anonymous', intention: 'Blessings for my new job', remainingHours: 120, prayerCount: 64, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                        { id: 'sample-7', userName: 'Emily W.', intention: 'For the souls in purgatory', remainingHours: 98, prayerCount: 112, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },

                        // 3-day Devotion Votive
                        { id: 'sample-8', userName: 'Michael P.', intention: 'Help with finding employment', remainingHours: 65, prayerCount: 43, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                        { id: 'sample-9', userName: 'Lisa T.', intention: 'For my father\'s surgery tomorrow', remainingHours: 58, prayerCount: 71, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                        { id: 'sample-10', userName: 'Anonymous', intention: 'Strength to overcome addiction', remainingHours: 49, prayerCount: 56, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                        { id: 'sample-11', userName: 'Robert H.', intention: 'For my daughter\'s safe delivery', remainingHours: 38, prayerCount: 92, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },

                        // 1-day Humble Prayer
                        { id: 'sample-12', userName: 'Grace L.', intention: 'Today\'s challenges at work', remainingHours: 18, prayerCount: 12, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                        { id: 'sample-13', userName: 'Thomas A.', intention: 'For those suffering today', remainingHours: 15, prayerCount: 28, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                        { id: 'sample-14', userName: 'Anonymous', intention: 'Gratitude for this beautiful day', remainingHours: 12, prayerCount: 19, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                        { id: 'sample-15', userName: 'Patricia B.', intention: 'Peace in my heart', remainingHours: 8, prayerCount: 34, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                        { id: 'sample-16', userName: 'James C.', intention: 'Help with an important decision', remainingHours: 6, prayerCount: 15, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    ];
                    setCandles(sampleCandles);
                } else {
                    setCandles(mapped);
                }
            } catch (err) {
                console.error('Failed to load candles', err);
                // On error, still load sample data
                // On error, still load sample data
                const sampleCandles: Candle[] = [
                    // Royal (30 Days) - 10 items
                    { id: 's-r1', userName: 'Maria S.', intention: 'For my mother\'s healing', remainingHours: 720, prayerCount: 342, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'US' },
                    { id: 's-r2', userName: 'Joseph B.', intention: 'Thanksgiving for answered prayers', remainingHours: 650, prayerCount: 289, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'MX' },
                    { id: 's-r3', userName: 'Sarah L.', intention: 'For peace in the world', remainingHours: 500, prayerCount: 450, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'CA' },
                    { id: 's-r4', userName: 'Anonymous', intention: 'Special intention', remainingHours: 400, prayerCount: 120, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },
                    { id: 's-r5', userName: 'Elena G.', intention: 'For my family\'s conversion', remainingHours: 350, prayerCount: 210, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'ES' },
                    { id: 's-r6', userName: 'Michael K.', intention: 'For the souls in Purgatory', remainingHours: 300, prayerCount: 180, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'PL' },
                    { id: 's-r7', userName: 'Clara D.', intention: 'Vocations to the priesthood', remainingHours: 250, prayerCount: 300, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'PH' },
                    { id: 's-r8', userName: 'Anonymous', intention: 'Healing of past wounds', remainingHours: 200, prayerCount: 150, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },
                    { id: 's-r9', userName: 'David M.', intention: 'For the sick and suffering', remainingHours: 150, prayerCount: 220, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'IE' },
                    { id: 's-r10', userName: 'Anne W.', intention: 'Protection for my children', remainingHours: 100, prayerCount: 410, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'GB' },

                    // Premium (14 Days) - 10 items
                    { id: 's-p1', userName: 'John M.', intention: 'Guidance for my family', remainingHours: 310, prayerCount: 156, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'CA' },
                    { id: 's-p2', userName: 'Peter R.', intention: 'For a safe journey', remainingHours: 300, prayerCount: 90, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'US' },
                    { id: 's-p3', userName: 'Lucia F.', intention: 'Success in exams', remainingHours: 280, prayerCount: 110, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'IT' },
                    { id: 's-p4', userName: 'Anonymous', intention: 'Financial breakthrough', remainingHours: 260, prayerCount: 85, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-p5', userName: 'Mark T.', intention: 'For my wife\'s pregnancy', remainingHours: 240, prayerCount: 130, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'AU' },
                    { id: 's-p6', userName: 'Sophie H.', intention: 'Strength in difficult times', remainingHours: 220, prayerCount: 145, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'DE' },
                    { id: 's-p7', userName: 'Carlos R.', intention: 'For my parents health', remainingHours: 200, prayerCount: 160, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'BR' },
                    { id: 's-p8', userName: 'Anonymous', intention: 'For a private intention', remainingHours: 180, prayerCount: 75, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-p9', userName: 'Rebecca N.', intention: 'For clarity and wisdom', remainingHours: 160, prayerCount: 115, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'NZ' },
                    { id: 's-p10', userName: 'James P.', intention: 'Thanksgiving for blessings', remainingHours: 140, prayerCount: 200, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'US' },

                    // Taper (7 Days) - 10 items
                    { id: 's-t1', userName: 'David R.', intention: 'For my son\'s safe return', remainingHours: 145, prayerCount: 87, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS', country: 'US' },
                    { id: 's-t2', userName: 'Emily W.', intention: 'For the lonely', remainingHours: 140, prayerCount: 60, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS', country: 'GB' },
                    { id: 's-t3', userName: 'Anonymous', intention: 'Forgiveness of sins', remainingHours: 135, prayerCount: 95, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-t4', userName: 'Francis C.', intention: 'Blessings on our home', remainingHours: 130, prayerCount: 70, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS', country: 'FR' },
                    { id: 's-t5', userName: 'Agnes K.', intention: 'For the elderly', remainingHours: 125, prayerCount: 105, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS', country: 'PL' },
                    { id: 's-t6', userName: 'Thomas J.', intention: 'Healing from addiction', remainingHours: 120, prayerCount: 140, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS', country: 'US' },
                    { id: 's-t7', userName: 'Anonymous', intention: 'Work situation', remainingHours: 115, prayerCount: 55, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-t8', userName: 'Sofia M.', intention: 'For my marriage', remainingHours: 110, prayerCount: 112, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS', country: 'AR' },
                    { id: 's-t9', userName: 'Leo B.', intention: 'Peace of mind', remainingHours: 105, prayerCount: 88, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS', country: 'BE' },
                    { id: 's-t10', userName: 'Catherine P.', intention: 'For a sick friend', remainingHours: 100, prayerCount: 134, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS', country: 'IE' },

                    // Votive (3 Days) - 10 items
                    { id: 's-v1', userName: 'Michael P.', intention: 'Help with employment', remainingHours: 65, prayerCount: 43, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v2', userName: 'Lisa T.', intention: 'Surgery recovery', remainingHours: 60, prayerCount: 30, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v3', userName: 'Anonymous', intention: 'Guidance', remainingHours: 55, prayerCount: 25, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v4', userName: 'Robert H.', intention: 'Safe travel', remainingHours: 50, prayerCount: 40, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v5', userName: 'Patricia M.', intention: 'For my children', remainingHours: 45, prayerCount: 60, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v6', userName: 'Kevin D.', intention: 'Study help', remainingHours: 40, prayerCount: 15, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v7', userName: 'Anonymous', intention: 'Thank you Lord', remainingHours: 35, prayerCount: 50, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v8', userName: 'Sandra K.', intention: 'Healing', remainingHours: 30, prayerCount: 22, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v9', userName: 'Tom W.', intention: 'New job', remainingHours: 25, prayerCount: 35, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v10', userName: 'Laura B.', intention: 'Family peace', remainingHours: 20, prayerCount: 48, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },

                    // Tealight (1 Day) - 10 items
                    { id: 's-tl1', userName: 'Grace L.', intention: 'Today\'s challenges', remainingHours: 18, prayerCount: 12, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl2', userName: 'James C.', intention: 'Strength', remainingHours: 16, prayerCount: 8, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl3', userName: 'Anonymous', intention: 'Peace', remainingHours: 14, prayerCount: 15, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl4', userName: 'Linda S.', intention: 'Hope', remainingHours: 12, prayerCount: 10, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl5', userName: 'Paul R.', intention: 'Healing', remainingHours: 10, prayerCount: 20, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl6', userName: 'Karen M.', intention: 'Guidance', remainingHours: 8, prayerCount: 5, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl7', userName: 'Anonymous', intention: 'Thanks', remainingHours: 6, prayerCount: 18, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl8', userName: 'Betty A.', intention: 'Love', remainingHours: 4, prayerCount: 25, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl9', userName: 'Daniel O.', intention: 'Faith', remainingHours: 2, prayerCount: 30, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-tl10', userName: 'Susan P.', intention: 'Mercy', remainingHours: 1, prayerCount: 40, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                ];
                setCandles(sampleCandles);
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
