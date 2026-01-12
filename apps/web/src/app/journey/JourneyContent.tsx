'use client';

import { useState } from 'react';
import { PrayerAnalyticsDashboard } from '@/components/analytics/PrayerAnalyticsDashboard';
import { PrayerStreaks } from '@/components/gamification/PrayerStreaks';
import { DailyChallenges } from '@/components/gamification/DailyChallenges';
import { ConfessionReminder } from '@/components/spiritual/ConfessionReminder';
import { BibleReadingTracker } from '@/components/bible/BibleReadingTracker';
import { PrayerIntentionsJournal } from '@/components/spiritual/PrayerIntentionsJournal';
import { AchievementSystem } from '@/components/gamification/AchievementSystem';
import { PrayerReminderScheduler } from '@/components/settings/PrayerReminderScheduler';
import { SavedPrayersList } from '@/components/spiritual/SavedPrayersList';
import { BarChart3, Target, Heart, Book, Trophy, Bell, Bookmark, Flame } from 'lucide-react';
import Link from 'next/link';

type TabId = 'overview' | 'intentions' | 'saved' | 'offerings' | 'challenges' | 'bible' | 'achievements' | 'reminders';

const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'intentions', label: 'Intentions', icon: Heart },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'offerings', label: 'Offerings', icon: Flame },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'bible', label: 'Bible', icon: Book },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'reminders', label: 'Reminders', icon: Bell },
];

/**
 * Journey page content - client component for interactivity
 */
export default function JourneyContent() {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    return (
        <div className="min-h-screen bg-cream-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-sacred-600 to-sacred-700 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold mb-2">My Spiritual Journey</h1>
                        <p className="text-sacred-100">Track your prayer life and grow in faith</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <nav className="flex gap-1 overflow-x-auto py-2">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors
                                        ${activeTab === tab.id
                                            ? 'bg-sacred-600 text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Prayer Stats */}
                            <PrayerAnalyticsDashboard />

                            {/* Streaks */}
                            <div className="grid lg:grid-cols-2 gap-6">
                                <PrayerStreaks />
                                <ConfessionReminder />
                            </div>
                        </div>
                    )}

                    {activeTab === 'challenges' && (
                        <DailyChallenges />
                    )}

                    {activeTab === 'intentions' && (
                        <PrayerIntentionsJournal />
                    )}

                    {activeTab === 'bible' && (
                        <BibleReadingTracker />
                    )}

                    {activeTab === 'achievements' && (
                        <AchievementSystem />
                    )}

                    {activeTab === 'saved' && (
                        <SavedPrayersList />
                    )}

                    {activeTab === 'offerings' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
                            <Flame className="w-16 h-16 text-gold-200 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Offerings</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                View your active candles, mass intentions, and memorial tributes.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                <Link
                                    href="/candles"
                                    className="p-6 rounded-xl border border-gold-200 bg-gold-50/50 hover:bg-gold-50 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-3 mb-2 font-bold text-gray-900">
                                        <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-hover:scale-110 transition-transform">
                                            <Flame size={20} />
                                        </div>
                                        Light a Virtual Candle
                                    </div>
                                    <p className="text-sm text-gray-600 pl-14">
                                        Light a candle for your intentions or loved ones.
                                    </p>
                                </Link>

                                <Link
                                    href="/mass-offerings"
                                    className="p-6 rounded-xl border border-sacred-200 bg-sacred-50/50 hover:bg-sacred-50 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-3 mb-2 font-bold text-gray-900">
                                        <div className="w-10 h-10 rounded-full bg-sacred-100 flex items-center justify-center text-sacred-600 group-hover:scale-110 transition-transform">
                                            <Church size={20} />
                                        </div>
                                        Request a Mass
                                    </div>
                                    <p className="text-sm text-gray-600 pl-14">
                                        Have a Mass offered for your special intentions.
                                    </p>
                                </Link>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reminders' && (
                        <PrayerReminderScheduler />
                    )}
                </div>
            </div>
        </div>
    );
}
