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
import { ActiveCandlesList } from '@/components/spiritual/ActiveCandlesList';
import { BarChart3, Target, Heart, Book, Trophy, Bell, Bookmark, Flame, Church, Gift, ChevronRight } from 'lucide-react';
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

import { UserPrayerStats } from '@/app/actions/journey';

/**
 * Journey page content - client component for interactivity
 */
export default function JourneyContent({ initialStats }: { initialStats: UserPrayerStats | null }) {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    return (
        <div className="min-h-screen bg-cream-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-sacred-600 to-sacred-700 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold mb-2">My Prayer Corner</h1>
                        <p className="text-sacred-100">Your personal spiritual space to track prayer life and grow in faith</p>
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
                            <PrayerAnalyticsDashboard stats={initialStats} />

                            {/* Streaks */}
                            <div className="grid lg:grid-cols-2 gap-6">
                                <PrayerStreaks
                                    streak={initialStats?.currentStreak || 0}
                                    longestStreak={initialStats?.longestStreak || 0}
                                    totalPrayers={initialStats?.totalPrayers || 0}
                                    prayedToday={(initialStats?.todayPrayers || 0) > 0}
                                />
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
                        <div className="space-y-8">
                            {/* Active Offerings Section */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                                        <ActiveCandlesList />
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Church className="w-5 h-5 text-sacred-600" />
                                            Active Mass Intentions
                                        </h3>
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-500 mb-4">No pending mass requests.</p>
                                            <Link
                                                href="/mass-offerings"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-sacred-600 hover:bg-sacred-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Request Mass
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Create New Offering Actions */}
                                <div className="bg-gradient-to-br from-sacred-900 to-sacred-800 rounded-2xl p-8 text-white">
                                    <Flame className="w-12 h-12 text-gold-400 mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Make an Offering</h2>
                                    <p className="text-sacred-200 mb-8">
                                        Support the mission and lift up your prayers through our sacred offerings.
                                    </p>

                                    <div className="space-y-4">
                                        <Link
                                            href="/candles"
                                            className="block p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gold-400/20 rounded-lg text-gold-400">
                                                        <Flame size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="block font-bold">Light a Candle</span>
                                                        <span className="text-xs text-gray-300">From Free to Premium</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </Link>

                                        <Link
                                            href="/mass-offerings"
                                            className="block p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-400/20 rounded-lg text-blue-400">
                                                        <Church size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="block font-bold">Request a Mass</span>
                                                        <span className="text-xs text-gray-300">For Living or Deceased</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </Link>

                                        <Link
                                            href="/bouquets"
                                            className="block p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-400/20 rounded-lg text-purple-400">
                                                        <Gift size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="block font-bold">Spiritual Bouquet</span>
                                                        <span className="text-xs text-gray-300">Send Prayers & Gifts</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
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
