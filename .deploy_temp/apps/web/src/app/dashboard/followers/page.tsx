'use client';

import { useState } from 'react';
import { Users, Search, Mail, Bell, Download, UserCheck, UserX } from 'lucide-react';

interface Follower {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    followedAt: string;
    isParishioner: boolean;
    pushEnabled: boolean;
}

const demoFollowers: Follower[] = [
    { id: '1', displayName: 'John Smith', avatarUrl: null, followedAt: '2024-12-15', isParishioner: true, pushEnabled: true },
    { id: '2', displayName: 'Mary Johnson', avatarUrl: null, followedAt: '2024-12-14', isParishioner: true, pushEnabled: true },
    { id: '3', displayName: 'David Wilson', avatarUrl: null, followedAt: '2024-12-12', isParishioner: false, pushEnabled: false },
    { id: '4', displayName: 'Sarah Davis', avatarUrl: null, followedAt: '2024-12-10', isParishioner: true, pushEnabled: true },
    { id: '5', displayName: 'Michael Brown', avatarUrl: null, followedAt: '2024-12-08', isParishioner: false, pushEnabled: true },
];

export default function FollowersPage() {
    const [followers] = useState<Follower[]>(demoFollowers);
    const [search, setSearch] = useState('');

    const filteredFollowers = followers.filter(f =>
        f.displayName.toLowerCase().includes(search.toLowerCase())
    );

    const parishionerCount = followers.filter(f => f.isParishioner).length;
    const pushEnabledCount = followers.filter(f => f.pushEnabled).length;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Followers</h1>
                    <p className="text-gray-500">People following your church on MyPrayerTower</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors">
                    <Download className="w-4 h-4" />
                    Export List
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{followers.length}</p>
                    </div>
                    <p className="text-sm text-gray-500">Total Followers</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{parishionerCount}</p>
                    </div>
                    <p className="text-sm text-gray-500">Registered Parishioners</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                            <Bell className="w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{pushEnabledCount}</p>
                    </div>
                    <p className="text-sm text-gray-500">Push Notifications Enabled</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search followers..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Followers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFollowers.map((follower) => (
                    <div
                        key={follower.id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                {follower.displayName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{follower.displayName}</p>
                                <p className="text-sm text-gray-500">
                                    Followed {new Date(follower.followedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            {follower.isParishioner && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    <UserCheck className="w-3 h-3" /> Parishioner
                                </span>
                            )}
                            {follower.pushEnabled && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                    <Bell className="w-3 h-3" /> Push
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredFollowers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No followers found</p>
                </div>
            )}
        </div>
    );
}
