'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Cross, Heart, Sparkles, Plus, Share2 } from 'lucide-react';
import { openOfferingModal } from '@/components/offerings/UniversalOfferingModal';

interface MemorialItem {
    id: string;
    type: 'candle' | 'mass';
    title: string;
    dedicationType: string;
    intention: string;
    offeredBy: string;
    isAnonymous: boolean;
    prayerCount: number;
    createdAt: string;
}

export function SanctuaryMemorialsWall() {
    const [memorials, setMemorials] = useState<MemorialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'IN_MEMORY' | 'FOR_HEALING' | 'IN_THANKSGIVING'>('ALL');
    const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchRecent() {
            try {
                const res = await fetch('/api/offerings/recent');
                if (res.ok) {
                    const data = await res.json();
                    if (data.memorials) {
                        setMemorials(data.memorials);
                    }
                }
            } catch (err) {
                console.error('Failed to load memorials:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchRecent();
        const onUpdated = () => fetchRecent();
        window.addEventListener('mpt-offerings-updated', onUpdated);
        return () => window.removeEventListener('mpt-offerings-updated', onUpdated);
    }, []);

    const handlePrayForMemorial = (id: string, type: 'candle' | 'mass' = 'candle') => {
        if (prayedIds.has(id)) return;
        setPrayedIds(prev => new Set(prev).add(id));
        setMemorials(prev =>
            prev.map(m => (m.id === id ? { ...m, prayerCount: m.prayerCount + 1 } : m))
        );
        try {
            const count = parseInt(localStorage.getItem('mpt_prayed_count') || '0', 10) + 1;
            localStorage.setItem('mpt_prayed_count', String(count));
        } catch {}
        fetch('/api/offerings/pray', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, type }),
        }).catch(() => {});
    };

    const handleShareMemorial = async (item: MemorialItem) => {
        const text = `🕯️ Pray with me for ${item.offeredBy}:\n"${item.intention}"\n\n🙏 Tap "I Prayed" on MyPrayerTower: https://www.myprayertower.com/candles`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Pray With Me — MyPrayerTower', text, url: 'https://www.myprayertower.com/candles' });
                return;
            } catch {}
        }
        try {
            await navigator.clipboard.writeText(text);
        } catch {}
    };

    const getDedicationBadge = (type: string) => {
        switch (type) {
            case 'IN_MEMORY':
                return { label: 'In Loving Memory', bg: 'bg-purple-900/40 text-purple-200 border-purple-500/30' };
            case 'FOR_HEALING':
                return { label: 'For Healing & Grace', bg: 'bg-emerald-900/40 text-emerald-200 border-emerald-500/30' };
            case 'IN_THANKSGIVING':
                return { label: 'In Thanksgiving', bg: 'bg-amber-900/40 text-amber-200 border-amber-500/30' };
            default:
                return { label: 'Special Intention', bg: 'bg-blue-900/40 text-blue-200 border-blue-500/30' };
        }
    };

    const filteredMemorials = memorials.filter(m => {
        if (filter === 'ALL') return true;
        return m.dedicationType === filter;
    });

    return (
        <section className="py-16 bg-[#120E0A] border-t border-b border-gold-500/20 text-[#FAF6EE] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Sanctuary Roster of Patrons & Dedications
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-3">
                        The Perpetual Wall of Intentions
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        Reverent vigil candles and Holy Mass offerings lit by faithful souls across the globe. Join in prayer for their intentions or offer your own dedication before the altar.
                    </p>

                    {/* Filter Tabs & Dedicate CTA */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                        {(['ALL', 'IN_MEMORY', 'FOR_HEALING', 'IN_THANKSGIVING'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                    filter === tab
                                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                }`}
                            >
                                {tab === 'ALL' && 'All Offerings'}
                                {tab === 'IN_MEMORY' && 'In Loving Memory'}
                                {tab === 'FOR_HEALING' && 'For Healing'}
                                {tab === 'IN_THANKSGIVING' && 'Thanksgiving'}
                            </button>
                        ))}

                        <button
                            onClick={() => openOfferingModal('candle')}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 ml-2"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Dedicate an Offering</span>
                        </button>
                    </div>
                </div>

                {/* Memorials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-44 rounded-2xl bg-white/5 border border-white/5 animate-pulse"
                            />
                        ))
                    ) : filteredMemorials.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500 text-sm">
                            No dedications found in this category yet. Be the first to light a candle.
                        </div>
                    ) : (
                        filteredMemorials.map(item => {
                            const badge = getDedicationBadge(item.dedicationType);
                            const hasPrayed = prayedIds.has(item.id);

                            return (
                                <div
                                    key={item.id}
                                    className="group relative bg-[#130b21]/80 hover:bg-[#1a0f2d] border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Top Meta */}
                                        <div className="flex items-center justify-between mb-3 text-xs">
                                            <span
                                                className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${badge.bg}`}
                                            >
                                                {badge.label}
                                            </span>
                                            <div className="flex items-center gap-1 text-amber-400/80">
                                                {item.type === 'candle' ? (
                                                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                                                ) : (
                                                    <Cross className="w-3.5 h-3.5 text-amber-400" />
                                                )}
                                                <span className="text-[11px] font-serif">{item.title}</span>
                                            </div>
                                        </div>

                                        {/* Intention Text */}
                                        <p className="text-gray-200 text-sm font-serif italic mb-4 leading-relaxed line-clamp-3">
                                            “{item.intention}”
                                        </p>
                                    </div>

                                    {/* Bottom Footer */}
                                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                                        <div className="text-gray-400">
                                            <span className="text-amber-200/90 font-medium block">
                                                {item.offeredBy}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleShareMemorial(item)}
                                                data-engagement="Share Prayer / Intention"
                                                data-category="social"
                                                aria-label="Share intention"
                                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 transition-all"
                                            >
                                                <Share2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePrayForMemorial(item.id, item.type)}
                                                data-engagement="I Prayed for This"
                                                data-category="prayer"
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                                                    hasPrayed
                                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                        : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10'
                                                }`}
                                            >
                                                <Heart
                                                    className={`w-3.5 h-3.5 ${hasPrayed ? 'fill-amber-400 text-amber-400' : ''}`}
                                                />
                                                <span>{item.prayerCount} Prayed</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
