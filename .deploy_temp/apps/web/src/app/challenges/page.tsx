import Link from 'next/link';
import { Trophy, Users, Calendar, Star, ChevronRight, Flame, Target, Crown } from 'lucide-react';
import { getChallenges } from '@/app/actions/challenges';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

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

const challengeTypeIcons: Record<string, typeof Trophy> = {
    ROSARY: Star,
    NOVENA: Flame,
    LENT: Target,
    ADVENT: Calendar,
    MARIAN_CONSECRATION: Crown,
    DIVINE_MERCY: Trophy,
    STATIONS: Users,
    CUSTOM: Trophy
};

async function ChallengesList() {
    const challenges = await getChallenges();

    if (challenges.length === 0) {
        return (
            <div className="text-center py-16">
                <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Challenges</h3>
                <p className="text-gray-500">Check back soon for new prayer challenges!</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
                const Icon = challengeTypeIcons[challenge.type] || Trophy;
                const gradient = challengeTypeColors[challenge.type] || 'from-primary-500 to-primary-600';

                return (
                    <Link key={challenge.id} href={`/challenges/${challenge.slug}`} className="group">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                            {/* Header with gradient */}
                            <div className={`bg-gradient-to-br ${gradient} p-6 text-white relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{challenge.name}</h3>
                                    <p className="text-white/80 text-sm">{challenge.duration} Day Challenge</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {challenge.shortDescription || challenge.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Users className="w-4 h-4" />
                                        <span>{challenge.participantCount.toLocaleString()} joined</span>
                                    </div>

                                    {challenge.isJoined ? (
                                        <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                                            <Flame className="w-4 h-4" />
                                            Day {challenge.userProgress?.currentDay || 0}/{challenge.duration}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
                                            Join Now
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </div>

                                {challenge.isPremium && (
                                    <div className="mt-3 text-xs text-gold-600 font-medium flex items-center gap-1">
                                        <Crown className="w-3.5 h-3.5" />
                                        Premium Challenge
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

function ChallengesLoading() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-200" />
                    <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ChallengesPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-sacred-700 to-sacred-800 text-white pt-28 pb-16 md:pt-32 md:pb-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Trophy className="w-4 h-4 text-gold-400" />
                            <span className="text-sm font-medium text-gold-200">Grow in Faith Together</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                            Prayer <span className="text-gold-400">Challenges</span>
                        </h1>
                        <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
                            Join thousands of faithful Catholics in prayer challenges designed to deepen your spiritual life and build holy habits.
                        </p>
                    </div>
                </div>
            </section>

            {/* Challenges Grid */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display text-2xl font-bold text-gray-900">
                                Active Challenges
                            </h2>
                            <Link
                                href="/leaderboard"
                                className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                <Crown className="w-4 h-4" />
                                View Leaderboard
                            </Link>
                        </div>

                        <Suspense fallback={<ChallengesLoading />}>
                            <ChallengesList />
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* Why Join */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-2xl font-bold text-gray-900 text-center mb-12">
                            Why Join a Prayer Challenge?
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Flame,
                                    title: 'Build Consistency',
                                    desc: 'Daily check-ins help you maintain a regular prayer habit and track your spiritual growth.'
                                },
                                {
                                    icon: Users,
                                    title: 'Community Support',
                                    desc: 'Join thousands of Catholics praying together. You\'re never alone on this journey.'
                                },
                                {
                                    icon: Trophy,
                                    title: 'Earn Achievements',
                                    desc: 'Complete challenges to unlock badges and climb the leaderboard.'
                                }
                            ].map((item, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <item.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
