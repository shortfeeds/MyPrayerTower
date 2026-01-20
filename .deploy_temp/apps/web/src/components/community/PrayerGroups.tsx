'use client';

import { useState } from 'react';
import { Users, Lock, Globe, Plus, UserPlus, Settings, MoreVertical, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface PrayerGroup {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
    imageUrl?: string;
    lastActivity?: string;
}

interface PrayerGroupCardProps {
    group: PrayerGroup;
    isJoined?: boolean;
    onJoin?: (groupId: string) => void;
    onLeave?: (groupId: string) => void;
}

export function PrayerGroupCard({ group, isJoined = false, onJoin, onLeave }: PrayerGroupCardProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
                {/* Group Avatar */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sacred-500 to-sacred-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {group.imageUrl ? (
                        <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                        group.name.charAt(0)
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{group.name}</h3>
                        {group.isPrivate ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                        ) : (
                            <Globe className="w-4 h-4 text-green-500" />
                        )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {group.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {group.memberCount} members
                            </span>
                        </div>

                        {isJoined ? (
                            <button
                                onClick={() => onLeave?.(group.id)}
                                className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Joined ✓
                            </button>
                        ) : (
                            <button
                                onClick={() => onJoin?.(group.id)}
                                className="px-4 py-1.5 text-sm font-medium text-white bg-sacred-600 hover:bg-sacred-700 rounded-full transition-colors"
                            >
                                Join
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CreateGroupButton() {
    return (
        <Link
            href="/groups/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sacred-600 to-sacred-700 text-white font-medium rounded-xl hover:from-sacred-500 hover:to-sacred-600 transition-all shadow-lg hover:shadow-xl"
        >
            <Plus className="w-5 h-5" />
            Create Group
        </Link>
    );
}

export function GroupMembersList({ members }: { members: { id: string; name: string; avatar?: string; role?: string }[] }) {
    return (
        <div className="space-y-3">
            {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-medium">
                        {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            member.name.charAt(0)
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        {member.role && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function GroupPrayerFeed({ prayers }: { prayers: { id: string; author: string; text: string; prayerCount: number; commentCount: number }[] }) {
    return (
        <div className="space-y-4">
            {prayers.map((prayer) => (
                <div key={prayer.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{prayer.author}</p>
                    <p className="text-gray-900 dark:text-white mb-4">{prayer.text}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            {prayer.prayerCount}
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary-500 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            {prayer.commentCount}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
