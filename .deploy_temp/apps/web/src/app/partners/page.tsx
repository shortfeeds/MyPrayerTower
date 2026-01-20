import Link from 'next/link';
import { ChevronLeft, Users, Heart, MessageCircle, UserPlus, Shield, HeartHandshake } from 'lucide-react';
import { getUserFromCookie } from '@/lib/auth';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Prayer Partners | MyPrayerTower',
    description: 'Find a prayer partner to support you on your spiritual journey. Grow in faith together through mutual prayer.',
};

async function getPartnerSuggestions() {
    const user = await getUserFromCookie();
    if (!user) return [];

    // Get users who have public prayer requests (active in community)
    const suggestions = await prisma.user.findMany({
        where: {
            id: { not: user.id },
            // Add more filters like same church, interests, etc.
        },
        select: {
            id: true,
            displayName: true,
            firstName: true,
            avatarUrl: true,
            bio: true,
            streakCount: true,
            _count: {
                select: { PrayerRequest: true }
            }
        },
        take: 12,
        orderBy: { streakCount: 'desc' }
    });

    return suggestions;
}

export default async function PartnersPage() {
    const user = await getUserFromCookie();
    const suggestions = user ? await getPartnerSuggestions() : [];

    return (
        <div className="min-h-screen bg-cream-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-rose-600 to-rose-700 text-white pt-28 pb-16 md:pt-32 md:pb-20">
                <div className="container mx-auto px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <HeartHandshake className="w-4 h-4 text-rose-200" />
                            <span className="text-sm font-medium text-rose-100">Community Feature</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            Find a <span className="text-rose-200">Prayer Partner</span>
                        </h1>
                        <p className="text-xl text-rose-100/80">
                            Connect with a fellow Catholic for mutual prayer support. Share intentions, encourage each other, and grow in faith together.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                icon: Heart,
                                title: 'Mutual Prayer',
                                desc: 'Pray for each other daily and share intentions privately.'
                            },
                            {
                                icon: MessageCircle,
                                title: 'Encouragement',
                                desc: 'Send words of encouragement and spiritual support.'
                            },
                            {
                                icon: Shield,
                                title: 'Accountability',
                                desc: 'Keep each other motivated on your faith journey.'
                            }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <item.icon className="w-6 h-6 text-rose-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Suggestions */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">
                            Suggested Partners
                        </h2>

                        {!user ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-4">Sign In to Find Partners</h3>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        ) : suggestions.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Suggestions Yet</h3>
                                <p className="text-gray-500 mb-4">Be more active in the community to get matched!</p>
                                <Link
                                    href="/prayer-wall"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                                >
                                    Visit Prayer Wall
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {suggestions.map((person) => (
                                    <div
                                        key={person.id}
                                        className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                {person.avatarUrl ? (
                                                    <img
                                                        src={person.avatarUrl}
                                                        alt=""
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    (person.displayName || person.firstName || 'A').charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {person.displayName || person.firstName || 'Anonymous'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {person.streakCount} day streak
                                                </p>
                                            </div>
                                        </div>

                                        {person.bio && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {person.bio}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                            <Heart className="w-3.5 h-3.5" />
                                            <span>{person._count.PrayerRequest} prayer requests</span>
                                        </div>

                                        <button className="w-full py-2.5 bg-rose-50 text-rose-600 font-semibold rounded-lg hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                                            <UserPlus className="w-4 h-4" />
                                            Send Partner Request
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
