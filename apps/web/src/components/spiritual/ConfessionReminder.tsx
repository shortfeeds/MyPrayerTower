'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Check, ChevronRight, Heart, Cross } from 'lucide-react';
import Link from 'next/link';

interface ConfessionStats {
    lastConfession: Date | null;
    daysSince: number;
    nextRecommended: Date;
    streak: number;
}

/**
 * Calculate confession stats from last date
 */
function calculateStats(lastDate: Date | null): ConfessionStats {
    const now = new Date();
    const daysSince = lastDate
        ? Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

    // Recommend monthly confession
    const nextRecommended = lastDate
        ? new Date(lastDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        : new Date();

    return {
        lastConfession: lastDate,
        daysSince,
        nextRecommended,
        streak: 0, // Would come from user stats
    };
}

/**
 * Confession reminder widget with tracker
 */
export function ConfessionReminder() {
    const [stats, setStats] = useState<ConfessionStats>(calculateStats(null));
    const [showLogger, setShowLogger] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('mpt-last-confession');
        if (stored) {
            const date = new Date(stored);
            setStats(calculateStats(date));
        }
    }, []);

    const logConfession = (date: Date = new Date()) => {
        localStorage.setItem('mpt-last-confession', date.toISOString());
        setStats(calculateStats(date));
        setShowLogger(false);
    };

    const getUrgencyLevel = () => {
        if (stats.daysSince < 14) return 'good';
        if (stats.daysSince < 30) return 'reminder';
        if (stats.daysSince < 60) return 'overdue';
        return 'urgent';
    };

    const urgency = getUrgencyLevel();

    const urgencyStyles = {
        good: {
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-200 dark:border-emerald-800',
            text: 'text-emerald-700 dark:text-emerald-300',
            icon: 'text-emerald-500',
        },
        reminder: {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-200 dark:border-amber-800',
            text: 'text-amber-700 dark:text-amber-300',
            icon: 'text-amber-500',
        },
        overdue: {
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            border: 'border-orange-200 dark:border-orange-800',
            text: 'text-orange-700 dark:text-orange-300',
            icon: 'text-orange-500',
        },
        urgent: {
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            border: 'border-rose-200 dark:border-rose-800',
            text: 'text-rose-700 dark:text-rose-300',
            icon: 'text-rose-500',
        },
    };

    const style = urgencyStyles[urgency];

    return (
        <div className={`rounded-2xl border p-6 ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${style.bg} border ${style.border}`}>
                    <Heart size={24} className={style.icon} />
                </div>

                <div className="flex-1">
                    <h3 className={`font-bold mb-1 ${style.text}`}>
                        {urgency === 'good' && 'Looking Good! 🙏'}
                        {urgency === 'reminder' && 'Gentle Reminder'}
                        {urgency === 'overdue' && "It's Been a While"}
                        {urgency === 'urgent' && 'Time for Reconciliation'}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {stats.lastConfession ? (
                            <>
                                Last confession was <strong>{stats.daysSince} days ago</strong>.
                                {urgency !== 'good' && ' The Church recommends monthly confession.'}
                            </>
                        ) : (
                            "Track your confession to receive gentle reminders."
                        )}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowLogger(!showLogger)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Check size={16} />
                            Log Confession
                        </button>

                        <Link
                            href="/confession"
                            className="flex items-center gap-2 px-4 py-2 bg-sacred-600 text-white rounded-lg text-sm font-medium hover:bg-sacred-700 transition-colors"
                        >
                            Examination of Conscience
                            <ChevronRight size={16} />
                        </Link>

                        <Link
                            href="/churches?filter=confession"
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Find Confession Times
                        </Link>
                    </div>

                    {/* Date Picker for Logging */}
                    {showLogger && (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">When did you go to confession?</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => logConfession()}
                                    className="px-4 py-2 bg-sacred-600 text-white rounded-lg text-sm font-medium hover:bg-sacred-700"
                                >
                                    Today
                                </button>
                                <input
                                    type="date"
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => logConfession(new Date(e.target.value))}
                                    className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900"
                                />
                                <button
                                    onClick={() => setShowLogger(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Compact confession badge for dashboard
 */
export function ConfessionBadge() {
    const [daysSince, setDaysSince] = useState<number | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('mpt-last-confession');
        if (stored) {
            const date = new Date(stored);
            const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
            setDaysSince(days);
        }
    }, []);

    if (daysSince === null) return null;

    const isOverdue = daysSince > 30;

    return (
        <Link
            href="/confession"
            className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                ${isOverdue
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                }
            `}
        >
            <Heart size={12} fill="currentColor" />
            {daysSince}d since confession
        </Link>
    );
}
