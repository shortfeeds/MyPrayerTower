
import Link from 'next/link';
import { Users, Lock, ArrowRight } from 'lucide-react';

interface PrayerGroupCardProps {
    group: {
        id: string;
        name: string;
        description?: string | null;
        isPrivate: boolean;
        _count?: {
            members: number;
        };
        memberCount?: number;
    };
    isMember?: boolean;
}

export function PrayerGroupCard({ group, isMember }: PrayerGroupCardProps) {
    const count = group._count?.members || group.memberCount || 0;

    return (
        <div className="group bg-white dark:bg-[#0A0A0A] rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-gold-500/30 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-[0_0_20px_-5px_rgba(212,175,55,0.1)]">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${group.isPrivate ? 'bg-gray-100 dark:bg-white/5' : 'bg-sacred-50 dark:bg-sacred-900/20'}`}>
                    {group.isPrivate ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                    ) : (
                        <Users className="w-6 h-6 text-sacred-600 dark:text-sacred-400" />
                    )}
                </div>
                {isMember && (
                    <span className="px-3 py-1 bg-gold-100 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 text-xs font-bold uppercase tracking-wider rounded-full border border-gold-200 dark:border-gold-500/20">
                        Member
                    </span>
                )}
            </div>

            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-gold-500 transition-colors">
                {group.name}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                {group.description || 'No description provided.'}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {count} {count === 1 ? 'Member' : 'Members'}
                </span>

                <Link
                    href={`/community/groups/${group.id}`}
                    className="flex items-center gap-2 text-sm font-bold text-sacred-600 dark:text-sacred-400 group-hover:text-gold-500 transition-colors"
                >
                    {isMember ? 'Enter Circle' : 'View Group'}
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
