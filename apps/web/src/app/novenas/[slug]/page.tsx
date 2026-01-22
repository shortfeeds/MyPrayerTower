'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Flame, Calendar, Check, Info } from 'lucide-react';
import { NOVENAS } from '@/lib/novenas';

export default function NovenaDetailPage({ params }: { params: { slug: string } }) {
    const novena = NOVENAS.find(n => n.id === params.slug);
    const [currentDay, setCurrentDay] = useState(1);
    const [isPraying, setIsPraying] = useState(false);

    if (!novena) {
        notFound();
    }

    const prayerForDay = novena.dailyPrayers[currentDay - 1];

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Header */}
            <div className={`bg-gradient-to-r ${novena.color} text-white pb-12 pt-6`}>
                <div className="container mx-auto px-4">
                    <Link
                        href="/novenas"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Library
                    </Link>

                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Flame className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{novena.name}</h1>
                                <p className="text-white/90 text-lg opacity-90">{novena.patron}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{novena.duration}</span>
                            </div>
                            {novena.patronOf && (
                                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    <Info className="w-4 h-4" />
                                    <span>Patron of {novena.patronOf}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-8">
                <div className="max-w-4xl mx-auto grid md:grid-cols-[300px_1fr] gap-8">

                    {/* Sidebar Tracker */}
                    <div className="order-2 md:order-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Your Progress</h3>
                            <div className="space-y-2">
                                {Array.from({ length: 9 }).map((_, i) => {
                                    const day = i + 1;
                                    const isActive = currentDay === day;
                                    const isCompleted = day < currentDay;

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => setCurrentDay(day)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                                                    ? 'bg-rose-50 text-rose-700 border-2 border-rose-100'
                                                    : 'hover:bg-gray-50 text-gray-600'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isActive ? 'bg-rose-200 text-rose-800' :
                                                    isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                                                }`}>
                                                {isCompleted ? <Check className="w-4 h-4" /> : day}
                                            </div>
                                            <span className="font-medium">Day {day}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Prayer Content */}
                    <div className="order-1 md:order-2">
                        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10 border border-gray-100 min-h-[600px]">

                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900">Day {currentDay} Prayer</h2>
                                    <p className="text-gray-500">Recite with devotion</p>
                                </div>
                                <button
                                    onClick={() => setCurrentDay(d => Math.min(d + 1, 9))}
                                    className="px-6 py-2 bg-rose-600 text-white rounded-full font-medium hover:bg-rose-700 transition w-full md:w-auto md:hidden"
                                >
                                    Mark Complete
                                </button>
                            </div>

                            {/* Dynamic Prayer Text */}
                            <div className="prose prose-lg max-w-none text-gray-700 font-serif leading-relaxed">
                                {isPraying ? (
                                    <div className="animate-in fade-in duration-500">
                                        {novena.openingPrayer && (
                                            <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-100">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-3">Opening Prayer</h4>
                                                <p className="whitespace-pre-line text-amber-900">{novena.openingPrayer}</p>
                                            </div>
                                        )}

                                        <div className="mb-8">
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-3">Daily Prayer</h4>
                                            <p className="whitespace-pre-line text-lg">{prayerForDay || "Prayer content coming soon..."}</p>
                                        </div>

                                        {novena.closingPrayer && (
                                            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-blue-800 mb-3">Closing Prayer</h4>
                                                <p className="whitespace-pre-line text-blue-900">{novena.closingPrayer}</p>
                                            </div>
                                        )}

                                        <div className="mt-12 flex justify-center">
                                            <button
                                                onClick={() => {
                                                    setIsPraying(false);
                                                    setCurrentDay(d => Math.min(d + 1, 9));
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="px-12 py-4 bg-rose-600 text-white rounded-full font-bold text-lg hover:bg-rose-700 shadow-xl shadow-rose-200 hover:shadow-2xl transition transform hover:-translate-y-1"
                                            >
                                                Amen (Complete Day {currentDay})
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Flame className="w-10 h-10 text-rose-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to pray Day {currentDay}?</h3>
                                        <p className="text-gray-600 max-w-md mx-auto mb-8">
                                            Find a quiet space, clear your mind, and open your heart to God's grace.
                                        </p>
                                        <button
                                            onClick={() => setIsPraying(true)}
                                            className="px-8 py-3 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition"
                                        >
                                            Start Prayer
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
