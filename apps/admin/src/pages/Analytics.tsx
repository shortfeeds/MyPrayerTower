'use client';

import { useState, useEffect } from 'react';
import { TeamOutlined, HeartOutlined, EnvironmentOutlined, DollarOutlined, RiseOutlined, BarChartOutlined } from '@ant-design/icons';

interface ChartData {
    label: string;
    value: number;
}

export default function AnalyticsDashboard() {
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalChurches: 0,
        totalPrayers: 0,
        totalDonations: 0,
        monthlyNewUsers: 0
    });
    const [prayerHeatmap, setPrayerHeatmap] = useState<ChartData[]>([]);
    const [topCategories, setTopCategories] = useState<{ name: string; count: number; percent: number }[]>([]);
    const [geographicData, setGeographicData] = useState<{ country: string; churches: number }[]>([]);

    useEffect(() => {
        fetchAllData();
    }, [dateRange]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
            const headers = {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };

            const [statsRes, heatmapRes, categoriesRes, geoRes, revenueRes] = await Promise.all([
                fetch(`${API_URL}/analytics/stats`, { headers }),
                fetch(`${API_URL}/analytics/heatmap?days=${dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90}`, { headers }),
                fetch(`${API_URL}/analytics/categories`, { headers }),
                fetch(`${API_URL}/analytics/geo`, { headers }),
                fetch(`${API_URL}/analytics/revenue`, { headers })
            ]);

            if (statsRes.ok && revenueRes.ok) {
                const statsData = await statsRes.json();
                const revenueData = await revenueRes.json();
                setStats({
                    totalUsers: statsData.totalUsers,
                    totalChurches: statsData.totalChurches,
                    totalPrayers: statsData.totalPrayers,
                    totalDonations: revenueData.totalDonations, // In cents
                    monthlyNewUsers: statsData.monthlyNewUsers
                });
            }

            if (heatmapRes.ok) {
                const data = await heatmapRes.json();
                // Transform to chart data format if needed, simplistic mapping for now
                setPrayerHeatmap(data.map((d: any) => ({
                    label: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
                    value: d.count
                })).slice(-7)); // Show last 7 entries for the bar chart visualization
            }

            if (categoriesRes.ok) {
                const data = await categoriesRes.json();
                const total = data.reduce((sum: number, c: any) => sum + c.count, 0);
                setTopCategories(data.map((c: any) => ({
                    name: c.category,
                    count: c.count,
                    percent: total > 0 ? Math.round((c.count / total) * 100) : 0
                })));
            }

            if (geoRes.ok) {
                const data = await geoRes.json();
                setGeographicData(data);
            }

        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading analytics...</p>
                </div>
            </div>
        );
    }

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
                        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: TeamOutlined, color: 'text-blue-500', trend: `+${stats.monthlyNewUsers} this month` },
                        { label: 'Churches', value: stats.totalChurches.toLocaleString(), icon: EnvironmentOutlined, color: 'text-green-500', trend: 'Global' },
                        { label: 'Prayers', value: stats.totalPrayers.toLocaleString(), icon: HeartOutlined, color: 'text-red-500', trend: 'Approved' },
                        { label: 'Donations', value: `$${(stats.totalDonations / 100).toLocaleString()}`, icon: DollarOutlined, color: 'text-amber-500', trend: 'Total Revenue' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
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
                            Prayer Activity (Last 7 Active Days)
                        </h3>
                        {prayerHeatmap.length > 0 ? (
                            <div className="flex items-end justify-between h-48 gap-4">
                                {prayerHeatmap.map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all"
                                            style={{ height: `${Math.min(100, Math.max(10, (day.value / 100) * 100))}%` }}
                                        />
                                        <span className="text-xs text-gray-500 mt-2">{day.label}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-gray-400">No activity data</div>
                        )}
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
