'use client';

import { useState } from 'react';
import { TeamOutlined, HeartOutlined, EnvironmentOutlined, DollarOutlined, RiseOutlined, BarChartOutlined } from '@ant-design/icons';

interface ChartData {
    label: string;
    value: number;
}

export default function AnalyticsDashboard() {
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Mock data
    const stats = {
        totalUsers: 15423,
        newUsersThisMonth: 892,
        totalChurches: 52345,
        totalPrayers: 89234,
        prayerActions: 456789,
        totalDonations: 125670,
        premiumUsers: 1234,
    };

    const prayerHeatmap: ChartData[] = [
        { label: 'Mon', value: 45 },
        { label: 'Tue', value: 52 },
        { label: 'Wed', value: 61 },
        { label: 'Thu', value: 48 },
        { label: 'Fri', value: 55 },
        { label: 'Sat', value: 72 },
        { label: 'Sun', value: 89 },
    ];

    const topCategories = [
        { name: 'Health', count: 23456, percent: 28 },
        { name: 'Family', count: 19234, percent: 23 },
        { name: 'Work', count: 15678, percent: 19 },
        { name: 'Spiritual', count: 12345, percent: 15 },
        { name: 'Other', count: 12521, percent: 15 },
    ];

    const geographicData = [
        { country: 'United States', churches: 28456 },
        { country: 'Philippines', churches: 8234 },
        { country: 'Brazil', churches: 6789 },
        { country: 'Mexico', churches: 4567 },
        { country: 'Italy', churches: 3456 },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                        <p className="text-gray-500">Platform insights and metrics</p>
                    </div>
                    <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
                        {(['7d', '30d', '90d'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-4 py-2 rounded-md font-medium ${dateRange === range
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: TeamOutlined, color: 'text-blue-500', trend: '+12%' },
                        { label: 'Churches', value: stats.totalChurches.toLocaleString(), icon: EnvironmentOutlined, color: 'text-green-500', trend: '+5%' },
                        { label: 'Prayers', value: stats.totalPrayers.toLocaleString(), icon: HeartOutlined, color: 'text-red-500', trend: '+23%' },
                        { label: 'Donations', value: `$${(stats.totalDonations / 100).toLocaleString()}`, icon: DollarOutlined, color: 'text-amber-500', trend: '+18%' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                                    <RiseOutlined className="w-4 h-4" />
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Prayer Activity Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <BarChartOutlined className="w-5 h-5 text-primary-500" />
                            Prayer Activity (Weekly)
                        </h3>
                        <div className="flex items-end justify-between h-48 gap-4">
                            {prayerHeatmap.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all"
                                        style={{ height: `${(day.value / 100) * 100}%` }}
                                    />
                                    <span className="text-xs text-gray-500 mt-2">{day.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Categories */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Prayer Categories</h3>
                        <div className="space-y-4">
                            {topCategories.map((cat, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                                        <span className="text-sm text-gray-500">{cat.count.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                                            style={{ width: `${cat.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Geographic Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Churches by Country</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {geographicData.map((country, i) => (
                            <div key={i} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{country.churches.toLocaleString()}</p>
                                <p className="text-sm text-gray-500 mt-1">{country.country}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
