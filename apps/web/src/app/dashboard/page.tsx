'use client';

import { useState, useEffect } from 'react';
import { Eye, Users, Megaphone, Calendar, TrendingUp, ArrowUpRight, Plus, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    totalViews: number;
    totalFollowers: number;
    totalAnnouncements: number;
    upcomingEvents: number;
}

interface ChurchInfo {
    name: string;
    isVerified: boolean;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [church, setChurch] = useState<ChurchInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual church ID from auth context
        const churchId = 'demo-church';

        fetch(`/api/church-portal/${churchId}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setStats(data.stats);
                setChurch(data.church);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                // Demo data for UI development
                setStats({ totalViews: 1234, totalFollowers: 456, totalAnnouncements: 12, upcomingEvents: 3 });
                setChurch({ name: 'St. Mary\'s Parish', isVerified: true });
            });
    }, []);

    const statCards = [
        { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Followers', value: stats?.totalFollowers || 0, icon: Users, color: 'bg-green-500', trend: '+8%' },
        { label: 'Announcements', value: stats?.totalAnnouncements || 0, icon: Megaphone, color: 'bg-purple-500', trend: '' },
        { label: 'Upcoming Events', value: stats?.upcomingEvents || 0, icon: Calendar, color: 'bg-orange-500', trend: '' },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back! 👋
                    </h1>
                    <p className="text-gray-500">
                        Manage your church's digital presence on MyPrayerTower
                    </p>
                </div>

                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </Link>
            </div>

            {/* Church Info Banner */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold">{church?.name || 'Your Church'}</h2>
                        {church?.isVerified && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                                <Sparkles className="w-3 h-3" /> Verified
                            </span>
                        )}
                    </div>
                    <p className="text-primary-100 mb-4">
                        Your church portal is live and visible to thousands of Catholics.
                    </p>
                    <Link
                        href="/churches/demo-church"
                        className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                        View Public Page <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.trend && (
                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                            {stat.value.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/announcements/new"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Create Announcement</h3>
                    <p className="text-gray-500 text-sm">Share news with your followers</p>
                </Link>

                <Link
                    href="/dashboard/events/new"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Add Event</h3>
                    <p className="text-gray-500 text-sm">Schedule a parish event</p>
                </Link>

                <Link
                    href="/dashboard/profile"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Settings className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Edit Profile</h3>
                    <p className="text-gray-500 text-sm">Update church information</p>
                </Link>
            </div>
        </div>
    );
}
