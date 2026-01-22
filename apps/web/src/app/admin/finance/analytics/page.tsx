'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    CreditCard,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function FinancialAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [period, setPeriod] = useState('30d');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const endDate = new Date().toISOString();
            const startDate = new Date();

            if (period === '7d') startDate.setDate(startDate.getDate() - 7);
            if (period === '30d') startDate.setDate(startDate.getDate() - 30);
            if (period === '90d') startDate.setDate(startDate.getDate() - 90);

            const params = new URLSearchParams({
                startDate: startDate.toISOString(),
                endDate: endDate
            });

            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const res = await fetch(`${API_BASE}/admin/reports/revenue?${params}`);

            if (res.ok) {
                const analyticsData = await res.json();
                setData(analyticsData);
            } else {
                toast.error('Failed to load analytics');
            }
        } catch (error) {
            console.error('Analytics error:', error);
            toast.error('Error loading analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    const { totalRevenue = 0, transactionCount = 0, averageOrderValue = 0, revenueByDate = [], revenueByType = [], recentTransactions = [] } = data || {};

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(cents / 100);
    };

    // Find max value for chart scaling
    const maxRevenue = Math.max(...revenueByDate.map((d: any) => d.amount), 1);

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
                    <p className="text-gray-500">Revenue overview and performance metrics</p>
                </div>
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                    <button
                        onClick={() => setPeriod('7d')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '7d' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setPeriod('30d')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '30d' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        30 Days
                    </button>
                    <button
                        onClick={() => setPeriod('90d')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '90d' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        90 Days
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +12.5%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Transactions</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{transactionCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(averageOrderValue)}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart (Revenue over time) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h3>
                    <div className="h-64 flex items-end gap-2">
                        {revenueByDate.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No data available for this period
                            </div>
                        ) : (
                            revenueByDate.map((item: any, i: number) => {
                                const heightPercentage = (item.amount / maxRevenue) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                        <div
                                            className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-all cursor-pointer relative"
                                            style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                                        >
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {formatCurrency(item.amount)}
                                                <br />
                                                {new Date(item.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 border-t border-gray-100 pt-2">
                        <span>{new Date(revenueByDate[0]?.date || Date.now()).toLocaleDateString()}</span>
                        <span>{new Date(revenueByDate[revenueByDate.length - 1]?.date || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Source</h3>
                    <div className="space-y-4">
                        {revenueByType.length === 0 ? (
                            <p className="text-gray-400 text-center py-10">No breakdown data</p>
                        ) : (
                            revenueByType.map((item: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 capitalize">{item.type.replace('_', ' ')}</span>
                                        <span className="text-gray-900">{Math.round((item.amount / totalRevenue) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full"
                                            style={{ width: `${(item.amount / totalRevenue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No recent transactions</td>
                                </tr>
                            ) : (
                                recentTransactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{tx.user}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {tx.product || 'Unknown Product'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            {formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
