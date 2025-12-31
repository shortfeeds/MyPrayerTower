'use client';

import { Flame, Trophy, Calendar, Sparkles } from 'lucide-react';

interface PrayerStreakWidgetProps {
    currentStreak: number;
    longestStreak?: number;
    prayedToday?: boolean;
    lastPrayerDate?: string;
}

export function PrayerStreakWidget({
    currentStreak,
    longestStreak = 0,
    prayedToday = false,
    lastPrayerDate
}: PrayerStreakWidgetProps) {
    const isOnFire = currentStreak >= 7;
    const isMilestone = currentStreak > 0 && currentStreak % 30 === 0;

    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 ${isOnFire
                ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white'
                : 'bg-gradient-to-br from-sacred-600 to-sacred-700 text-white'
            }`}>
            {/* Animated background sparkles for milestones */}
            {isMilestone && (
                <div className="absolute inset-0 overflow-hidden">
                    <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-300 animate-pulse" />
                    <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
            )}

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Flame className={`w-5 h-5 ${isOnFire ? 'animate-bounce' : ''}`} />
                        Prayer Streak
                    </h3>
                    {prayedToday && (
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                            ✓ Prayed Today
                        </span>
                    )}
                </div>

                {/* Main Streak Count */}
                <div className="text-center my-6">
                    <div className="text-6xl font-bold mb-1">
                        {currentStreak}
                    </div>
                    <div className="text-white/80 text-sm">
                        {currentStreak === 1 ? 'day' : 'days'} in a row
                    </div>
                </div>

                {/* Streak Visualization */}
                <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium ${i < Math.min(currentStreak, 7)
                                    ? 'bg-white/30'
                                    : 'bg-white/10'
                                }`}
                        >
                            {i < Math.min(currentStreak, 7) ? '🔥' : '·'}
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
                        <div className="text-xl font-bold">{longestStreak}</div>
                        <div className="text-xs text-white/70">Longest Streak</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-300" />
                        <div className="text-xl font-bold">{currentStreak * 5}</div>
                        <div className="text-xs text-white/70">Total Prayers</div>
                    </div>
                </div>

                {/* Encouragement */}
                {!prayedToday && currentStreak > 0 && (
                    <div className="mt-4 p-3 bg-white/10 rounded-xl text-center">
                        <p className="text-sm">
                            🙏 Don't break your streak! Pray today to keep it going.
                        </p>
                    </div>
                )}

                {currentStreak === 0 && (
                    <div className="mt-4 p-3 bg-white/10 rounded-xl text-center">
                        <p className="text-sm">
                            Start your prayer journey today! 🌟
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Compact version for sidebar/dashboard
export function StreakBadge({ streak }: { streak: number }) {
    const isOnFire = streak >= 7;

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${isOnFire
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : streak > 0
                    ? 'bg-sacred-100 text-sacred-700 dark:bg-sacred-900 dark:text-sacred-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
            <Flame className={`w-4 h-4 ${isOnFire ? 'animate-pulse' : ''}`} />
            {streak} day{streak !== 1 ? 's' : ''}
        </div>
    );
}
