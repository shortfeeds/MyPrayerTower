'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Church, ArrowRight, Sparkles, Lock, Heart } from 'lucide-react';
import { openOfferingModal } from '@/components/offerings/UniversalOfferingModal';

const INTENTIONS = [
    {
        id: 'healing',
        label: 'Healing & Strength',
        icon: '🕊️',
        verse: '"He heals the brokenhearted and binds up their wounds." — Psalm 147:3',
        prayer: 'Lord Jesus, Physician of body and soul, pour Your healing grace upon this intention.',
        href: '/prayers/intention/healing',
        defaultIntention: 'For physical, emotional, and spiritual healing',
    },
    {
        id: 'family',
        label: 'Family & Loved Ones',
        icon: '🏡',
        verse: '"As for me and my household, we will serve the Lord." — Joshua 24:15',
        prayer: 'Holy Family of Nazareth, watch over our home with peace, unity, and protection.',
        href: '/prayers/intention/family',
        defaultIntention: 'For the protection and grace of my family',
    },
    {
        id: 'peace',
        label: 'Anxiety & Peace',
        icon: '🌿',
        verse: '"Peace I leave with you; my peace I give to you." — John 14:27',
        prayer: 'Prince of Peace, quiet my anxious heart and anchor my soul in Your trust.',
        href: '/prayers/intention/peace',
        defaultIntention: 'For peace of mind and calm in times of anxiety',
    },
    {
        id: 'deceased',
        label: 'Deceased Souls',
        icon: '🕯️',
        verse: '"Eternal rest grant unto them, O Lord, and let perpetual light shine upon them."',
        prayer: 'Merciful Father, welcome the souls of our faithful departed into Your eternal light.',
        href: '/memorials',
        defaultIntention: 'For the eternal repose of my departed loved ones',
    },
    {
        id: 'gratitude',
        label: 'Thanksgiving',
        icon: '✨',
        verse: '"Give thanks to the Lord, for He is good; His mercy endures forever." — Psalm 107:1',
        prayer: 'Thank You, Father, for every blessing seen and unseen in our lives.',
        href: '/prayers/intention/thanksgiving',
        defaultIntention: 'In humble thanksgiving for God\'s abundant blessings',
    },
    {
        id: 'guidance',
        label: 'Guidance & Work',
        icon: '🧭',
        verse: '"Trust in the Lord with all your heart, and He will make straight your paths." — Prov 3:5-6',
        prayer: 'Come, Holy Spirit, illuminate my path and grant wisdom for every decision.',
        href: '/prayers/intention/guidance',
        defaultIntention: 'For divine wisdom, guidance, and provision',
    },
];

export function SanctuaryHero() {
    const [selectedId, setSelectedId] = useState<string>('healing');
    const [prayedCount, setPrayedCount] = useState<number>(0);
    const [hasPrayed, setHasPrayed] = useState(false);
    const [cms, setCms] = useState({
        heroTitle: 'Enter a Sanctuary of Perpetual Prayer',
        heroSubtitle: 'Light a vigil candle before the altar, unite in the Holy Rosary, and entrust your intentions to priests and faithful worldwide.',
        candlesBurningCount: '12,847',
        faithfulOfferedCount: '428',
    });

    useEffect(() => {
        fetch('/api/frontend-config')
            .then(r => r.json())
            .then(d => {
                if (d?.config) {
                    setCms(prev => ({ ...prev, ...d.config }));
                }
            })
            .catch(() => {});
    }, []);

    const active = INTENTIONS.find(i => i.id === selectedId) || INTENTIONS[0];

    const handlePrayAmen = () => {
        setHasPrayed(true);
        setPrayedCount(c => c + 1);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpt-prayer-offered', {
                detail: { intention: active.defaultIntention, label: active.label }
            }));
        }
    };

    return (
        <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#120E0A] text-[#FAF6EE] pt-24 pb-20">
            {/* Candlelit Basilica Backdrop */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
                style={{ backgroundImage: "url('/images/sanctuary/hero_altar.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#120E0A]/85 via-[#120E0A]/65 to-[#120E0A]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14)_0%,transparent_65%)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
                {/* Live Social Proof Pill */}
                <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-[#18120D]/90 border border-gold-500/35 text-xs text-[#CFC5B4] mb-6 shadow-lg backdrop-blur-md">
                    <span className="flex items-center gap-1.5 text-gold-300 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        {cms.candlesBurningCount} candles burning now
                    </span>
                    <span className="text-gold-500/40">•</span>
                    <span>{cms.faithfulOfferedCount} faithful offered this month</span>
                    <span className="text-gold-500/40 hidden sm:inline">•</span>
                    <span className="hidden sm:inline text-emerald-300/90">✠ Catholic Digital Sanctuary</span>
                    <span className="text-gold-500/40 hidden md:inline">•</span>
                    <span className="hidden md:inline-flex items-center gap-1.5 text-purple-300 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        {(() => {
                            const m = new Date().getMonth() + 1;
                            const d = new Date().getDate();
                            if ((m === 11 && d >= 27) || (m === 12 && d <= 24)) return 'Advent • Violet';
                            if ((m === 12 && d >= 25) || (m === 1 && d <= 12)) return 'Christmas • Gold';
                            if (m === 3 || (m === 4 && d <= 10)) return 'Lent / Paschal • Violet';
                            return 'Ordinary Time • Green';
                        })()}
                    </span>
                </div>

                {/* Liturgical Headline */}
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide text-[#FAF6EE] leading-[1.12] mb-5 drop-shadow-[0_6px_28px_rgba(0,0,0,0.9)]">
                    {cms.heroTitle}
                </h1>

                <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#CFC5B4] max-w-2xl mx-auto mb-8 leading-relaxed">
                    {cms.heroSubtitle}
                </p>

                {/* Primary Revenue + Prayer CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
                    <button
                        type="button"
                        onClick={() => openOfferingModal('candle', { intention: active.defaultIntention })}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#E8CA68] via-[#D4AF37] to-[#B8942C] hover:brightness-110 text-[#120E0A] font-extrabold text-base shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-all hover:scale-[1.03] active:scale-95"
                    >
                        <Flame className="w-5 h-5 fill-current animate-pulse" />
                        <span>Light a Candle — Free</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => openOfferingModal('mass', { intention: active.defaultIntention })}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#7A1E24] hover:bg-[#9B2C33] text-[#FAF6EE] font-bold text-base border border-gold-400/30 shadow-xl transition-all hover:scale-[1.02]"
                    >
                        <Church className="w-5 h-5 text-gold-300" />
                        <span>Request a Holy Mass</span>
                    </button>

                    <Link
                        href="/prayer-wall"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#18120D]/80 hover:bg-[#1F1711] text-[#FAF6EE] font-semibold text-base border border-gold-500/30 transition-all"
                    >
                        <span>Prayer Wall</span>
                        <ArrowRight className="w-4 h-4 text-gold-400" />
                    </Link>
                </div>

                {/* Interactive Intention Selector Box */}
                <div className="bg-[#18120D]/90 backdrop-blur-xl border border-gold-500/30 rounded-3xl p-5 sm:p-7 max-w-4xl mx-auto shadow-[0_24px_60px_rgba(0,0,0,0.75)] text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gold-500/15">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gold-400" />
                            <span className="font-display text-xs sm:text-sm uppercase tracking-widest text-gold-300 font-bold">
                                What weighs on your heart today?
                            </span>
                        </div>
                        <span className="text-[11px] text-[#CFC5B4]/75">Select an intention for instant Scripture &amp; prayer</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-5">
                        {INTENTIONS.map((item) => {
                            const isSelected = item.id === selectedId;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => { setSelectedId(item.id); setHasPrayed(false); }}
                                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                                        isSelected
                                            ? 'bg-gold-500/20 border-gold-400 text-[#FAF6EE] shadow-md'
                                            : 'bg-[#120E0A]/60 border-gold-500/15 text-[#CFC5B4] hover:border-gold-500/40 hover:text-white'
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="text-[11px] font-semibold leading-tight">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected Prayer Response */}
                    <div className="bg-[#120E0A]/80 border border-gold-500/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                            <p className="font-serif italic text-gold-200 text-sm sm:text-base">{active.verse}</p>
                            <p className="text-xs sm:text-sm text-[#CFC5B4]">{active.prayer}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={handlePrayAmen}
                                className="flex-1 md:flex-none px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-[#120E0A] font-bold text-xs sm:text-sm transition-all shadow-md"
                            >
                                {hasPrayed ? `✠ Amen Offered (${prayedCount})` : 'Pray Now (✠ Amen)'}
                            </button>
                            <button
                                type="button"
                                onClick={() => openOfferingModal('candle', { intention: active.defaultIntention })}
                                className="flex-1 md:flex-none px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gold-300 border border-gold-500/30 font-semibold text-xs transition-all"
                            >
                                🕯️ Light Candle
                            </button>
                            <Link
                                href={active.href}
                                className="px-3 py-2 text-xs text-[#CFC5B4] hover:text-gold-300 underline underline-offset-4"
                            >
                                Explore →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sacred Privacy Reassurance */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#CFC5B4]/70">
                    <Lock className="w-3.5 h-3.5 text-gold-400" />
                    <span>Sacred Privacy &amp; Voluntary Offerings • You are always welcome here</span>
                </div>
            </div>
        </section>
    );
}
