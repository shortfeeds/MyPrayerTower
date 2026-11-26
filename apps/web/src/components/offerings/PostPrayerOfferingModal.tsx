'use client';

import { useState, useEffect } from 'react';
import { X, Flame, Church, Heart, Smartphone, Sparkles } from 'lucide-react';
import { openOfferingModal } from '@/components/offerings/UniversalOfferingModal';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app';

export function PostPrayerOfferingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [intention, setIntention] = useState('');

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail || {};
            setIntention(detail.intention || '');
            setIsOpen(true);
        };
        window.addEventListener('mpt-prayer-offered', handler);
        return () => window.removeEventListener('mpt-prayer-offered', handler);
    }, []);

    if (!isOpen) return null;

    const triggerOffering = (tab: 'candle' | 'mass' | 'bouquet') => {
        setIsOpen(false);
        openOfferingModal(tab, { intention });
    };

    return (
        <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-[#18120D] border-2 border-gold-500/40 p-6 sm:p-7 text-[#FAF6EE] shadow-2xl relative text-center">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center mx-auto mb-3 text-gold-300">
                    <Sparkles className="w-6 h-6" />
                </div>

                <h3 className="font-display text-2xl font-bold text-[#FAF6EE]">
                    Your prayer has been offered.
                </h3>
                <p className="font-serif italic text-sm text-[#CFC5B4] mt-1.5 mb-5">
                    Would you like to deepen this intention before the sanctuary altar?
                </p>

                <div className="space-y-2.5 text-left">
                    <button
                        type="button"
                        onClick={() => triggerOffering('candle')}
                        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] font-extrabold text-sm flex items-center justify-between shadow-lg hover:brightness-110 transition-all"
                    >
                        <span className="flex items-center gap-2.5">
                            <Flame className="w-5 h-5 fill-current" />
                            <span>Light a Vigil Candle</span>
                        </span>
                        <span className="text-xs font-mono bg-[#120E0A]/15 px-2.5 py-0.5 rounded-full">From Free</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => triggerOffering('mass')}
                        className="w-full p-3.5 rounded-2xl bg-[#7A1E24] hover:bg-[#9B2C33] text-[#FAF6EE] border border-gold-400/30 font-bold text-sm flex items-center justify-between transition-all"
                    >
                        <span className="flex items-center gap-2.5">
                            <Church className="w-5 h-5 text-gold-300" />
                            <span>Request a Holy Mass</span>
                        </span>
                        <span className="text-xs font-mono text-gold-300">$10.00</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => triggerOffering('bouquet')}
                        className="w-full p-3.5 rounded-2xl bg-[#120E0A] hover:bg-[#1F1711] text-[#FAF6EE] border border-gold-500/30 font-semibold text-sm flex items-center justify-between transition-all"
                    >
                        <span className="flex items-center gap-2.5">
                            <Heart className="w-5 h-5 text-rose-400" />
                            <span>Send a Spiritual Bouquet</span>
                        </span>
                        <span className="text-xs text-[#CFC5B4]">Custom</span>
                    </button>
                </div>

                {/* App Download Nudge */}
                <div className="mt-5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2.5">
                        <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                            <div className="text-xs font-bold text-emerald-200">Get Daily Prayer Reminders</div>
                            <div className="text-[10px] text-[#CFC5B4]">Free on Google Play</div>
                        </div>
                    </div>
                    <a
                        href={PLAY_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#120E0A] font-bold text-[11px]"
                    >
                        Download
                    </a>
                </div>

                <p className="text-[11px] text-[#CFC5B4]/75 italic mt-4">
                    No obligation — your prayer alone is a beautiful gift.
                </p>

                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 text-xs font-semibold text-gold-300 hover:text-gold-200 underline underline-offset-4"
                >
                    Continue in peace →
                </button>
            </div>
        </div>
    );
}
