'use client';

import { useState, useEffect } from 'react';
import { Flame, Star, Trophy, Crown, Zap, Calendar, Target, Award } from 'lucide-react';

interface PrayerStreaksProps {
    /** Current streak count */
    streak?: number;
    /** Longest streak ever */
    longestStreak?: number;
    /** Whether user prayed today */
    prayedToday?: boolean;
    /** Total prayers count */
    totalPrayers?: number;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Show milestone celebration */
    showMilestone?: boolean;
}

// Milestone definitions
const MILESTONES = [
    { days: 7, icon: Star, label: '1 Week', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
    { days: 30, icon: Trophy, label: '1 Month', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
    { days: 100, icon: Crown, label: '100 Days', color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
    { days: 365, icon: Award, label: '1 Year', color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/30' },
];

/**
 * Prayer streak badge with fire animation
 */
export function PrayerStreaks({
    streak = 0,
    longestStreak = 0,
    prayedToday = false,
    totalPrayers = 0,
    size = 'md',
    showMilestone = true,
}: PrayerStreaksProps) {
    const [showCelebration, setShowCelebration] = useState(false);
    const [currentMilestone, setCurrentMilestone] = useState<typeof MILESTONES[0] | null>(null);

    useEffect(() => {
        // Check if user just hit a milestone
        const milestone = MILESTONES.find(m => m.days === streak);
        if (milestone && showMilestone) {
            setCurrentMilestone(milestone);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
    }, [streak, showMilestone]);

    const sizeClasses = {
        sm: { badge: 'p-2', icon: 16, text: 'text-sm', ring: 'w-12 h-12' },
        md: { badge: 'p-3', icon: 20, text: 'text-base', ring: 'w-16 h-16' },
        lg: { badge: 'p-4', icon: 28, text: 'text-lg', ring: 'w-20 h-20' },
    };

    const s = sizeClasses[size];

    // Get flame color based on streak
    const getFlameColor = () => {
        if (streak >= 100) return 'text-amber-400';
        if (streak >= 30) return 'text-orange-500';
        if (streak >= 7) return 'text-orange-400';
        return 'text-gray-400';
    };

    // Get streak level
    const getStreakLevel = () => {
        if (streak >= 365) return { label: 'Legendary', color: 'from-amber-400 to-red-500' };
        if (streak >= 100) return { label: 'Master', color: 'from-purple-500 to-pink-500' };
        if (streak >= 30) return { label: 'Devoted', color: 'from-blue-500 to-cyan-500' };
        if (streak >= 7) return { label: 'Faithful', color: 'from-emerald-500 to-teal-500' };
        return { label: 'Beginner', color: 'from-gray-400 to-gray-500' };
    };

    const level = getStreakLevel();

    return (
        <div className="relative">
            {/* Milestone celebration overlay */}
            {showCelebration && currentMilestone && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-2xl animate-fade-in">
                    <div className="text-center text-white p-4">
                        <currentMilestone.icon size={48} className="mx-auto mb-2 text-amber-400 animate-bounce" />
                        <p className="text-xl font-bold">🎉 {currentMilestone.label} Streak!</p>
                        <p className="text-sm text-white/80">Keep up the great work!</p>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4">
                {/* Streak Ring */}
                <div className="relative">
                    <div className={`
                        ${s.ring} rounded-full 
                        bg-gradient-to-br ${level.color}
                        flex items-center justify-center
                        ${prayedToday ? 'shadow-lg shadow-orange-500/30' : 'opacity-60'}
                    `}>
                        <Flame
                            size={s.icon + 8}
                            className={`${getFlameColor()} ${prayedToday ? 'animate-pulse' : ''}`}
                            fill={streak > 0 ? 'currentColor' : 'none'}
                        />
                    </div>

                    {/* Streak count badge */}
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full px-2 py-0.5 text-xs font-bold shadow border border-gray-100 dark:border-gray-700">
                        {streak}
                    </div>
                </div>

                {/* Stats */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`${s.text} font-bold text-gray-900 dark:text-white`}>
                            {streak} Day Streak
                        </span>
                        <span className={`
                            px-2 py-0.5 rounded-full text-xs font-semibold
                            bg-gradient-to-r ${level.color} text-white
                        `}>
                            {level.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <Trophy size={12} />
                            Best: {longestStreak}
                        </span>
                        <span className="flex items-center gap-1">
                            <Zap size={12} />
                            Total: {totalPrayers.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Compact streak badge for headers/cards
 */
export function StreakBadge({
    streak,
    size = 'sm',
    showLabel = true,
}: {
    streak: number;
    size?: 'sm' | 'md';
    showLabel?: boolean;
}) {
    const isActive = streak > 0;

    return (
        <div className={`
            inline-flex items-center gap-1.5 
            ${size === 'md' ? 'px-3 py-1.5' : 'px-2 py-1'}
            rounded-full font-medium
            ${isActive
                ? 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-600 dark:text-orange-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }
        `}>
            <Flame
                size={size === 'md' ? 16 : 14}
                className={isActive ? 'animate-pulse' : ''}
                fill={isActive ? 'currentColor' : 'none'}
            />
            <span className={size === 'md' ? 'text-sm' : 'text-xs'}>
                {streak}
                {showLabel && <span className="ml-0.5">{streak === 1 ? 'day' : 'days'}</span>}
            </span>
        </div>
    );
}

/**
 * Achievement badges grid
 */
export function AchievementBadges({
    earnedBadges = [],
    totalPrayers = 0,
    streak = 0,
}: {
    earnedBadges?: string[];
    totalPrayers?: number;
    streak?: number;
}) {
    const badges = [
        { id: 'first-prayer', label: 'First Prayer', icon: Star, unlocked: totalPrayers >= 1 },
        { id: 'week-streak', label: '7 Day Streak', icon: Flame, unlocked: streak >= 7 },
        { id: 'month-streak', label: '30 Day Streak', icon: Trophy, unlocked: streak >= 30 },
        { id: 'century', label: '100 Prayers', icon: Target, unlocked: totalPrayers >= 100 },
        { id: 'devotee', label: '1000 Prayers', icon: Crown, unlocked: totalPrayers >= 1000 },
        { id: 'daily-devotee', label: 'Daily Devotee', icon: Calendar, unlocked: streak >= 365 },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {badges.map(badge => (
                <div
                    key={badge.id}
                    className={`
                        p-3 rounded-xl text-center transition-all
                        ${badge.unlocked
                            ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800'
                            : 'bg-gray-50 dark:bg-gray-800/50 opacity-40'
                        }
                    `}
                >
                    <badge.icon
                        size={24}
                        className={`
                            mx-auto mb-1
                            ${badge.unlocked ? 'text-amber-500' : 'text-gray-400'}
                        `}
                        fill={badge.unlocked ? 'currentColor' : 'none'}
                    />
                    <span className={`
                        text-xs font-medium
                        ${badge.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}
                    `}>
                        {badge.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

/**
 * Daily reward unlock component
 */
export function DailyReward({
    claimed = false,
    onClaim,
}: {
    claimed?: boolean;
    onClaim?: () => void;
}) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClaim = () => {
        if (claimed) return;
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            onClaim?.();
        }, 1000);
    };

    return (
        <button
            onClick={handleClaim}
            disabled={claimed}
            className={`
                w-full p-4 rounded-xl transition-all
                ${claimed
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800 hover:shadow-lg cursor-pointer'
                }
                ${isAnimating ? 'animate-pulse' : ''}
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${claimed ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-amber-200 dark:bg-amber-800'}
                    `}>
                        {claimed ? (
                            <Star size={20} className="text-emerald-500 fill-current" />
                        ) : (
                            <Star size={20} className="text-amber-600 dark:text-amber-400" />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {claimed ? 'Reward Claimed!' : 'Daily Reward'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {claimed ? 'Come back tomorrow' : 'Pray to claim your reward'}
                        </p>
                    </div>
                </div>
                {!claimed && (
                    <span className="px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">
                        +10 XP
                    </span>
                )}
            </div>
        </button>
    );
}
