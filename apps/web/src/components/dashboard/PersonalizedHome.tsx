'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Flame, Sun, Moon, Star, BookOpen, Heart,
    ChevronRight, Calendar, Church, Sparkles,
    Play, Clock, Quote, Book, Settings
} from 'lucide-react';
import { ReminderPreferences } from '@/components/dashboard/ReminderPreferences';

interface DailyData {
    saint?: { name: string; feastDay: string; slug: string };
    reading?: { title: string; reference: string };
    quote?: { text: string; author: string };
    streak?: { current: number; prayedToday: boolean; longest: number };
    memorials?: Array<{ name: string; relation: string; anniversary: string }>;
}

/**
 * PersonalizedHome - Hallow-inspired personalized dashboard
 * Shows greeting, daily content, streak, and quick actions
 */
export function PersonalizedHome({ userId }: { userId?: string }) {
    const [data, setData] = useState<DailyData>({});
    const [loading, setLoading] = useState(true);
    const [intentionTab, setIntentionTab] = useState<'active' | 'answered'>('active');
    const [showSettings, setShowSettings] = useState(false);

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
                streak: { current: 7, prayedToday: true, longest: 14 },
                memorials: [
                    { name: "Maria Garcia", relation: "Grandmother", anniversary: "Oct 12" },
                    { name: "John Smith", relation: "Friend", anniversary: "Mar 15" }
                ]
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
                        <span className="text-white/40 text-xs mt-1">days of prayer</span>
                    </div>

                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="ml-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                {showSettings && <ReminderPreferences />}

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

            {/* Dashboard Grid */}
            <div className="px-6 py-4 grid lg:grid-cols-2 gap-6">

                {/* Left Column: Daily Content */}
                <div className="space-y-4">
                    <h2 className="text-white/80 font-semibold text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-gold-400" /> Daily Inspiration
                    </h2>

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

                    {/* Saved Prayers (Mock) */}
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Book className="w-4 h-4 text-blue-400" /> Saved Prayers
                            </h3>
                            <Link href="/prayers" className="text-xs text-blue-300 hover:text-blue-200">View All</Link>
                        </div>
                        <div className="space-y-2">
                            {[
                                { title: 'The Angelus', type: 'Daily Prayer' },
                                { title: 'Prayer to St. Michael', type: 'Protection' },
                                { title: 'Memorare', type: 'Marian' }
                            ].map((prayer, i) => (
                                <Link key={i} href="/prayers/angelus" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                    <div>
                                        <div className="text-white font-medium text-sm">{prayer.title}</div>
                                        <div className="text-white/40 text-xs">{prayer.type}</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Personal State */}
                <div className="space-y-4">
                    {/* My Intentions & Answered Prayers */}
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-400" /> My Prayer Intentions
                            </h3>
                            <button className="text-xs text-rose-300 hover:text-rose-200 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
                                + Add New
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-white/10 mb-4 pb-2">
                            <button
                                onClick={() => setIntentionTab('active')}
                                className={`text-sm font-medium pb-1 transition-colors relative ${intentionTab === 'active' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                            >
                                Active
                                {intentionTab === 'active' && <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-rose-500 rounded-full" />}
                            </button>
                            <button
                                onClick={() => setIntentionTab('answered')}
                                className={`text-sm font-medium pb-1 transition-colors relative ${intentionTab === 'answered' ? 'text-emerald-300' : 'text-white/40 hover:text-white/60'}`}
                            >
                                Answered
                                {intentionTab === 'answered' && <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {intentionTab === 'active' ? (
                                [
                                    { text: "For my grandmother's health", date: 'Added 2 days ago' },
                                    { text: "For peace in my family", date: 'Added 5 days ago' },
                                    { text: "For guidance in my career", date: 'Added 1 week ago' }
                                ].map((intention, i) => (
                                    <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-gradient-to-br from-rose-500/5 to-rose-900/5 border border-rose-500/10 hover:border-rose-500/30 transition-all">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
                                        <div>
                                            <p className="text-white/90 text-sm italic">"{intention.text}"</p>
                                            <p className="text-white/30 text-[10px] mt-1">{intention.date}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                [
                                    { text: "Recovery from surgery", date: 'Answered last month' },
                                    { text: "Safe travels", date: 'Answered in Dec' }
                                ].map((intention, i) => (
                                    <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-gradient-to-br from-emerald-500/5 to-emerald-900/5 border border-emerald-500/10 hover:border-emerald-500/30 transition-all">
                                        <div className="mt-1 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400">
                                            <Sparkles className="w-2.5 h-2.5" />
                                        </div>
                                        <div>
                                            <p className="text-white/90 text-sm italic">"{intention.text}"</p>
                                            <p className="text-emerald-400/60 text-[10px] mt-1">{intention.date}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Memorials I'm Remembering */}
                    {data.memorials && (
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-purple-300" /> Memorials
                            </h3>
                            <div className="space-y-3">
                                {data.memorials.map((memorial, i) => (
                                    <Link key={i} href="/memorials" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-serif">
                                                {memorial.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-sm">{memorial.name}</div>
                                                <div className="text-white/40 text-xs">{memorial.relation} • {memorial.anniversary}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Candles */}
                    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-3xl p-6 border border-amber-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" /> Active Candles
                            </h3>
                            <Link href="/candles" className="text-xs text-amber-300 hover:text-amber-200">Light Candle</Link>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                    <Flame className="w-6 h-6 text-white animate-pulse" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-medium text-sm">For the Sick</div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                        <div className="bg-amber-400 h-full w-3/4 rounded-full" />
                                    </div>
                                    <div className="text-amber-200/60 text-[10px] mt-1 flex justify-between">
                                        <span>7 Days Prayer</span>
                                        <span>2 days left</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prayer Journey (Formerly Weekly Streak) */}
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                        <h2 className="text-white/80 font-semibold text-lg mb-4">Prayer Journey</h2>
                        <div className="flex justify-between items-center px-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                                const isToday = i === new Date().getDay();
                                const isPast = i < new Date().getDay();
                                const completed = isPast || (isToday && data.streak?.prayedToday);

                                return (
                                    <div key={i} className="flex flex-col items-center gap-3">
                                        <span className={`text-xs ${isToday ? 'text-gold-400 font-bold' : 'text-white/40'}`}>{day}</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${completed
                                            ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/30 scale-110'
                                            : isToday
                                                ? 'bg-white/10 ring-1 ring-gold-400/50'
                                                : 'bg-white/5'
                                            }`}>
                                            {completed && <Flame className="w-4 h-4 text-white fill-current" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Padding */}
            <div className="h-24" />
        </div>
    );
}
