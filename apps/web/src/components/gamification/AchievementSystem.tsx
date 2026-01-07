'use client';

import { useState, useEffect } from 'react';
import { Award, Lock, Star, Trophy, Flame, Heart, BookOpen, Users, Crown, Zap } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'streak' | 'prayers' | 'community' | 'reading' | 'special';
    requirement: number;
    progress: number;
    unlocked: boolean;
    unlockedAt?: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
    // Streak achievements
    { id: 'streak-7', title: 'Week Warrior', description: '7-day prayer streak', icon: '🔥', category: 'streak', requirement: 7, rarity: 'common' },
    { id: 'streak-30', title: 'Monthly Devotee', description: '30-day prayer streak', icon: '💪', category: 'streak', requirement: 30, rarity: 'rare' },
    { id: 'streak-100', title: 'Century Pray-er', description: '100-day prayer streak', icon: '🏆', category: 'streak', requirement: 100, rarity: 'epic' },
    { id: 'streak-365', title: 'Annual Saint', description: '365-day prayer streak', icon: '👑', category: 'streak', requirement: 365, rarity: 'legendary' },

    // Prayer count achievements
    { id: 'prayers-10', title: 'First Steps', description: 'Pray 10 prayers', icon: '🌱', category: 'prayers', requirement: 10, rarity: 'common' },
    { id: 'prayers-100', title: 'Prayer Warrior', description: 'Pray 100 prayers', icon: '⚔️', category: 'prayers', requirement: 100, rarity: 'common' },
    { id: 'prayers-500', title: 'Devoted Soul', description: 'Pray 500 prayers', icon: '💎', category: 'prayers', requirement: 500, rarity: 'rare' },
    { id: 'prayers-1000', title: 'Prayer Master', description: 'Pray 1000 prayers', icon: '🌟', category: 'prayers', requirement: 1000, rarity: 'epic' },

    // Community achievements
    { id: 'community-10', title: 'Good Neighbor', description: 'Pray for 10 intentions', icon: '🤝', category: 'community', requirement: 10, rarity: 'common' },
    { id: 'community-100', title: 'Intercessor', description: 'Pray for 100 intentions', icon: '❤️', category: 'community', requirement: 100, rarity: 'rare' },
    { id: 'partner-1', title: 'Prayer Partner', description: 'Get your first prayer partner', icon: '👥', category: 'community', requirement: 1, rarity: 'common' },

    // Reading achievements
    { id: 'readings-30', title: 'Scripture Reader', description: 'Read 30 daily readings', icon: '📖', category: 'reading', requirement: 30, rarity: 'common' },
    { id: 'bible-chapters-100', title: 'Bible Scholar', description: 'Read 100 Bible chapters', icon: '📚', category: 'reading', requirement: 100, rarity: 'rare' },

    // Special achievements
    { id: 'early-bird', title: 'Early Bird', description: 'Pray before 6 AM', icon: '🌅', category: 'special', requirement: 1, rarity: 'common' },
    { id: 'night-owl', title: 'Night Owl', description: 'Pray after midnight', icon: '🌙', category: 'special', requirement: 1, rarity: 'common' },
    { id: 'all-categories', title: 'Well Rounded', description: 'Pray from all categories', icon: '🎯', category: 'special', requirement: 10, rarity: 'rare' },
];

const RARITY_COLORS = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-amber-600',
};

const RARITY_BORDERS = {
    common: 'border-gray-200 dark:border-gray-700',
    rare: 'border-blue-200 dark:border-blue-800',
    epic: 'border-purple-200 dark:border-purple-800',
    legendary: 'border-amber-200 dark:border-amber-800',
};

/**
 * Achievement system display
 */
export function AchievementSystem() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        // Load progress from localStorage
        const stored = localStorage.getItem('mpt-achievements');
        const progress = stored ? JSON.parse(stored) : {};

        const userAchievements: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(def => ({
            ...def,
            progress: progress[def.id]?.progress || 0,
            unlocked: progress[def.id]?.unlocked || false,
            unlockedAt: progress[def.id]?.unlockedAt ? new Date(progress[def.id].unlockedAt) : undefined,
        }));

        setAchievements(userAchievements);
    }, []);

    const categories = [
        { id: 'all', label: 'All', icon: Award },
        { id: 'streak', label: 'Streaks', icon: Flame },
        { id: 'prayers', label: 'Prayers', icon: Heart },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'reading', label: 'Reading', icon: BookOpen },
        { id: 'special', label: 'Special', icon: Star },
    ];

    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === selectedCategory);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Trophy className="text-amber-500" />
                        Achievements
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {unlockedCount} / {totalCount} unlocked
                    </p>
                </div>

                {/* Overall progress */}
                <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {Math.round((unlockedCount / totalCount) * 100)}%
                    </div>
                    <p className="text-sm text-gray-500">Complete</p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
                            ${selectedCategory === cat.id
                                ? 'bg-sacred-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }
                        `}
                    >
                        <cat.icon size={16} />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Achievement Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
            </div>
        </div>
    );
}

/**
 * Individual achievement card
 */
function AchievementCard({ achievement }: { achievement: Achievement }) {
    const progressPercent = Math.min(100, (achievement.progress / achievement.requirement) * 100);

    return (
        <div
            className={`
                relative rounded-2xl border-2 p-5 transition-all
                ${achievement.unlocked
                    ? `bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]} bg-opacity-10 ${RARITY_BORDERS[achievement.rarity]}`
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800'
                }
                ${!achievement.unlocked && 'opacity-60'}
            `}
        >
            {/* Rarity Badge */}
            <div className={`
                absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold uppercase
                ${achievement.unlocked
                    ? 'bg-white/80 text-gray-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }
            `}>
                {achievement.rarity}
            </div>

            {/* Icon */}
            <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4
                ${achievement.unlocked
                    ? `bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]} shadow-lg`
                    : 'bg-gray-200 dark:bg-gray-700'
                }
            `}>
                {achievement.unlocked ? achievement.icon : <Lock size={24} className="text-gray-400" />}
            </div>

            {/* Content */}
            <h3 className={`font-bold mb-1 ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {achievement.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {achievement.description}
            </p>

            {/* Progress */}
            {!achievement.unlocked && (
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.requirement}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]} rounded-full transition-all`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Unlocked date */}
            {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                </p>
            )}
        </div>
    );
}

/**
 * Compact achievement badge display
 */
export function RecentAchievements() {
    const [recent, setRecent] = useState<Achievement[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('mpt-achievements');
        if (stored) {
            const progress = JSON.parse(stored);
            const unlocked = ACHIEVEMENT_DEFINITIONS
                .filter(def => progress[def.id]?.unlocked)
                .map(def => ({
                    ...def,
                    progress: progress[def.id]?.progress || 0,
                    unlocked: true,
                    unlockedAt: new Date(progress[def.id].unlockedAt),
                }))
                .sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime())
                .slice(0, 3);

            setRecent(unlocked);
        }
    }, []);

    if (recent.length === 0) return null;

    return (
        <div className="flex gap-2">
            {recent.map(achievement => (
                <div
                    key={achievement.id}
                    className={`
                        w-10 h-10 rounded-xl flex items-center justify-center text-lg
                        bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]}
                        shadow-md
                    `}
                    title={achievement.title}
                >
                    {achievement.icon}
                </div>
            ))}
        </div>
    );
}
