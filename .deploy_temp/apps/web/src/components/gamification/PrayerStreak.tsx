'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { checkAndUpdateStreak } from '@/app/actions/gamification';

export function PrayerStreakBadge({ userId }: { userId: string }) {
    const [streak, setStreak] = useState(0);
    const [prayedToday, setPrayedToday] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Optimistic / Client-side fetch
        checkAndUpdateStreak(userId).then((res) => {
            if (res) {
                setStreak(res.currentStreak);
                setPrayedToday(res.prayedToday);
            }
            setLoading(false);
        });
    }, [userId]);

    if (loading) return (
        <div className="w-16 h-8 bg-gray-100 rounded-full animate-pulse" />
    );

    return (
        <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-sm transition-all border ${prayedToday
                    ? 'bg-orange-50 text-orange-600 border-orange-100 shadow-sm'
                    : 'bg-gray-50 text-gray-400 border-gray-100 opacity-75 hover:opacity-100'
                }`}
            title={prayedToday ? "You've prayed today!" : "Pray today to keep your streak!"}
        >
            <Flame
                className={`w-4 h-4 ${prayedToday ? 'fill-orange-500 text-orange-600' : 'text-gray-400'}`}
            />
            <span>{streak}</span>
        </div>
    );
}
