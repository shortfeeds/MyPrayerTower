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
import { BarChart3, Target, Heart, Book, Trophy, Bell } from 'lucide-react';

type TabId = 'overview' | 'challenges' | 'intentions' | 'bible' | 'achievements' | 'reminders';

const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'intentions', label: 'Intentions', icon: Heart },
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

                    {activeTab === 'reminders' && (
                        <PrayerReminderScheduler />
                    )}
                </div>
            </div>
        </div>
    );
}
