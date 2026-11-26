'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sun, CheckCircle2, Flame, Share2, BookOpen, ArrowRight } from 'lucide-react';

export function MorningSanctuaryRoutine() {
    const [amenDone, setAmenDone] = useState(false);
    const [streak, setStreak] = useState(1);
    const [shared, setShared] = useState(false);

    useEffect(() => {
        try {
            const todayKey = new Date().toISOString().slice(0, 10);
            const savedDate = localStorage.getItem('mpt_morning_amen_date');
            const savedStreak = parseInt(localStorage.getItem('mpt_prayer_streak') || '1', 10);
            setStreak(isNaN(savedStreak) ? 1 : savedStreak);
            if (savedDate === todayKey) {
                setAmenDone(true);
            }
        } catch {
            // ignore
        }
    }, []);

    const handleSayAmen = () => {
        if (amenDone) return;
        setAmenDone(true);
        try {
            const todayKey = new Date().toISOString().slice(0, 10);
            const nextStreak = streak + 1;
            setStreak(nextStreak);
            localStorage.setItem('mpt_morning_amen_date', todayKey);
            localStorage.setItem('mpt_prayer_streak', String(nextStreak));
            const prayedCount = parseInt(localStorage.getItem('mpt_prayed_count') || '0', 10) + 1;
            localStorage.setItem('mpt_prayed_count', String(prayedCount));
        } catch {
            // ignore
        }
    };

    const handleShareRoutine = async () => {
        const text = `🕊️ Today's 60-Second Catholic Sanctuary Routine on MyPrayerTower:\n"Do not be afraid; only have faith." — Mark 5:36\n\n🙏 Pray with me: https://www.myprayertower.com`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'MyPrayerTower Daily Sanctuary', text, url: 'https://www.myprayertower.com' });
                setShared(true);
                return;
            } catch {
                // fallback
            }
        }
        try {
            await navigator.clipboard.writeText(text);
            setShared(true);
            setTimeout(() => setShared(false), 2500);
        } catch {
            // ignore
        }
    };

    return (
        <section className="py-10 bg-[#120E0A] px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="rounded-3xl bg-gradient-to-br from-[#1C150F] via-[#17110C] to-[#120E0A] border border-gold-500/35 p-6 sm:p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2.5 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                                <Sun className="w-3.5 h-3.5" />
                                <span>60-Second Morning Sanctuary</span>
                                <span className="text-white/40">•</span>
                                <span className="inline-flex items-center gap-1 text-emerald-300">
                                    <Flame className="w-3 h-3" /> {streak}-Day Streak
                                </span>
                            </div>

                            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF6EE]">
                                Pause for One Minute of Grace
                            </h2>
                            <p className="font-serif italic text-base text-[#CFC5B4] leading-relaxed">
                                &ldquo;Lord Jesus Christ, I offer You this day — my prayers, works, joys, and sufferings — in union with the Holy Sacrifice of the Mass throughout the world.&rdquo;
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                            <button
                                type="button"
                                onClick={handleSayAmen}
                                data-engagement="Say Amen & Seal Prayer"
                                data-category="amen"
                                className={`px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                                    amenDone
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                                        : 'bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] shadow-lg hover:brightness-110'
                                }`}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{amenDone ? 'Amen Sealed Today' : 'Say Amen — Free'}</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <Link
                                    href="/readings"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-gold-500/25 text-xs font-semibold text-gold-200 flex items-center justify-center gap-1.5"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Gospel</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleShareRoutine}
                                    data-engagement="Share Prayer / Intention"
                                    data-category="social"
                                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white/85 flex items-center justify-center gap-1.5"
                                >
                                    <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                                    <span>{shared ? 'Copied!' : 'Share'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
