import Link from 'next/link';
import { Crown, Trophy, Medal, Award, ChevronLeft, Flame, Star } from 'lucide-react';
import { getLeaderboard } from '@/app/actions/challenges';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Prayer Leaderboard | MyPrayerTower',
    description: 'See top prayer warriors and climb the leaderboard by completing daily prayers and challenges.'
};

async function LeaderboardList() {
    const entries = await getLeaderboard('weekly');

    if (entries.length === 0) {
        return (
            <div className="text-center py-16">
                <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Entries Yet</h3>
                <p className="text-gray-500">Be the first to appear on the leaderboard!</p>
                <Link
                    href="/challenges"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                    <Flame className="w-5 h-5" />
                    Join a Challenge
                </Link>
            </div>
        );
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-gold-500" />;
            case 2: return <Medal className="w-6 h-6 text-gray-400" />;
            case 3: return <Award className="w-6 h-6 text-amber-600" />;
            default: return <span className="font-bold text-gray-500">#{rank}</span>;
        }
    };

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-gradient-to-r from-gold-50 to-gold-100 border-gold-200';
            case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
            case 3: return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
            default: return 'bg-white border-gray-100';
        }
    };

    return (
        <div className="space-y-3">
            {entries.map((entry) => (
                <div
                    key={entry.user.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(entry.rank)} transition-all hover:shadow-md`}
                >
                    {/* Rank */}
                    <div className="w-12 h-12 flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                    </div>

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {entry.user.avatarUrl ? (
                            <img
                                src={entry.user.avatarUrl}
                                alt={entry.user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            entry.user.name.charAt(0).toUpperCase()
                        )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                            {entry.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {entry.rank <= 3 ? (
                                <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                                    Top Prayer Warrior
                                </span>
                            ) : (
                                'Prayer Warrior'
                            )}
                        </p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                        <p className="font-bold text-xl text-gray-900">{entry.score.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">points</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function LeaderboardLoading() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-1" />
                        <div className="h-4 bg-gray-100 rounded w-24" />
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
            ))}
        </div>
    );
}

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-sacred-700 to-sacred-800 text-white pt-28 pb-16 md:pt-32 md:pb-20">
                <div className="container mx-auto px-4">
                    <Link
                        href="/challenges"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Challenges
                    </Link>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Trophy className="w-4 h-4 text-gold-400" />
                            <span className="text-sm font-medium text-gold-200">Weekly Rankings</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            Prayer <span className="text-gold-400">Leaderboard</span>
                        </h1>
                        <p className="text-xl text-blue-100/80">
                            See who's leading in prayer this week. Complete daily prayers and challenges to earn points!
                        </p>
                    </div>
                </div>
            </section>

            {/* Leaderboard */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                            <button className="flex-1 py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg transition-colors">
                                This Week
                            </button>
                            <button className="flex-1 py-3 px-4 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                                This Month
                            </button>
                            <button className="flex-1 py-3 px-4 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                                All Time
                            </button>
                        </div>

                        {/* List */}
                        <Suspense fallback={<LeaderboardLoading />}>
                            <LeaderboardList />
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* How to Earn Points */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="font-display text-2xl font-bold text-gray-900 text-center mb-8">
                            How to Earn Points
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { points: 10, action: 'Daily Prayer', desc: 'Complete any prayer' },
                                { points: 25, action: 'Challenge Check-in', desc: 'Complete challenge day' },
                                { points: 50, action: 'Prayer Streak', desc: '7-day streak bonus' },
                            ].map((item, i) => (
                                <div key={i} className="text-center p-6 bg-gray-50 rounded-xl">
                                    <div className="text-3xl font-bold text-primary-600 mb-2">+{item.points}</div>
                                    <p className="font-semibold text-gray-900 mb-1">{item.action}</p>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
