'use client';

import { useState } from 'react';
import { Eye, Users, TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

export default function AnalyticsPage() {
    // Demo data - in production, fetch from API
    const weeklyViews = [120, 145, 132, 189, 201, 176, 234];
    const weeklyFollowers = [3, 5, 2, 8, 4, 6, 7];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const maxViews = Math.max(...weeklyViews);

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-500">Track your church's engagement and growth</p>
            </div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Eye className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <ArrowUp className="w-3 h-3" /> 12%
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-sm text-gray-500">Page Views (This Week)</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <ArrowUp className="w-3 h-3" /> 8%
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">456</p>
                    <p className="text-sm text-gray-500">Total Followers</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                            <ArrowDown className="w-3 h-3" /> 2%
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">35</p>
                    <p className="text-sm text-gray-500">New Followers (This Week)</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                    <p className="text-sm text-gray-500">Event RSVPs (This Month)</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Views Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Page Views (Last 7 Days)</h2>

                    <div className="flex items-end justify-between gap-4 h-48 mb-4">
                        {weeklyViews.map((views, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-primary-100 rounded-t-lg relative group cursor-pointer hover:bg-primary-200 transition-colors"
                                    style={{ height: `${(views / maxViews) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {views} views
                                    </div>
                                    <div
                                        className="absolute bottom-0 w-full bg-primary-500 rounded-t-lg transition-all"
                                        style={{ height: '100%' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between">
                        {days.map((day, i) => (
                            <div key={i} className="flex-1 text-center text-sm text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Followers Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">New Followers (Last 7 Days)</h2>

                    <div className="flex items-end justify-between gap-4 h-48 mb-4">
                        {weeklyFollowers.map((followers, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-green-100 rounded-t-lg relative group cursor-pointer hover:bg-green-200 transition-colors"
                                    style={{ height: `${(followers / Math.max(...weeklyFollowers)) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        +{followers}
                                    </div>
                                    <div
                                        className="absolute bottom-0 w-full bg-green-500 rounded-t-lg"
                                        style={{ height: '100%' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between">
                        {days.map((day, i) => (
                            <div key={i} className="flex-1 text-center text-sm text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Announcements */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Announcements</h2>

                    <div className="space-y-4">
                        {[
                            { title: 'Christmas Mass Schedule', views: 342 },
                            { title: 'Parish Food Drive', views: 156 },
                            { title: 'New Bible Study Group', views: 89 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-gray-900">{item.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">{item.views} views</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Traffic Sources</h2>

                    <div className="space-y-4">
                        {[
                            { source: 'Direct / Bookmarks', percentage: 45, color: 'bg-blue-500' },
                            { source: 'Google Search', percentage: 30, color: 'bg-green-500' },
                            { source: 'Social Media', percentage: 15, color: 'bg-purple-500' },
                            { source: 'Other', percentage: 10, color: 'bg-gray-400' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">{item.source}</span>
                                    <span className="font-medium text-gray-900">{item.percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
