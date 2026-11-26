'use client';

import { useEffect, useState } from 'react';
import { Flame, Sparkles, Globe2 } from 'lucide-react';

interface TickerItem {
    id: string;
    text: string;
}

const FALLBACK_TICKER: TickerItem[] = [
    { id: 't1', text: 'Candle lit by Carlos S. (Philippines) — Eternal repose of Maria Santos' },
    { id: 't2', text: 'Rosary sponsored by The Rodriguez Family (Madrid, Spain)' },
    { id: 't3', text: 'Healing candle lit by Patrick O. (Ireland) — Recovery after surgery' },
    { id: 't4', text: 'Perpetual Mass intention lifted by Fr. Thomas K. (United States)' },
];

export function GlobalSanctuaryTicker() {
    const [items, setItems] = useState<TickerItem[]>(FALLBACK_TICKER);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        async function loadLiveTicker() {
            try {
                const [offRes, spRes] = await Promise.all([
                    fetch('/api/offerings/recent').then(r => r.ok ? r.json() : null).catch(() => null),
                    fetch('/api/events/sponsored').then(r => r.ok ? r.json() : null).catch(() => null),
                ]);

                const live: TickerItem[] = [];
                if (Array.isArray(spRes?.config?.recentSponsors)) {
                    for (const sp of spRes.config.recentSponsors.slice(0, 4)) {
                        const loc = [sp.city, sp.country].filter(Boolean).join(', ');
                        const who = loc ? `${sp.family} (${loc})` : sp.family;
                        live.push({
                            id: `sp-${sp.id}`,
                            text: `${sp.packageTitle || 'Rosary'} — ${who}`,
                        });
                    }
                }
                if (Array.isArray(offRes?.memorials)) {
                    for (const m of offRes.memorials.slice(0, 6)) {
                        live.push({
                            id: `mem-${m.id}`,
                            text: `${m.title} by ${m.offeredBy}`,
                        });
                    }
                }
                if (live.length > 0) {
                    setItems(live);
                }
            } catch {
                // keep fallback
            }
        }
        loadLiveTicker();
    }, []);

    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setInterval(() => {
            setActiveIdx(prev => (prev + 1) % items.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [items.length]);

    const current = items[activeIdx % items.length] || FALLBACK_TICKER[0];

    return (
        <div className="bg-[#0D0A07] border-y border-gold-500/20 py-2.5 px-4">
            <div className="container mx-auto max-w-5xl flex items-center justify-center gap-2.5 text-xs sm:text-sm text-[#EADFC8]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                    <Globe2 className="w-3 h-3" />
                    Live Sanctuary
                </span>
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate font-serif italic">{current.text}</span>
                <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 hidden sm:inline" />
            </div>
        </div>
    );
}
