'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Check, Star, Target } from 'lucide-react';

// Simple 365-day reading plan (Genesis to Revelation)
// This is a simplified version - a full implementation would have detailed daily readings
const generateReadingPlan = () => {
    const plan: { day: number; book: string; bookName: string; chapters: string }[] = [];

    // Simplified plan structure - read through sequentially
    const readings = [
        { book: 'genesis', name: 'Genesis', start: 1, end: 50 },
        { book: 'exodus', name: 'Exodus', start: 1, end: 40 },
        { book: 'leviticus', name: 'Leviticus', start: 1, end: 27 },
        { book: 'numbers', name: 'Numbers', start: 1, end: 36 },
        { book: 'deuteronomy', name: 'Deuteronomy', start: 1, end: 34 },
        { book: 'matthew', name: 'Matthew', start: 1, end: 28 },
        { book: 'mark', name: 'Mark', start: 1, end: 16 },
        { book: 'luke', name: 'Luke', start: 1, end: 24 },
        { book: 'john', name: 'John', start: 1, end: 21 },
        { book: 'acts', name: 'Acts', start: 1, end: 28 },
        { book: 'romans', name: 'Romans', start: 1, end: 16 },
        { book: 'psalms', name: 'Psalms', start: 1, end: 150 },
        { book: 'proverbs', name: 'Proverbs', start: 1, end: 31 },
    ];

    let day = 1;
    for (const book of readings) {
        for (let ch = book.start; ch <= book.end && day <= 365; ch++) {
            plan.push({
                day,
                book: book.book,
                bookName: book.name,
                chapters: `${ch}`
            });
            day++;
        }
    }

    // Fill remaining days with Revelation and other books
    while (day <= 365) {
        plan.push({
            day,
            book: 'revelation',
            bookName: 'Revelation',
            chapters: `${((day - 1) % 22) + 1}`
        });
        day++;
    }

    return plan;
};

export default function BibleYearPage() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [completedDays, setCompletedDays] = useState<number[]>([]);

    const plan = generateReadingPlan();
    const today = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get days for selected month (approximate - 30/31 days per month)
    const getDaysForMonth = (month: number) => {
        const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let startDay = 0;
        for (let i = 0; i < month; i++) {
            startDay += daysPerMonth[i];
        }
        return plan.slice(startDay, startDay + daysPerMonth[month]);
    };

    const monthDays = getDaysForMonth(selectedMonth);
    const completion = Math.round((completedDays.length / 365) * 100);

    const toggleDay = (day: number) => {
        setCompletedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <Link href="/bible" className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Bible
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <Calendar className="w-12 h-12 text-gold-400" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-serif">
                                Bible in a Year
                            </h1>
                            <p className="text-primary-200">
                                Read through the entire Bible in 365 days
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/10 rounded-full h-4 mt-6 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-gold-400 to-gold-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${completion}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span>{completedDays.length} / 365 days</span>
                        <span className="text-gold-400 font-bold">{completion}% complete</span>
                    </div>
                </div>
            </div>

            {/* Month Selector */}
            <div className="sticky top-16 z-30 bg-white border-b border-gray-100 py-4 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setSelectedMonth(m => Math.max(0, m - 1))}
                            disabled={selectedMonth === 0}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-lg min-w-[120px] text-center">
                            {months[selectedMonth]}
                        </span>
                        <button
                            onClick={() => setSelectedMonth(m => Math.min(11, m + 1))}
                            disabled={selectedMonth === 11}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {monthDays.map(reading => (
                        <div
                            key={reading.day}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${completedDays.includes(reading.day)
                                    ? 'bg-green-50 border-green-200'
                                    : reading.day === today
                                        ? 'bg-gold-50 border-gold-300 ring-2 ring-gold-400'
                                        : 'bg-white border-gray-100 hover:border-primary-200 hover:shadow-md'
                                }`}
                            onClick={() => toggleDay(reading.day)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-500">
                                    Day {reading.day}
                                </span>
                                {completedDays.includes(reading.day) && (
                                    <Check className="w-5 h-5 text-green-600" />
                                )}
                                {reading.day === today && !completedDays.includes(reading.day) && (
                                    <Star className="w-5 h-5 text-gold-500" />
                                )}
                            </div>
                            <h3 className="font-bold text-gray-900">{reading.bookName}</h3>
                            <p className="text-sm text-gray-500">Chapter {reading.chapters}</p>
                            <Link
                                href={`/bible/${reading.book}/${reading.chapters}`}
                                onClick={e => e.stopPropagation()}
                                className="mt-3 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <BookOpen className="w-4 h-4" />
                                Read Now
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Today's Reading CTA */}
            {plan[today - 1] && (
                <div className="container mx-auto px-4 pb-12">
                    <div className="bg-gradient-to-r from-gold-100 to-primary-100 rounded-2xl p-8 text-center">
                        <Target className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Reading</h2>
                        <p className="text-gray-600 mb-6">
                            {plan[today - 1].bookName} Chapter {plan[today - 1].chapters}
                        </p>
                        <Link
                            href={`/bible/${plan[today - 1].book}/${plan[today - 1].chapters}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-colors"
                        >
                            Start Reading
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
