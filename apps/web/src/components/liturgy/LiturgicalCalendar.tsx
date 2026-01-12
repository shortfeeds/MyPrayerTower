'use client';

import { Calendar, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

// Simplified liturgical data logic (in a real app this would use an API or library)
function getLiturgicalData(date: Date) {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // Simple logic for demonstration purposes
    // Season Logic (Approximate)
    let season = 'Ordinary Time';
    let color = 'text-green-600';
    let bg = 'bg-green-100';

    if (month === 11 || (month === 0 && day <= 10)) { // Dec-Jan
        season = 'Christmas Season';
        color = 'text-yellow-600';
        bg = 'bg-yellow-100';
    } else if (month === 2 || month === 3) { // Mar-Apr
        season = 'Lent';
        color = 'text-purple-600';
        bg = 'bg-purple-100';
    } else if (month === 0 && day > 10) {
        season = 'Ordinary Time';
    }

    // Feast Days (Hardcoded Sample)
    const feasts: Record<string, string> = {
        '1-1': 'Solemnity of Mary, Mother of God',
        '1-6': 'Epiphany of the Lord',
        '3-19': 'St. Joseph, Husband of Mary',
        '8-15': 'Assumption of Mary',
        '11-1': 'All Saints Day',
        '12-8': 'Immaculate Conception',
        '12-25': 'Nativity of the Lord',
    };

    const key = `${month + 1}-${day}`;
    const feast = feasts[key] || `Week ${Math.ceil(day / 7)} of ${season}`;

    return {
        season,
        color,
        bg,
        feast,
        date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
}

export function LiturgicalCalendar() {
    const [today, setToday] = useState<ReturnType<typeof getLiturgicalData> | null>(null);

    useEffect(() => {
        setToday(getLiturgicalData(new Date()));
    }, []);

    if (!today) return <div className="h-48 bg-gray-100 animate-pulse rounded-2xl"></div>;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-sacred-600 dark:text-sacred-400 font-semibold">
                <Calendar className="w-5 h-5" />
                <span>Today's Liturgy</span>
            </div>

            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-3 ${today.bg} ${today.color}`}>
                {today.season}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 font-serif">
                {today.feast}
            </h3>

            <p className="text-gray-500 text-sm mb-6">
                {today.date}
            </p>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Readings</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sacred-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Office of Readings</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sacred-500" />
                </div>
            </div>
        </div>
    );
}
