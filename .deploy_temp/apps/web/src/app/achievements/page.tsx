'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy, Medal, Target, Star, Crown, ChevronRight, TrendingUp } from 'lucide-react';

const BADGES = [
    { id: 'first_prayer', name: 'First Prayer', icon: '🙏', earned: true, description: 'Submit your first prayer' },
    { id: 'devoted', name: 'Devoted', icon: '✨', earned: true, description: 'Submit 10 prayers' },
    { id: 'faithful', name: 'Faithful', icon: '🕯️', earned: false, description: 'Submit 50 prayers' },
    { id: 'prayer_warrior', name: 'Prayer Warrior', icon: '⚔️', earned: false, description: 'Submit 100 prayers' },
    { id: 'week_streak', name: 'Weekly Devotion', icon: '🔥', earned: true, description: '7-day streak' },
    { id: 'month_streak', name: 'Monthly Devotion', icon: '💎', earned: false, description: '30-day streak' },
    { id: 'explorer', name: 'Explorer', icon: '🗺️', earned: true, description: 'Save 5 churches' },
    { id: 'helper', name: 'Helper', icon: '🤝', earned: true, description: 'Pray for 10 others' },
    { id: 'intercessor', name: 'Intercessor', icon: '🌟', earned: false, description: 'Pray for 100 others' },
];

const LEADERBOARD = [
    { rank: 1, name: 'Maria S.', streak: 156, level: 24, badge: '👑' },
    { rank: 2, name: 'John D.', streak: 134, level: 21, badge: '🥈' },
    { rank: 3, name: 'Sarah M.', streak: 98, level: 18, badge: '🥉' },
    { rank: 4, name: 'Peter L.', streak: 87, level: 16 },
    { rank: 5, name: 'Anna K.', streak: 72, level: 14 },
];

export default function AchievementsPage() {
    const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges');

    // Mock user stats
    const userStats = {
        level: 8,
        xp: 780,
        xpToNext: 900,
        currentStreak: 12,
        longestStreak: 24,
        totalPrayers: 45,
        prayedFor: 156,
        rank: 47,
    };

    const progressPercent = (userStats.xp / userStats.xpToNext) * 100;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-8 text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Trophy className="w-8 h-8" />
                        Your Achievements
                    </h1>

                    {/* Level Progress */}
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    {userStats.level}
                                </div>
                                <div>
                                    <p className="text-purple-200">Level {userStats.level}</p>
                                    <p className="text-2xl font-bold">Prayer Champion</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-purple-200">Global Rank</p>
                                <p className="text-3xl font-bold">#{userStats.rank}</p>
                            </div>
                        </div>

                        {/* XP Bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span>{userStats.xp} XP</span>
                                <span>{userStats.xpToNext} XP</span>
                            </div>
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-center text-purple-200 text-sm mt-2">
                                {userStats.xpToNext - userStats.xp} XP to Level {userStats.level + 1}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="container mx-auto px-4 -mt-6">
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { icon: Flame, label: 'Current Streak', value: `${userStats.currentStreak} days`, color: 'text-orange-500' },
                        { icon: TrendingUp, label: 'Best Streak', value: `${userStats.longestStreak} days`, color: 'text-green-500' },
                        { icon: Target, label: 'Prayers', value: userStats.totalPrayers, color: 'text-blue-500' },
                        { icon: Star, label: 'Prayed For', value: userStats.prayedFor, color: 'text-purple-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="container mx-auto px-4 mt-8">
                <div className="flex gap-4 border-b border-gray-200 mb-6">
                    {[
                        { id: 'badges', label: 'Badges', icon: Medal },
                        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 pb-4 px-2 font-medium ${activeTab === tab.id
                                    ? 'text-purple-600 border-b-2 border-purple-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Badges Tab */}
                {activeTab === 'badges' && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 pb-10">
                        {BADGES.map((badge) => (
                            <div
                                key={badge.id}
                                className={`p-4 rounded-xl text-center transition-all ${badge.earned
                                        ? 'bg-white shadow-sm'
                                        : 'bg-gray-100 opacity-50'
                                    }`}
                            >
                                <div className={`text-4xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                                    {badge.icon}
                                </div>
                                <p className="font-medium text-gray-900 text-sm">{badge.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                                {badge.earned && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                        ✓ Earned
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Leaderboard Tab */}
                {activeTab === 'leaderboard' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-10">
                        {LEADERBOARD.map((user, i) => (
                            <div
                                key={user.rank}
                                className={`flex items-center justify-between p-4 border-b last:border-0 ${i < 3 ? 'bg-gradient-to-r from-amber-50 to-transparent' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-amber-400 text-white' :
                                            i === 1 ? 'bg-gray-300 text-white' :
                                                i === 2 ? 'bg-orange-400 text-white' :
                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.badge || user.rank}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">Level {user.level}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-orange-500">
                                    <Flame className="w-5 h-5" />
                                    <span className="font-bold">{user.streak}</span>
                                    <span className="text-gray-400">days</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
