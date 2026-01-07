'use client';

import { ReactNode, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Removed to fix runtime error
import { Sparkles, Flame, Heart, Compass, BarChart2 } from 'lucide-react';

interface DashboardGridProps {
    greeting: ReactNode;
    statsBar: ReactNode;
    dailyFocus: ReactNode;      // Verse, Reading, Saint
    journey: ReactNode;         // Streaks, Challenges
    community: ReactNode;       // Sessions, Global Stats
    recommendations: ReactNode;
    trending: ReactNode;
    recent: ReactNode;
}

export function DashboardGrid({
    greeting,
    statsBar,
    dailyFocus,
    journey,
    community,
    recommendations,
    trending,
    recent,
}: DashboardGridProps) {
    const [activeTab, setActiveTab] = useState<'daily' | 'explore' | 'community'>('daily');
    const [discoveryTab, setDiscoveryTab] = useState<'recommended' | 'trending' | 'recent'>('recommended');

    return (
        <div className="min-h-screen bg-cream-50 pb-20">
            {/* 1. Global Stats Bar (Always visible) */}
            {statsBar}

            {/* 2. Hero / Greeting Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        {greeting}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* 3. Main Dashboard Layout */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Daily Focus (2/3 width) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Section Header */}
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-gold-500" />
                                <h2 className="font-display text-xl font-bold text-gray-900">Daily Focus</h2>
                            </div>

                            {/* Daily Focus Widgets (Verse, Reading, Saint) */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                {dailyFocus}
                            </div>

                            {/* Content Discovery Tabs */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
                                    <button
                                        onClick={() => setDiscoveryTab('recommended')}
                                        className={`pb-2 text-sm font-bold transition-colors relative ${discoveryTab === 'recommended' ? 'text-sacred-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        For You
                                        {discoveryTab === 'recommended' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sacred-600" />}
                                    </button>
                                    <button
                                        onClick={() => setDiscoveryTab('trending')}
                                        className={`pb-2 text-sm font-bold transition-colors relative ${discoveryTab === 'trending' ? 'text-sacred-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Trending
                                        {discoveryTab === 'trending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sacred-600" />}
                                    </button>
                                    <button
                                        onClick={() => setDiscoveryTab('recent')}
                                        className={`pb-2 text-sm font-bold transition-colors relative ${discoveryTab === 'recent' ? 'text-sacred-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Recently Viewed
                                        {discoveryTab === 'recent' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sacred-600" />}
                                    </button>
                                </div>

                                <div className="relative">
                                    {discoveryTab === 'recommended' && <div>{recommendations}</div>}
                                    {discoveryTab === 'trending' && <div>{trending}</div>}
                                    {discoveryTab === 'recent' && <div>{recent}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Journey & Community (1/3 width) */}
                        <div className="space-y-8">

                            {/* My Journey Card */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Compass className="w-5 h-5 text-blue-500" />
                                    <h2 className="font-display text-xl font-bold text-gray-900">My Journey</h2>
                                </div>
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    {journey}
                                </div>
                            </div>

                            {/* Community Pulse */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Heart className="w-5 h-5 text-rose-500" />
                                    <h2 className="font-display text-xl font-bold text-gray-900">Community</h2>
                                </div>
                                <div className="space-y-4">
                                    {community}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
