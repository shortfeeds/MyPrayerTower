'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trophy, Users, Calendar, Star, ChevronLeft, Flame, Target, Check, Clock, Share2 } from 'lucide-react';
import { joinChallenge, challengeCheckIn } from '@/app/actions/challenges';

interface ChallengeDetailClientProps {
    challenge: {
        id: string;
        name: string;
        slug: string;
        description: string;
        shortDescription: string | null;
        imageUrl: string | null;
        type: string;
        duration: number;
        startDate: Date | null;
        endDate: Date | null;
        isActive: boolean;
        isPremium: boolean;
        dailyAction: string;
        reward: string | null;
        participantCount: number;
        isJoined?: boolean;
        userProgress?: {
            currentDay: number;
            status: string;
        };
    };
}

const challengeTypeColors: Record<string, string> = {
    ROSARY: 'from-rose-500 to-rose-600',
    NOVENA: 'from-purple-500 to-purple-600',
    LENT: 'from-violet-600 to-violet-700',
    ADVENT: 'from-blue-500 to-blue-600',
    MARIAN_CONSECRATION: 'from-sky-400 to-sky-500',
    DIVINE_MERCY: 'from-red-500 to-red-600',
    STATIONS: 'from-amber-600 to-amber-700',
    CUSTOM: 'from-emerald-500 to-emerald-600'
};

export default function ChallengeDetailClient({ challenge }: ChallengeDetailClientProps) {
    const [isJoined, setIsJoined] = useState(challenge.isJoined || false);
    const [currentDay, setCurrentDay] = useState(challenge.userProgress?.currentDay || 0);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const gradient = challengeTypeColors[challenge.type] || 'from-primary-500 to-primary-600';
    const progressPercent = Math.round((currentDay / challenge.duration) * 100);

    const handleJoin = () => {
        setMessage(null);
        startTransition(async () => {
            try {
                await joinChallenge(challenge.id);
                setIsJoined(true);
                setMessage({ type: 'success', text: 'You have joined the challenge! Complete your first day now.' });
            } catch (error: any) {
                setMessage({ type: 'error', text: error.message || 'Failed to join challenge' });
            }
        });
    };

    const handleCheckIn = () => {
        setMessage(null);
        startTransition(async () => {
            try {
                const result = await challengeCheckIn(challenge.id);
                setCurrentDay(result.day);
                if (result.isCompleted) {
                    setMessage({ type: 'success', text: '🎉 Congratulations! You have completed the challenge!' });
                } else {
                    setMessage({ type: 'success', text: `Day ${result.day} complete! Keep up the great work!` });
                }
            } catch (error: any) {
                setMessage({ type: 'error', text: error.message || 'Failed to check in' });
            }
        });
    };

    return (
        <div className="min-h-screen bg-cream-50">
            {/* Header */}
            <div className={`bg-gradient-to-br ${gradient} text-white`}>
                <div className="container mx-auto px-4 py-6">
                    <Link
                        href="/challenges"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Challenges
                    </Link>
                </div>

                <div className="container mx-auto px-4 pb-16">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                                {challenge.duration} Days
                            </span>
                            <span className="flex items-center gap-1 text-white/80 text-sm">
                                <Users className="w-4 h-4" />
                                {challenge.participantCount.toLocaleString()} participants
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            {challenge.name}
                        </h1>
                        <p className="text-xl text-white/80">
                            {challenge.shortDescription || challenge.description.slice(0, 150)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar (if joined) */}
            {isJoined && (
                <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Day {currentDay} of {challenge.duration}
                                </span>
                                <span className="text-sm font-bold text-primary-600">
                                    {progressPercent}% Complete
                                </span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Action Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="font-display text-xl font-bold text-gray-900 mb-1">
                                    Daily Action
                                </h2>
                                <p className="text-gray-600">{challenge.dailyAction}</p>
                            </div>
                        </div>

                        {!isJoined ? (
                            <button
                                onClick={handleJoin}
                                disabled={isPending}
                                className={`w-full py-4 bg-gradient-to-r ${gradient} text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2`}
                            >
                                {isPending ? (
                                    <span className="animate-pulse">Joining...</span>
                                ) : (
                                    <>
                                        <Flame className="w-5 h-5" />
                                        Join This Challenge
                                    </>
                                )}
                            </button>
                        ) : currentDay >= challenge.duration ? (
                            <div className="text-center py-4 bg-emerald-50 rounded-xl">
                                <Trophy className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                                <p className="font-bold text-emerald-700 text-lg">Challenge Completed!</p>
                                <p className="text-emerald-600 text-sm">You've earned the {challenge.reward || 'completion badge'}!</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleCheckIn}
                                disabled={isPending}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <span className="animate-pulse">Checking in...</span>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Complete Day {currentDay + 1}
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
                        <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                            About This Challenge
                        </h2>
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {challenge.description}
                            </p>
                        </div>
                    </div>

                    {/* Share */}
                    <div className="flex justify-center">
                        <button className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            <Share2 className="w-5 h-5" />
                            Share This Challenge
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
