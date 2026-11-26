'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Flame, Heart, Share2, Check } from 'lucide-react';

export function FaithJourneyRecap() {
    const [candlesLit, setCandlesLit] = useState(0);
    const [prayersOffered, setPrayersOffered] = useState(0);
    const [streak, setStreak] = useState(1);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            const candles = JSON.parse(localStorage.getItem('mpt_user_candles') || '[]');
            setCandlesLit(Array.isArray(candles) ? candles.length : 0);
            const prayed = parseInt(localStorage.getItem('mpt_prayed_count') || '0', 10);
            setPrayersOffered(isNaN(prayed) ? 0 : prayed);
            const s = parseInt(localStorage.getItem('mpt_prayer_streak') || '1', 10);
            setStreak(isNaN(s) ? 1 : s);
        } catch {
            // ignore
        }
    }, []);

    const handleShareMilestone = async () => {
        const msg = `✨ My Faith Journey on MyPrayerTower:\n🔥 ${streak}-Day Prayer Streak\n🕯️ ${candlesLit} Sanctuary Candles Lit\n🙏 ${prayersOffered} Prayers Lifted for Others\n\nJoin me in daily Catholic prayer: https://www.myprayertower.com`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'My Faith Journey — MyPrayerTower', text: msg, url: 'https://www.myprayertower.com' });
                setCopied(true);
                return;
            } catch {
                // fallback
            }
        }
        try {
            await navigator.clipboard.writeText(msg);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // ignore
        }
    };

    return (
        <section className="py-10 bg-[#120E0A] px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="rounded-3xl bg-[#18120D] border border-gold-500/25 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-400">
                            <Sparkles className="w-3.5 h-3.5" /> Your Faith Journey Recap
                        </span>
                        <h3 className="font-display text-2xl font-bold text-[#FAF6EE] mt-1">
                            Spiritual Milestones on This Device
                        </h3>
                        <p className="text-xs sm:text-sm text-[#CFC5B4] mt-1">
                            Every candle, Amen, and prayer for a neighbor builds a quiet habit of grace.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="px-4 py-3 rounded-2xl bg-[#120E0A] border border-gold-500/20 text-center min-w-[96px]">
                            <div className="text-xl font-mono font-black text-amber-300 flex items-center justify-center gap-1">
                                <Flame className="w-4 h-4" /> {streak}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-[#CFC5B4]">Day Streak</span>
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-[#120E0A] border border-gold-500/20 text-center min-w-[96px]">
                            <div className="text-xl font-mono font-black text-gold-300">{candlesLit}</div>
                            <span className="text-[10px] uppercase tracking-wider text-[#CFC5B4]">Candles Lit</span>
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-[#120E0A] border border-gold-500/20 text-center min-w-[96px]">
                            <div className="text-xl font-mono font-black text-emerald-300 flex items-center justify-center gap-1">
                                <Heart className="w-4 h-4 fill-current" /> {prayersOffered}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-[#CFC5B4]">Prayed For</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleShareMilestone}
                            data-engagement="Share Prayer / Intention"
                            data-category="social"
                            className="px-5 py-3 rounded-2xl bg-gold-500/15 hover:bg-gold-500 text-gold-200 hover:text-[#120E0A] border border-gold-500/40 font-bold text-xs flex items-center gap-2 transition-all"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                            <span>{copied ? 'Milestone Copied!' : 'Share Milestone'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
