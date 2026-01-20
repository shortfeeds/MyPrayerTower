'use client';

import { useState, useEffect } from 'react';
import { Target, Check, Clock, Gift, Flame, Star, Trophy, ChevronRight, Sparkles } from 'lucide-react';

interface DailyChallenge {
    id: string;
    type: 'prayer' | 'reading' | 'reflection' | 'community' | 'devotion';
    title: string;
    description: string;
    target: number;
    current: number;
    reward: number; // XP/points
    expiresAt: Date;
    completed: boolean;
}

const CHALLENGE_ICONS = {
    prayer: '🙏',
    reading: '📖',
    reflection: '💭',
    community: '👥',
    devotion: '🕯️',
};

const generateDailyChallenges = (): DailyChallenge[] => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return [
        {
            id: 'morning-prayer',
            type: 'prayer',
            title: 'Morning Offering',
            description: 'Start your day with a morning prayer',
            target: 1,
            current: 0,
            reward: 10,
            expiresAt: endOfDay,
            completed: false,
        },
        {
            id: 'three-prayers',
            type: 'prayer',
            title: 'Triple Blessing',
            description: 'Pray 3 different prayers today',
            target: 3,
            current: 0,
            reward: 25,
            expiresAt: endOfDay,
            completed: false,
        },
        {
            id: 'daily-reading',
            type: 'reading',
            title: 'Scripture Reader',
            description: "Read today's Mass readings",
            target: 1,
            current: 0,
            reward: 15,
            expiresAt: endOfDay,
            completed: false,
        },
        {
            id: 'saint-bio',
            type: 'reflection',
            title: 'Saint Study',
            description: "Read about today's saint",
            target: 1,
            current: 0,
            reward: 10,
            expiresAt: endOfDay,
            completed: false,
        },
        {
            id: 'pray-for-others',
            type: 'community',
            title: 'Intercessor',
            description: 'Pray for 5 intentions on the Prayer Wall',
            target: 5,
            current: 0,
            reward: 30,
            expiresAt: endOfDay,
            completed: false,
        },
    ];
};

/**
 * Daily challenges widget
 */
export function DailyChallenges() {
    const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        // Check for new day, reset if needed
        const stored = localStorage.getItem('mpt-daily-challenges');
        const storedDate = localStorage.getItem('mpt-daily-challenges-date');
        const today = new Date().toDateString();

        if (storedDate !== today) {
            // New day, generate fresh challenges
            const newChallenges = generateDailyChallenges();
            setChallenges(newChallenges);
            localStorage.setItem('mpt-daily-challenges', JSON.stringify(newChallenges));
            localStorage.setItem('mpt-daily-challenges-date', today);
        } else if (stored) {
            setChallenges(JSON.parse(stored));
        } else {
            const newChallenges = generateDailyChallenges();
            setChallenges(newChallenges);
            localStorage.setItem('mpt-daily-challenges', JSON.stringify(newChallenges));
            localStorage.setItem('mpt-daily-challenges-date', today);
        }

        // Load total points
        const points = localStorage.getItem('mpt-total-points');
        if (points) setTotalPoints(parseInt(points, 10));
    }, []);

    const completeChallenge = (id: string) => {
        setChallenges(prev => {
            const updated = prev.map(c => {
                if (c.id === id && !c.completed) {
                    const newCurrent = Math.min(c.current + 1, c.target);
                    const completed = newCurrent >= c.target;

                    if (completed) {
                        // Award points
                        const newTotal = totalPoints + c.reward;
                        setTotalPoints(newTotal);
                        localStorage.setItem('mpt-total-points', newTotal.toString());
                    }

                    return { ...c, current: newCurrent, completed };
                }
                return c;
            });

            localStorage.setItem('mpt-daily-challenges', JSON.stringify(updated));
            return updated;
        });
    };

    const completedCount = challenges.filter(c => c.completed).length;
    const availablePoints = challenges.reduce((sum, c) => sum + c.reward, 0);
    const earnedPoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0);

    // Calculate time remaining
    const getTimeRemaining = () => {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        const diff = endOfDay.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Target size={20} />
                            Daily Challenges
                        </h3>
                        <p className="text-amber-100 text-sm mt-1">
                            {completedCount}/{challenges.length} completed • {earnedPoints}/{availablePoints} XP earned
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-100 text-sm">
                            <Clock size={14} />
                            {getTimeRemaining()} left
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-white font-bold">
                            <Star size={16} className="fill-current" />
                            {totalPoints} XP total
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${(completedCount / challenges.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Challenge list */}
            <div className="p-4 space-y-3">
                {challenges.map(challenge => (
                    <div
                        key={challenge.id}
                        className={`
                            flex items-center gap-4 p-4 rounded-xl border transition-all
                            ${challenge.completed
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                                : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-800'
                            }
                        `}
                    >
                        {/* Icon */}
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                            ${challenge.completed
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-amber-100 dark:bg-amber-900/30'
                            }
                        `}>
                            {challenge.completed ? '✅' : CHALLENGE_ICONS[challenge.type]}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className={`font-semibold ${challenge.completed
                                        ? 'text-emerald-700 dark:text-emerald-300'
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                    {challenge.title}
                                </h4>
                                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
                                    +{challenge.reward} XP
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{challenge.description}</p>

                            {/* Progress */}
                            {!challenge.completed && challenge.target > 1 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {challenge.current}/{challenge.target}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action */}
                        {!challenge.completed && (
                            <button
                                onClick={() => completeChallenge(challenge.id)}
                                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                <Check size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Bonus for completing all */}
            {completedCount === challenges.length && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
                        <Trophy size={24} className="text-amber-500" />
                        <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white">All Challenges Complete! 🎉</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">You earned {earnedPoints} XP today</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Compact challenge indicator for header
 */
export function ChallengeIndicator() {
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('mpt-daily-challenges');
        if (stored) {
            const challenges: DailyChallenge[] = JSON.parse(stored);
            setRemaining(challenges.filter(c => !c.completed).length);
        }
    }, []);

    if (remaining === 0) return null;

    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
            <Target size={12} />
            {remaining} left
        </div>
    );
}
