'use client';

import React, { useState } from 'react';
import {
    Flame,
    Crown,
    Sparkles,
    Shield,
    X,
    Clock,
    Lock,
    CheckCircle,
    Calendar,
    Download
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { CertificateModal } from '@/components/certificates/CertificateModal';

const PayPalCheckout = dynamic(
    () => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout),
    { ssr: false }
);

interface TabernacleLampModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (sponsorData: { familyName: string; intention: string; durationDays: number }) => void;
}

export function TabernacleLampModal({ isOpen, onClose, onSuccess }: TabernacleLampModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [familyName, setFamilyName] = useState('');
    const [intention, setIntention] = useState('In Thanksgiving, Healing & Divine Protection for Our Family');
    const [email, setEmail] = useState('');
    const [durationDays, setDurationDays] = useState<7 | 14 | 30>(7);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    if (!isOpen) return null;

    const getPrice = () => {
        switch (durationDays) {
            case 7: return 25.00;
            case 14: return 45.00;
            case 30: return 89.00;
            default: return 25.00;
        }
    };

    const handlePayPalSuccess = (details: any) => {
        const sponsorData = {
            familyName: familyName.trim() || 'Faithful Catholic Family',
            intention: intention.trim(),
            durationDays,
        };

        // Save to localStorage for real-time banner update
        try {
            const now = new Date();
            const expires = new Date(now.getTime() + durationDays * 24 * 3600 * 1000);
            localStorage.setItem('mpt_tabernacle_lamp', JSON.stringify({
                id: `tabernacle_${Date.now()}`,
                sponsorFamily: sponsorData.familyName,
                intention: sponsorData.intention,
                litAt: now.toISOString(),
                expiresAt: expires.toISOString(),
                prayerCount: 1,
            }));
            window.dispatchEvent(new Event('mpt-tabernacle-updated'));
        } catch {
            // private browsing fallback
        }

        if (onSuccess) {
            onSuccess(sponsorData);
        }

        setIsCompleted(true);
        setIsCertModalOpen(true);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
            <div className="relative w-full max-w-lg bg-[#14080e] border-2 border-red-500/50 rounded-3xl shadow-[0_25px_80px_rgba(220,38,38,0.4)] overflow-hidden my-auto p-5 sm:p-7 text-white">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header: Sacred Ruby Glass Emblem */}
                <div className="text-center pt-2 pb-4 border-b border-red-500/20">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-amber-900 border-2 border-amber-300/80 shadow-[0_0_35px_rgba(220,38,38,0.8)] flex items-center justify-center mx-auto mb-3 relative">
                        <Flame className="w-9 h-9 text-amber-200 fill-amber-300 animate-pulse drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                        <span className="absolute -bottom-2 text-[8px] font-serif font-black tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded-full bg-black/90 border border-amber-400/50">
                            Perpetual
                        </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Altar of the Blessed Sacrament</span>
                    </div>

                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-amber-100">
                        Sponsor The Tabernacle Lamp
                    </h3>
                    <p className="text-xs text-red-200/80 max-w-sm mx-auto mt-1 leading-relaxed">
                        In Catholic tradition (Canon 940), this sacred flame burns night and day before the Tabernacle to signify Christ&apos;s Eucharistic Real Presence.
                    </p>
                </div>

                {step === 1 && !isCompleted && (
                    <div className="space-y-4 py-4">
                        {/* Duration Selection */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80 mb-2">
                                Select Vigil Duration
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { days: 7, label: '7-Day Vigil', sub: 'Traditional 1-Week', price: '$25.00' },
                                    { days: 14, label: '14-Day Vigil', sub: 'Fortnight Grace', price: '$45.00' },
                                    { days: 30, label: '30-Day Vigil', sub: 'Full Month Adoration', price: '$89.00' },
                                ].map(opt => (
                                    <button
                                        key={opt.days}
                                        type="button"
                                        onClick={() => setDurationDays(opt.days as any)}
                                        className={`p-3 rounded-2xl border text-center transition-all ${
                                            durationDays === opt.days
                                                ? 'bg-red-950/70 border-amber-400 ring-1 ring-amber-400'
                                                : 'bg-black/40 border-red-500/20 hover:border-amber-400/40'
                                        }`}
                                    >
                                        <span className="block text-xs font-bold text-white">{opt.label}</span>
                                        <span className="block text-[10px] text-red-200/60 mt-0.5">{opt.sub}</span>
                                        <span className="block text-sm font-black text-amber-300 font-mono mt-1">{opt.price}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sponsor Family / Individual */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80 mb-1">
                                Family or Sponsor Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. The D&apos;Souza Family / Maria &amp; Joseph"
                                value={familyName}
                                onChange={e => setFamilyName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-red-500/30 bg-black/50 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>

                        {/* Dedication Intention */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80 mb-1">
                                Sacred Dedication Intention
                            </label>
                            <textarea
                                rows={2}
                                placeholder="e.g. For divine healing, protection, and peace in our home."
                                value={intention}
                                onChange={e => setIntention(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-red-500/30 bg-black/50 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80 mb-1">
                                Email (For Official Certificate &amp; Archival Receipt)
                            </label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-red-500/30 bg-black/50 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>

                        {/* Privileges Included Strip */}
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-1.5 text-xs text-amber-200/90">
                            <div className="flex items-center gap-2 font-bold text-amber-300">
                                <Crown className="w-4 h-4" />
                                <span>Solemn Tabernacle Privileges:</span>
                            </div>
                            <ul className="space-y-1 pl-6 list-disc text-[11px] text-amber-100/80">
                                <li>Consecrated placement at the Altar of Perpetual Adoration</li>
                                <li>Prominent Family Name &amp; Intention banner displayed on Sanctuary Chapel</li>
                                <li>Official Archival Consecration Certificate ready to download and frame</li>
                            </ul>
                        </div>

                        {/* Proceed to Payment Button */}
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Crown className="w-4 h-4" />
                            <span>Continue to Consecration (${getPrice().toFixed(2)})</span>
                        </button>
                    </div>
                )}

                {/* Step 2: In-Page Embedded PayPal Checkout */}
                {step === 2 && !isCompleted && (
                    <div className="py-4 space-y-4">
                        <div className="text-center space-y-1 pb-2 border-b border-red-500/20">
                            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                                Consecration Stipend
                            </span>
                            <div className="text-3xl font-serif font-black text-white font-mono">
                                ${getPrice().toFixed(2)} USD
                            </div>
                            <p className="text-xs text-red-200/70">
                                {durationDays}-Day Eucharistic Tabernacle Lamp for &ldquo;{familyName || 'Faithful Family'}&rdquo;
                            </p>
                        </div>

                        <div className="min-h-[150px] relative z-0">
                            <PayPalCheckout
                                amount={Math.round(getPrice() * 100)}
                                description={`Tabernacle Lamp Consecration: ${familyName || 'Catholic Family'}`}
                                onSuccess={handlePayPalSuccess}
                                onError={() => alert('Payment failed. Please try again.')}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-center text-xs text-white/50 hover:text-white pt-2 transition-colors"
                        >
                            ← Back to edit dedication details
                        </button>
                    </div>
                )}

                {/* Completed State */}
                {isCompleted && (
                    <div className="py-6 text-center space-y-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h4 className="font-serif font-bold text-xl text-white">
                            Tabernacle Lamp Consecrated!
                        </h4>
                        <p className="text-xs text-red-100/80 max-w-sm mx-auto leading-relaxed">
                            The Sanctuary Tabernacle Lamp is now burning for <strong>{familyName || 'Your Family'}</strong> before the Blessed Sacrament.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsCertModalOpen(true)}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 mx-auto"
                        >
                            <Download className="w-4 h-4" />
                            <span>View &amp; Download Consecration Certificate</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Official Archival Consecration Certificate Modal */}
            <CertificateModal
                isOpen={isCertModalOpen}
                onClose={() => {
                    setIsCertModalOpen(false);
                    onClose();
                }}
                type="tabernacle"
                recipientName={familyName || 'The Faithful Family'}
                dedicatedDetail={`7-Day Perpetual Eucharistic Vigil • Altar of the Blessed Sacrament`}
                intention={intention}
                donorName={familyName || 'Devoted Catholic Family'}
                celebrantOrSanctuary="Sanctuary of the Blessed Sacrament & Perpetual Adoration"
                scripture="Command the children of Israel that they bring unto thee pure oil olive beaten for the light, to cause the lamps to burn continually without the vail of the testimony in the tabernacle."
                scriptureRef="Leviticus 24:2-3"
            />
        </div>
    );
}
