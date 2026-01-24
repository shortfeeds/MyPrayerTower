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
            case 'SOLEMNITY': return 'bg-amber-500 text-white shadow-amber-500/30';
            case 'FEAST': return 'bg-purple-600 text-white shadow-purple-500/30';
            case 'MEMORIAL': return 'bg-sky-500 text-white shadow-sky-500/30';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 selection:bg-gold-500/20">
            {/* Hero Section */}
            <div className="relative bg-sacred-900 text-white pt-32 pb-24 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20 mb-8 animate-fade-in-up">
                        <CalendarIcon className="w-4 h-4 text-gold-400" />
                        <span className="text-gray-100">Liturgical Year 2026</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-tight text-white drop-shadow-xl animate-fade-in-up delay-100">
                        Liturgical Calendar
                    </h1>
                    <p className="text-xl text-gray-300 mb-0 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                        Journey through the seasons of the Church, abiding in the rhythm of grace.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 -mt-16 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-8">

                        {/* Calendar Grid Section */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">

                                {/* Calendar Header */}
                                <div className="bg-white p-8 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-3xl font-serif font-bold text-gray-900">
                                        {MONTHS[month]} <span className="text-gold-600">{year}</span>
                                    </h2>

                                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                        <button
                                            onClick={prevMonth}
                                            className="p-2.5 hover:bg-white hover:text-gold-600 hover:shadow-sm rounded-lg transition-all text-gray-500"
                                            aria-label="Previous Month"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={goToToday}
                                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={nextMonth}
                                            className="p-2.5 hover:bg-white hover:text-gold-600 hover:shadow-sm rounded-lg transition-all text-gray-500"
                                            aria-label="Next Month"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Weekday Headers */}
                                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                                    {DAYS.map(day => (
                                        <div key={day} className="py-4 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 bg-gray-100 gap-[1px]">
                                    {calendarDays.map((day, idx) => (
                                        <div
                                            key={idx}
                                            className={`
                                                relative bg-white aspect-[1/1] p-2 transition-all duration-200
                                                ${day ? 'hover:bg-gray-50 cursor-pointer group' : ''}
                                                ${isSelected(day!) ? 'ring-2 ring-inset ring-gold-500 z-10' : ''}
                                            `}
                                            onClick={() => day && handleDayClick(day)}
                                        >
                                            {day && (
                                                <>
                                                    <div className="flex justify-between items-start">
                                                        <span className={`
                                                            w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors
                                                            ${isToday(day)
                                                                ? 'bg-sacred-900 text-white shadow-lg'
                                                                : isSelected(day)
                                                                    ? 'text-gold-600 bg-gold-50'
                                                                    : 'text-gray-700 group-hover:text-gray-900'
                                                            }
                                                        `}>
                                                            {day}
                                                        </span>

                                                        {/* Activity Dot (Mock) */}
                                                        {Math.random() > 0.7 && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 mr-2" />
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-8 flex flex-wrap gap-6 justify-center bg-white py-4 px-6 rounded-2xl shadow-sm border border-gray-100 mx-auto w-fit">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-amber-500/20 shadow-lg"></div>
                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Solemnity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-purple-600/20 shadow-lg"></div>
                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Feast</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sky-500/20 shadow-lg"></div>
                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Memorial</span>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Details */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-6">
                                {/* Selected Day Card */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 relative overflow-hidden">
                                    {/* Decorative Top Border */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-400 via-amber-500 to-gold-600" />

                                    <div className="mb-6">
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Detailed View</p>
                                        <h3 className="font-serif text-2xl font-bold text-gray-900">
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                                                : 'Select a Date'
                                            }
                                        </h3>
                                    </div>

                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-gold-500" />
                                            <p className="text-sm font-medium">Consulting the Ordo...</p>
                                        </div>
                                    ) : selectedDayData ? (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                            {/* Season Card */}
                                            <div
                                                className="p-6 rounded-2xl text-white shadow-lg relative overflow-hidden"
                                                style={{ backgroundColor: selectedDayData.seasonColor }}
                                            >
                                                <div className="relative z-10">
                                                    <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Liturgical Season</p>
                                                    <p className="font-serif text-2xl font-bold">{selectedDayData.season}</p>
                                                </div>
                                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl" />
                                            </div>

                                            {/* Celebrations List */}
                                            <div className="space-y-3">
                                                {selectedDayData.celebrations?.map((cel, idx) => (
                                                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group">
                                                        <div className="flex items-start justify-between gap-3 mb-2">
                                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${getRankColor(cel.rank)}`}>
                                                                {cel.rankName}
                                                            </span>
                                                        </div>
                                                        <p className="font-serif font-medium text-lg text-gray-900 leading-tight group-hover:text-gold-700 transition-colors">
                                                            {cel.name}
                                                        </p>
                                                    </div>
                                                ))}

                                                {(!selectedDayData.celebrations || selectedDayData.celebrations.length === 0) && (
                                                    <div className="text-center py-6 text-gray-400 italic">
                                                        No special feasts for this day.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Holy Day Alert */}
                                            {selectedDayData.isHolyDayOfObligation && (
                                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
                                                    <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                                                        <Star className="w-5 h-5 fill-current" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-red-900 text-sm uppercase tracking-wide">Holy Day of Obligation</p>
                                                        <p className="text-sm text-red-700/80 mt-1">The faithful are obliged to participate in the Mass.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Button */}
                                            <Link
                                                href={`/readings?date=${selectedDayData.date}`}
                                                className="flex w-full items-center justify-center gap-2 p-4 bg-sacred-900 text-white rounded-xl hover:bg-gold-600 transition-all font-medium shadow-lg hover:shadow-gold-500/25 group mt-8"
                                            >
                                                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                Read Today's Gospel
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 px-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-medium">Select a date from the calendar to view the liturgy.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pro Tip / Quote */}
                                <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200">
                                    <p className="font-serif italic text-stone-600 text-center leading-relaxed">
                                        "The liturgy is the summit toward which the activity of the Church is directed."
                                    </p>
                                    <p className="text-center text-xs text-stone-400 font-bold uppercase tracking-widest mt-4">— Sacrosanctum Concilium</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
