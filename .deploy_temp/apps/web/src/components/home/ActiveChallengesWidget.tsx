'use client';

import Link from 'next/link';
import { Trophy, ChevronRight, Flame, Target } from 'lucide-react';

interface Challenge {
    id: string;
    title: string;
    description: string;
    durationDays: number;
    currentDay: number;
    completedToday: boolean;
    iconEmoji: string;
}

interface ActiveChallengesWidgetProps {
    challenges?: Challenge[];
    onCompleteToday?: (challengeId: string) => void;
}

// Sample challenges for demo
const SAMPLE_CHALLENGES: Challenge[] = [
    {
        id: '1',
        title: '30-Day Rosary Challenge',
        description: 'Pray the Rosary daily for 30 days',
        durationDays: 30,
        currentDay: 12,
        completedToday: false,
        iconEmoji: '📿'
    },
    {
        id: '2',
        title: 'Divine Mercy Novena',
        description: 'Pray for 9 consecutive days',
        durationDays: 9,
        currentDay: 5,
        completedToday: true,
        iconEmoji: '🙏'
    }
];

export function ActiveChallengesWidget({
    challenges = SAMPLE_CHALLENGES,
    onCompleteToday
}: ActiveChallengesWidgetProps) {
    if (challenges.length === 0) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-gray-900">Prayer Challenges</h3>
                </div>
                <p className="text-gray-600 mb-4">
                    Join a challenge to build consistent prayer habits and grow in faith!
                </p>
                <Link
                    href="/challenges"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors"
                >
                    Browse Challenges
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                        <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-gray-900">Your Active Challenges</h3>
                        <p className="text-xs text-gray-500">{challenges.length} in progress</p>
                    </div>
                </div>
                <Link
                    href="/challenges"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                    View All
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Challenge list */}
            <div className="divide-y divide-gray-50">
                {challenges.slice(0, 2).map((challenge) => {
                    const progressPercent = (challenge.currentDay / challenge.durationDays) * 100;
                    const daysLeft = challenge.durationDays - challenge.currentDay;

                    return (
                        <div key={challenge.id} className="p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="text-3xl">{challenge.iconEmoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{challenge.title}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-3.5 h-3.5" />
                                                Day {challenge.currentDay} of {challenge.durationDays}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span>{daysLeft} days left</span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action button */}
                                {challenge.completedToday ? (
                                    <div className="flex items-center gap-1.5 px-3 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-lg">
                                        <Flame className="w-4 h-4 fill-green-500" />
                                        Done!
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onCompleteToday?.(challenge.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:shadow transition-all"
                                    >
                                        <Target className="w-4 h-4" />
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
