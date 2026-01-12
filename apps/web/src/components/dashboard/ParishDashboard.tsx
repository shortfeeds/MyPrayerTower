'use client';

import { useState, useEffect } from 'react';
import { Eye, Users, Megaphone, Calendar, TrendingUp, ArrowUpRight, Plus, Settings, Sparkles, Clock, MessageSquare, Bell } from 'lucide-react';
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
    slug: string;
}

interface ActivityItem {
    id: string;
    type: 'review' | 'follower' | 'event_rsvp';
    content: string;
    time: string;
    isNew: boolean;
}

export function ParishDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [church, setChurch] = useState<ChurchInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch
        const timer = setTimeout(() => {
            setStats({ totalViews: 12450, totalFollowers: 856, totalAnnouncements: 14, upcomingEvents: 3 });
            setChurch({ name: "St. Mary's Parish", isVerified: true, slug: 'st-marys' });
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const statCards = [
        { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Followers', value: stats?.totalFollowers || 0, icon: Users, color: 'bg-green-500', trend: '+8%' },
        { label: 'Announcements', value: stats?.totalAnnouncements || 0, icon: Megaphone, color: 'bg-purple-500', trend: '' },
        { label: 'Upcoming Events', value: stats?.upcomingEvents || 0, icon: Calendar, color: 'bg-orange-500', trend: '' },
    ];

    const activities: ActivityItem[] = [
        { id: '1', type: 'follower', content: 'Sarah J. started following your parish', time: '2 hours ago', isNew: true },
        { id: '2', type: 'event_rsvp', content: '5 new RSVPs for "Sunday Bible Study"', time: '5 hours ago', isNew: true },
        { id: '3', type: 'review', content: 'New 5-star review from John D.', time: '1 day ago', isNew: false },
    ];

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back! 👋
                    </h1>
                    <p className="text-gray-500">
                        Manage <span className="font-semibold text-gray-700">{church?.name}</span>'s digital presence
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </Link>
                </div>
            </div>

            {/* Church Info Banner */}
            <div className="bg-gradient-to-r from-sacred-800 to-sacred-950 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold">{church?.name}</h2>
                            {church?.isVerified && (
                                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-medium">
                                    <Sparkles className="w-3 h-3" /> Verified Parish
                                </span>
                            )}
                        </div>
                        <p className="text-gray-300 text-sm max-w-xl">
                            Your dashboard is fully active. Keep your mass times and announcements up to date to reach more parishioners.
                        </p>
                    </div>
                    <Link
                        href={`/churches/${church?.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors"
                    >
                        View Public Page <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            {stat.trend && (
                                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                                </span>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value.toLocaleString()}
                            </p>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link
                                href="/dashboard/announcements/new"
                                className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all flex items-start gap-4"
                            >
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <Megaphone className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Post Announcement</h4>
                                    <p className="text-sm text-gray-500 mt-1">Share news, updates, or bulletins with your community.</p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/events/new"
                                className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all flex items-start gap-4"
                            >
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                    <Calendar className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-orange-700 transition-colors">Schedule Event</h4>
                                    <p className="text-sm text-gray-500 mt-1">Add a mass, confession time, or parish event.</p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/mass-times"
                                className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-start gap-4"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Update Mass Times</h4>
                                    <p className="text-sm text-gray-500 mt-1">Keep your schedule accurate for visitors.</p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/profile"
                                className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex items-start gap-4"
                            >
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                    <Settings className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-black transition-colors">Edit Profile</h4>
                                    <p className="text-sm text-gray-500 mt-1">Update contact info, photos, and description.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Activity Feed */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Recent Activity</h3>
                            <Link href="/dashboard/activity" className="text-xs text-blue-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex gap-3 items-start">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${activity.isNew ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                    <div>
                                        <p className="text-sm text-gray-800 leading-snug">{activity.content}</p>
                                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gold-50 to-amber-50 rounded-2xl border border-gold-100 p-6">
                        <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Pro Tip
                        </h3>
                        <p className="text-sm text-amber-800 mb-3">
                            Parishes that post weekly announcements see 3x more engagement from their community.
                        </p>
                        <button className="text-xs font-bold text-amber-700 hover:text-amber-900 uppercase tracking-wide">
                            Create Post →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
