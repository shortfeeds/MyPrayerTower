'use client';

import { Heart, Flame, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Stats {
    prayersToday: number;
    candlesLit: number;
    prayingNow: number;
}

export function LiveStatsBar() {
    // Initial state within requested ranges
    // Prayers Today: 15,000 - 35,000
    // Candles Lit: 7,000 - 14,000
    // Praying Now: 9,000 - 21,000
    const [stats, setStats] = useState<Stats>({
        prayersToday: 15420,
        candlesLit: 7850,
        prayingNow: 12450
    });

    // Pulse effect trigger
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        // Function to fetch real stats from DB
        const fetchStats = async () => {
            try {
                console.log('Fetching stats from API...');
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${API_BASE}/api/v1/stats`, { next: { revalidate: 30 } });
                if (res.ok) {
                    const data = await res.json();
                    console.log('Stats received:', data);
                    setStats({
                        prayersToday: data.prayersToday,
                        candlesLit: data.candlesLit,
                        prayingNow: data.prayingNow
                    });
                } else {
                    console.error('Stats API returned status:', res.status);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        // Fetch immediately
        fetchStats();

        // Fetch immediately (Polling removed to save Vercel Edge limits)

        // Local "Liveliness" Animation
        // Slightly fluctuates numbers between API calls to make it feel alive
        const livelinessInterval = setInterval(() => {
            setPulse(true);
            setTimeout(() => setPulse(false), 1000);

            setStats(prev => {
                // Fluctuates mostly "Praying Now", rarely increments others locally
                // ensuring we don't drift too far from server truth
                const newPrayingNow = prev.prayingNow + (Math.floor(Math.random() * 21) - 10);

                // Small chance to increment others
                const addPrayer = Math.random() > 0.8 ? 1 : 0;
                const addCandle = Math.random() > 0.9 ? 1 : 0;

                return {
                    prayersToday: prev.prayersToday + addPrayer,
                    candlesLit: prev.candlesLit + addCandle,
                    prayingNow: Math.max(9000, Math.min(21000, newPrayingNow))
                };
            });
        }, 3000);

        return () => {
            clearInterval(livelinessInterval);
        };
    }, []);

    const statItems = [
        { icon: Heart, label: 'prayers today', value: stats.prayersToday, color: 'text-rose-500' },
        { icon: Flame, label: 'candles lit', value: stats.candlesLit, color: 'text-amber-500' },
        { icon: Users, label: 'praying now', value: stats.prayingNow, color: 'text-emerald-500', pulse: true },
    ];

    return (
        <div className="bg-sacred-900/95 backdrop-blur-md border-b border-white/10 py-4 relative z-30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap">
                    {statItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="relative">
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                {item.pulse && (
                                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ${pulse ? 'animate-ping' : ''} opacity-75`} />
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                                <span className="font-display font-bold text-lg text-white tabular-nums leading-none">
                                    {item.value.toLocaleString()}
                                </span>
                                <span className="text-xs uppercase tracking-wider font-semibold text-white/60">{item.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function LiveStatsCompact() {
    const [prayingNow, setPrayingNow] = useState(12450);

    useEffect(() => {
        // Initial random
        setPrayingNow(9000 + Math.floor(Math.random() * 12000));

        const interval = setInterval(() => {
            setPrayingNow(prev => {
                const newValue = prev + (Math.floor(Math.random() * 21) - 10); // Smaller fluctuation for compact
                return Math.max(9000, Math.min(21000, newValue));
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-white/90 font-medium">
                    <span className="font-bold text-white tabular-nums">{prayingNow.toLocaleString()}</span> praying now
                </span>
            </div>
        </div>
    );
}
