'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, Heart, Plus } from 'lucide-react';

interface Candle {
    id: string;
    intention: string;
    userName: string;
    remainingHours: number;
    prayerCount: number;
    tier: 'premium' | 'standard' | 'basic' | 'free';
    createdAt: string;
}

export function ActiveCandlesList() {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch - replace with actual API call
        const fetchCandles = async () => {
            setIsLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data
                const mockCandles: Candle[] = [
                    {
                        id: '1',
                        intention: 'For the health of my family',
                        userName: 'Me',
                        remainingHours: 72,
                        prayerCount: 12,
                        tier: 'standard',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '2',
                        intention: 'Guidance in my career',
                        userName: 'Me',
                        remainingHours: 24,
                        prayerCount: 5,
                        tier: 'free',
                        createdAt: new Date().toISOString(),
                    }
                ];
                setCandles(mockCandles);
            } catch (error) {
                console.error('Failed to fetch candles:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandles();
    }, []);

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'premium': return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950';
            case 'standard': return 'bg-blue-100 text-blue-700';
            case 'basic': return 'bg-rose-100 text-rose-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                        <div className="h-4 w-1/3 bg-gray-200 rounded mb-3" />
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
                        <div className="flex justify-between mt-4">
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (candles.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Flame className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">No Active Candles</h3>
                <p className="text-sm text-gray-500 mb-4">Light a candle to carry your prayers.</p>
                <Link
                    href="/candles"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Light a Candle
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Your Active Candles</h3>
                <Link href="/candles" className="text-sm text-gold-600 hover:text-gold-700 font-medium">Light New +</Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {candles.map(candle => (
                    <div key={candle.id} className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-gold-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTierColor(candle.tier)}`}>
                                {candle.tier}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-medium text-sacred-600 bg-sacred-50 px-2 py-1 rounded-full">
                                <Heart size={12} className="fill-current" />
                                {candle.prayerCount}
                            </div>
                        </div>

                        <h4 className="font-medium text-gray-900 mb-4 line-clamp-2">"{candle.intention}"</h4>

                        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                <span>{candle.remainingHours}h remaining</span>
                            </div>
                            <Link href={`/candles?view=${candle.id}`} className="hover:text-gold-600 font-medium">
                                View Details →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
