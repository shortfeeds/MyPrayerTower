'use client';

import { useState } from 'react';
import { Users, Plus, Lock, Globe, Heart, UserPlus, MessageCircle, ChevronRight } from 'lucide-react';

interface PrayerGroup {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    prayerCount: number;
    isPrivate: boolean;
    isOwner: boolean;
    lastActivity: string;
}

const MOCK_GROUPS: PrayerGroup[] = [
    { id: '1', name: 'Family Prayer Circle', description: 'Our family prayer group for daily intentions', memberCount: 8, prayerCount: 234, isPrivate: true, isOwner: true, lastActivity: '2 hours ago' },
    { id: '2', name: 'St. Michael Parish Group', description: 'Prayer intentions from our parish community', memberCount: 156, prayerCount: 1234, isPrivate: false, isOwner: false, lastActivity: '15 min ago' },
    { id: '3', name: 'Bible Study Prayer Warriors', description: 'Supporting each other through prayer and scripture', memberCount: 24, prayerCount: 567, isPrivate: true, isOwner: false, lastActivity: '1 hour ago' },
];

export default function PrayerGroupsPage() {
    const [groups, setGroups] = useState<PrayerGroup[]>(MOCK_GROUPS);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', isPrivate: true });

    const handleCreateGroup = () => {
        const group: PrayerGroup = {
            id: Date.now().toString(),
            name: newGroup.name,
            description: newGroup.description,
            memberCount: 1,
            prayerCount: 0,
            isPrivate: newGroup.isPrivate,
            isOwner: true,
            lastActivity: 'Just now',
        };
        setGroups([group, ...groups]);
        setShowCreateModal(false);
        setNewGroup({ name: '', description: '', isPrivate: true });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-8 h-8" />
                                <h1 className="text-3xl font-bold">Prayer Groups</h1>
                            </div>
                            <p className="text-indigo-200">Create private circles and pray together with loved ones</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Group
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mb-8">
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                        <p className="text-sm text-gray-500">Groups</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-2xl font-bold text-gray-900">{groups.reduce((s, g) => s + g.memberCount, 0)}</p>
                        <p className="text-sm text-gray-500">Members</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-2xl font-bold text-gray-900">{groups.reduce((s, g) => s + g.prayerCount, 0)}</p>
                        <p className="text-sm text-gray-500">Prayers</p>
                    </div>
                </div>

                {/* Pending Invites (if any) */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-800">You have 2 pending invitations</p>
                            <p className="text-sm text-amber-600">Join prayer groups your friends created</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                        View Invites
                    </button>
                </div>

                {/* Groups List */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Groups</h2>
                <div className="space-y-4">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                                        {group.isPrivate ? (
                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                <Lock className="w-3 h-3" />
                                                Private
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                                <Globe className="w-3 h-3" />
                                                Public
                                            </span>
                                        )}
                                        {group.isOwner && (
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-3">{group.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {group.memberCount} members
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {group.prayerCount} prayers
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            {group.lastActivity}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-gray-300" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus className="text-indigo-600" />
                            Create Prayer Group
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Family Prayer Circle"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    placeholder="What is this group for?"
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    {newGroup.isPrivate ? <Lock className="w-5 h-5 text-gray-500" /> : <Globe className="w-5 h-5 text-green-500" />}
                                    <div>
                                        <p className="font-medium text-gray-900">{newGroup.isPrivate ? 'Private' : 'Public'} Group</p>
                                        <p className="text-sm text-gray-500">
                                            {newGroup.isPrivate ? 'Only invited members can join' : 'Anyone can join this group'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNewGroup({ ...newGroup, isPrivate: !newGroup.isPrivate })}
                                    className={`relative w-12 h-7 rounded-full transition-colors ${newGroup.isPrivate ? 'bg-indigo-600' : 'bg-green-500'}`}
                                >
                                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${newGroup.isPrivate ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                disabled={!newGroup.name}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:bg-gray-300"
                            >
                                Create Group
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
