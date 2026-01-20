'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, Flame, Users, Globe } from 'lucide-react';

interface LivePrayerCounterProps {
    /** Initial value */
    initialValue?: number;
    /** Label to show */
    label?: string;
    /** Icon to use */
    icon?: 'heart' | 'flame' | 'users' | 'globe';
    /** Update interval in ms */
    updateInterval?: number;
    /** Minimum increment per update */
    minIncrement?: number;
    /** Maximum increment per update */
    maxIncrement?: number;
    /** Additional className */
    className?: string;
}

const ICONS = {
    heart: Heart,
    flame: Flame,
    users: Users,
    globe: Globe,
};

/**
 * Real-time animated counter showing global prayers
 * Numbers animate smoothly on update
 */
export function LivePrayerCounter({
    initialValue = 1234567,
    label = 'Prayers Offered',
    icon = 'heart',
    updateInterval = 5000,
    minIncrement = 1,
    maxIncrement = 5,
    className = '',
}: LivePrayerCounterProps) {
    const [count, setCount] = useState(initialValue);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevCountRef = useRef(initialValue);

    useEffect(() => {
        const interval = setInterval(() => {
            const increment = Math.floor(Math.random() * (maxIncrement - minIncrement + 1)) + minIncrement;
            prevCountRef.current = count;
            setCount(prev => prev + increment);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 500);
        }, updateInterval);

        return () => clearInterval(interval);
    }, [count, updateInterval, minIncrement, maxIncrement]);

    const Icon = ICONS[icon];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`
                p-2 rounded-full bg-rose-100 dark:bg-rose-900/30
                ${isAnimating ? 'animate-pulse' : ''}
            `}>
                <Icon
                    size={20}
                    className={`
                        text-rose-500 dark:text-rose-400
                        ${isAnimating ? 'animate-heart-burst' : ''}
                    `}
                    fill={isAnimating ? 'currentColor' : 'none'}
                />
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                    <AnimatedNumber value={count} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
        </div>
    );
}

/**
 * Animated number component that smoothly transitions between values
 */
export function AnimatedNumber({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (value === displayValue) return;

        setIsAnimating(true);
        const duration = 500;
        const start = displayValue;
        const diff = value - start;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + diff * easeOut);

            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [value, displayValue]);

    return (
        <span className={isAnimating ? 'text-rose-600 dark:text-rose-400' : ''}>
            {displayValue.toLocaleString()}
        </span>
    );
}

/**
 * Compact inline counter for headers/banners
 */
export function InlineCounter({
    value,
    label,
    icon = 'heart',
    className = '',
}: {
    value: number;
    label: string;
    icon?: keyof typeof ICONS;
    className?: string;
}) {
    const Icon = ICONS[icon];

    return (
        <div className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
            <Icon size={14} className="text-rose-500" />
            <span className="font-bold tabular-nums">{value.toLocaleString()}</span>
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
        </div>
    );
}

/**
 * Stats bar showing multiple counters
 */
export function LiveStatsCounter({
    prayers = 1234567,
    users = 45678,
    churches = 10000,
    className = '',
}: {
    prayers?: number;
    users?: number;
    churches?: number;
    className?: string;
}) {
    const [liveStats, setLiveStats] = useState({ prayers, users, churches });

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveStats(prev => ({
                prayers: prev.prayers + Math.floor(Math.random() * 3) + 1,
                users: prev.users + (Math.random() > 0.7 ? 1 : 0),
                churches: prev.churches,
            }));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex items-center justify-center gap-8 py-4 ${className}`}>
            <LivePrayerCounter
                initialValue={liveStats.prayers}
                label="Prayers"
                icon="flame"
                updateInterval={4000}
            />
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            <InlineCounter value={liveStats.users} label="Users" icon="users" />
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            <InlineCounter value={liveStats.churches} label="Churches" icon="globe" />
        </div>
    );
}
