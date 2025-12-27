'use client';

import { useState } from 'react';
import { User, Settings, Bell, Heart, MapPin, LogOut, Crown, ChevronRight, Camera, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('prayers');

    // Mock user data
    const user = {
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria@example.com',
        avatarUrl: null,
        tier: 'free',
        joinedAt: 'December 2024',
        stats: {
            prayersSubmitted: 12,
            prayersAnswered: 3,
            churchesSaved: 8,
            timesPrayed: 156,
        },
    };

    const myPrayers = [
        { id: '1', content: 'For my mother\'s health...', status: 'approved', prayerCount: 45, date: '2 days ago' },
        { id: '2', content: 'Guidance in my career...', status: 'approved', prayerCount: 23, date: '1 week ago' },
        { id: '3', content: 'Family reconciliation...', status: 'pending', prayerCount: 0, date: 'Just now' },
    ];

    const savedChurches = [
        { id: '1', name: "St. Patrick's Cathedral", city: 'New York' },
        { id: '2', name: 'Holy Name of Jesus', city: 'New York' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white pt-8 pb-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">My Profile</h1>
                        <Link href="/settings" className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full text-primary-600">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-primary-200">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.tier === 'free' ? 'bg-white/20' : 'bg-gold-400 text-gold-900'
                                    }`}>
                                    {user.tier.toUpperCase()}
                                </span>
                                <span className="text-primary-200 text-sm">Member since {user.joinedAt}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Prayers', value: user.stats.prayersSubmitted, icon: Heart },
                        { label: 'Answered', value: user.stats.prayersAnswered, icon: Heart },
                        { label: 'Saved', value: user.stats.churchesSaved, icon: MapPin },
                        { label: 'Times Prayed', value: user.stats.timesPrayed, icon: Heart },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Upgrade Banner */}
                {user.tier === 'free' && (
                    <div className="bg-gradient-to-r from-gold-400 to-amber-500 rounded-2xl p-6 mb-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-6 h-6" />
                                    <h3 className="text-lg font-bold">Upgrade to Premium</h3>
                                </div>
                                <p className="text-white/90">Remove ads, unlock offline mode, audio prayers & more</p>
                            </div>
                            <Link href="/premium" className="px-6 py-3 bg-white text-gold-600 rounded-full font-semibold hover:bg-gold-50">
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 mb-6">
                    {['prayers', 'saved', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-2 font-medium capitalize ${activeTab === tab
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'prayers' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">My Prayer Requests</h3>
                            <Link href="/prayer-wall" className="text-primary-600 hover:underline text-sm">
                                Submit New
                            </Link>
                        </div>
                        {myPrayers.map((prayer) => (
                            <div key={prayer.id} className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-gray-700">{prayer.content}</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${prayer.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {prayer.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{prayer.date}</span>
                                    {prayer.status === 'approved' && <span>🙏 {prayer.prayerCount} people praying</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Saved Churches</h3>
                        {savedChurches.map((church) => (
                            <Link key={church.id} href={`/churches/${church.id}`} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{church.name}</h4>
                                        <p className="text-sm text-gray-500">{church.city}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        ))}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {[
                            { icon: User, label: 'Edit Profile', href: '/settings/profile' },
                            { icon: Bell, label: 'Notifications', href: '/settings/notifications' },
                            { icon: Crown, label: 'Subscription', href: '/settings/subscription' },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-0">
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-gray-400" />
                                    <span>{item.label}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        ))}
                        <button className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50">
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
