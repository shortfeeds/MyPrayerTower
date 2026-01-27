
import { getUserFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { PrayerGroupCard } from '@/components/community/PrayerGroupCard';
import { CreateGroupButton } from '@/components/community/CreateGroupButton';
import { Search, Globe, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GroupsPage() {
    const user = await getUserFromCookie();

    // 1. Fetch User's Groups
    const userGroups = user ? await db.prayerGroup.findMany({
        where: {
            members: { some: { userId: user.id } }
        },
        include: {
            _count: { select: { members: true } }
        },
        orderBy: { updatedAt: 'desc' }
    }) : [];

    // 2. Fetch Public Groups (excluding joined ones if desired, or all)
    const publicGroups = await db.prayerGroup.findMany({
        where: {
            isPrivate: false,
            // optional: exclude joined
            // id: { notIn: userGroups.map(g => g.id) }
        },
        include: {
            _count: { select: { members: true } }
        },
        orderBy: { members: { _count: 'desc' } },
        take: 9
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-24">
            {/* Header */}
            <div className="bg-sacred-900 pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold-400 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
                        <Users className="w-3 h-3" />
                        Community
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Prayer Circles</h1>
                    <p className="text-xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
                        Gather in His name. Join a prayer circle or start your own to pray for shared intentions.
                    </p>

                    {user && <CreateGroupButton />}
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 relative z-20">

                {/* User's Groups Section */}
                {user && userGroups.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <Users className="w-6 h-6 text-gold-500" />
                            Your Circles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userGroups.map(group => (
                                <PrayerGroupCard
                                    key={group.id}
                                    group={group}
                                    isMember={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Public Groups / Discovery */}
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <Globe className="w-6 h-6 text-blue-500" />
                        Discover Circles
                    </h2>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search prayer groups..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publicGroups.map(group => (
                            <PrayerGroupCard
                                key={group.id}
                                group={group}
                                isMember={userGroups.some(ug => ug.id === group.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
