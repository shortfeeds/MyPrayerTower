'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, BookOpen, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface LiturgicalDay {
    date: string;
    season: string;
    seasonColor: string;
    celebrations: {
        key: string;
        name: string;
        rank: string;
        rankName: string;
        color: string;
        colorHex: string;
    }[];
    isHolyDayOfObligation: boolean;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDayData, setSelectedDayData] = useState<LiturgicalDay | null>(null);
    const [loading, setLoading] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const handleDayClick = async (day: number) => {
        const date = new Date(year, month, day);
        setSelectedDate(date);

        setLoading(true);
        try {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const res = await fetch(`/api/calendar/liturgical?date=${dateStr}`);
            const data = await res.json();
            setSelectedDayData(data);
        } catch (err) {
            console.error('Failed to fetch liturgical data:', err);
        } finally {
            setLoading(false);
        }
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
    };

    // Build calendar grid
    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null); // Empty cells before first day
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'SOLEMNITY': return 'bg-amber-500';
            case 'FEAST': return 'bg-purple-500';
            case 'MEMORIAL': return 'bg-blue-500';
            default: return 'bg-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Liturgical Calendar</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
                        Church Calendar
                    </h1>
                    <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                        Explore the liturgical seasons, feast days, and celebrations of the Roman Catholic Church.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Calendar */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                {/* Calendar Header */}
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={prevMonth}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>

                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold">{MONTHS[month]} {year}</h2>
                                        </div>

                                        <button
                                            onClick={nextMonth}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={goToToday}
                                        className="mt-4 text-sm text-green-200 hover:text-white underline mx-auto block"
                                    >
                                        Go to Today
                                    </button>
                                </div>

                                {/* Day Headers */}
                                <div className="grid grid-cols-7 border-b border-gray-100">
                                    {DAYS.map(day => (
                                        <div key={day} className="p-3 text-center text-sm font-semibold text-gray-500 bg-gray-50">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7">
                                    {calendarDays.map((day, idx) => (
                                        <div
                                            key={idx}
                                            className={`aspect-square border-b border-r border-gray-100 relative ${day ? 'cursor-pointer hover:bg-green-50 transition-colors' : 'bg-gray-50'
                                                } ${isSelected(day!) ? 'bg-green-100' : ''}`}
                                            onClick={() => day && handleDayClick(day)}
                                        >
                                            {day && (
                                                <>
                                                    <span className={`absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${isToday(day)
                                                        ? 'bg-green-600 text-white'
                                                        : isSelected(day)
                                                            ? 'text-green-700'
                                                            : 'text-gray-700'
                                                        }`}>
                                                        {day}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span className="text-sm text-gray-600">Solemnity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span className="text-sm text-gray-600">Feast</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-gray-600">Memorial</span>
                                </div>
                            </div>
                        </div>

                        {/* Selected Day Details */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500" />
                                    {selectedDate
                                        ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                                        : 'Select a Date'
                                    }
                                </h3>

                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                                    </div>
                                ) : selectedDayData ? (
                                    <div className="space-y-4">
                                        {/* Season */}
                                        <div
                                            className="p-4 rounded-xl text-white"
                                            style={{ backgroundColor: selectedDayData.seasonColor }}
                                        >
                                            <p className="text-sm opacity-80">Season</p>
                                            <p className="font-bold text-lg">{selectedDayData.season}</p>
                                        </div>

                                        {/* Celebrations */}
                                        {selectedDayData.celebrations?.map((cel, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded ${getRankColor(cel.rank)} text-white`}>
                                                        {cel.rankName}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-gray-900">{cel.name}</p>
                                            </div>
                                        ))}

                                        {/* Holy Day */}
                                        {selectedDayData.isHolyDayOfObligation && (
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                                <p className="font-bold text-red-800">Holy Day of Obligation</p>
                                                <p className="text-sm text-red-600">Mass attendance required</p>
                                            </div>
                                        )}

                                        {/* Action Links */}
                                        <div className="pt-4 border-t border-gray-100 space-y-2">
                                            <Link
                                                href={`/readings?date=${selectedDayData.date}`}
                                                className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                                            >
                                                <BookOpen className="w-5 h-5" />
                                                View Readings
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        Click on a date to see liturgical details
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
