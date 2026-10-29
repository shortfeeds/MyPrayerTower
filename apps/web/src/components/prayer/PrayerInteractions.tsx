'use client';

import { useState, useEffect } from 'react';
import { Flame, Church, Users, Check, Sparkles, ArrowRight, Heart, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { CandleCreationModal } from '@/components/candles/CandleCreationModal';
import { DigitalVotiveCardModal } from '@/components/candles/DigitalVotiveCardModal';

interface PrayerInteractionsProps {
    prayerId: string;
    prayerTitle: string;
    initialCount?: number;
}

export function PrayerInteractions({ prayerId, prayerTitle, initialCount = 42 }: PrayerInteractionsProps) {
    const [hasPrayed, setHasPrayed] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isCandleModalOpen, setIsCandleModalOpen] = useState(false);
    const [candleLitSuccess, setCandleLitSuccess] = useState(false);
    const [showVotiveModal, setShowVotiveModal] = useState(false);

    // Persist prayer state locally so returning users see their prayer recorded
    useEffect(() => {
        try {
            const stored = localStorage.getItem(`mpt_prayed_${prayerId}`);
            if (stored) {
                setHasPrayed(true);
            }
            const storedCandle = localStorage.getItem(`mpt_candle_lit_${prayerId}`);
            if (storedCandle) {
                setCandleLitSuccess(true);
            }
        } catch {
            // Ignore storage errors in private browsing
        }
    }, [prayerId]);

    const handleCandleLitSuccess = () => {
        setIsCandleModalOpen(false);
        setCandleLitSuccess(true);
        setShowVotiveModal(true); // Automatically reveal the sacred votive card certificate!
        try {
            localStorage.setItem(`mpt_candle_lit_${prayerId}`, 'true');
            const existing = JSON.parse(localStorage.getItem('mpt_user_candles') || '[]');
            const now = new Date();
            const expires = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
            const newEntry = {
                id: `candle_${Date.now()}`,
                intention: prayerTitle,
                name: 'Faithful Soul',
                duration: 'SEVEN_DAYS',
                durationDays: 7,
                litAt: now.toISOString(),
                expiresAt: expires.toISOString(),
                isActive: true,
                prayerId,
                prayerTitle,
            };
            localStorage.setItem('mpt_user_candles', JSON.stringify([newEntry, ...existing]));
        } catch {
            // Ignore storage errors
        }
        confetti({
            particleCount: 75,
            spread: 90,
            origin: { y: 0.65 },
            colors: ['#D4AF37', '#F59E0B', '#EF4444', '#FFFFFF']
        });
    };

    const handlePray = () => {
        if (hasPrayed) return;

        setHasPrayed(true);
        setCount(c => c + 1);

        try {
            localStorage.setItem(`mpt_prayed_${prayerId}`, 'true');
            const existingPrayers = JSON.parse(localStorage.getItem('mpt_sealed_prayers') || '[]');
            const exists = existingPrayers.some((p: any) => p.prayerId === prayerId);
            if (!exists) {
                const newPrayer = {
                    prayerId,
                    prayerTitle,
                    prayedAt: new Date().toISOString(),
                    path: typeof window !== 'undefined' ? window.location.pathname : `/prayers/${prayerId}`,
                };
                localStorage.setItem('mpt_sealed_prayers', JSON.stringify([newPrayer, ...existingPrayers].slice(0, 50)));
            }
        } catch {
            // Ignore storage errors
        }

        // Reverent gold celebration
        confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.75 },
            colors: ['#D4AF37', '#F59E0B', '#FDE68A', '#FFFFFF']
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: `Pray with me: ${prayerTitle}`,
            text: `Join me in this sacred prayer on MyPrayerTower: ${prayerTitle}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User dismissed native share sheet
            }
        } else {
            setShowShareMenu(!showShareMenu);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
    const shareText = encodeURIComponent(`Pray with me: ${prayerTitle}`);

    return (
        <div className="w-full max-w-2xl mx-auto my-6 text-center">
            {/* ── Step 1: The Interactive "Say Amen" Primary Action ── */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={handlePray}
                    disabled={hasPrayed}
                    className={`
                        relative group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg
                        ${hasPrayed
                            ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white cursor-default shadow-emerald-700/20'
                            : 'bg-gradient-to-r from-sacred-900 via-sacred-800 to-amber-900 text-white hover:from-sacred-850 hover:to-amber-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        }
                    `}
                >
                    {hasPrayed ? (
                        <>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </span>
                            <span>Amen • Prayer Sealed With God</span>
                        </>
                    ) : (
                        <>
                            <span className="text-xl">🙏</span>
                            <span>Say Amen & Seal This Prayer</span>
                        </>
                    )}

                    {/* Community Counter Pill */}
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        hasPrayed ? 'bg-white/20 text-white' : 'bg-gold-500/30 text-gold-200 border border-gold-400/30'
                    }`}>
                        {count.toLocaleString()} United
                    </span>
                </button>

                {/* Quick Native Share Button */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="p-4 bg-white text-gray-500 hover:text-sacred-700 hover:bg-amber-50/50 rounded-full shadow-md border border-gray-100 transition-all hover:scale-105"
                        title="Share this prayer with a loved one"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    {showShareMenu && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 flex gap-1 min-w-[200px] z-50">
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 hover:bg-sky-50 text-gray-600 hover:text-sky-500 rounded-lg transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <button
                                type="button"
                                onClick={copyToClipboard}
                                className="p-3 hover:bg-gray-50 text-gray-600 hover:text-emerald-600 rounded-lg transition-colors"
                            >
                                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <LinkIcon className="w-5 h-5" />}
                            </button>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 font-serif italic">
                {hasPrayed
                    ? 'Your petition is offered before the Throne of Grace.'
                    : 'Click "Say Amen" to unite your intention with believers praying worldwide.'}
            </p>

            {/* ── Step 2: The Sacred Seal Tray (Revealed upon praying or available for all visitors) ── */}
            <div className={`mt-8 p-6 md:p-8 rounded-3xl transition-all duration-500 border text-left ${
                hasPrayed
                    ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/30 to-amber-50/70 border-amber-300/80 shadow-md ring-2 ring-gold-400/20'
                    : 'bg-white border-gray-200/80 shadow-sm'
            }`}>
                <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                        {hasPrayed ? 'Spiritual Continuity' : 'Anchor Your Intention'}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-950 mb-2">
                        Leave a Physical Sign of Your Prayer
                    </h3>
                    <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                        In Christian tradition, a prayer does not end when you close your eyes. Leave an enduring sign in the sanctuary so your intention is held in continuous vigil.
                    </p>
                </div>

                {/* Active Vigil Confirmation (if candle was lit) */}
                {candleLitSuccess && (
                    <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border-2 border-amber-400/80 shadow-md flex flex-col sm:flex-row items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm shrink-0">
                            <Flame className="w-6 h-6 text-white fill-white animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full">
                                ✨ Sanctuary Vigil Active
                            </span>
                            <h4 className="font-serif font-bold text-base text-gray-950 mt-1">
                                Your Flame is Burning Before the Lord
                            </h4>
                            <p className="text-xs text-gray-600 mt-0.5">
                                Intention: <em className="text-gray-900 font-semibold">"{prayerTitle}"</em>. Our community holds your petition in continuous prayer.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowVotiveModal(true)}
                                className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 border border-amber-500/40 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                            >
                                <span>📜</span>
                                <span>View Keepsake</span>
                            </button>
                            <Link
                                href="/my-vigils"
                                className="px-3 py-2 bg-white/90 hover:bg-white text-amber-950 border border-amber-300 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1"
                            >
                                <span>🕯️</span>
                                <span>My Vigils</span>
                            </Link>
                            <Link
                                href="/candles"
                                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs rounded-xl hover:scale-105 transition-all shadow-sm"
                            >
                                Sanctuary Wall →
                            </Link>
                        </div>
                    </div>
                )}

                {/* 3 Sacred Offerings Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Offering 1: Virtual Votive Candle */}
                    <button
                        type="button"
                        onClick={() => setIsCandleModalOpen(true)}
                        className="group flex flex-col justify-between p-5 rounded-2xl bg-white border border-amber-200/90 hover:border-gold-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-left cursor-pointer"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-colors">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-full">
                                    From $2.99
                                </span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-amber-800 transition-colors">
                                Light a Vigil Candle
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                Keep a glowing flame burning on the Sanctuary Prayer Wall for 3 to 30 days while you go about your week.
                            </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 w-full">
                            <span className="flex items-center text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
                                Light Candle <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </span>
                            <Link
                                href={`/candles?intention=${encodeURIComponent(prayerTitle)}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] text-gray-400 hover:text-amber-800 underline decoration-gray-300"
                                title="Browse all active candles in sanctuary"
                            >
                                Sanctuary wall
                            </Link>
                        </div>
                    </button>

                    {/* Offering 2: Holy Mass Offering */}
                    <Link
                        href={`/mass-offerings?intention=${encodeURIComponent(prayerTitle)}`}
                        className="group flex flex-col justify-between p-5 rounded-2xl bg-white border border-amber-200/90 hover:border-gold-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Church className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100/60 px-2 py-0.5 rounded-full">
                                    From $10.00
                                </span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-800 transition-colors">
                                Offer a Holy Mass
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                Have an ordained priest offer the Holy Sacrifice of the Mass for this specific medical, family, or personal burden.
                            </p>
                        </div>
                        <div className="flex items-center text-xs font-bold text-blue-800 group-hover:translate-x-1 transition-transform pt-2 border-t border-gray-100">
                            Request Mass <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </div>
                    </Link>

                    {/* Offering 3: Community Prayer Wall */}
                    <Link
                        href={`/prayer-wall?title=${encodeURIComponent(prayerTitle)}`}
                        className="group flex flex-col justify-between p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                                    Free
                                </span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-emerald-800 transition-colors">
                                Post to Prayer Wall
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                Invite our global global community of faithful believers to lift your intention in daily intercession.
                            </p>
                        </div>
                        <div className="flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform pt-2 border-t border-gray-100">
                            Post Intention <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </div>
                    </Link>
                </div>

                {/* Subtle Voluntary Alms Footnote */}
                <div className="mt-6 pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
                    <span className="flex items-center gap-1.5 text-center sm:text-left">
                        <span>🕊️</span>
                        <span>MyPrayerTower is kept free and ad-light for souls in crisis worldwide.</span>
                    </span>
                    <Link
                        href="/donate?amount=3&tier=ALMS"
                        className="font-bold text-amber-900 hover:text-amber-950 underline hover:no-underline shrink-0"
                    >
                        Give $3 Alms to Support Ministry →
                    </Link>
                </div>
            </div>

            {/* In-Place Candle Creation Modal */}
            <CandleCreationModal
                isOpen={isCandleModalOpen}
                initialIntention={prayerTitle}
                onClose={() => setIsCandleModalOpen(false)}
                onSuccess={handleCandleLitSuccess}
            />

            {/* Sacred Keepsake & Viral Share Certificate */}
            <DigitalVotiveCardModal
                isOpen={showVotiveModal}
                onClose={() => setShowVotiveModal(false)}
                prayerTitle={prayerTitle}
                durationDays={3}
                candleTierName="Devotion Votive"
            />
        </div>
    );
}
