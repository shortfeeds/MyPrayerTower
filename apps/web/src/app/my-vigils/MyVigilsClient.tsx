'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
    Flame, Church, Heart, Sparkles, Clock, Check, 
    Share2, Plus, ArrowRight, ExternalLink, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { DigitalVotiveCardModal } from '@/components/candles/DigitalVotiveCardModal';
import { CandleCreationModal } from '@/components/candles/CandleCreationModal';
import { CertificateModal } from '@/components/certificates/CertificateModal';

export interface UserCandleRecord {
    id: string;
    intention: string;
    name?: string | null;
    duration?: string;
    durationDays?: number;
    litAt: string;
    expiresAt: string;
    isActive: boolean;
    prayerCount?: number;
    prayerId?: string;
    prayerTitle?: string;
}

export interface UserMassOfferingRecord {
    id: string;
    orderNumber: string;
    offeringType: string;
    intentionFor: string;
    offeredBy?: string | null;
    status: string;
    submittedAt?: string;
    createdAt?: string;
    celebrationDate?: string | null;
    celebrant?: string | null;
}

export interface SealedPrayerRecord {
    prayerId: string;
    prayerTitle: string;
    prayedAt: string;
    path: string;
}

interface MyVigilsClientProps {
    initialData: {
        candles: UserCandleRecord[];
        massOfferings: UserMassOfferingRecord[];
    };
}

function calculateTimeRemaining(expiresAtStr: string): {
    totalHours: number;
    days: number;
    hours: number;
    minutes: number;
    isExpired: boolean;
    formatted: string;
} {
    const diff = new Date(expiresAtStr).getTime() - Date.now();
    if (diff <= 0) {
        return { totalHours: 0, days: 0, hours: 0, minutes: 0, isExpired: true, formatted: 'Vigil Completed' };
    }

    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const formatted = days > 0 
        ? `${days}d ${hours}h remaining` 
        : `${hours}h ${minutes}m remaining`;

    return { totalHours, days, hours, minutes, isExpired: false, formatted };
}

export function MyVigilsClient({ initialData }: MyVigilsClientProps) {
    const [activeTab, setActiveTab] = useState<'candles' | 'masses' | 'sealed'>('candles');
    const [localCandles, setLocalCandles] = useState<UserCandleRecord[]>([]);
    const [localMasses, setLocalMasses] = useState<UserMassOfferingRecord[]>([]);
    const [sealedPrayers, setSealedPrayers] = useState<SealedPrayerRecord[]>([]);
    const [currentTime, setCurrentTime] = useState(Date.now());
    
    // Modal states
    const [selectedCandleForCard, setSelectedCandleForCard] = useState<UserCandleRecord | null>(null);
    const [selectedMassForCard, setSelectedMassForCard] = useState<UserMassOfferingRecord | null>(null);
    const [isCreateCandleOpen, setIsCreateCandleOpen] = useState(false);

    // Sync localStorage data
    useEffect(() => {
        try {
            const storedCandles = JSON.parse(localStorage.getItem('mpt_user_candles') || '[]');
            setLocalCandles(storedCandles);

            const storedMasses = JSON.parse(localStorage.getItem('mpt_user_mass_offerings') || '[]');
            setLocalMasses(storedMasses);

            const storedPrayers = JSON.parse(localStorage.getItem('mpt_sealed_prayers') || '[]');
            setSealedPrayers(storedPrayers);
        } catch {
            // Ignore storage read errors
        }

        // Live ticker for countdown clocks
        const interval = setInterval(() => setCurrentTime(Date.now()), 30000);
        return () => clearInterval(interval);
    }, []);

    // Merge server and local candle records (deduplicating by id or intention+litAt)
    const allCandles = useMemo(() => {
        const map = new Map<string, UserCandleRecord>();
        
        // Add server records
        initialData.candles.forEach(c => map.set(c.id, c));
        
        // Add local records
        localCandles.forEach(c => {
            const key = c.id || `${c.intention}_${c.litAt}`;
            if (!map.has(key)) {
                map.set(key, c);
            }
        });

        return Array.from(map.values()).sort((a, b) => 
            new Date(b.litAt).getTime() - new Date(a.litAt).getTime()
        );
    }, [initialData.candles, localCandles]);

    // Merge server and local mass records
    const allMasses = useMemo(() => {
        const map = new Map<string, UserMassOfferingRecord>();
        
        initialData.massOfferings.forEach(m => map.set(m.id || m.orderNumber, m));
        localMasses.forEach(m => {
            const key = m.id || m.orderNumber;
            if (!map.has(key)) {
                map.set(key, m);
            }
        });

        return Array.from(map.values()).sort((a, b) => {
            const timeA = new Date(a.createdAt || a.submittedAt || 0).getTime();
            const timeB = new Date(b.createdAt || b.submittedAt || 0).getTime();
            return timeB - timeA;
        });
    }, [initialData.massOfferings, localMasses]);

    const activeVigilCount = allCandles.filter(c => !calculateTimeRemaining(c.expiresAt).isExpired).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#120824] via-[#0d071a] to-[#080410] text-gray-100 font-sans pb-24">
            {/* Ambient Liturgical Glow Banner */}
            <div className="relative pt-16 pb-14 px-4 overflow-hidden border-b border-amber-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/15 via-purple-900/10 to-transparent pointer-events-none" />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4">
                        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                        <span>Personal Sanctuary Portal</span>
                    </div>

                    <h1 className="font-serif text-3xl md:text-5xl font-black text-amber-100 tracking-tight mb-3">
                        My Sacred Vigils
                    </h1>
                    <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
                        Track your burning vigil flames before the Lord, Holy Mass intentions, and commemorative keepsake certificates.
                    </p>

                    {/* Quick Stats Banner */}
                    <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mt-8 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="text-center p-2">
                            <span className="block text-2xl font-serif font-black text-amber-300">
                                {activeVigilCount}
                            </span>
                            <span className="text-[11px] text-gray-400 uppercase tracking-wider">Active Flames</span>
                        </div>
                        <div className="text-center p-2 border-x border-white/10">
                            <span className="block text-2xl font-serif font-black text-amber-300">
                                {allMasses.length}
                            </span>
                            <span className="text-[11px] text-gray-400 uppercase tracking-wider">Mass Offerings</span>
                        </div>
                        <div className="text-center p-2">
                            <span className="block text-2xl font-serif font-black text-amber-300">
                                {sealedPrayers.length}
                            </span>
                            <span className="text-[11px] text-gray-400 uppercase tracking-wider">Sealed Prayers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-4xl mx-auto px-4 mt-8">
                <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto mb-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab('candles')}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'candles'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Flame className="w-4 h-4" />
                        <span>Vigil Candles ({allCandles.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('masses')}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'masses'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Church className="w-4 h-4" />
                        <span>Holy Masses ({allMasses.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('sealed')}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'sealed'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Check className="w-4 h-4" />
                        <span>Amen Prayers ({sealedPrayers.length})</span>
                    </button>
                </div>

                {/* ─── TAB 1: VIGIL CANDLES ─── */}
                {activeTab === 'candles' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
                                <span>🕯️</span>
                                <span>Sanctuary Vigil Lamps</span>
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsCreateCandleOpen(true)}
                                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Light New Candle</span>
                            </button>
                        </div>

                        {allCandles.length === 0 ? (
                            <div className="text-center py-16 px-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                                    <Flame className="w-8 h-8 text-amber-400" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-amber-100 mb-2">No Active Vigils Lit Yet</h3>
                                <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
                                    Leave a physical sign of your intention burning before God. In Christian tradition, a votive candle remains in vigil long after your prayer is spoken.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateCandleOpen(true)}
                                    className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                                >
                                    <span>🕯️</span>
                                    <span>Light a Sanctuary Candle</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {allCandles.map((candle, idx) => {
                                    const time = calculateTimeRemaining(candle.expiresAt);
                                    const litDate = new Date(candle.litAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    });

                                    return (
                                        <div
                                            key={candle.id || idx}
                                            className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                                                !time.isExpired
                                                    ? 'bg-gradient-to-br from-[#1a0f30] to-[#120824] border-amber-400/40 shadow-xl shadow-amber-950/20'
                                                    : 'bg-white/[0.03] border-white/10 opacity-75'
                                            }`}
                                        >
                                            {/* Top Status */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                                        !time.isExpired
                                                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                                            : 'bg-gray-800 text-gray-400'
                                                    }`}>
                                                        <Flame className={`w-3 h-3 ${!time.isExpired ? 'fill-amber-400 animate-pulse text-amber-400' : 'text-gray-500'}`} />
                                                        <span>{!time.isExpired ? 'Vigil Active' : 'Completed Vigil'}</span>
                                                    </span>

                                                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{time.formatted}</span>
                                                    </span>
                                                </div>

                                                {/* Intention Title */}
                                                <h3 className="font-serif text-lg font-bold text-amber-100 leading-snug mb-2 italic">
                                                    "{candle.intention}"
                                                </h3>

                                                <div className="text-xs text-gray-400 space-y-1 mb-6">
                                                    <p>Offered by: <span className="text-gray-200 font-semibold">{candle.name || 'Faithful Soul'}</span></p>
                                                    <p>Placed on Altar: <span className="text-gray-300">{litDate}</span></p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 pt-4 border-t border-white/10 mt-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedCandleForCard(candle)}
                                                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <span>📜</span>
                                                    <span>Certificate</span>
                                                </button>

                                                <a
                                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                                        `🕊️ A holy vigil candle is burning before the Lord on MyPrayerTower for this intention: "${candle.intention}". \n\n📱 View prayer & join: https://www.myprayertower.com/app \nJoin Telegram: https://t.me/myprayertower`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                                    title="Share on WhatsApp"
                                                >
                                                    <span>💬</span>
                                                    <span className="hidden sm:inline">WhatsApp</span>
                                                </a>

                                                <Link
                                                    href="/candles"
                                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                                                    title="View Sanctuary Wall"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── TAB 2: HOLY MASS OFFERINGS ─── */}
                {activeTab === 'masses' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
                                <span>🍷</span>
                                <span>Holy Mass Intentions</span>
                            </h2>
                            <Link
                                href="/mass-offerings"
                                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Request a Mass</span>
                            </Link>
                        </div>

                        {allMasses.length === 0 ? (
                            <div className="text-center py-16 px-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                                    <Church className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-amber-100 mb-2">No Holy Mass Offerings Recorded</h3>
                                <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
                                    Entrust acute burdens, departed loved ones, and thanksgiving to the highest prayer on earth: The Eucharistic Sacrifice of the Mass offered by ordained Catholic priests.
                                </p>
                                <Link
                                    href="/mass-offerings"
                                    className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                                >
                                    <span>🍷</span>
                                    <span>Request a Holy Mass Offering</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {allMasses.map((mass, idx) => (
                                    <div
                                        key={mass.id || idx}
                                        className="p-6 rounded-3xl bg-gradient-to-r from-[#170e28] to-[#120824] border border-amber-400/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                                                <Church className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/70">
                                                        #{mass.orderNumber}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                                        {mass.status || 'SCHEDULED'}
                                                    </span>
                                                </div>
                                                <h3 className="font-serif text-lg font-bold text-amber-100 italic">
                                                    "{mass.intentionFor}"
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {mass.offeringType} &bull; Requested by {mass.offeredBy || 'Faithful Soul'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 self-end md:self-center">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedMassForCard(mass)}
                                                className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                                            >
                                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                                <span>View Certificate</span>
                                            </button>
                                            <a
                                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                                    `🍷 A Holy Mass has been requested on MyPrayerTower for this intention: "${mass.intentionFor}". May God bless and grant grace. \n\n📱 View & pray: https://www.myprayertower.com/app \nJoin Telegram: https://t.me/myprayertower`
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                                            >
                                                <span>💬</span>
                                                <span>Share Blessing</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── TAB 3: SEALED AMEN PRAYERS ─── */}
                {activeTab === 'sealed' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
                                <span>🙏</span>
                                <span>Prayers Sealed with "Amen"</span>
                            </h2>
                            <Link
                                href="/prayers"
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                                <span>Browse Prayers</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {sealedPrayers.length === 0 ? (
                            <div className="text-center py-16 px-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-amber-100 mb-2">No Prayers Sealed Yet</h3>
                                <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
                                    Whenever you finish reading a prayer on MyPrayerTower and click "Say Amen & Seal This Prayer", it will be permanently recorded in your personal sanctuary corner.
                                </p>
                                <Link
                                    href="/prayers"
                                    className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                                >
                                    <span>🙏</span>
                                    <span>Explore Treasury of Prayers</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {sealedPrayers.map((prayer, idx) => (
                                    <div
                                        key={prayer.prayerId || idx}
                                        className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-between group"
                                    >
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1 mb-1">
                                                <Check className="w-3 h-3" />
                                                <span>Amen Sealed</span>
                                            </span>
                                            <h3 className="font-serif font-bold text-white group-hover:text-amber-200 transition-colors text-base">
                                                {prayer.prayerTitle}
                                            </h3>
                                            <span className="text-[11px] text-gray-500 block mt-1">
                                                Recited: {new Date(prayer.prayedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <Link
                                            href={prayer.path || `/prayers/${prayer.prayerId}`}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-gray-400 transition-all"
                                            title="Pray Again"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Sanctuary Footer Scripture */}
                <div className="mt-16 text-center max-w-md mx-auto p-6 rounded-2xl bg-white/[0.02] border border-amber-500/20">
                    <p className="font-serif italic text-amber-200/80 text-sm leading-relaxed mb-2">
                        "Let my prayer be set forth before thee as incense; and the lifting up of my hands as the evening sacrifice."
                    </p>
                    <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                        — Psalm 141:2
                    </span>
                </div>
            </div>

            {/* Keepsake Candle Certificate Modal */}
            {selectedCandleForCard && (
                <DigitalVotiveCardModal
                    isOpen={!!selectedCandleForCard}
                    onClose={() => setSelectedCandleForCard(null)}
                    prayerTitle={selectedCandleForCard.intention}
                    userName={selectedCandleForCard.name || 'Faithful Soul'}
                    durationDays={selectedCandleForCard.durationDays || 7}
                    candleTierName={selectedCandleForCard.duration || 'Sanctuary Vigil'}
                    prayerUrl={typeof window !== 'undefined' ? `${window.location.origin}/candles` : undefined}
                />
            )}

            {/* Keepsake Holy Mass Certificate Modal */}
            {selectedMassForCard && (
                <CertificateModal
                    isOpen={!!selectedMassForCard}
                    onClose={() => setSelectedMassForCard(null)}
                    type="mass-offering"
                    title="HOLY MASS OFFERING CERTIFICATE"
                    latinTitle="Sacrificium Sanctissimum Missae"
                    recipientName={selectedMassForCard.intentionFor}
                    donorName={selectedMassForCard.offeredBy || 'Faithful Soul'}
                    dedicatedDetail={`${selectedMassForCard.offeringType} • Sacred Vigil Record`}
                    serialNumber={`MPT-MASS-${selectedMassForCard.orderNumber || new Date().getFullYear()}`}
                    celebrantOrSanctuary="Sanctuary of Perpetual Adoration & Sacred Altars"
                />
            )}

            {/* New Candle Creation Modal */}
            {isCreateCandleOpen && (
                <CandleCreationModal
                    isOpen={isCreateCandleOpen}
                    onClose={() => setIsCreateCandleOpen(false)}
                    onSuccess={() => {
                        setIsCreateCandleOpen(false);
                        try {
                            const updated = JSON.parse(localStorage.getItem('mpt_user_candles') || '[]');
                            setLocalCandles(updated);
                        } catch {
                            // ignore
                        }
                    }}
                />
            )}
        </div>
    );
}
