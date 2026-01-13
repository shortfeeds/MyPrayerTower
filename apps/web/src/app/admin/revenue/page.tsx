'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import { getRevenueStats, type RevenueStats, type RevenueData } from '@/app/actions/revenue';

// Mock data - replace with API calls
const MOCK_MONTHLY_DATA: RevenueData[] = [
    { period: 'Jan 2024', massOfferings: 245000, donations: 180000, subscriptions: 45000, total: 470000 },
    { period: 'Feb 2024', massOfferings: 289000, donations: 195000, subscriptions: 52000, total: 536000 },
    { period: 'Mar 2024', massOfferings: 312000, donations: 210000, subscriptions: 58000, total: 580000 },
    { period: 'Apr 2024', massOfferings: 278000, donations: 185000, subscriptions: 63000, total: 526000 },
    { period: 'May 2024', massOfferings: 334000, donations: 225000, subscriptions: 71000, total: 630000 },
    { period: 'Jun 2024', massOfferings: 356000, donations: 240000, subscriptions: 78000, total: 674000 },
];

export default function AdminRevenueReportsPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '12m' | 'ytd'>('30d');
    const [revenueData, setRevenueData] = useState<RevenueData[]>(MOCK_MONTHLY_DATA);
    const [stats, setStats] = useState<RevenueStats>({
        totalRevenue: 0,
        massOfferingsRevenue: 0,
        donationsRevenue: 0,
        subscriptionsRevenue: 0,
        growthPercent: 0,
        avgOrderValue: 0,
        topOfferingType: 'Loading...',
        topDonationTier: 'Loading...',
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                // Dynamically import action to avoid server-client boundary issues if any
                const { getRevenueStats } = await import('@/app/actions/revenue');
                const data = await getRevenueStats();
                setStats(data);
            } catch (err) {
                console.error('Failed to load revenue stats', err);
            }
        };
        loadStats();
    }, []);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(cents / 100);
    };

    const exportReport = () => {
        // Generate CSV
        const headers = ['Period', 'Mass Offerings', 'Donations', 'Subscriptions', 'Total'];
        const rows = revenueData.map(d => [
            d.period,
            (d.massOfferings / 100).toFixed(2),
            (d.donations / 100).toFixed(2),
            (d.subscriptions / 100).toFixed(2),
            (d.total / 100).toFixed(2),
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-report-${period}.csv`;
        a.click();
    };

    // Calculate chart max for scaling
    const maxRevenue = Math.max(...revenueData.map(d => d.total));

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Revenue Reports</h1>
                    <p className="text-gray-600 mt-1">Detailed financial analytics and reporting</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as any)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="12m">Last 12 Months</option>
                        <option value="ytd">Year to Date</option>
                    </select>
                    <button
                        onClick={exportReport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
                            <div className="flex items-center gap-1 mt-2">
                                {stats.growthPercent >= 0 ? (
                                    <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4" />
                                )}
                                <span className="text-sm">{Math.abs(stats.growthPercent)}% vs last period</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Mass Offerings</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.massOfferingsRevenue)}</p>
                            <p className="text-sm text-amber-600 mt-1">Top: {stats.topOfferingType}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">⛪</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Donations</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.donationsRevenue)}</p>
                            <p className="text-sm text-rose-600 mt-1">Top: {stats.topDonationTier}</p>
                        </div>
                        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">❤️</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Subscriptions (MRR)</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.subscriptionsRevenue)}</p>
                            <p className="text-sm text-purple-600 mt-1">Recurring monthly</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg text-gray-900">Revenue Trend</h2>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-amber-500 rounded"></span> Mass Offerings
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-rose-500 rounded"></span> Donations
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-purple-500 rounded"></span> Subscriptions
                        </span>
                    </div>
                </div>

                {/* Simple bar chart */}
                <div className="space-y-4">
                    {revenueData.map((data, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-20 text-sm text-gray-600 flex-shrink-0">{data.period.split(' ')[0]}</div>
                            <div className="flex-1 flex gap-1 h-8">
                                <div
                                    className="bg-amber-500 rounded-l"
                                    style={{ width: `${(data.massOfferings / maxRevenue) * 100}%` }}
                                    title={`Mass Offerings: ${formatCurrency(data.massOfferings)}`}
                                />
                                <div
                                    className="bg-rose-500"
                                    style={{ width: `${(data.donations / maxRevenue) * 100}%` }}
                                    title={`Donations: ${formatCurrency(data.donations)}`}
                                />
                                <div
                                    className="bg-purple-500 rounded-r"
                                    style={{ width: `${(data.subscriptions / maxRevenue) * 100}%` }}
                                    title={`Subscriptions: ${formatCurrency(data.subscriptions)}`}
                                />
                            </div>
                            <div className="w-24 text-right font-medium">{formatCurrency(data.total)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Breakdown Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mass Offerings Breakdown */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Mass Offerings by Type</h2>
                    <div className="space-y-3">
                        {[
                            { type: 'Perpetual Enrollment', count: 45, revenue: 450000, percent: 55 },
                            { type: 'Gregorian Masses', count: 12, revenue: 300000, percent: 20 },
                            { type: 'Novena of Masses', count: 28, revenue: 210000, percent: 15 },
                            { type: 'Single Mass', count: 85, revenue: 127500, percent: 8 },
                            { type: 'Expedited Mass', count: 8, revenue: 20000, percent: 2 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium">{item.type}</span>
                                        <span className="text-sm text-gray-500">{item.count} orders</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="ml-4 font-bold text-green-600">{formatCurrency(item.revenue)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donation Tiers Breakdown */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Donations by Tier</h2>
                    <div className="space-y-3">
                        {[
                            { tier: '💎 Patron ($500)', count: 8, revenue: 400000, percent: 40 },
                            { tier: '🌟 Benefactor ($250)', count: 15, revenue: 375000, percent: 25 },
                            { tier: '👼 Guardian ($100)', count: 32, revenue: 320000, percent: 20 },
                            { tier: '⛪ Supporter ($50)', count: 45, revenue: 225000, percent: 10 },
                            { tier: '📿 Rosary ($20)', count: 28, revenue: 56000, percent: 3 },
                            { tier: '🕯️ Candle ($10)', count: 42, revenue: 42000, percent: 2 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium">{item.tier}</span>
                                        <span className="text-sm text-gray-500">{item.count} donors</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-500 rounded-full"
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="ml-4 font-bold text-green-600">{formatCurrency(item.revenue)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Avg Order Value</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.avgOrderValue)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-xl font-bold text-gray-900">4.2%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Repeat Donors</p>
                    <p className="text-xl font-bold text-gray-900">32%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Active Subscribers</p>
                    <p className="text-xl font-bold text-gray-900">284</p>
                </div>
            </div>
        </div>
    );
}
