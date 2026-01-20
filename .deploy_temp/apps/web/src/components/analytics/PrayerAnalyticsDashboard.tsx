'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Clock, Heart, Flame, Star, BookOpen, ChevronRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';

import { UserPrayerStats } from '@/app/actions/journey';

const EMPTY_STATS: UserPrayerStats = {
    totalPrayers: 0,
    todayPrayers: 0,
    weeklyPrayers: 0,
    monthlyPrayers: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteTime: '-',
    topCategory: '-',
    averageDaily: 0,
    weeklyGoalProgress: 0,
};

/**
 * Prayer analytics dashboard
 */
export function PrayerAnalyticsDashboard({ stats = EMPTY_STATS }: { stats: UserPrayerStats | null }) {
    const finalStats = stats || EMPTY_STATS;
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Prayer Journey</h2>
                    <p className="text-gray-500 dark:text-gray-400">Track your spiritual growth</p>
                </div>

                {/* Time Range Selector */}
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {(['week', 'month', 'year'] as const).map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`
                                px-4 py-2 text-sm font-medium rounded-md transition-colors
                                ${timeRange === range
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }
                            `}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Heart}
                    label="Today"
                    value={finalStats.todayPrayers}
                    sublabel="prayers"
                    color="rose"
                />
                <StatCard
                    icon={Flame}
                    label="Current Streak"
                    value={finalStats.currentStreak}
                    sublabel="days"
                    color="orange"
                />
                <StatCard
                    icon={Star}
                    label="Best Streak"
                    value={finalStats.longestStreak}
                    sublabel="days"
                    color="amber"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Average"
                    value={finalStats.averageDaily}
                    sublabel="/day"
                    color="emerald"
                />
            </div>

            {/* Weekly Goal Progress */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Weekly Goal Progress</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {finalStats.weeklyPrayers} / 40 prayers
                    </span>
                </div>

                <div className="relative h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-sacred-500 to-sacred-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, finalStats.weeklyGoalProgress)}%` }}
                    />
                </div>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {finalStats.weeklyGoalProgress >= 100
                        ? '🎉 Goal achieved! Keep going!'
                        : `${100 - finalStats.weeklyGoalProgress}% more to reach your weekly goal`
                    }
                </p>
            </div>

            {/* Activity Calendar (Simplified) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar size={18} />
                        Prayer Activity
                    </h3>
                    <Link href="/profile/history" className="text-sm text-sacred-600 hover:text-sacred-700 flex items-center gap-1">
                        View all <ChevronRight size={14} />
                    </Link>
                </div>

                {/* Simplified week view */}
                <div className="grid grid-cols-7 gap-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center">
                            <span className="text-xs text-gray-400 dark:text-gray-500">{day}</span>
                        </div>
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => {
                        const activity = Math.floor(Math.random() * 5);
                        return (
                            <div
                                key={i}
                                className={`
                                    aspect-square rounded-md
                                    ${activity === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''}
                                    ${activity === 1 ? 'bg-sacred-100 dark:bg-sacred-900/30' : ''}
                                    ${activity === 2 ? 'bg-sacred-200 dark:bg-sacred-900/50' : ''}
                                    ${activity === 3 ? 'bg-sacred-300 dark:bg-sacred-800' : ''}
                                    ${activity >= 4 ? 'bg-sacred-500 dark:bg-sacred-700' : ''}
                                `}
                                title={`${activity} prayers`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Insights */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-sacred-50 to-gold-50 dark:from-sacred-900/20 dark:to-gold-900/20 rounded-2xl border border-sacred-100 dark:border-sacred-800 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Clock size={20} className="text-sacred-600" />
                        <h4 className="font-bold text-gray-900 dark:text-white">Best Time</h4>
                    </div>
                    <p className="text-2xl font-bold text-sacred-600 dark:text-sacred-400 mb-1">
                        {finalStats.favoriteTime}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        When you pray most consistently
                    </p>
                </div>

                <div className="bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gold-900/20 dark:to-amber-900/20 rounded-2xl border border-gold-100 dark:border-gold-800 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <BookOpen size={20} className="text-gold-600" />
                        <h4 className="font-bold text-gray-900 dark:text-white">Favorite Prayer</h4>
                    </div>
                    <p className="text-2xl font-bold text-gold-600 dark:text-gold-400 mb-1">
                        {finalStats.topCategory}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your most prayed devotion
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Individual stat card
 */
function StatCard({
    icon: Icon,
    label,
    value,
    sublabel,
    color,
}: {
    icon: any;
    label: string;
    value: number;
    sublabel: string;
    color: 'rose' | 'orange' | 'amber' | 'emerald';
}) {
    const colorClasses = {
        rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800',
        orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800',
        amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800',
    };

    const iconClasses = {
        rose: 'text-rose-500',
        orange: 'text-orange-500',
        amber: 'text-amber-500',
        emerald: 'text-emerald-500',
    };

    return (
        <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={iconClasses[color]} />
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}<span className="text-sm font-normal text-gray-400 ml-1">{sublabel}</span>
            </p>
        </div>
    );
}

/**
 * Compact stats widget for sidebar
 */
export function QuickPrayerStats() {
    const [stats, setStats] = useState({
        today: 0,
        streak: 0,
    });

    useEffect(() => {
        const stored = localStorage.getItem('mpt-prayer-stats');
        if (stored) {
            const parsed = JSON.parse(stored);
            setStats({
                today: parsed.todayPrayers || 0,
                streak: parsed.currentStreak || 0,
            });
        }
    }, []);

    return (
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
                <Heart size={16} className="text-rose-500" />
                <span className="font-bold text-gray-900 dark:text-white">{stats.today}</span>
                <span className="text-xs text-gray-500">today</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <span className="font-bold text-gray-900 dark:text-white">{stats.streak}</span>
                <span className="text-xs text-gray-500">streak</span>
            </div>
        </div>
    );
}
