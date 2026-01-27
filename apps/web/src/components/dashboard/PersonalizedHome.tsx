'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Flame, Sun, Moon, Star, BookOpen, Heart,
    ChevronRight, Calendar, Church, Sparkles,
    Play, Clock, Quote, Book, Settings
} from 'lucide-react';
import { ReminderPreferences } from '@/components/dashboard/ReminderPreferences';
import { getUserPrayerRequests, markPrayerAnswered } from '@/app/actions/prayer';
import { Sparkles as SparklesIcon } from 'lucide-react';
import { NotificationSettings } from '@/components/dashboard/NotificationSettings';
import { X, Wind } from 'lucide-react';
import { SacredPause } from '@/components/ui/SacredPause';
import { Candle } from '@/components/ui/Candle';

interface DailyData {
    saint?: { name: string; feastDay: string; slug: string };
    reading?: { title: string; reference: string };
    quote?: { text: string; author: string };
    streak?: { current: number; prayedToday: boolean; longest: number };
    memorials?: Array<{ name: string; relation: string; anniversary: string }>;
    prayers?: Array<any>;
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
    const [showPause, setShowPause] = useState(false);

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
            fetch('/api/daily-content/today').then(r => r.json()).catch(() => null),
            getUserPrayerRequests().catch(() => [])
        ]).then(([daily, prayers]) => {
            setData({
                saint: daily?.saint,
                reading: daily?.reading,
                quote: daily?.quote || { text: "The Lord is my shepherd; I shall not want.", author: "Psalm 23:1" },
                streak: { current: 7, prayedToday: true, longest: 14 },
                memorials: [
                    { name: "Maria Garcia", relation: "Grandmother", anniversary: "Oct 12" },
                    { name: "John Smith", relation: "Friend", anniversary: "Mar 15" }
                ],
                prayers: prayers || []
            });
            setLoading(false);
        });
    }, []);

    const handleMarkAnswered = async (prayerId: string) => {
        // Optimistic update
        if (data.prayers) {
            setData(prev => ({
                ...prev,
                prayers: prev.prayers?.map(p => p.id === prayerId ? { ...p, isAnswered: true, status: 'ANSWERED' } : p)
            }));
        }
        await markPrayerAnswered(prayerId);
    };

    const quickActions = [
        { icon: Heart, label: 'Rosary', href: '/rosary', color: 'bg-rose-500', glow: 'shadow-rose-500/30' },
        { icon: BookOpen, label: 'Readings', href: '/readings', color: 'bg-emerald-500', glow: 'shadow-emerald-500/30' },
        { icon: SparklesIcon, label: 'Pray', href: '/prayer-wall', color: 'bg-amber-500', glow: 'shadow-amber-500/30' },
        { icon: Wind, label: 'Pause', onClick: () => setShowPause(true), color: 'bg-indigo-500', glow: 'shadow-indigo-500/30' }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-transparent opacity-60" />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            {/* Hero Section */}
            <div className="relative px-6 pt-8 pb-8">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2 opacity-0 animate-fade-in text-white/60">
                            <GreetingIcon className={`w-4 h-4 ${greeting.color}`} />
                            <span className="text-sm font-medium tracking-wide uppercase">{greeting.text}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight opacity-0 animate-fade-in mb-4" style={{ animationDelay: '0.1s' }}>
                            Welcome Back
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sacred Pause Trigger */}
                        <button
                            onClick={() => setShowPause(true)}
                            className="group relative px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 overflow-hidden"
                            title="Sacred Pause"
                        >
                            <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                            <div className="flex items-center gap-2 relative z-10">
                                <Wind className="w-5 h-5 text-indigo-300 group-hover:text-indigo-200" />
                                <span className="text-xs font-semibold text-indigo-200 hidden md:inline-block uppercase tracking-wider">Pause</span>
                            </div>
                        </button>

                        {/* Prayer Streak */}
                        <div className={`relative px-4 py-2 rounded-xl border transition-all ${data.streak?.prayedToday
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-white/5 border-white/10'
                            }`}>
                            <div className="flex items-center gap-2">
                                <Flame className={`w-5 h-5 ${data.streak?.prayedToday ? 'text-amber-400 fill-amber-400' : 'text-white/40'}`} />
                                <span className={`font-bold text-lg font-serif ${data.streak?.prayedToday ? 'text-amber-100' : 'text-white/60'}`}>{data.streak?.current || 0}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:rotate-45"
                        >
                            <Settings className="w-5 h-5 text-white/60" />
                        </button>
                    </div>
                </div>

                {/* Hero Card / Daily Inspiration */}
                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl p-8 border border-white/10 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors duration-700" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-full border border-amber-500/20 bg-amber-900/20 text-amber-400 flex-shrink-0">
                            <Quote className="w-10 h-10 opacity-80" />
                        </div>
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] uppercase tracking-widest font-bold mb-4">
                                <Sparkles className="w-3 h-3" /> Daily Word
                            </div>
                            <blockquote className="text-xl md:text-2xl font-serif text-white/90 leading-relaxed italic">
                                "{data.quote?.text || 'Loading inspiration...'}"
                            </blockquote>
                            <cite className="block mt-4 text-amber-400/80 text-sm font-medium not-italic tracking-wide">
                                — {data.quote?.author}
                            </cite>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-2 mb-8">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest">Quick Access</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        action.href ? (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all overflow-hidden"
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${action.color.replace('bg-', 'from-').replace('-500', '-500/10')} to-transparent`} />

                                <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${action.color} ${action.glow}`}>
                                    <action.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="relative font-medium text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                            </Link>
                        ) : (
                            <button
                                key={action.label}
                                onClick={action.onClick}
                                className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all overflow-hidden text-left w-full"
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${action.color.replace('bg-', 'from-').replace('-500', '-500/10')} to-transparent`} />

                                <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${action.color} ${action.glow}`}>
                                    <action.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="relative font-medium text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                            </button>
                        )
                    ))}
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="px-6 pb-24 grid lg:grid-cols-12 gap-8">

                {/* Left Column: Daily Content (8 cols) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Section: Today's Liturgy */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-purple-400" /> Today's Liturgy
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Saint of the Day */}
                            <Link
                                href={data.saint?.slug ? `/saints/${data.saint.slug}` : '/saints'}
                                className="group relative block bg-gradient-to-br from-purple-500/10 via-purple-900/5 to-transparent rounded-3xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors" />

                                <div className="relative z-10 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span>Saint of the Day</span>
                                        </div>
                                        <h3 className="text-white text-2xl font-serif font-bold mb-1 leading-tight group-hover:text-purple-200 transition-colors">
                                            {data.saint?.name || 'Loading...'}
                                        </h3>
                                        <p className="text-white/50 text-sm font-medium">
                                            {data.saint?.feastDay || 'Feast Day'}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/20">
                                        <Star className="w-5 h-5 text-purple-300" />
                                    </div>
                                </div>
                            </Link>

                            {/* Daily Reading */}
                            <Link
                                href="/readings"
                                className="group relative block bg-gradient-to-br from-emerald-500/10 via-emerald-900/5 to-transparent rounded-3xl p-6 border border-emerald-500/20 hover:border-emerald-400/40 transition-all overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors" />

                                <div className="relative z-10 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                                            <BookOpen className="w-3 h-3" />
                                            <span>Gospel</span>
                                        </div>
                                        <h3 className="text-white text-2xl font-serif font-bold mb-1 leading-tight group-hover:text-emerald-200 transition-colors">
                                            {data.reading?.title || 'Daily Gospel'}
                                        </h3>
                                        <p className="text-white/50 text-sm font-medium">
                                            {data.reading?.reference || 'Mass Readings'}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-900/20">
                                        <Play className="w-5 h-5 text-emerald-300 ml-0.5" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Section: Active Candles */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Flame className="w-3 h-3 text-amber-500" /> Sanctuary
                            </h2>
                            <Link href="/candles" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">View All</Link>
                        </div>

                        <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/10 rounded-3xl p-1 border border-amber-500/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mixture-blend-overlay" />
                            <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-[22px] p-6 h-full">
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse-slow" />
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-amber-900/30 to-black border border-amber-500/30 flex items-center justify-center relative z-10 shadow-2xl">
                                            <Candle size="lg" />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left space-y-3">
                                        <div>
                                            <h3 className="text-white text-lg font-bold">For the Sick & Suffering</h3>
                                            <p className="text-white/50 text-sm">Light a candle to unite your prayers with the community.</p>
                                        </div>
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                            <div className="bg-gradient-to-r from-amber-600 to-orange-500 h-full w-3/4 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-amber-500/80 font-medium uppercase tracking-wider">
                                            <span>7 Day Intentions</span>
                                            <span>Community Flame</span>
                                        </div>
                                    </div>
                                    <Link href="/candles" className="whitespace-nowrap px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors shadow-lg shadow-amber-500/20">
                                        Light a Candle
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Personal State (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* My Intentions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Heart className="w-3 h-3 text-rose-400" /> Intentions
                            </h2>
                            <button className="text-xs text-rose-400 hover:text-rose-300 transition-colors">+ Add New</button>
                        </div>

                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 min-h-[300px]">
                            {/* Tabs */}
                            <div className="flex p-1 bg-white/5 rounded-xl mb-6">
                                <button
                                    onClick={() => setIntentionTab('active')}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${intentionTab === 'active' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setIntentionTab('answered')}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${intentionTab === 'answered' ? 'bg-emerald-500/20 text-emerald-300 shadow-sm' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    Answered
                                </button>
                            </div>

                            <div className="space-y-3">
                                {intentionTab === 'active' ? (
                                    data.prayers?.filter(p => !p.isAnswered).length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-32 text-center">
                                            <Heart className="w-8 h-8 text-white/10 mb-2" />
                                            <p className="text-white/30 text-xs">Your heart is open.<br />Add an intention.</p>
                                        </div>
                                    ) : (
                                        data.prayers?.filter(p => !p.isAnswered).map((intention, i) => (
                                            <div key={intention.id} className="flex gap-3 items-start p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 transition-all group">
                                                <button
                                                    onClick={() => handleMarkAnswered(intention.id)}
                                                    className="mt-0.5 w-5 h-5 rounded-full border-2 border-white/10 group-hover:border-rose-400/50 flex items-center justify-center transition-colors"
                                                    title="Mark as Answered"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                                <div>
                                                    <p className="text-gray-300 text-sm leading-snug">"{intention.content}"</p>
                                                    <p className="text-white/20 text-[10px] mt-1.5 font-medium uppercase tracking-wider">{intention.date}</p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    // Answered View...
                                    data.prayers?.filter(p => p.isAnswered).length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-32 text-center">
                                            <SparklesIcon className="w-8 h-8 text-white/10 mb-2" />
                                            <p className="text-white/30 text-xs">No answered prayers yet.<br />Keep faifth.</p>
                                        </div>
                                    ) : (
                                        data.prayers?.filter(p => p.isAnswered).map((intention, i) => (
                                            <div key={intention.id} className="flex gap-3 items-start p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                                <div className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
                                                    <SparklesIcon className="w-3 h-3" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-300 text-sm leading-snug">"{intention.content}"</p>
                                                    <p className="text-emerald-500/40 text-[10px] mt-1.5 font-medium uppercase tracking-wider">Answered</p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Prayer Journey Component */}
                    <div className="space-y-4">
                        <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest px-1">Prayer Journey</h2>
                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                            <div className="flex justify-between items-center">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                                    const isToday = i === new Date().getDay();
                                    const isPast = i < new Date().getDay();
                                    const completed = isPast || (isToday && data.streak?.prayedToday); // Mock logic for demo

                                    return (
                                        <div key={i} className="flex flex-col items-center gap-3">
                                            <span className={`text-[10px] font-bold ${isToday ? 'text-amber-400' : 'text-white/20'}`}>{day}</span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${completed
                                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 scale-100'
                                                : isToday
                                                    ? 'bg-white/5 ring-1 ring-amber-500/30'
                                                    : 'bg-white/[0.02]'
                                                }`}>
                                                {completed && <Flame className="w-3.5 h-3.5 text-black fill-current" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Padding */}
            <div className="h-24" />
            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in relative shadow-2xl">
                        <button
                            onClick={() => setShowSettings(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <NotificationSettings />
                    </div>
                </div>
            )}
            {/* Sacred Pause Modal */}
            <SacredPause
                isOpen={showPause}
                onClose={() => setShowPause(false)}
            />
        </div>
    );
}
