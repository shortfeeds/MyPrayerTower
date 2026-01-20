'use client';

import { useState } from 'react';
import { Flame, Check, Target } from 'lucide-react';

interface PersonalizedGreetingProps {
    userName?: string | null;
    streak?: number;
    prayedToday?: boolean;
    liturgicalDate?: string;
    prayersCompletedToday?: number;
    dailyGoal?: number;
    onCheckIn?: () => void;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

export function PersonalizedGreeting({
    userName,
    streak = 0,
    prayedToday = false,
    liturgicalDate,
    prayersCompletedToday = 0,
    dailyGoal = 3,
    onCheckIn
}: PersonalizedGreetingProps) {
    const [showCheckInSuccess, setShowCheckInSuccess] = useState(false);
    const greeting = getGreeting();
    const displayDate = liturgicalDate || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const isLoggedIn = !!userName;
    const progressPercent = Math.min((prayersCompletedToday / dailyGoal) * 100, 100);

    const handleCheckIn = () => {
        setShowCheckInSuccess(true);
        onCheckIn?.();
        setTimeout(() => setShowCheckInSuccess(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Greeting and date */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                            {greeting}{isLoggedIn ? `, ${userName?.split(' ')[0]}` : ''}! 👋
                        </h2>
                        {/* Streak badge - prominent */}
                        {isLoggedIn && streak > 0 && (
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm ${prayedToday
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                <Flame className={`w-4 h-4 ${prayedToday ? 'fill-yellow-200 animate-pulse' : ''}`} />
                                <span>{streak}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600">{displayDate}</p>
                </div>

                {/* Right: Progress and Check-in */}
                {isLoggedIn && (
                    <div className="flex items-center gap-4">
                        {/* Progress ring */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14">
                                {/* Background circle */}
                                <svg className="w-14 h-14 transform -rotate-90">
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="#e5e7eb"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke={progressPercent >= 100 ? '#22c55e' : '#8b5cf6'}
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray={`${progressPercent * 1.51} 151`}
                                        strokeLinecap="round"
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                {/* Center text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-700">
                                        {prayersCompletedToday}/{dailyGoal}
                                    </span>
                                </div>
                            </div>
                            <div className="hidden sm:block text-sm">
                                <p className="font-medium text-gray-700">Daily Goal</p>
                                <p className="text-gray-500 text-xs">
                                    {progressPercent >= 100 ? '✨ Complete!' : `${dailyGoal - prayersCompletedToday} more to go`}
                                </p>
                            </div>
                        </div>

                        {/* Daily Check-in Button */}
                        {!prayedToday && (
                            <button
                                onClick={handleCheckIn}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                            >
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">I Prayed Today</span>
                                <span className="sm:hidden">Check In</span>
                            </button>
                        )}

                        {prayedToday && (
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 text-sm font-bold rounded-xl border border-green-200">
                                <Check className="w-4 h-4" />
                                <span>Prayed Today ✓</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Check-in success message */}
            {showCheckInSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center animate-fade-in">
                    <p className="text-green-700 font-medium">🙏 God bless you! Your streak continues!</p>
                </div>
            )}
        </div>
    );
}
