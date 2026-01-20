'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, User, Flame, ArrowRight, Calendar, Lock, ChevronRight } from 'lucide-react';

interface DailyFocusProps {
    reading?: {
        citation: string;
        text: string;
    };
    saint?: {
        name: string;
        title?: string;
        image?: string;
    };
    date?: string;
    liturgicalColor?: string;
}

export function DailyFocus({ reading, saint, date, liturgicalColor = 'green' }: DailyFocusProps) {
    // Helper for liturgical colors
    const getBgColor = (color: string) => {
        switch (color.toLowerCase()) {
            case 'purple': return 'bg-purple-100 text-purple-700';
            case 'red': return 'bg-red-100 text-red-700';
            case 'white': return 'bg-yellow-50 text-yellow-700';
            case 'green': return 'bg-emerald-50 text-emerald-700';
            default: return 'bg-sacred-100 text-sacred-700';
        }
    };

    return (
        <section className="relative -mt-20 mb-16 px-4 z-20">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white rounded-3xl shadow-xl border border-gold-100/50 overflow-hidden backdrop-blur-xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sacred-50 to-cream-50 px-5 py-4 md:px-6 border-b border-gold-100/30 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sacred-100 rounded-lg shrink-0">
                                <Calendar className="w-5 h-5 text-sacred-600" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-gray-900 text-lg md:text-xl">Today's Sacred Focus</h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    {date || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pl-2 md:pl-0">
                            <Link
                                href="/login"
                                className="text-xs font-bold text-sacred-600 hover:text-sacred-700 uppercase tracking-widest flex items-center gap-1 group"
                            >
                                <Lock className="w-3 h-3" />
                                Login to Track
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* 1. The Word */}
                        <div className="p-5 md:p-8 hover:bg-gray-50/50 transition-colors group relative">
                            <div className="mb-3 md:mb-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                <BookOpen className="w-3 h-3" /> Gospel
                            </div>

                            <h4 className="font-serif font-bold text-lg md:text-xl text-gray-900 mb-2">Daily Wisdom</h4>
                            <p className="text-sm font-medium text-sacred-600 mb-3 line-clamp-1">{reading?.citation || "Loading..."}</p>

                            <div className="prose prose-sm text-gray-600 line-clamp-3 mb-4 italic leading-relaxed">
                                "{reading?.text || "The Word of God is alive and active..."}"
                            </div>

                            <Link href="/readings" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-sacred-600 transition-colors group/link">
                                Read Full Gospel <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                        </div>

                        {/* 2. The Saint */}
                        <div className="p-5 md:p-8 hover:bg-gray-50/50 transition-colors relative">
                            <div className="mb-3 md:mb-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                <User className="w-3 h-3" /> Saint
                            </div>

                            <h4 className="font-serif font-bold text-lg md:text-xl text-gray-900 mb-2">Intercessor</h4>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden ring-2 ring-gold-100 shrink-0 relative">
                                    {saint?.image ? (
                                        <Image src={saint.image} alt={saint.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-serif font-bold">
                                            {saint?.name?.charAt(0) || 'S'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{saint?.name || "Saint of the Day"}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1">{saint?.title || "Pray for us"}</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                Learn from the lives of the saints and ask for their intercession today.
                            </p>

                            <Link href="/saints" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-sacred-600 transition-colors group/link">
                                View Profile <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                        </div>

                        {/* 3. The Call (Action) */}
                        <div className="p-5 md:p-8 bg-gradient-to-br from-sacred-900 via-sacred-800 to-sacred-900 text-white relative overflow-hidden group">
                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div>
                                    <div className="mb-3 md:mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md text-gold-200 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wide">
                                        <Flame className="w-3 h-3" /> Action
                                    </div>

                                    <h4 className="font-serif font-bold text-lg md:text-xl text-white mb-2">Light a Candle</h4>
                                    <p className="text-sm text-blue-100/90 mb-6 leading-relaxed">
                                        Join thousands in prayer. Light a virtual candle for your intentions.
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        href="/candles"
                                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gold-500 hover:bg-gold-400 text-sacred-900 font-bold rounded-xl transition-all shadow-lg shadow-gold-900/20 group/btn"
                                    >
                                        <Flame className="w-4 h-4 mr-2 fill-current" />
                                        Light Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
