'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Heart, Flame, Church, Trophy, Star, Share2, Download, ChevronRight } from 'lucide-react';

// Mock data - in production this would come from server
const mockStats = {
    totalPrayers: 847,
    rosaries: 45,
    dailyReadings: 312,
    streakDays: 156,
    longestStreak: 45,
    churchVisits: 52,
    prayerWallPosts: 23,
    prayersForOthers: 234,
    challengesCompleted: 3,
    badges: ['first_prayer', 'rosary_warrior', 'streak_7', 'streak_30', 'community_helper', 'lent_2025'],
    topPrayers: ['Morning Offering', 'Hail Mary', 'Our Father', 'Divine Mercy Chaplet'],
    monthlyProgress: [12, 23, 34, 45, 32, 43, 54, 45, 56, 67, 78, 89]
};

export default function YearInReviewPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const year = new Date().getFullYear() - 1; // Show last year

    const slides = [
        // Slide 1: Intro
        {
            id: 'intro',
            bg: 'from-sacred-700 via-sacred-800 to-sacred-900',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Sparkles className="w-16 h-16 text-gold-400 mb-6" />
                    <h1 className="text-5xl font-display font-bold text-white mb-4">
                        Your {year} Faith Journey
                    </h1>
                    <p className="text-xl text-blue-100/80 max-w-md">
                        Let's look back at how you grew in faith this year ✨
                    </p>
                </div>
            )
        },
        // Slide 2: Total Prayers
        {
            id: 'prayers',
            bg: 'from-rose-600 to-rose-700',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Heart className="w-16 h-16 text-rose-200 mb-6" />
                    <p className="text-xl text-rose-100 mb-2">You prayed</p>
                    <h2 className="text-7xl font-display font-bold text-white mb-2">
                        {mockStats.totalPrayers}
                    </h2>
                    <p className="text-2xl text-rose-100">prayers this year</p>
                    <p className="text-rose-200/80 mt-4">That's {Math.round(mockStats.totalPrayers / 365)} prayers per day! 🙏</p>
                </div>
            )
        },
        // Slide 3: Streak
        {
            id: 'streak',
            bg: 'from-orange-500 to-amber-600',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Flame className="w-16 h-16 text-white mb-6" />
                    <p className="text-xl text-orange-100 mb-2">Your longest streak was</p>
                    <h2 className="text-7xl font-display font-bold text-white mb-2">
                        {mockStats.longestStreak}
                    </h2>
                    <p className="text-2xl text-orange-100">days in a row!</p>
                    <p className="text-orange-200/80 mt-4">Incredible dedication! 🔥</p>
                </div>
            )
        },
        // Slide 4: Rosaries
        {
            id: 'rosary',
            bg: 'from-sky-500 to-blue-600',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Star className="w-16 h-16 text-sky-200 mb-6" />
                    <p className="text-xl text-sky-100 mb-2">You prayed the Rosary</p>
                    <h2 className="text-7xl font-display font-bold text-white mb-2">
                        {mockStats.rosaries}
                    </h2>
                    <p className="text-2xl text-sky-100">times!</p>
                    <p className="text-sky-200/80 mt-4">{mockStats.rosaries * 53} Hail Marys 📿</p>
                </div>
            )
        },
        // Slide 5: Community
        {
            id: 'community',
            bg: 'from-purple-600 to-violet-700',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Heart className="w-16 h-16 text-purple-200 mb-6 fill-purple-200" />
                    <p className="text-xl text-purple-100 mb-2">You prayed for others</p>
                    <h2 className="text-7xl font-display font-bold text-white mb-2">
                        {mockStats.prayersForOthers}
                    </h2>
                    <p className="text-2xl text-purple-100">times</p>
                    <p className="text-purple-200/80 mt-4">The power of community! 💜</p>
                </div>
            )
        },
        // Slide 6: Badges
        {
            id: 'badges',
            bg: 'from-emerald-600 to-teal-700',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Trophy className="w-16 h-16 text-emerald-200 mb-6" />
                    <p className="text-xl text-emerald-100 mb-2">You earned</p>
                    <h2 className="text-7xl font-display font-bold text-white mb-2">
                        {mockStats.badges.length}
                    </h2>
                    <p className="text-2xl text-emerald-100">badges!</p>
                    <div className="flex gap-2 mt-6">
                        {mockStats.badges.slice(0, 4).map((badge, i) => (
                            <div key={i} className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-gold-300" />
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        // Slide 7: Summary
        {
            id: 'summary',
            bg: 'from-gold-500 to-amber-600',
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Sparkles className="w-16 h-16 text-white mb-6" />
                    <h2 className="text-4xl font-display font-bold text-white mb-6">
                        What an Amazing Year!
                    </h2>
                    <p className="text-xl text-amber-100 max-w-md mb-8">
                        Keep growing in faith. We're blessed to have you in our community!
                    </p>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white text-amber-700 font-bold rounded-xl flex items-center gap-2 hover:bg-amber-50 transition-colors">
                            <Share2 className="w-5 h-5" />
                            Share
                        </button>
                        <button className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-white/30 transition-colors">
                            <Download className="w-5 h-5" />
                            Download
                        </button>
                    </div>
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
        <div className={`min-h-screen bg-gradient-to-br ${slides[currentSlide].bg} transition-all duration-500`}>
            {/* Progress */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4">
                <div className="max-w-md mx-auto flex gap-1">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all ${i <= currentSlide ? 'bg-white' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div
                className={`min-h-screen flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'
                    }`}
            >
                {slides[currentSlide].content}
            </div>

            {/* Navigation */}
            <div className="fixed bottom-8 left-0 right-0 px-4">
                <div className="max-w-md mx-auto flex justify-between">
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                    >
                        Back
                    </button>
                    {currentSlide < slides.length - 1 ? (
                        <button
                            onClick={nextSlide}
                            className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl flex items-center gap-2 hover:bg-white/90 transition-colors"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <Link
                            href="/"
                            className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transition-colors"
                        >
                            Done
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
