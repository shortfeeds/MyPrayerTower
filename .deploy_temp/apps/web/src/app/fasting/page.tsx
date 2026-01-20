'use client';

import { useState, useEffect } from 'react';
import { UtensilsCrossed, Calendar, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface FastingDay {
    date: string;
    name: string;
    type: 'fast' | 'abstinence' | 'both';
    description: string;
}

export default function FastingPage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [upcomingDays, setUpcomingDays] = useState<FastingDay[]>([]);

    useEffect(() => {
        // Calculate fasting days for the year
        const easter = calculateEaster(year);
        const ashWednesday = new Date(easter);
        ashWednesday.setDate(ashWednesday.getDate() - 46);

        const goodFriday = new Date(easter);
        goodFriday.setDate(goodFriday.getDate() - 2);

        const days: FastingDay[] = [
            { date: ashWednesday.toISOString().split('T')[0], name: 'Ash Wednesday', type: 'both', description: 'Fast and abstinence. Marks the beginning of Lent.' },
            { date: goodFriday.toISOString().split('T')[0], name: 'Good Friday', type: 'both', description: 'Fast and abstinence. Commemorates the Crucifixion.' },
        ];

        // Add all Fridays of Lent
        const currentDate = new Date(ashWednesday);
        currentDate.setDate(currentDate.getDate() + ((5 - currentDate.getDay() + 7) % 7)); // Next Friday
        while (currentDate < easter) {
            if (currentDate.toISOString().split('T')[0] !== goodFriday.toISOString().split('T')[0]) {
                days.push({
                    date: currentDate.toISOString().split('T')[0],
                    name: 'Friday of Lent',
                    type: 'abstinence',
                    description: 'Abstinence from meat required for those 14 and older.'
                });
            }
            currentDate.setDate(currentDate.getDate() + 7);
        }

        days.sort((a, b) => a.date.localeCompare(b.date));
        setUpcomingDays(days);
    }, [year]);

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-purple-700 via-violet-800 to-indigo-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <UtensilsCrossed className="w-4 h-4 text-purple-300" />
                        <span>Liturgical Discipline</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Fasting & Abstinence</h1>
                    <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                        Know when to fast and abstain according to Church law.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Rules */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-purple-600" />
                            Fasting Rules
                        </h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>• <strong>Who:</strong> Adults ages 18-59</li>
                            <li>• <strong>What:</strong> One full meal; two smaller meals that don't equal a full meal</li>
                            <li>• <strong>When:</strong> Ash Wednesday and Good Friday</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <UtensilsCrossed className="w-5 h-5 text-red-600" />
                            Abstinence Rules
                        </h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>• <strong>Who:</strong> Catholics age 14 and older</li>
                            <li>• <strong>What:</strong> No meat (flesh of warm-blooded animals)</li>
                            <li>• <strong>When:</strong> Ash Wednesday, Good Friday, all Fridays of Lent</li>
                        </ul>
                    </div>
                </div>

                {/* Year Selector */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <button onClick={() => setYear(y => y - 1)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">←</button>
                    <span className="text-2xl font-bold">{year}</span>
                    <button onClick={() => setYear(y => y + 1)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">→</button>
                </div>

                {/* Upcoming Days */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Fasting & Abstinence Days</h2>
                <div className="space-y-3">
                    {upcomingDays.map(day => {
                        const isPast = day.date < today;
                        const isToday = day.date === today;
                        return (
                            <div
                                key={day.date + day.name}
                                className={`bg-white rounded-xl p-4 border shadow-sm flex items-center gap-4 ${isToday ? 'border-purple-500 ring-2 ring-purple-200' :
                                        isPast ? 'opacity-50 border-gray-100' : 'border-gray-100'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${day.type === 'both' ? 'bg-red-100 text-red-600' :
                                        day.type === 'fast' ? 'bg-purple-100 text-purple-600' :
                                            'bg-orange-100 text-orange-600'
                                    }`}>
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900">{day.name}</h4>
                                        {isToday && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Today</span>}
                                    </div>
                                    <p className="text-sm text-gray-500">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${day.type === 'both' ? 'bg-red-100 text-red-700' :
                                        day.type === 'fast' ? 'bg-purple-100 text-purple-700' :
                                            'bg-orange-100 text-orange-700'
                                    }`}>
                                    {day.type === 'both' ? 'Fast & Abstain' : day.type === 'fast' ? 'Fast' : 'Abstain'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Calculate Easter using the Anonymous Gregorian algorithm
function calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}
