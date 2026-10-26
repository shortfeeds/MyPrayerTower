'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Clock, Crown, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { TabernacleLampModal } from './TabernacleLampModal';

interface TabernacleLampData {
    id: string;
    sponsorFamily: string;
    intention: string;
    litAt: string;
    expiresAt: string;
    prayerCount: number;
}

interface TabernacleLampBannerProps {
    initialLamp?: TabernacleLampData | null;
    onSponsorClick?: () => void;
}

export function TabernacleLampBanner({ initialLamp, onSponsorClick }: TabernacleLampBannerProps) {
    const [lamp, setLamp] = useState<TabernacleLampData | null>(initialLamp || null);
    const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 14, minutes: 22 });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadLamp = () => {
        try {
            const saved = localStorage.getItem('mpt_tabernacle_lamp');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (new Date(parsed.expiresAt).getTime() > Date.now()) {
                    setLamp(parsed);
                    return;
                }
            }
        } catch {
            // ignore
        }
        if (initialLamp) {
            setLamp(initialLamp);
        }
    };

    useEffect(() => {
        loadLamp();
        const handleUpdate = () => loadLamp();
        window.addEventListener('mpt-tabernacle-updated', handleUpdate);
        return () => window.removeEventListener('mpt-tabernacle-updated', handleUpdate);
    }, []);

    useEffect(() => {
        if (!lamp?.expiresAt) {
            setTimeLeft({ days: 6, hours: 23, minutes: 54 });
            return;
        }
        const update = () => {
            const diff = new Date(lamp.expiresAt).getTime() - Date.now();
            if (diff > 0) {
                const totalHours = Math.floor(diff / (1000 * 60 * 60));
                setTimeLeft({
                    days: Math.floor(totalHours / 24),
                    hours: totalHours % 24,
                    minutes: Math.floor((diff / (1000 * 60)) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            }
        };
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, [lamp?.expiresAt]);

    const handleOpenSponsor = () => {
        if (onSponsorClick) {
            onSponsorClick();
        } else {
            setIsModalOpen(true);
        }
    };

    const sponsorName = lamp?.sponsorFamily || 'The Faithful Communion';
    const intention = lamp?.intention || 'In Adoration & Protection of Catholic Families';

    return (
        <div className="relative my-8 rounded-3xl overflow-hidden border-2 border-red-500/40 bg-gradient-to-r from-[#1c080e] via-[#2a0c16] to-[#1a060d] text-white shadow-2xl p-6 md:p-8">
            {/* Ambient Ruby & Gold Radiance */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-1.5 border border-red-400/20 rounded-[22px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Animated Ruby Glass Lamp */}
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center shrink-0">
                        {/* Red Glass Glow */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-amber-900 flex items-center justify-center shadow-[0_0_35px_rgba(220,38,38,0.7)] border-2 border-amber-300/60 relative">
                            {/* Inner Flame */}
                            <Flame className="w-10 h-10 text-amber-200 fill-amber-300 animate-pulse drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                            <span className="absolute -bottom-2 text-[9px] font-serif font-black tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded-full bg-black/80 border border-amber-400/40">
                                Perpetual
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-amber-300 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Altar of the Blessed Sacrament</span>
                            </span>
                            <span className="text-[11px] font-mono text-red-200/60 hidden sm:inline">
                                Coram Deo ☩
                            </span>
                        </div>

                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-amber-100 tracking-tight">
                            The Sanctuary Tabernacle Lamp
                        </h2>

                        <p className="text-xs md:text-sm text-red-100/80 max-w-xl mt-1 leading-relaxed">
                            Signifying Christ's continuous Real Presence. This week's perpetual flame is consecrated for:
                        </p>

                        <div className="mt-2.5 p-3 rounded-xl bg-black/30 border border-red-500/30 inline-block">
                            <p className="text-sm font-serif font-bold text-amber-200 italic">
                                "{intention}"
                            </p>
                            <span className="text-[11px] text-red-200/70 block mt-0.5">
                                Dedicated by: <strong className="text-white">{sponsorName}</strong>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Countdown & Sponsorship Action */}
                <div className="flex flex-col sm:flex-row md:flex-col items-center sm:justify-end gap-3 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-red-500/20 pt-4 md:pt-0 md:pl-6">
                    <div className="text-center sm:text-right md:text-center w-full">
                        <span className="text-[10px] uppercase tracking-wider text-red-300/70 flex items-center justify-center md:justify-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Current Lamp Vigils</span>
                        </span>
                        <div className="text-lg font-serif font-bold text-amber-300 mt-0.5">
                            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m remaining
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenSponsor}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-slate-950 font-bold text-xs md:text-sm shadow-xl shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Crown className="w-4 h-4" />
                        <span>Sponsor Tabernacle Lamp</span>
                    </button>
                    
                    <span className="text-[10px] text-red-200/50 text-center">
                        7-Day Family Dedication &bull; Digital Altar Certificate
                    </span>
                </div>
            </div>

            {/* In-Page Dedicated Tabernacle Lamp Modal */}
            <TabernacleLampModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(data) => {
                    const expires = new Date(Date.now() + data.durationDays * 24 * 3600 * 1000).toISOString();
                    setLamp({
                        id: `lamp_${Date.now()}`,
                        sponsorFamily: data.familyName,
                        intention: data.intention,
                        litAt: new Date().toISOString(),
                        expiresAt: expires,
                        prayerCount: 1,
                    });
                }}
            />
        </div>
    );
}
