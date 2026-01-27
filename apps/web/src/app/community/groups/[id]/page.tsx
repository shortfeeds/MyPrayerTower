
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { GroupPrayerBoard } from '@/components/community/GroupPrayerBoard';
import { JoinGroupButton } from '@/components/community/JoinGroupButton';
import { Users, Lock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GroupPage({ params }: { params: { id: string } }) {
    const user = await getUserFromCookie();
    if (!user) redirect(`/login?redirect=/community/groups/${params.id}`);

    const group = await db.prayerGroup.findUnique({
        where: { id: params.id },
        include: {
            _count: { select: { members: true } }
        }
    });

    if (!group) notFound();

    const member = await db.prayerGroupMember.findFirst({
        where: {
            groupId: group.id,
            userId: user.id
        }
    });

    const isMember = !!member;

    // Privacy Check
    if (group.isPrivate && !isMember) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black pt-32 px-6">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 text-center shadow-xl border border-gray-100 dark:border-white/5">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">{group.name}</h1>
                    <p className="text-gray-500 mb-8 max-w-lg mx-auto">{group.description}</p>

                    <div className="flex justify-center gap-4">
                        <Link href="/community/groups" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl">
                            Back
                        </Link>
                        <button className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                            Invite Only
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fetch Prayers if member
    let prayers: any[] = [];
    if (isMember) {
        prayers = await db.groupPrayer.findMany({
            where: { groupId: group.id },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-24">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/5 pt-32 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link href="/community/groups" className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-6 inline-block">
                        &larr; Back to Circles
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${group.isPrivate ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                                    {group.isPrivate ? 'Private Circle' : 'Public Circle'}
                                </span>
                                {isMember && <span className="text-gold-500 font-bold flex items-center gap-1 text-sm"><Users className="w-3 h-3" /> Member</span>}
                            </div>
                            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">{group.name}</h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">{group.description}</p>
                        </div>

                        {!isMember && (
                            <JoinGroupButton groupId={group.id} />
                        )}
                    </div>

                    <div className="mt-8 flex items-center gap-6 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {group._count.members} Members
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 mt-8 max-w-4xl">
                {isMember ? (
                    <GroupPrayerBoard groupId={group.id} initialPrayers={prayers} />
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-white/5">
                        <h3 className="text-2xl font-serif font-bold mb-4">Join to view prayers</h3>
                        <p className="text-gray-500 mb-8">This is a public prayer circle. Join to share your intentions and pray with others.</p>
                        <JoinGroupButton groupId={group.id} />
                    </div>
                )}
            </div>
        </div>
    );
}
