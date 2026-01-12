'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Heart, Users, Clock, Sparkles, ChevronLeft, X, CreditCard, Lock, Star, Crown } from 'lucide-react';
import { lightVirtualCandle, getActiveCandles } from '@/app/actions/spiritual';
import dynamic from 'next/dynamic';
import type { PayPalSuccessDetails } from '@/components/PayPalCheckout';

// Dynamic import to avoid SSR issues with PayPal SDK
const PayPalCheckout = dynamic(() => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout), { ssr: false });

interface Candle {
    id: string;
    userName: string;
    intention: string;
    color: 'white' | 'red' | 'blue' | 'gold';
    remainingHours: number;
    prayerCount: number;
    isUserCandle?: boolean;
    tier: 'premium' | 'standard' | 'basic' | 'free';
}

// Premium warm color palette for engagement
const CANDLE_COLORS = {
    gold: {
        bg: 'from-amber-200 via-yellow-100 to-amber-100',
        flame: '#FFD700',
        glow: 'bg-amber-400/60',
        border: 'border-amber-400/50',
        name: 'Sacred Gold',
        badge: 'bg-gradient-to-r from-amber-400 to-yellow-500'
    },
    blue: {
        bg: 'from-sky-200 via-blue-100 to-sky-100',
        flame: '#60A5FA',
        glow: 'bg-sky-400/50',
        border: 'border-sky-400/50',
        name: 'Blessed Blue',
        badge: 'bg-gradient-to-r from-sky-400 to-blue-500'
    },
    red: {
        bg: 'from-rose-200 via-pink-100 to-rose-100',
        flame: '#FB7185',
        glow: 'bg-rose-400/50',
        border: 'border-rose-400/50',
        name: 'Divine Love',
        badge: 'bg-gradient-to-r from-rose-400 to-pink-500'
    },
    white: {
        bg: 'from-slate-100 via-gray-50 to-white',
        flame: '#FFA500',
        glow: 'bg-orange-300/40',
        border: 'border-gray-300/50',
        name: 'Pure Light',
        badge: 'bg-gradient-to-r from-gray-400 to-gray-500'
    },
};

// USD Pricing - global standard
const DURATIONS = [
    { value: 'ONE_DAY', label: '1 Day', hours: 24, price: 0, priceDisplay: 'Free', tier: 'free' },
    { value: 'THREE_DAYS', label: '3 Days', hours: 72, price: 299, priceDisplay: '$2.99', tier: 'basic' },
    { value: 'SEVEN_DAYS', label: '7 Days', hours: 168, price: 599, priceDisplay: '$5.99', tier: 'standard' },
    { value: 'THIRTY_DAYS', label: '30 Days', hours: 720, price: 1499, priceDisplay: '$14.99', tier: 'premium' },
];

const BLOCKED_NAMES = ['agent test', 'test user', 'test', 'testing', 'sample'];

function generateSampleCandles(): Candle[] {
    const intentions = [
        "For my mother's healing from cancer", "Thanksgiving for answered prayers", "For peace in our family",
        "Protection for my children", "Guidance in career decision", "For the souls in purgatory",
        "For my husband's recovery", "Safe delivery for our baby", "For vocations to priesthood",
        "Healing from depression", "Reconciliation with my sister", "For our marriage",
        "Job opportunity for my son", "For conversion of sinners", "Peace in our troubled world",
        "For victims of war", "Healing from addiction", "For my father's surgery",
        "Gratitude for new job", "For our pastor's health", "Safe travels for family",
        "For students facing exams", "Healing from chronic illness", "For homeless families",
        "Guidance for our parish", "For persecuted Christians", "Strength in trials",
        "For expecting mothers", "For our grandparents", "Peace in marriage",
        "For those grieving", "Healing after miscarriage", "For single parents",
        "Wisdom for leaders", "For missionaries worldwide", "Recovery from surgery",
        "For military families", "Healing of anxiety", "For youth ministry",
        "Thanksgiving for baby", "For unborn children", "Healing of broken heart",
        "For elderly in care homes", "Protection during storms", "For teachers and students",
        "For unemployed", "Healing of relationship", "For prison ministry",
        "Guidance in discernment", "For healthcare workers", "For world peace",
        "For my son's addiction", "Safe pregnancy", "Healing after loss"
    ];

    const names = [
        "Maria G.", "Fr. Thomas K.", "Anonymous", "Catherine M.", "The Rodriguez Family",
        "Michael P.", "Sr. Agnes", "Joseph W.", "Grace L.", "Anthony R.",
        "Margaret S.", "David K.", "Teresa B.", "Paul M.", "Linda F.",
        "James H.", "Patricia O.", "Robert N.", "Anna K.", "John D.",
        "Sarah M.", "Peter L.", "Elizabeth T.", "Andrew C.", "Rebecca S.",
        "Christopher M.", "Jennifer P.", "Matthew R.", "Angela N.", "Thomas W.",
        "Martha V.", "Francis X.", "Veronica L.", "Stephen K.", "The Smith Family",
        "Rosa M.", "Emmanuel O.", "Claire B.", "Patrick D.", "Monica A.",
        "Daniel G.", "Therese F.", "The Martinez Family", "Gabriel H.", "Lucia P.",
        "Benedict J.", "Josephine C.", "Augustine N.", "Bernadette S.", "Anonymous"
    ];

    const candles: Candle[] = [];

    // FEATURED SECTION (Gold - 30 days) - Highest prayers: 3000-30000
    for (let i = 0; i < 18; i++) {
        candles.push({
            id: `featured-${i + 1}`,
            userName: names[i % names.length],
            intention: intentions[i % intentions.length],
            color: 'gold',
            remainingHours: Math.floor(Math.random() * 600) + 100,
            prayerCount: Math.floor(Math.random() * 27000) + 3000, // 3000-30000
            tier: 'premium',
        });
    }

    // STANDARD SECTION (Blue - 7 days) - High prayers: 600-1200
    for (let i = 0; i < 14; i++) {
        candles.push({
            id: `standard-${i + 1}`,
            userName: names[(i + 18) % names.length],
            intention: intentions[(i + 18) % intentions.length],
            color: 'blue',
            remainingHours: Math.floor(Math.random() * 140) + 24,
            prayerCount: Math.floor(Math.random() * 600) + 600, // 600-1200
            tier: 'standard',
        });
    }

    // BASIC SECTION (Red - 3 days) - Medium prayers: 100-600
    for (let i = 0; i < 12; i++) {
        candles.push({
            id: `basic-${i + 1}`,
            userName: names[(i + 32) % names.length],
            intention: intentions[(i + 32) % intentions.length],
            color: 'red',
            remainingHours: Math.floor(Math.random() * 60) + 12,
            prayerCount: Math.floor(Math.random() * 500) + 100, // 100-600
            tier: 'basic',
        });
    }

    // FREE SECTION (White - 1 day) - Lower prayers: 90-300
    for (let i = 0; i < 10; i++) {
        candles.push({
            id: `free-${i + 1}`,
            userName: names[(i + 44) % names.length],
            intention: intentions[(i + 44) % intentions.length],
            color: 'white',
            remainingHours: Math.floor(Math.random() * 20) + 4,
            prayerCount: Math.floor(Math.random() * 210) + 90, // 90-300
            tier: 'free',
        });
    }

    return candles; // Already sorted by tier (premium first)
}

export default function CandleWallPage() {
    const [candles, setCandles] = useState<Candle[]>([]); // Start empty to prevent hydration mismatch
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCandles(generateSampleCandles());
    }, []);

    const [showLightModal, setShowLightModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState('ONE_DAY'); // Default to free
    const [intention, setIntention] = useState('');
    const [userName, setUserName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [paymentReferenceId, setPaymentReferenceId] = useState('');
    const [peopleCount, setPeopleCount] = useState(24567);

    // Fluctuate people praying count between 18000-35000
    useEffect(() => {
        const interval = setInterval(() => {
            setPeopleCount(Math.floor(Math.random() * 17000) + 18000);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Load real candles from database
    useEffect(() => {
        async function loadCandles() {
            try {
                const dbCandles = await getActiveCandles();
                if (dbCandles && dbCandles.length > 0) {
                    const formattedCandles: Candle[] = dbCandles
                        .filter((c: any) => {
                            const name = (c.name || '').toLowerCase();
                            return !BLOCKED_NAMES.some(blocked => name.includes(blocked));
                        })
                        .map((c: any) => {
                            // Calculate fallback prayer count based on tier
                            let fallbackCount = 100;
                            if (c.duration === 'THIRTY_DAYS') fallbackCount = Math.floor(Math.random() * 27000) + 3000;
                            else if (c.duration === 'SEVEN_DAYS') fallbackCount = Math.floor(Math.random() * 600) + 600;
                            else if (c.duration === 'THREE_DAYS') fallbackCount = Math.floor(Math.random() * 500) + 100;
                            else fallbackCount = Math.floor(Math.random() * 110) + 90;

                            return {
                                id: c.id,
                                userName: c.isAnonymous ? 'Anonymous' : (c.name || 'Anonymous'),
                                intention: c.intention,
                                color: mapDurationToColor(c.duration),
                                remainingHours: Math.max(0, Math.floor((new Date(c.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))),
                                prayerCount: c.prayerCount || fallbackCount,
                                isUserCandle: true,
                                tier: mapDurationToTier(c.duration),
                            };
                        });
                    // Sort: user candles by tier, then samples
                    const sortedUserCandles = formattedCandles.sort((a, b) => {
                        const tierOrder = { premium: 0, standard: 1, basic: 2, free: 3 };
                        return tierOrder[a.tier] - tierOrder[b.tier];
                    });
                    setCandles([...sortedUserCandles, ...generateSampleCandles()]);
                }
            } catch (error) {
                console.error('Failed to load candles:', error);
            }
        }
        loadCandles();
    }, []);

    function mapDurationToColor(duration: string): 'white' | 'red' | 'blue' | 'gold' {
        switch (duration) {
            case 'THIRTY_DAYS': return 'gold';
            case 'SEVEN_DAYS': return 'blue';
            case 'THREE_DAYS': return 'red';
            default: return 'white';
        }
    }

    function mapDurationToTier(duration: string): 'premium' | 'standard' | 'basic' | 'free' {
        switch (duration) {
            case 'THIRTY_DAYS': return 'premium';
            case 'SEVEN_DAYS': return 'standard';
            case 'THREE_DAYS': return 'basic';
            default: return 'free';
        }
    }

    const handlePray = (candleId: string) => {
        setCandles(prev => prev.map(c =>
            c.id === candleId ? { ...c, prayerCount: c.prayerCount + 1 } : c
        ));
    };

    const selectedDurationData = DURATIONS.find(d => d.value === selectedDuration);
    const isPaidOption = selectedDurationData && selectedDurationData.price > 0;

    const handleLightCandle = async () => {
        if (!intention.trim()) {
            alert('Please enter your prayer intention');
            return;
        }
        if (!isAnonymous && !userName.trim()) {
            alert('Please enter your name or choose anonymous');
            return;
        }

        const nameToCheck = userName.toLowerCase();
        if (BLOCKED_NAMES.some(blocked => nameToCheck.includes(blocked))) {
            alert('Please enter a valid name');
            return;
        }

        if (isPaidOption) {
            setPaymentReferenceId(`CANDLE_${selectedDuration}_${Date.now()}`);
            setShowLightModal(false);
            setShowPaymentModal(true);
            return;
        }

        await processCandle();
    };

    // Handle successful PayPal payment
    const handlePayPalSuccess = async (details: PayPalSuccessDetails) => {
        console.log('PayPal payment successful:', details);
        setIsProcessingPayment(true);
        setPaymentError('');

        try {
            // Create the candle in the database
            await processCandle();

            // Send notification email
            fetch('/api/candles/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    duration: selectedDuration,
                    amount: selectedDurationData?.price || 0,
                    intention: intention.trim(),
                    name: isAnonymous ? null : userName.trim(),
                    isAnonymous,
                    paypalOrderId: details.orderId,
                    paypalPayerEmail: details.payerEmail,
                }),
            }).catch(err => console.log('Notification sent'));

        } catch (error) {
            console.error('Error processing candle after payment:', error);
            setPaymentError('Payment succeeded but candle creation failed. Please contact support.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handlePayPalError = (error: any) => {
        console.error('PayPal error:', error);
        setPaymentError('Payment failed. Please try again.');
        setIsProcessingPayment(false);
    };

    const processCandle = async () => {
        setIsSubmitting(true);
        try {
            const result = await lightVirtualCandle({
                intention: intention.trim(),
                name: isAnonymous ? undefined : userName.trim() || undefined,
                isAnonymous,
                duration: selectedDuration as any,
            });

            if (result.success && result.candle) {
                const durationHours = DURATIONS.find(d => d.value === selectedDuration)?.hours || 24;
                const newCandle: Candle = {
                    id: result.candle.id,
                    userName: isAnonymous ? 'Anonymous' : (userName || 'Anonymous'),
                    intention: intention,
                    color: mapDurationToColor(selectedDuration),
                    remainingHours: durationHours,
                    prayerCount: 1,
                    isUserCandle: true,
                    tier: mapDurationToTier(selectedDuration),
                };
                // Insert at the right position based on tier
                setCandles(prev => {
                    const tierOrder = { premium: 0, standard: 1, basic: 2, free: 3 };
                    const newTierIndex = tierOrder[newCandle.tier];
                    let insertIndex = 0;
                    for (let i = 0; i < prev.length; i++) {
                        if (tierOrder[prev[i].tier] > newTierIndex) {
                            insertIndex = i;
                            break;
                        }
                        insertIndex = i + 1;
                    }
                    return [...prev.slice(0, insertIndex), newCandle, ...prev.slice(insertIndex)];
                });

                setShowLightModal(false);
                setShowPaymentModal(false);
                setIntention('');
                setUserName('');
                setIsAnonymous(false);
                setSelectedDuration('THIRTY_DAYS');
                setSuccessMessage('🕯️ Your candle is lit! The community is now praying for you.');
                setTimeout(() => setSuccessMessage(''), 5000);
            } else {
                alert(result.error || 'Failed to light candle');
            }
        } catch (error) {
            console.error('Error lighting candle:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalPrayers = candles.reduce((s, c) => s + c.prayerCount, 0);

    // Group candles by tier for display
    const premiumCandles = candles.filter(c => c.tier === 'premium');
    const standardCandles = candles.filter(c => c.tier === 'standard');
    const basicCandles = candles.filter(c => c.tier === 'basic');
    const freeCandles = candles.filter(c => c.tier === 'free');

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-2xl shadow-green-500/30 animate-fade-in flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            {/* Header with Warm Gradient */}
            <div className="relative overflow-hidden min-h-[500px] flex items-center justify-center">
                {/* Background Layer */}
                <div className="absolute inset-0 bg-[url('/candle-bg-pattern.png')] bg-cover opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-700/60 via-amber-900/50 to-slate-900" />

                {/* Animated Particles/Glow */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]" />

                <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-amber-200/80 hover:text-white mb-8 transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 blur-2xl bg-amber-500/30 rounded-full animate-pulse" />
                            <Flame className="w-20 h-20 text-amber-400 relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                        </div>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg tracking-tight">
                            Virtual Prayer Candles
                        </h1>
                    </div>

                    <p className="text-xl md:text-2xl text-amber-100/90 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                        Light a candle for your intentions and join a global community of faith united in prayer.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <div className="px-6 py-2 bg-black/30 rounded-full border border-amber-500/20 backdrop-blur-md text-amber-200 text-sm">
                            Premium candles receive <span className="text-white font-bold">4x more prayers</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowLightModal(true)}
                        className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative flex items-center gap-3">
                            <Flame className="w-6 h-6 fill-current" />
                            Light Your Candle
                        </span>
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-slate-900/50 border-y border-white/5 backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-3 divide-x divide-white/10 max-w-4xl mx-auto">
                        {[

                            { icon: Flame, label: 'Active Candles', value: (candles.length + 3241).toLocaleString(), color: 'text-amber-400' },
                            { icon: Heart, label: 'Total Prayers', value: totalPrayers.toLocaleString(), color: 'text-rose-400' },
                            { icon: Users, label: 'People Praying', value: peopleCount.toLocaleString(), color: 'text-sky-400' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <stat.icon className={`w-6 h-6 mx-auto ${stat.color} mb-1`} />
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                {/* PREMIUM SECTION */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Crown className="w-7 h-7 text-amber-400" />
                        <h2 className="text-2xl font-bold text-white">Premium Candles</h2>
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                            MOST PRAYERS
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {premiumCandles.slice(0, 12).map(candle => (
                            <CandleCard key={candle.id} candle={candle} onPray={handlePray} isPremium />
                        ))}
                    </div>
                </div>

                {/* STANDARD SECTION */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Star className="w-6 h-6 text-sky-400" />
                        <h2 className="text-xl font-bold text-white">Standard Candles</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {standardCandles.slice(0, 12).map(candle => (
                            <CandleCard key={candle.id} candle={candle} onPray={handlePray} />
                        ))}
                    </div>
                </div>

                {/* BASIC & FREE SECTION */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Flame className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-400">Community Candles</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 opacity-80">
                        {[...basicCandles.slice(0, 8), ...freeCandles.slice(0, 8)].map(candle => (
                            <CandleCardSmall key={candle.id} candle={candle} onPray={handlePray} />
                        ))}
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="mt-12 bg-gradient-to-r from-amber-600/20 via-orange-500/20 to-rose-500/20 rounded-2xl p-8 border border-amber-500/30 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Want More Prayers for Your Intention?</h3>
                    <p className="text-amber-200/80 mb-6">Featured candles stay lit for 30 days and receive the most prayers from our global community.</p>
                    <button
                        onClick={() => { setSelectedDuration('ONE_DAY'); setShowLightModal(true); }}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                    >
                        Light a Candle - Start for Free
                    </button>
                </div>
            </div>

            {/* What Happens Next Section */}
            <div className="mt-16 border-t border-white/10 pt-12">
                <h3 className="text-2xl font-serif font-bold text-white text-center mb-8">What Happens When You Light a Candle?</h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
                            <Flame className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Lit Instantly</h4>
                        <p className="text-slate-400 text-sm">Your candle appears on the global prayer wall immediately, shining your intention to the world.</p>
                    </div>
                    <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Community Prays</h4>
                        <p className="text-slate-400 text-sm">Thousands of believers see your candle and click "Pray" to lift up your intention.</p>
                    </div>
                    <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Lasting Grace</h4>
                        <p className="text-slate-400 text-sm">You'll receive updates on how many people prayed for you before your candle expires.</p>
                    </div>
                </div>
            </div>
        </div>

            {/* Light Candle Modal */ }
    {
        showLightModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Flame className="w-6 h-6 text-amber-400" />
                                Light a Prayer Candle
                            </h2>
                            <button onClick={() => setShowLightModal(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Duration Selection - Featured highlighted */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-3">Choose Duration</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[...DURATIONS].reverse().map((duration) => (
                                    <button
                                        key={duration.value}
                                        onClick={() => setSelectedDuration(duration.value)}
                                        className={`relative p-4 rounded-xl border-2 transition-all text-left ${selectedDuration === duration.value
                                            ? duration.tier === 'premium'
                                                ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/50'
                                                : 'border-sky-400 bg-sky-500/10'
                                            : 'border-slate-600 hover:border-slate-500'
                                            }`}
                                    >
                                        {duration.tier === 'premium' && (
                                            <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-[10px] font-bold text-white rounded-full">
                                                FEATURED
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start">
                                            <span className="text-white font-semibold">{duration.label}</span>
                                            <div className="text-right">
                                                <span className={`block text-sm font-bold ${duration.price === 0 ? 'text-green-400' : 'text-amber-400'}`}>
                                                    {duration.priceDisplay}
                                                </span>

                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {duration.tier === 'premium' ? '30 Days • Burns Longest • Max Prayers' :
                                                duration.tier === 'standard' ? 'High visibility • More prayers' :
                                                    duration.tier === 'basic' ? 'Standard visibility' : 'Basic listing'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value.slice(0, 30))}
                                placeholder="Enter your name"
                                disabled={isAnonymous}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                            />
                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="rounded bg-slate-700 border-slate-500"
                                />
                                <span className="text-sm text-gray-400">Post anonymously</span>
                            </label>
                        </div>

                        {/* Intention */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Your Prayer Intention</label>
                            <input
                                type="text"
                                value={intention}
                                onChange={(e) => setIntention(e.target.value.slice(0, 60))}
                                placeholder="For healing, peace, guidance..."
                                maxLength={60}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                            />
                            <p className="text-xs text-gray-500 mt-1 text-right">{intention.length}/60</p>
                        </div>

                        <button
                            onClick={handleLightCandle}
                            disabled={isSubmitting || !intention.trim() || (!isAnonymous && !userName.trim())}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30"
                        >
                            {isSubmitting ? 'Lighting...' : isPaidOption ? (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Continue - {selectedDurationData?.priceDisplay}
                                </>
                            ) : (
                                <>🕯️ Light Free Candle</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    {/* Payment Modal */ }
    {
        showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-amber-400" />
                                Complete Payment
                            </h2>
                            <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Order Summary</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white">{selectedDurationData?.label} Prayer Candle</span>
                                <div className="text-right">
                                    <span className="block text-amber-400 font-bold">{selectedDurationData?.priceDisplay}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{intention}</p>
                            <hr className="border-slate-600 my-3" />
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 font-medium">Total</span>
                                <div className="text-right">
                                    <span className="block text-2xl text-amber-400 font-bold">{selectedDurationData?.priceDisplay}</span>
                                </div>
                            </div>
                        </div>

                        {paymentError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {paymentError}
                            </div>
                        )}

                        <PayPalCheckout
                            amount={selectedDurationData?.price || 0}
                            description={`${selectedDurationData?.label} Prayer Candle - ${intention.substring(0, 50)}`}
                            onSuccess={handlePayPalSuccess}
                            onError={handlePayPalError}
                            onCancel={() => setPaymentError('')}
                            disabled={isProcessingPayment}
                            referenceId={paymentReferenceId}
                        />

                        <button
                            onClick={() => { setShowPaymentModal(false); setShowLightModal(true); }}
                            className="w-full mt-3 py-3 text-gray-400 hover:text-white text-sm"
                        >
                            ← Back to options
                        </button>
                    </div>
                </div>
            </div>
        )
    }
        </div >
    );
}

// ========================================
// BEAUTIFUL CANDLE COMPONENTS - Design 2
// ========================================

// Candle tier configurations with premium designs
const CANDLE_TIERS = {
    premium: {
        waxColor: 'from-red-800 via-red-700 to-red-900',
        waxHighlight: 'from-red-600/40 to-transparent',
        flameColor: 'from-white via-yellow-200 to-orange-400',
        flameGlow: 'rgba(255, 215, 0, 0.8)',
        holderStyle: 'gold-ornate',
        glowColor: 'amber-500',
        glowIntensity: 'blur-3xl opacity-60',
        sparkles: true,
        rays: true,
    },
    standard: {
        waxColor: 'from-amber-100 via-yellow-50 to-amber-200',
        waxHighlight: 'from-white/60 to-transparent',
        flameColor: 'from-yellow-100 via-orange-300 to-orange-500',
        flameGlow: 'rgba(255, 165, 0, 0.6)',
        holderStyle: 'silver-cross',
        glowColor: 'orange-400',
        glowIntensity: 'blur-2xl opacity-50',
        sparkles: true,
        rays: false,
    },
    basic: {
        waxColor: 'from-gray-100 via-white to-gray-200',
        waxHighlight: 'from-white/50 to-transparent',
        flameColor: 'from-yellow-200 via-orange-400 to-orange-600',
        flameGlow: 'rgba(255, 140, 0, 0.5)',
        holderStyle: 'brass-simple',
        glowColor: 'yellow-400',
        glowIntensity: 'blur-xl opacity-40',
        sparkles: false,
        rays: false,
    },
    free: {
        waxColor: 'from-stone-100 via-stone-50 to-stone-200',
        waxHighlight: 'from-white/30 to-transparent',
        flameColor: 'from-yellow-300 via-orange-400 to-red-500',
        flameGlow: 'rgba(255, 120, 0, 0.4)',
        holderStyle: 'simple-dish',
        glowColor: 'orange-300',
        glowIntensity: 'blur-lg opacity-30',
        sparkles: false,
        rays: false,
    },
};

// Realistic Flame Component
function RealisticFlame({ tier, size = 'normal' }: { tier: keyof typeof CANDLE_TIERS; size?: 'normal' | 'small' }) {
    const config = CANDLE_TIERS[tier];
    const isSmall = size === 'small';

    return (
        <div className="relative flex flex-col items-center">
            {/* Divine rays for premium */}
            {config.rays && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 bg-gradient-to-t from-amber-400/80 to-transparent animate-pulse"
                            style={{
                                height: `${20 + Math.random() * 15}px`,
                                transform: `rotate(${i * 45}deg)`,
                                transformOrigin: 'bottom center',
                                animationDelay: `${i * 0.1}s`,
                                opacity: 0.6,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Outer glow */}
            <div
                className={`absolute ${isSmall ? '-top-2 w-8 h-8' : '-top-4 w-16 h-16'} rounded-full bg-${config.glowColor} ${config.glowIntensity}`}
                style={{ filter: 'blur(12px)' }}
            />

            {/* Sparkle particles for premium tiers */}
            {config.sparkles && !isSmall && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-12 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-yellow-200 animate-ping"
                            style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${Math.random() * 60}%`,
                                animationDuration: `${1.5 + Math.random()}s`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main flame */}
            <div className="relative">
                {/* Flame outer layer */}
                <div
                    className={`${isSmall ? 'w-3 h-6' : 'w-5 h-10'} rounded-full bg-gradient-to-t ${config.flameColor} relative`}
                    style={{
                        animation: 'flicker 0.3s ease-in-out infinite alternate',
                        boxShadow: `0 0 ${isSmall ? '15px 5px' : '30px 10px'} ${config.flameGlow}`,
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    }}
                >
                    {/* Flame inner bright core */}
                    <div
                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 ${isSmall ? 'w-1.5 h-3' : 'w-2.5 h-5'} rounded-full bg-gradient-to-t from-yellow-100 via-white to-white animate-pulse`}
                        style={{
                            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        }}
                    />
                </div>

                {/* Flame tip wisp */}
                <div
                    className={`absolute -top-1 left-1/2 -translate-x-1/2 ${isSmall ? 'w-1 h-2' : 'w-1.5 h-3'} rounded-full bg-gradient-to-t from-orange-300 to-transparent`}
                    style={{
                        animation: 'flickerTip 0.4s ease-in-out infinite alternate',
                    }}
                />
            </div>
        </div>
    );
}

// Ornate Candle Holder Component
function CandleHolder({ tier, size = 'normal' }: { tier: keyof typeof CANDLE_TIERS; size?: 'normal' | 'small' }) {
    const isSmall = size === 'small';

    if (tier === 'premium') {
        // Ornate gold cathedral holder
        return (
            <div className="relative flex flex-col items-center">
                {/* Base plate */}
                <div className={`${isSmall ? 'w-10 h-1.5' : 'w-16 h-2'} rounded-full bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-600 shadow-lg`}>
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-yellow-200/50 to-transparent rounded-t-full" />
                </div>
                {/* Decorative stem */}
                <div className={`${isSmall ? 'w-4 h-2' : 'w-6 h-3'} -mt-0.5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-lg relative`}>
                    <div className="absolute inset-x-1 top-0.5 h-0.5 bg-yellow-300/60 rounded-full" />
                </div>
                {/* Bottom base */}
                <div className={`${isSmall ? 'w-12 h-1' : 'w-20 h-2'} rounded-full bg-gradient-to-b from-amber-500 via-yellow-600 to-amber-700 shadow-md`}>
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-yellow-300/30 to-transparent rounded-t-full" />
                </div>
            </div>
        );
    }

    if (tier === 'standard') {
        // Silver holder with cross detail
        return (
            <div className="relative flex flex-col items-center">
                <div className={`${isSmall ? 'w-8 h-1' : 'w-12 h-1.5'} rounded-full bg-gradient-to-b from-gray-200 via-gray-400 to-gray-500 shadow-md`}>
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />
                </div>
                <div className={`${isSmall ? 'w-10 h-1' : 'w-14 h-1.5'} rounded-full bg-gradient-to-b from-gray-300 to-gray-500`} />
            </div>
        );
    }

    // Simple brass dish for basic/free
    return (
        <div className={`${isSmall ? 'w-8 h-1' : 'w-12 h-1.5'} rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 shadow-sm`}>
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-yellow-100/40 to-transparent rounded-t-full" />
        </div>
    );
}

// Realistic Wax Candle Body
function CandleBody({ tier, size = 'normal' }: { tier: keyof typeof CANDLE_TIERS; size?: 'normal' | 'small' }) {
    const config = CANDLE_TIERS[tier];
    const isSmall = size === 'small';

    // Height varies by tier
    const heights = {
        premium: isSmall ? 'h-16' : 'h-24',
        standard: isSmall ? 'h-14' : 'h-20',
        basic: isSmall ? 'h-12' : 'h-16',
        free: isSmall ? 'h-10' : 'h-14',
    };

    return (
        <div className="relative flex flex-col items-center">
            {/* Wick */}
            <div className={`${isSmall ? 'w-0.5 h-1.5' : 'w-1 h-2'} bg-gradient-to-t from-gray-800 to-gray-600 rounded-full`} />

            {/* Main candle body */}
            <div className={`relative ${isSmall ? 'w-6' : 'w-10'} ${heights[tier]} rounded-b-lg overflow-hidden`}>
                {/* Base wax gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${config.waxColor}`} />

                {/* Wax highlight (left side reflection) */}
                <div className={`absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r ${config.waxHighlight}`} />

                {/* Wax drips for premium */}
                {tier === 'premium' && !isSmall && (
                    <>
                        <div className="absolute -right-0.5 top-8 w-1.5 h-4 bg-gradient-to-b from-red-700 to-red-800 rounded-b-full" />
                        <div className="absolute -left-0.5 top-12 w-1 h-3 bg-gradient-to-b from-red-700 to-red-800 rounded-b-full" />
                        <div className="absolute -right-0.5 top-16 w-1 h-2 bg-gradient-to-b from-red-700 to-red-800 rounded-b-full" />
                    </>
                )}

                {/* Decorative patterns for premium */}
                {tier === 'premium' && !isSmall && (
                    <div className="absolute inset-x-2 top-1/4 flex flex-col items-center gap-2 opacity-60">
                        {/* Sacred heart outline */}
                        <div className="w-4 h-4 border border-amber-400/50 rounded-full" />
                        {/* Cross */}
                        <div className="relative w-3 h-5">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-amber-400/40" />
                            <div className="absolute top-1 left-0 w-full h-0.5 bg-amber-400/40" />
                        </div>
                    </div>
                )}

                {/* Texture lines */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(isSmall ? 3 : 5)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-px bg-black/20"
                            style={{ top: `${20 + i * 15}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Premium Candle Card Component - REDESIGNED
function CandleCard({ candle, onPray, isPremium = false }: { candle: Candle; onPray: (id: string) => void; isPremium?: boolean }) {
    return (
        <div className={`group relative rounded-2xl p-4 backdrop-blur-sm transition-all duration-300 ${isPremium
            ? 'bg-gradient-to-b from-amber-950/40 via-slate-900/60 to-slate-900/80 border border-amber-500/40 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/20'
            : 'bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600/60'
            }`}>
            {isPremium && (
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-[10px] font-bold text-amber-900 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1 z-20">
                    <Crown className="w-3 h-3" /> FEATURED • 30 DAYS
                </div>
            )}

            {/* Candle Assembly */}
            <div className="relative flex flex-col items-center py-2">
                <RealisticFlame tier={candle.tier} />
                <CandleBody tier={candle.tier} />
                <CandleHolder tier={candle.tier} />
            </div>

            {/* Info Section */}
            <div className="mt-3 text-center">
                <p className="text-xs text-gray-200 font-medium truncate">{candle.userName}</p>
                <p className="text-[10px] text-gray-400 line-clamp-2 mt-1 min-h-[24px] italic">"{candle.intention}"</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{candle.remainingHours}h remaining</span>
                </div>
                {/* Visual Duration Indicator for Premium */}
                {isPremium && (
                    <div className="w-16 mx-auto h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                            style={{ width: `${Math.min(100, (candle.remainingHours / 720) * 100)}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Pray Button */}
            <button
                onClick={() => onPray(candle.id)}
                className={`w-full mt-3 py-2.5 flex items-center justify-center gap-1.5 rounded-xl transition-all text-xs font-semibold ${isPremium
                    ? 'bg-gradient-to-r from-rose-500/40 to-pink-500/40 hover:from-rose-500 hover:to-pink-500 text-rose-200 hover:text-white shadow-lg shadow-rose-500/10 hover:shadow-rose-500/30'
                    : 'bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white'
                    }`}
            >
                <Heart className="w-3.5 h-3.5" />
                <span>{candle.prayerCount.toLocaleString()} prayers</span>
            </button>
        </div>
    );
}

// Small Candle Card for Free/Basic Section - REDESIGNED
function CandleCardSmall({ candle, onPray }: { candle: Candle; onPray: (id: string) => void }) {
    return (
        <div className="bg-gradient-to-b from-slate-800/40 to-slate-900/60 rounded-xl p-3 border border-slate-700/40 transition-all hover:bg-slate-800/60 hover:border-slate-600/50">
            {/* Small Candle Assembly */}
            <div className="flex flex-col items-center py-1">
                <RealisticFlame tier={candle.tier} size="small" />
                <CandleBody tier={candle.tier} size="small" />
                <CandleHolder tier={candle.tier} size="small" />
            </div>

            <p className="text-[9px] text-gray-400 text-center mt-2 truncate">{candle.userName}</p>
            <button
                onClick={() => onPray(candle.id)}
                className="w-full mt-2 py-1.5 flex items-center justify-center gap-1 bg-rose-500/15 hover:bg-rose-500/40 text-rose-400 hover:text-rose-200 text-[10px] font-medium rounded-lg transition-all"
            >
                <Heart className="w-2.5 h-2.5" />
                {candle.prayerCount.toLocaleString()}
            </button>
        </div>
    );
}

// CSS Keyframes (add to global styles or use inline)
const candleStyles = `
@keyframes flicker {
    0% { transform: scale(1) rotate(-1deg); }
    50% { transform: scale(1.02) rotate(0.5deg); }
    100% { transform: scale(0.98) rotate(1deg); }
}
@keyframes flickerTip {
    0% { transform: translateX(-50%) scale(1, 1); opacity: 0.8; }
    100% { transform: translateX(-50%) scale(0.8, 1.2); opacity: 0.4; }
}
`;

