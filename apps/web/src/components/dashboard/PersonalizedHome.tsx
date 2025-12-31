'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Flame, Sun, Moon, Star, BookOpen, Heart,
    ChevronRight, Calendar, Church, Sparkles,
    Play, Clock, Quote
} from 'lucide-react';

interface DailyData {
    saint?: { name: string; feastDay: string; slug: string };
    reading?: { title: string; reference: string };
    quote?: { text: string; author: string };
    streak?: { current: number; prayedToday: boolean; longest: number };
}

/**
 * PersonalizedHome - Hallow-inspired personalized dashboard
 * Shows greeting, daily content, streak, and quick actions
 */
export function PersonalizedHome({ userId }: { userId?: string }) {
    const [data, setData] = useState<DailyData>({});
    const [loading, setLoading] = useState(true);

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good Morning', icon: Sun, color: 'text-amber-500' };
        if (hour < 17) return { text: 'Good Afternoon', icon: Sun, color: 'text-orange-500' };
        if (hour < 21) return { text: 'Good Evening', icon: Moon, color: 'text-indigo-500' };
        return { text: 'Good Night', icon: Moon, color: 'text-blue-400' };
    };

    const greeting = getGreeting();
    const GreetingIcon = greeting.icon;

    useEffect(() => {
        // Fetch personalized data
        Promise.all([
            fetch('/api/saints/today').then(r => r.json()).catch(() => null),
            fetch('/api/readings/today').then(r => r.json()).catch(() => null),
        ]).then(([saint, reading]) => {
            setData({
                saint: saint?.saint,
                reading: reading?.reading,
                quote: { text: "The Lord is my shepherd; I shall not want.", author: "Psalm 23:1" },
                streak: { current: 7, prayedToday: true, longest: 14 }
            });
            setLoading(false);
        });
    }, []);

    const quickActions = [
        { icon: Heart, label: 'Rosary', href: '/rosary', color: 'bg-rose-500', glow: 'shadow-rose-500/30' },
        { icon: BookOpen, label: 'Readings', href: '/readings', color: 'bg-emerald-500', glow: 'shadow-emerald-500/30' },
        { icon: Church, label: 'Find Mass', href: '/churches', color: 'bg-blue-500', glow: 'shadow-blue-500/30' },
        { icon: Star, label: 'Saints', href: '/saints', color: 'bg-purple-500', glow: 'shadow-purple-500/30' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950">
            {/* Header with Greeting */}
            <div className="px-6 pt-8 pb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <GreetingIcon className={`w-5 h-5 ${greeting.color}`} />
                            <span className="text-white/60 text-sm">{greeting.text}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            Welcome Back
                        </h1>
                    </div>

                    {/* Prayer Streak */}
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${data.streak?.prayedToday
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                                : 'bg-white/10'
                            }`}>
                            <Flame className={`w-5 h-5 ${data.streak?.prayedToday ? 'text-white fill-current' : 'text-white/50'}`} />
                            <span className="text-white font-bold text-lg">{data.streak?.current || 0}</span>
                        </div>
                        <span className="text-white/40 text-xs mt-1">day streak</span>
                    </div>
                </div>

                {/* Daily Inspiration Quote */}
                <div className="bg-gradient-to-r from-gold-500/20 to-amber-500/10 rounded-2xl p-5 border border-gold-500/20 backdrop-blur-md">
                    <div className="flex gap-3">
                        <Quote className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1 opacity-50" />
                        <div>
                            <p className="text-white/90 text-lg italic leading-relaxed">
                                "{data.quote?.text || 'Loading inspiration...'}"
                            </p>
                            <p className="text-gold-400 text-sm mt-2 font-medium">
                                — {data.quote?.author}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white/80 font-semibold text-lg">Quick Prayers</h2>
                    <Link href="/prayers" className="text-gold-400 text-sm flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                            <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center shadow-lg ${action.glow}`}>
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-white/80 text-xs font-medium">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Today's Cards */}
            <div className="px-6 py-4 space-y-4">
                {/* Saint of the Day */}
                <Link
                    href={data.saint?.slug ? `/saints/${data.saint.slug}` : '/saints'}
                    className="block bg-gradient-to-br from-purple-600/30 to-purple-900/30 rounded-3xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-purple-300 text-sm mb-2">
                                <Star className="w-4 h-4 fill-current" />
                                <span>Saint of the Day</span>
                            </div>
                            <h3 className="text-white text-xl font-bold mb-1">
                                {data.saint?.name || 'Loading...'}
                            </h3>
                            <p className="text-white/60 text-sm">
                                {data.saint?.feastDay || 'Feast Day'}
                            </p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                            <Star className="w-8 h-8 text-purple-300" />
                        </div>
                    </div>
                </Link>

                {/* Daily Reading */}
                <Link
                    href="/readings"
                    className="block bg-gradient-to-br from-emerald-600/30 to-emerald-900/30 rounded-3xl p-6 border border-emerald-500/20 hover:border-emerald-400/40 transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-300 text-sm mb-2">
                                <BookOpen className="w-4 h-4" />
                                <span>Today's Reading</span>
                            </div>
                            <h3 className="text-white text-xl font-bold mb-1">
                                {data.reading?.title || 'Gospel of the Day'}
                            </h3>
                            <p className="text-white/60 text-sm">
                                {data.reading?.reference || 'Mass Readings'}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/50 transition-colors">
                            <Play className="w-5 h-5 text-emerald-300 ml-0.5" />
                        </div>
                    </div>
                </Link>

                {/* Prayer Wall Preview */}
                <Link
                    href="/prayer-wall"
                    className="block bg-gradient-to-br from-rose-600/30 to-rose-900/30 rounded-3xl p-6 border border-rose-500/20 hover:border-rose-400/40 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-rose-300 text-sm mb-1">
                                <Heart className="w-4 h-4 fill-current" />
                                <span>Prayer Wall</span>
                            </div>
                            <p className="text-white/80 font-medium">
                                Join the global community in prayer
                            </p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-white/40" />
                    </div>
                </Link>
            </div>

            {/* Weekly Streak Calendar */}
            <div className="px-6 py-6">
                <h2 className="text-white/80 font-semibold text-lg mb-4">This Week</h2>
                <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex justify-between">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                            const isToday = i === new Date().getDay();
                            const isPast = i < new Date().getDay();
                            const completed = isPast || (isToday && data.streak?.prayedToday);

                            return (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <span className="text-white/40 text-xs">{day}</span>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${completed
                                            ? 'bg-gradient-to-br from-orange-400 to-amber-500'
                                            : isToday
                                                ? 'bg-white/20 ring-2 ring-orange-400'
                                                : 'bg-white/10'
                                        }`}>
                                        {completed && <Flame className="w-5 h-5 text-white fill-current" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Padding */}
            <div className="h-24" />
        </div>
    );
}
