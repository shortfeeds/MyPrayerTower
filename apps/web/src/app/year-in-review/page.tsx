"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, BookOpen, Heart, Flame, Church, Trophy, Star, Share2, Download, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function YearInReviewPage() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [stats, setStats] = useState({
        totalPrayers: 0,
        rosaries: 0,
        dailyReadings: 0,
        streakDays: 0,
        longestStreak: 0,
        churchVisits: 0,
        prayersForOthers: 0,
        journalEntries: 0,
        sacraments: 0,
        novenas: 0,
        badges: [] as string[],
    });

    const year = new Date().getFullYear();

    useEffect(() => {
        // Load real data from localStorage
        const journal = JSON.parse(localStorage.getItem('mpt_journal_entries') || '[]');
        const readingPlans = JSON.parse(localStorage.getItem('mpt_reading_plans') || '{}');
        const novenas = JSON.parse(localStorage.getItem('mpt_active_novenas') || '[]');
        const sacraments = JSON.parse(localStorage.getItem('mpt_sacrament_records') || '[]');

        // Calculate stats
        const totalReadingDays = Object.values(readingPlans).reduce((acc: number, days: any) => acc + days.length, 0);
        const completedNovenas = novenas.filter((n: any) => n.isCompleted).length;
        const receivedSacraments = sacraments.filter((s: any) => s.isReceived).length;

        setStats({
            totalPrayers: journal.length + totalReadingDays + (completedNovenas * 9), // Rough estimate
            rosaries: 0, // No specific tracker for this yet
            dailyReadings: totalReadingDays,
            streakDays: 0, // Needs a proper streak tracker
            longestStreak: 0,
            churchVisits: 0,
            prayersForOthers: 0,
            journalEntries: journal.length,
            sacraments: receivedSacraments,
            novenas: completedNovenas,
            badges: [],
        });
    }, []);

    const slides = [
        // Slide 1: Intro
        {
            id: 'intro',
            bg: 'bg-slate-900',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Sparkles className="w-16 h-16 text-amber-400 mb-6 animate-pulse" />
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                        Your {year} Faith Journey
                    </h1>
                    <p className="text-xl text-slate-300 max-w-md">
                        A look back at your spiritual growth and moments of grace.
                    </p>
                </div>
            )
        },
        // Slide 2: Journaling
        {
            id: 'journal',
            bg: 'bg-indigo-900',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <BookOpen className="w-16 h-16 text-indigo-300 mb-6" />
                    <p className="text-xl text-indigo-200 mb-2">You recorded</p>
                    <h2 className="text-7xl font-serif font-bold text-white mb-2">
                        {stats.journalEntries}
                    </h2>
                    <p className="text-2xl text-indigo-200">journal entries</p>
                    <p className="text-indigo-300/80 mt-4 max-w-md">
                        Each entry is a conversation with God. Keep writing your story.
                    </p>
                </div>
            )
        },
        // Slide 3: Scripture
        {
            id: 'scripture',
            bg: 'bg-emerald-900',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Flame className="w-16 h-16 text-emerald-300 mb-6" />
                    <p className="text-xl text-emerald-200 mb-2">You spent</p>
                    <h2 className="text-7xl font-serif font-bold text-white mb-2">
                        {stats.dailyReadings}
                    </h2>
                    <p className="text-2xl text-emerald-200">days in scripture</p>
                    <p className="text-emerald-300/80 mt-4">
                        "Your word is a lamp for my feet, a light on my path."
                    </p>
                </div>
            )
        },
        // Slide 4: Novenas
        {
            id: 'novenas',
            bg: 'bg-rose-900',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Heart className="w-16 h-16 text-rose-300 mb-6" />
                    <p className="text-xl text-rose-200 mb-2">You completed</p>
                    <h2 className="text-7xl font-serif font-bold text-white mb-2">
                        {stats.novenas}
                    </h2>
                    <p className="text-2xl text-rose-200">novenas</p>
                    <p className="text-rose-300/80 mt-4">
                        Powerful prayers of persistence and faith.
                    </p>
                </div>
            )
        },
        // Slide 5: Sacraments
        {
            id: 'sacraments',
            bg: 'bg-amber-900',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Church className="w-16 h-16 text-amber-300 mb-6" />
                    <p className="text-xl text-amber-200 mb-2">You have received</p>
                    <h2 className="text-7xl font-serif font-bold text-white mb-2">
                        {stats.sacraments}
                    </h2>
                    <p className="text-2xl text-amber-200">sacraments</p>
                    <p className="text-amber-300/80 mt-4">
                        Visible signs of invisible grace.
                    </p>
                </div>
            )
        },
        // Slide 6: Summary
        {
            id: 'summary',
            bg: 'bg-slate-900',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8 animate-in fade-in duration-1000">
                    <Trophy className="w-20 h-20 text-yellow-400 mb-8" />
                    <h2 className="text-4xl font-serif font-bold text-white mb-6">
                        Keep the Faith!
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-sm">
                        <div className="bg-white/10 p-4 rounded-xl">
                            <div className="text-2xl font-bold">{stats.journalEntries}</div>
                            <div className="text-xs text-slate-400">Entries</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl">
                            <div className="text-2xl font-bold">{stats.dailyReadings}</div>
                            <div className="text-xs text-slate-400">Readings</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl">
                            <div className="text-2xl font-bold">{stats.novenas}</div>
                            <div className="text-xs text-slate-400">Novenas</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl">
                            <div className="text-2xl font-bold">{stats.sacraments}</div>
                            <div className="text-xs text-slate-400">Sacraments</div>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                        Return Home <ArrowRight size={18} />
                    </Link>
                </div>
            )
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentSlide(currentSlide + 1);
                setIsAnimating(false);
            }, 300);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentSlide(currentSlide - 1);
                setIsAnimating(false);
            }, 300);
        }
    };

    return (
        <div className={`min-h-screen ${slides[currentSlide].bg} transition-colors duration-700`}>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
                <div className="flex gap-2 max-w-md mx-auto">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= currentSlide ? 'bg-white' : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div
                className={`min-h-screen transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            >
                {slides[currentSlide].content}
            </div>

            {/* Navigation Controls */}
            <div className="fixed bottom-0 left-0 right-0 p-8 z-50">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className={`text-white/50 hover:text-white transition-colors disabled:opacity-0 ${currentSlide === 0 ? 'pointer-events-none' : ''
                            }`}
                    >
                        Back
                    </button>

                    {currentSlide < slides.length - 1 && (
                        <button
                            onClick={nextSlide}
                            className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
