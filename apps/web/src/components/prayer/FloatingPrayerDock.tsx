'use client';

import React, { useState } from 'react';
import { 
    Volume2, VolumeX, Pause, Play, 
    Type, Palette, Maximize2, Minimize2, 
    Heart, Check, Flame, Copy, Share2, Sparkles, X 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type PrayerTheme = 'parchment' | 'sepia' | 'sanctuary';
export type PrayerFontSize = 'sm' | 'base' | 'lg' | 'xl';

interface FloatingPrayerDockProps {
    prayerTitle: string;
    prayerContent: string;
    prayerUrl: string;
    fontSize: PrayerFontSize;
    setFontSize: (size: PrayerFontSize) => void;
    theme: PrayerTheme;
    setTheme: (theme: PrayerTheme) => void;
    isFocusMode: boolean;
    setIsFocusMode: (focus: boolean) => void;
    isPlayingAudio: boolean;
    toggleAudio: () => void;
    hasPrayed: boolean;
    onPray: () => void;
    onLightCandle?: () => void;
}

export function FloatingPrayerDock({
    prayerTitle,
    prayerContent,
    prayerUrl,
    fontSize,
    setFontSize,
    theme,
    setTheme,
    isFocusMode,
    setIsFocusMode,
    isPlayingAudio,
    toggleAudio,
    hasPrayed,
    onPray,
    onLightCandle
}: FloatingPrayerDockProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${prayerTitle}\n\n${prayerContent}\n\nVia MyPrayerTower: ${prayerUrl}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(
            `🙏 *${prayerTitle}*\n\n${prayerContent.slice(0, 500)}${prayerContent.length > 500 ? '...' : ''}\n\n✨ Read full prayer on MyPrayerTower:\n${prayerUrl}`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <>
            {/* Preferences Flyout Modal / Popover */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="bg-[#120a1f] border border-[#d4af37]/30 text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                                <h3 className="font-bold text-sm uppercase tracking-wider text-white">Prayer Reading Ergonomics</h3>
                            </div>
                            <button 
                                onClick={() => setShowSettings(false)}
                                className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Font Size Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Text Size</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(
                                    [
                                        { id: 'sm', label: 'A', desc: 'Compact' },
                                        { id: 'base', label: 'A+', desc: 'Regular' },
                                        { id: 'lg', label: 'A++', desc: 'Comfort' },
                                        { id: 'xl', label: 'A+++', desc: 'Large' },
                                    ] as const
                                ).map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setFontSize(item.id)}
                                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                                            fontSize === item.id
                                                ? 'bg-[#d4af37] text-[#0a0612] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 scale-105'
                                                : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <div>{item.label}</div>
                                        <div className="text-[9px] opacity-75 font-normal">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reading Color Theme */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Atmosphere Theme</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'parchment', name: 'Daylight', bg: 'bg-[#faf9f6]', text: 'text-slate-900', border: 'border-slate-300' },
                                    { id: 'sepia', name: 'Candlelight', bg: 'bg-[#fcf5e5]', text: 'text-amber-950', border: 'border-amber-300' },
                                    { id: 'sanctuary', name: 'Sanctuary Night', bg: 'bg-[#0a0612]', text: 'text-amber-100', border: 'border-[#d4af37]/40' },
                                ].map((thm) => (
                                    <button
                                        key={thm.id}
                                        type="button"
                                        onClick={() => setTheme(thm.id as PrayerTheme)}
                                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                                            theme === thm.id
                                                ? 'ring-2 ring-[#d4af37] border-transparent scale-105 shadow-md'
                                                : 'border-white/10 hover:border-white/30'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full ${thm.bg} ${thm.border} border shadow-inner flex items-center justify-center text-xs font-serif font-black`}>
                                            ✝
                                        </div>
                                        <span className="text-[11px] font-medium text-white/90">{thm.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowSettings(false)}
                            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                            Apply & Continue Praying
                        </button>
                    </div>
                </div>
            )}

            {/* ── Sacred Floating Capsule Dock ── */}
            {/* 
                Mobile: bottom-[84px] (20px ABOVE MobileBottomNav which is at bottom-0 h-16)
                Desktop: bottom-8 centered
            */}
            <aside 
                aria-label="Prayer Controls Dock"
                className="fixed bottom-[84px] md:bottom-8 left-3 right-3 md:left-1/2 md:-translate-x-1/2 z-40 max-w-lg md:max-w-xl mx-auto"
            >
                <div className="bg-[#0e0818]/92 backdrop-blur-xl border border-[#d4af37]/40 rounded-2xl px-3 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-1.5 md:gap-3 text-white transition-all">
                    
                    {/* Audio Recitation (Listen / Pause) */}
                    <button
                        type="button"
                        onClick={toggleAudio}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                            isPlayingAudio 
                                ? 'bg-amber-500 text-[#0a0612] animate-pulse shadow-md' 
                                : 'bg-white/10 text-white hover:bg-white/15'
                        }`}
                        title={isPlayingAudio ? 'Pause Audio Recitation' : 'Listen to Prayer Aloud'}
                    >
                        {isPlayingAudio ? (
                            <>
                                <Pause className="w-4 h-4 fill-current" />
                                <span className="hidden sm:inline">Pause</span>
                            </>
                        ) : (
                            <>
                                <Volume2 className="w-4 h-4 text-[#d4af37]" />
                                <span className="hidden sm:inline">Listen</span>
                            </>
                        )}
                    </button>

                    {/* Font & Theme Settings */}
                    <button
                        type="button"
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                        title="Change Font Size & Night/Sepia Reading Theme"
                    >
                        <Type className="w-4 h-4" />
                    </button>

                    {/* Focus Mode (Fullscreen Meditation) */}
                    <button
                        type="button"
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`p-2 rounded-xl transition-all active:scale-95 ${
                            isFocusMode 
                                ? 'bg-[#d4af37] text-[#0a0612] shadow-md' 
                                : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
                        }`}
                        title={isFocusMode ? 'Exit Focus Mode' : 'Enter Distraction-Free Prayer Mode'}
                    >
                        {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    <div className="h-6 w-px bg-white/15 mx-0.5" />

                    {/* Primary Devotional Action: "I Prayed This" */}
                    <button
                        type="button"
                        onClick={onPray}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md ${
                            hasPrayed
                                ? 'bg-emerald-600/80 text-white border border-emerald-400/40'
                                : 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#0a0612] hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        }`}
                    >
                        {hasPrayed ? (
                            <>
                                <Check className="w-4 h-4 text-emerald-200" />
                                <span className="truncate">Prayed</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm">🙏</span>
                                <span className="truncate">Say Amen</span>
                            </>
                        )}
                    </button>

                    {/* Light a Candle Intention */}
                    {onLightCandle && (
                        <button
                            type="button"
                            onClick={onLightCandle}
                            className="p-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 transition-all active:scale-95 shrink-0"
                            title="Light a Virtual Candle for this Intention"
                        >
                            <Flame className="w-4 h-4 text-orange-400" />
                        </button>
                    )}

                    {/* Copy Text */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95 shrink-0"
                        title="Copy Prayer to Clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* WhatsApp 1-Click Share */}
                    <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="p-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 transition-all active:scale-95 shrink-0"
                        title="Share to WhatsApp Prayer Circle"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </aside>
        </>
    );
}
