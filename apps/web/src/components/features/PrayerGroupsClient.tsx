'use client';

import { useState } from 'react';
import { Users, Plus, Lock, Globe, Heart, UserPlus, MessageCircle, ChevronRight, LogIn } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PrayerGroup {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    prayerCount: number;
    isPrivate: boolean;
    isOwner: boolean;
    isMember: boolean;
    lastActivity: string;
    category: string;
}

const MOCK_GROUPS: PrayerGroup[] = [
    // User's Groups (Only shown when logged in)
    { id: '1', name: 'Family Prayer Circle', description: 'Our family prayer group for daily intentions', memberCount: 8, prayerCount: 234, isPrivate: true, isOwner: true, isMember: true, lastActivity: '2 hours ago', category: 'Family' },
    { id: '2', name: 'St. Michael Parish Group', description: 'Prayer intentions from our parish community', memberCount: 156, prayerCount: 1234, isPrivate: false, isOwner: false, isMember: true, lastActivity: '15 min ago', category: 'Parish' },

    // Public Groups (Discoverable)
    { id: '3', name: 'Novena for Healing', description: 'A community dedicated to praying for physical and spiritual healing.', memberCount: 2450, prayerCount: 15600, isPrivate: false, isOwner: false, isMember: false, lastActivity: 'Just now', category: 'Healing' },
    { id: '4', name: 'Divine Mercy Devotees', description: 'Praying the Divine Mercy Chaplet daily at 3 PM.', memberCount: 890, prayerCount: 4500, isPrivate: false, isOwner: false, isMember: false, lastActivity: '1 hour ago', category: 'Devotion' },
    { id: '5', name: 'Rosary Warriors', description: 'United in praying the Holy Rosary for peace in the world.', memberCount: 5600, prayerCount: 92000, isPrivate: false, isOwner: false, isMember: false, lastActivity: '5 min ago', category: 'Rosary' },
    { id: '6', name: 'Young Catholic Professionals', description: 'Supporting each other in faith and career.', memberCount: 340, prayerCount: 890, isPrivate: true, isOwner: false, isMember: false, lastActivity: '1 day ago', category: 'Community' },
    { id: '7', name: 'Mothers of Grace', description: 'Praying for our children and families.', memberCount: 1200, prayerCount: 6700, isPrivate: false, isOwner: false, isMember: false, lastActivity: '30 min ago', category: 'Family' },
    { id: '8', name: 'Vocations Support', description: 'Praying for priests, religious, and seminarians.', memberCount: 450, prayerCount: 2100, isPrivate: false, isOwner: false, isMember: false, lastActivity: '4 hours ago', category: 'Vocation' },
];

interface PrayerGroupsClientProps {
    isAuthenticated: boolean;
}

export function PrayerGroupsClient({ isAuthenticated }: PrayerGroupsClientProps) {
    const [groups, setGroups] = useState<PrayerGroup[]>(MOCK_GROUPS);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', isPrivate: true });

    // Filter groups strictly based on auth state
    const myGroups = isAuthenticated ? groups.filter(g => g.isMember) : [];
    const discoverGroups = groups.filter(g => !g.isMember);

    const handleCreateGroup = () => {
        const group: PrayerGroup = {
            id: Date.now().toString(),
            name: newGroup.name,
            description: newGroup.description,
            memberCount: 1,
            prayerCount: 0,
            isPrivate: newGroup.isPrivate,
            isOwner: true,
            isMember: true,
            lastActivity: 'Just now',
            category: 'Personal'
        };
        setGroups([group, ...groups]);
        setShowCreateModal(false);
        setNewGroup({ name: '', description: '', isPrivate: true });
    };

    const handleJoinClick = (groupName: string) => {
        if (!isAuthenticated) {
            alert("Please sign in to join this prayer group.");
            return;
        }
        // Mock join logic
        alert(`Request to join "${groupName}" sent!`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <Users className="w-8 h-8 text-gold-400" />
                                </span>
                                <h1 className="text-4xl font-bold font-display">Prayer Groups</h1>
                            </div>
                            <p className="text-indigo-100 text-lg max-w-xl">Find your community, share intentions, and pray together in spiritual unity.</p>
                        </div>

                        {isAuthenticated ? (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-8 py-3 bg-gold-500 text-indigo-950 rounded-full font-bold hover:bg-gold-400 transition-all shadow-lg hover:shadow-gold-500/20 transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-5 h-5" />
                                Create Group
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-0.5"
                            >
                                <LogIn className="w-5 h-5" />
                                Sign In to Join
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {isAuthenticated && (
                    <>
                        {/* Pending Invites (Only for logged in users) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                    <UserPlus className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">You have 2 pending invitations</h3>
                                    <p className="text-amber-700">Friends have invited you to join their prayer circles.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-initial px-6 py-2.5 bg-white border border-amber-200 text-amber-900 rounded-xl font-semibold hover:bg-amber-100 transition-colors">
                                    Decline
                                </button>
                                <button className="flex-1 md:flex-initial px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-sm">
                                    View Invites
                                </button>
                            </div>
                        </motion.div>

                        {/* Your Groups */}
                        {myGroups.length > 0 && (
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    Your Groups
                                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{myGroups.length}</span>
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myGroups.map((group) => (
                                        <div
                                            key={group.id}
                                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                                                    {group.category}
                                                </div>
                                                {group.isPrivate ? (
                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                ) : (
                                                    <Globe className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{group.name}</h3>
                                            <p className="text-gray-600 mb-6 line-clamp-2 h-10">{group.description}</p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" /> {group.memberCount}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4" /> {group.prayerCount}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                    Member
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Discover Groups (Visible to All) */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover Groups</h2>
                            <p className="text-gray-600">Find communities that match your spiritual journey</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {discoverGroups.map((group, index) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                                        {group.category}
                                    </div>
                                    {group.isPrivate ? (
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Lock className="w-3 h-3" /> Private
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <Globe className="w-3 h-3" /> Public
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                                <p className="text-gray-600 mb-6 line-clamp-2 flex-grow">{group.description}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" /> {group.memberCount.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" /> {group.prayerCount.toLocaleString()}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleJoinClick(group.name)}
                                        className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isAuthenticated
                                                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {isAuthenticated ? (
                                            <>Join Group <ChevronRight className="w-4 h-4" /></>
                                        ) : (
                                            <>Sign in to Join <Lock className="w-3 h-3 ml-1" /></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="p-2 bg-indigo-100 rounded-lg">
                                <Plus className="w-6 h-6 text-indigo-600" />
                            </span>
                            Create Prayer Group
                        </h2>

                        <div className="space-y-5 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Family Prayer Circle"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    placeholder="What is this group for?"
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    {newGroup.isPrivate ? <Lock className="w-5 h-5 text-gray-500" /> : <Globe className="w-5 h-5 text-green-500" />}
                                    <div>
                                        <p className="font-medium text-gray-900">{newGroup.isPrivate ? 'Private' : 'Public'} Group</p>
                                        <p className="text-xs text-gray-500">
                                            {newGroup.isPrivate ? 'Invite only' : 'Open to everyone'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNewGroup({ ...newGroup, isPrivate: !newGroup.isPrivate })}
                                    className={`relative w-12 h-7 rounded-full transition-colors ${newGroup.isPrivate ? 'bg-gray-400' : 'bg-green-500'}`}
                                >
                                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${newGroup.isPrivate ? 'translate-x-0.5' : 'translate-x-5.5'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                disabled={!newGroup.name}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Create
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
