'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getActiveCandles, prayForCandle, getPublicCandleStats } from '@/app/actions/spiritual';
import { CandleHero } from '@/components/candles/CandleHero';
import { CandleStats } from '@/components/candles/CandleStats';
import { CandleCreationModal } from '@/components/candles/CandleCreationModal';
import { DigitalVotiveCardModal } from '@/components/candles/DigitalVotiveCardModal';
import { TabernacleLampBanner } from '@/components/candles/TabernacleLampBanner';
import { PrayerCompletionModal } from '@/components/prayer/PrayerCompletionModal';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Heart, Clock, Crown, Star, Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useAppMode } from '@/contexts/AppModeContext';
import { trackHubAction } from '@/lib/analytics';
import Script from 'next/script';

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

                <img
                    src={tierConfig.image}
                    alt={tierConfig.label}
                    className={`absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 mix-blend-screen ${candle.duration === 'THIRTY_DAYS' ? 'p-0 scale-110' : 'p-4'
                        }`}
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

function CandleSearchParamsHandler({ onIntentionFound }: { onIntentionFound: (intention: string) => void }) {
    const searchParams = useSearchParams();
    const intention = searchParams.get('intention');

    useEffect(() => {
        if (intention) {
            onIntentionFound(intention);
        }
    }, [intention, onIntentionFound]);

    return null;
}

// Main Page
export default function CandlesPage() {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [activeCount, setActiveCount] = useState(0);
    const [livePrayersOffered, setLivePrayersOffered] = useState(3831);
    const [liveActiveCandles, setLiveActiveCandles] = useState(3140);
    const [loading, setLoading] = useState(true);
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [prefilledIntention, setPrefilledIntention] = useState<string>('');
    const [showKeepsakeCard, setShowKeepsakeCard] = useState(false);
    const [completedIntention, setCompletedIntention] = useState('');
    const [prayerCompleteOpen, setPrayerCompleteOpen] = useState(false);
    const { isNativeApp } = useAppMode();

    const handleIntentionFound = useCallback((intention: string) => {
        setPrefilledIntention(intention);
        setIsCreationModalOpen(true);
    }, []);

    // Live smart fluctuation for prayers offered (3800 - 5600) and active candles (2800 - 4200)
    useEffect(() => {
        const prayerInterval = setInterval(() => {
            setLivePrayersOffered(prev => {
                const delta = Math.floor(Math.random() * 7) - 2; // -2 to +4
                let next = prev + delta;
                if (next < 3800) next = 3800 + Math.floor(Math.random() * 25);
                if (next > 5600) next = 5600 - Math.floor(Math.random() * 25);
                return next;
            });
        }, 3200);

        const candleInterval = setInterval(() => {
            setLiveActiveCandles(prev => {
                const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
                let next = prev + delta;
                if (next < 2800) next = 2800 + Math.floor(Math.random() * 20);
                if (next > 4200) next = 4200 - Math.floor(Math.random() * 20);
                return next;
            });
        }, 4200);

        return () => {
            clearInterval(prayerInterval);
            clearInterval(candleInterval);
        };
    }, []);

    const fetchCandles = useCallback(async () => {
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
                    // 30-day Divine Cathedral (+3 more as requested)
                    { id: 'sample-1', userName: 'Maria S.', intention: 'For my mother\'s healing from cancer', remainingHours: 720, prayerCount: 342, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'US' },
                    { id: 'sample-2', userName: 'Anonymous', intention: 'Thanksgiving for answered prayers', remainingHours: 650, prayerCount: 289, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'MX' },
                    { id: 'sample-1c', userName: 'Elena R.', intention: 'For the souls of my departed grandparents', remainingHours: 710, prayerCount: 156, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'IT' },
                    { id: 'sample-2c', userName: 'Joseph K.', intention: 'Blessing for our new parish building', remainingHours: 690, prayerCount: 204, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'PH' },
                    { id: 'sample-3c', userName: 'Anonymous', intention: 'For the global return to faith', remainingHours: 680, prayerCount: 188, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },
                    { id: 'sample-4c', userName: 'Theresa L.', intention: 'In honor of the Sacred Heart', remainingHours: 720, prayerCount: 95, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },
                    { id: 'sample-5c', userName: 'Anonymous', intention: 'For all holy priests', remainingHours: 715, prayerCount: 42, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },
                    { id: 'sample-6c', userName: 'Mark A.', intention: 'Preparation for my pilgrimage', remainingHours: 705, prayerCount: 77, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },

                    // 14-day Blessed Marian (+8 more as requested)
                    { id: 'sample-3', userName: 'John M.', intention: 'Guidance for my family during difficult times', remainingHours: 310, prayerCount: 156, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'CA' },
                    { id: 'sample-4', userName: 'Sarah K.', intention: 'For peace in our troubled world', remainingHours: 280, prayerCount: 198, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'GB' },
                    { id: 's-m-1', userName: 'Catherine B.', intention: 'Under Mary\'s mantle for my children', remainingHours: 330, prayerCount: 45, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'IE' },
                    { id: 's-m-2', userName: 'Anonymous', intention: 'To overcome my current anxiety', remainingHours: 320, prayerCount: 67, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-3', userName: 'Paul S.', intention: 'For a successful surgery next week', remainingHours: 315, prayerCount: 32, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'US' },
                    { id: 's-m-4', userName: 'Mary L.', intention: 'In honor of the Immaculate Heart', remainingHours: 300, prayerCount: 89, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'PT' },
                    { id: 's-m-5', userName: 'Anonymous', intention: 'For the conversion of my spouse', remainingHours: 290, prayerCount: 54, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-6', userName: 'Robert T.', intention: 'Safe travel for my daughter', remainingHours: 270, prayerCount: 23, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'AU' },
                    { id: 's-m-7', userName: 'Sofia G.', intention: 'For all expectant mothers', remainingHours: 260, prayerCount: 112, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'AR' },
                    { id: 's-m-8', userName: 'Anonymous', intention: 'Gratitude for graces received', remainingHours: 250, prayerCount: 76, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-9', userName: 'Lucas P.', intention: 'Protection of the Holy Souls', remainingHours: 336, prayerCount: 12, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-10', userName: 'Anonymous', intention: 'For the souls in purgatory', remainingHours: 330, prayerCount: 45, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-11', userName: 'Maria F.', intention: 'To find my lost faith', remainingHours: 320, prayerCount: 28, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-12', userName: 'Anonymous', intention: 'Financial stability', remainingHours: 310, prayerCount: 56, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-13', userName: 'Peter G.', intention: 'For my godchildren', remainingHours: 300, prayerCount: 19, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-14', userName: 'Anonymous', intention: 'Health of my parents', remainingHours: 290, prayerCount: 88, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-15', userName: 'Sofia T.', intention: 'Unity in our family', remainingHours: 280, prayerCount: 34, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
                    { id: 's-m-16', userName: 'Anonymous', intention: 'For a special intention', remainingHours: 270, prayerCount: 12, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },

                    // 7-day Sacred Altar (+8 more as requested)
                    { id: 'sample-6', userName: 'Anonymous', intention: 'Blessings for my new job', remainingHours: 120, prayerCount: 64, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 'sample-7', userName: 'Emily W.', intention: 'For the souls in purgatory', remainingHours: 98, prayerCount: 112, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-1', userName: 'Mark D.', intention: 'In reparation for sins', remainingHours: 160, prayerCount: 22, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-2', userName: 'Anne P.', intention: 'For my godchildren\'s faith', remainingHours: 155, prayerCount: 34, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-3', userName: 'Anonymous', intention: 'For the holy souls of priests', remainingHours: 150, prayerCount: 56, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-4', userName: 'Francis X.', intention: 'Success of the local mission', remainingHours: 145, prayerCount: 18, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-5', userName: 'Teresa M.', intention: 'For the terminally ill', remainingHours: 140, prayerCount: 92, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-6', userName: 'Anonymous', intention: 'For the Unity of the Church', remainingHours: 130, prayerCount: 41, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-7', userName: 'Benedict L.', intention: 'For holy vocations', remainingHours: 125, prayerCount: 120, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-8', userName: 'Anonymous', intention: 'Internal peace and clarity', remainingHours: 110, prayerCount: 15, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-9', userName: 'Leticia V.', intention: 'For the conversion of sailors', remainingHours: 168, prayerCount: 45, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
                    { id: 's-a-10', userName: 'Anonymous', intention: 'For the unborn babies', remainingHours: 165, prayerCount: 230, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },

                    // 3-day Devotion Votive
                    { id: 'sample-8', userName: 'Michael P.', intention: 'Help with finding employment', remainingHours: 65, prayerCount: 43, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v-1', userName: 'Grace K.', intention: 'For inner peace and strength', remainingHours: 70, prayerCount: 28, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v-2', userName: 'David L.', intention: 'Family reconciliation', remainingHours: 60, prayerCount: 35, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v-3', userName: 'Anonymous', intention: 'Gratitude for healing', remainingHours: 55, prayerCount: 50, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v-4', userName: 'Angela M.', intention: 'For someone who has strayed', remainingHours: 48, prayerCount: 19, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
                    { id: 's-v-5', userName: 'Anonymous', intention: 'Hope during trials', remainingHours: 36, prayerCount: 62, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },

                    // 1-day Humble Prayer
                    { id: 'sample-16', userName: 'James C.', intention: 'Help with an important decision', remainingHours: 6, prayerCount: 15, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new1', userName: 'Anna K.', intention: 'Strength for today', remainingHours: 20, prayerCount: 8, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new2', userName: 'Anonymous', intention: 'Mercy', remainingHours: 19, prayerCount: 12, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new3', userName: 'Paul D.', intention: 'Healing for my friend', remainingHours: 17, prayerCount: 22, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new4', userName: 'Anonymous', intention: 'Hope', remainingHours: 14, prayerCount: 9, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new5', userName: 'Lucas M.', intention: 'Guidance', remainingHours: 11, prayerCount: 14, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new6', userName: 'Anonymous', intention: 'Patience', remainingHours: 9, prayerCount: 18, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new7', userName: 'Emma S.', intention: 'Joy', remainingHours: 7, prayerCount: 25, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new8', userName: 'Anonymous', intention: 'Clarity', remainingHours: 5, prayerCount: 11, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new9', userName: 'John F.', intention: 'Faith', remainingHours: 3, prayerCount: 30, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                    { id: 's-h-new10', userName: 'Anonymous', intention: 'Love', remainingHours: 1, prayerCount: 42, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
                ];
                setCandles(sampleCandles);
            } else {
                setCandles(mapped);
            }
        } catch (err) {
            console.error('Failed to load candles', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandles();
        // Auto-pilot live refresh every 45 seconds so newly lit candles show without manual refresh
        const interval = setInterval(fetchCandles, 45000);
        return () => clearInterval(interval);
    }, [fetchCandles]);

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
            setLivePrayersOffered(prev => Math.min(5600, prev + 1));
            await prayForCandle(candleId);
        } catch (error) {
            console.error('Prayer failed:', error);
            // Revert on failure if needed, but for prayer counts usually fine to ignore
        }
    };

    return (
        <div className={`min-h-screen bg-black text-gray-100 selection:bg-amber-500/30 font-sans ${isNativeApp ? 'bg-[#0a0612]' : ''}`}>
            {/* Header / Hero */}
            <div className={`relative border-b border-neutral-800 pt-24 pb-16 overflow-hidden ${isNativeApp ? 'bg-[#120821]' : 'bg-neutral-950'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Link href={isNativeApp ? "/app" : "/"} className={`inline-flex items-center gap-2 mb-8 transition-colors ${isNativeApp ? 'text-[#d4af37] active:scale-95' : 'text-neutral-400 hover:text-white'}`}>
                        <ChevronLeft className="w-4 h-4" /> {isNativeApp ? "Back to Sanctuary" : "Back to Home"}
                    </Link>
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
                        <div className="text-center min-w-[120px]">
                            <span className="block text-2xl font-bold text-white mb-1 transition-all duration-300">
                                {livePrayersOffered.toLocaleString()}
                            </span>
                            Prayers Offered
                        </div>
                        <div className="w-px h-12 bg-neutral-800" />
                        <div className="text-center min-w-[120px]">
                            <span className="block text-2xl font-bold text-white mb-1 transition-all duration-300">
                                {liveActiveCandles.toLocaleString()}
                            </span>
                            Active Candles
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 space-y-16">
                <SmartAdSlot page="candles" position="top" />

                {/* Perpetual Altar Tabernacle Lamp Banner */}
                <TabernacleLampBanner />

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

            <Suspense fallback={null}>
                <CandleSearchParamsHandler onIntentionFound={handleIntentionFound} />
            </Suspense>

            <CandleCreationModal
                isOpen={isCreationModalOpen}
                initialIntention={prefilledIntention}
                onClose={() => {
                    setIsCreationModalOpen(false);
                    fetchCandles();
                }}
                onSuccess={() => {
                    trackHubAction('candle_lit_success', 'Revenue');
                    setCompletedIntention(prefilledIntention || 'Special Intention');
                    setShowKeepsakeCard(true);
                    fetchCandles();
                }}
            />

            {/* Sacred Votive Keepsake & Viral Share Certificate */}
            <DigitalVotiveCardModal
                isOpen={showKeepsakeCard}
                onClose={() => {
                    setShowKeepsakeCard(false);
                    fetchCandles();
                }}
                prayerTitle={completedIntention || 'Special Intention'}
                prayerUrl="https://www.myprayertower.com/candles"
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

            {/* Structured Data for LLMs */}
            <Script
                id="schema-candles"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        name: 'Virtual Prayer Candles',
                        provider: {
                            '@type': 'Organization',
                            name: 'MyPrayerTower'
                        },
                        description: 'Light a virtual candle for your prayer intentions. Your candle will burn brightly for the global Catholic community to see and join in prayer.',
                        offers: [
                            { '@type': 'Offer', name: 'Divine Cathedral (30 Days)', price: '0', priceCurrency: 'USD' },
                            { '@type': 'Offer', name: 'Blessed Marian (14 Days)', price: '0', priceCurrency: 'USD' },
                            { '@type': 'Offer', name: 'Sacred Altar (7 Days)', price: '0', priceCurrency: 'USD' },
                            { '@type': 'Offer', name: 'Devotion Votive (3 Days)', price: '0', priceCurrency: 'USD' },
                            { '@type': 'Offer', name: 'Humble Prayer (1 Day)', price: '0', priceCurrency: 'USD' }
                        ]
                    })
                }}
            />
        </div>
    );
}
