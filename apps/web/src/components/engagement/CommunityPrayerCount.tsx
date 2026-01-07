'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, TrendingUp, Flame } from 'lucide-react';

interface CommunityPrayerCountProps {
    /** Initial prayer count */
    count: number;
    /** Whether the current user has prayed */
    hasPrayed?: boolean;
    /** Callback when user prays */
    onPray?: () => void;
    /** Show trending indicator */
    showTrending?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Show pray button */
    showButton?: boolean;
}

/**
 * Community prayer counter with live updates and pray button
 */
export function CommunityPrayerCount({
    count: initialCount,
    hasPrayed = false,
    onPray,
    showTrending = true,
    size = 'md',
    showButton = true,
}: CommunityPrayerCountProps) {
    const [count, setCount] = useState(initialCount);
    const [prayed, setPrayed] = useState(hasPrayed);
    const [isAnimating, setIsAnimating] = useState(false);
    const [increment, setIncrement] = useState(0);

    // Simulate live updates
    useEffect(() => {
        if (!showTrending) return;

        const interval = setInterval(() => {
            const random = Math.random();
            if (random > 0.7) {
                const inc = Math.floor(Math.random() * 3) + 1;
                setCount(prev => prev + inc);
                setIncrement(inc);
                setTimeout(() => setIncrement(0), 1000);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [showTrending]);

    const handlePray = () => {
        if (prayed) return;

        setPrayed(true);
        setCount(prev => prev + 1);
        setIsAnimating(true);

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }

        setTimeout(() => setIsAnimating(false), 400);
        onPray?.();
    };

    const sizeClasses = {
        sm: { text: 'text-sm', icon: 14, button: 'px-3 py-1.5 text-xs' },
        md: { text: 'text-base', icon: 16, button: 'px-4 py-2 text-sm' },
        lg: { text: 'text-lg', icon: 20, button: 'px-5 py-2.5' },
    };

    const s = sizeClasses[size];

    return (
        <div className="flex items-center gap-3">
            {/* Prayer Counter */}
            <div className="flex items-center gap-1.5">
                <Heart
                    size={s.icon}
                    className={`text-rose-500 ${isAnimating ? 'animate-heart-burst fill-rose-500' : ''}`}
                    fill={prayed ? 'currentColor' : 'none'}
                />
                <span className={`${s.text} font-bold text-gray-900 dark:text-white tabular-nums`}>
                    {count.toLocaleString()}
                </span>

                {/* Live increment indicator */}
                {increment > 0 && (
                    <span className="text-xs text-emerald-500 font-bold animate-count-up">
                        +{increment}
                    </span>
                )}
            </div>

            {/* Trending Indicator */}
            {showTrending && count > 100 && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <TrendingUp size={12} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        Trending
                    </span>
                </div>
            )}

            {/* Pray Button */}
            {showButton && (
                <button
                    onClick={handlePray}
                    disabled={prayed}
                    className={`
                        ${s.button}
                        flex items-center gap-1.5 font-medium rounded-full transition-all
                        ${prayed
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 cursor-default'
                            : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50'
                        }
                    `}
                >
                    {prayed ? (
                        <>
                            <Heart size={s.icon - 2} className="fill-current" />
                            Prayed
                        </>
                    ) : (
                        <>
                            <Heart size={s.icon - 2} />
                            Pray
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

/**
 * Compact prayer count badge for cards
 */
export function PrayerCountBadge({
    count,
    hasPrayed = false,
}: {
    count: number;
    hasPrayed?: boolean;
}) {
    return (
        <div className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            ${hasPrayed
                ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }
        `}>
            <Heart size={14} fill={hasPrayed ? 'currentColor' : 'none'} />
            <span className="tabular-nums">{count.toLocaleString()}</span>
            <span className="text-xs opacity-70">prayers</span>
        </div>
    );
}

/**
 * Global prayer stats bar
 */
export function GlobalPrayerStats({
    totalPrayers = 1234567,
    todayPrayers = 12345,
    activeUsers = 234,
}: {
    totalPrayers?: number;
    todayPrayers?: number;
    activeUsers?: number;
}) {
    const [live, setLive] = useState({ total: totalPrayers, today: todayPrayers, active: activeUsers });

    useEffect(() => {
        const interval = setInterval(() => {
            setLive(prev => ({
                total: prev.total + Math.floor(Math.random() * 5),
                today: prev.today + Math.floor(Math.random() * 2),
                active: prev.active + (Math.random() > 0.5 ? 1 : -1),
            }));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center gap-6 py-3 px-6 bg-gradient-to-r from-sacred-50 to-gold-50 dark:from-sacred-900/20 dark:to-gold-900/20 rounded-xl border border-sacred-100 dark:border-sacred-800">
            <div className="flex items-center gap-2">
                <Heart size={18} className="text-rose-500" />
                <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                        {live.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Prayers</p>
                </div>
            </div>

            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />

            <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-500" />
                <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                        {live.today.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                </div>
            </div>

            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />

            <div className="flex items-center gap-2">
                <Users size={18} className="text-emerald-500" />
                <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                        {live.active}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Praying Now</p>
                </div>
            </div>
        </div>
    );
}
