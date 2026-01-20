'use client';

import { Trophy, Star, Flame, Book, Heart, Cross, Calendar, Users, Sun, Moon, Target, Award, Shield, Crown } from 'lucide-react';

// Badge definitions
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    requirement: string;
    earned?: boolean;
    earnedAt?: Date;
    progress?: number; // 0-100
    tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const BADGES: Badge[] = [
    {
        id: 'first-prayer',
        name: 'First Steps',
        description: 'Submit your first prayer intention',
        icon: Heart,
        color: 'from-rose-400 to-rose-600',
        requirement: 'Submit 1 prayer',
    },
    {
        id: 'prayer-warrior',
        name: 'Prayer Warrior',
        description: 'Pray for 100 intentions',
        icon: Shield,
        color: 'from-blue-400 to-blue-600',
        requirement: 'Pray for 100 intentions',
    },
    {
        id: 'streak-7',
        name: 'Week of Faith',
        description: 'Maintain a 7-day prayer streak',
        icon: Flame,
        color: 'from-orange-400 to-orange-600',
        requirement: '7-day streak',
        tier: 'bronze',
    },
    {
        id: 'streak-30',
        name: 'Month of Devotion',
        description: 'Maintain a 30-day prayer streak',
        icon: Flame,
        color: 'from-orange-500 to-red-500',
        requirement: '30-day streak',
        tier: 'silver',
    },
    {
        id: 'streak-100',
        name: 'Century of Prayer',
        description: 'Maintain a 100-day prayer streak',
        icon: Flame,
        color: 'from-red-500 to-pink-500',
        requirement: '100-day streak',
        tier: 'gold',
    },
    {
        id: 'rosary-master',
        name: 'Rosary Master',
        description: 'Complete 50 rosaries',
        icon: Cross,
        color: 'from-purple-400 to-purple-600',
        requirement: 'Complete 50 rosaries',
    },
    {
        id: 'daily-reader',
        name: 'Daily Reader',
        description: 'Read daily readings for 30 consecutive days',
        icon: Book,
        color: 'from-emerald-400 to-emerald-600',
        requirement: '30 days of readings',
    },
    {
        id: 'saint-scholar',
        name: 'Saint Scholar',
        description: 'Learn about 50 different saints',
        icon: Star,
        color: 'from-gold-400 to-gold-600',
        requirement: 'View 50 saints',
    },
    {
        id: 'community-builder',
        name: 'Community Builder',
        description: 'Create or join 5 prayer groups',
        icon: Users,
        color: 'from-sacred-400 to-sacred-600',
        requirement: 'Join 5 groups',
    },
    {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Pray before 6 AM for 7 days',
        icon: Sun,
        color: 'from-amber-400 to-amber-600',
        requirement: 'Pray early 7 times',
    },
    {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Pray after 10 PM for 7 days',
        icon: Moon,
        color: 'from-indigo-400 to-indigo-600',
        requirement: 'Pray late 7 times',
    },
    {
        id: 'goal-setter',
        name: 'Goal Achiever',
        description: 'Complete 10 prayer challenges',
        icon: Target,
        color: 'from-teal-400 to-teal-600',
        requirement: 'Complete 10 challenges',
    },
];

interface BadgeCardProps {
    badge: Badge;
    showProgress?: boolean;
}

export function BadgeCard({ badge, showProgress = false }: BadgeCardProps) {
    const Icon = badge.icon;

    return (
        <div className={`relative p-4 rounded-2xl border ${badge.earned
                ? 'bg-white dark:bg-gray-900 border-gold-200 dark:border-gold-800'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
            }`}>
            {/* Tier indicator */}
            {badge.tier && badge.earned && (
                <div className="absolute -top-2 -right-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${badge.tier === 'platinum' ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                            badge.tier === 'gold' ? 'bg-gradient-to-br from-gold-400 to-gold-600' :
                                badge.tier === 'silver' ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                    'bg-gradient-to-br from-amber-600 to-amber-800'
                        }`}>
                        <Crown className="w-3 h-3 text-white" />
                    </div>
                </div>
            )}

            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-3 ${badge.earned ? 'shadow-lg' : 'grayscale'
                }`}>
                <Icon className="w-7 h-7 text-white" />
            </div>

            <h4 className="font-bold text-center text-gray-900 dark:text-white text-sm mb-1">
                {badge.name}
            </h4>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
                {badge.description}
            </p>

            {showProgress && !badge.earned && badge.progress !== undefined && (
                <div className="mt-3">
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${badge.color} transition-all duration-500`}
                            style={{ width: `${badge.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-1">{badge.progress}%</p>
                </div>
            )}

            {badge.earned && badge.earnedAt && (
                <p className="text-xs text-gold-600 dark:text-gold-400 text-center mt-2">
                    Earned {badge.earnedAt.toLocaleDateString()}
                </p>
            )}
        </div>
    );
}

export function BadgesGrid({ badges, showProgress = true }: { badges: Badge[]; showProgress?: boolean }) {
    const earnedBadges = badges.filter(b => b.earned);
    const lockedBadges = badges.filter(b => !b.earned);

    return (
        <div className="space-y-6">
            {earnedBadges.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
                        <Trophy className="w-5 h-5 text-gold-500" />
                        Earned ({earnedBadges.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {earnedBadges.map((badge) => (
                            <BadgeCard key={badge.id} badge={badge} showProgress={showProgress} />
                        ))}
                    </div>
                </div>
            )}

            {lockedBadges.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
                        <Award className="w-5 h-5 text-gray-400" />
                        Available ({lockedBadges.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {lockedBadges.map((badge) => (
                            <BadgeCard key={badge.id} badge={badge} showProgress={showProgress} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Daily Challenge Component
interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    reward: string;
    progress: number;
    target: number;
    expiresAt: Date;
}

export function DailyChallengeCard({ challenge }: { challenge: DailyChallenge }) {
    const progressPercent = (challenge.progress / challenge.target) * 100;
    const hoursLeft = Math.max(0, Math.floor((challenge.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)));

    return (
        <div className="p-5 bg-gradient-to-br from-sacred-50 to-sacred-100 dark:from-sacred-900/20 dark:to-sacred-800/20 rounded-2xl border border-sacred-200 dark:border-sacred-800">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-sacred-600" />
                    <span className="text-sm font-medium text-sacred-600 dark:text-sacred-400">Daily Challenge</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {hoursLeft}h left
                </span>
            </div>

            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{challenge.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{challenge.progress} / {challenge.target}</span>
                    <span className="font-medium text-sacred-600 dark:text-sacred-400">{challenge.reward}</span>
                </div>
                <div className="h-2 bg-sacred-200 dark:bg-sacred-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-sacred-500 to-sacred-600 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
