'use client';

import { Flame } from 'lucide-react';

interface PersonalizedGreetingProps {
    userName?: string | null;
    streak?: number;
    prayedToday?: boolean;
    liturgicalDate?: string; // e.g. "Tuesday of the First Week of Advent"
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
    liturgicalDate
}: PersonalizedGreetingProps) {
    const greeting = getGreeting();

    // Fallback if not provided
    const displayDate = liturgicalDate || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const isLoggedIn = !!userName;

    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                    {greeting}{isLoggedIn ? `, ${userName?.split(' ')[0]}` : ''}! 👋
                </h2>
                <p className="text-gray-600 mt-1">
                    {displayDate}
                </p>
            </div>

            {isLoggedIn && streak > 0 && (
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all border shadow-sm ${prayedToday
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border-orange-200'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}
                    title={prayedToday ? "You've prayed today!" : "Pray today to keep your streak!"}
                >
                    <Flame
                        className={`w-5 h-5 ${prayedToday ? 'fill-orange-500 text-orange-600 animate-glow-pulse' : 'text-gray-400'}`}
                    />
                    <span className="text-lg">{streak}</span>
                    <span className="text-xs uppercase tracking-wide opacity-70">day streak</span>
                </div>
            )}
        </div>
    );
}
