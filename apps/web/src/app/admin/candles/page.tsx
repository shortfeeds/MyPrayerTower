'use client';

import { useState, useEffect } from 'react';
import { Flame, Clock, Calendar, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Crown, Star, User, Check, X, Trash2 } from 'lucide-react';
import { getAdminCandleStats, getCandlesForAdmin, approveCandle, rejectCandle } from '@/app/actions/spiritual';

export default function AdminCandlesPage() {
    const [stats, setStats] = useState<any>(null);
    const [candles, setCandles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    async function loadData() {
        setIsLoading(true);
        try {
            const [statsData, candlesData] = await Promise.all([
                getAdminCandleStats(),
                getCandlesForAdmin(page, 50)
            ]);
            setStats(statsData);
            setCandles(candlesData);
            setHasMore(candlesData.length === 50);
        } catch (error) {
            console.error('Failed to load admin candle data', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [page]);

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amt / 100);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString();
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Approve this candle?')) return;
        await approveCandle(id);
        loadData();
    };

    const handleReject = async (id: string) => {
        if (!confirm('Reject and delete this candle?')) return;
        await rejectCandle(id);
        loadData();
    };

    if (isLoading && !stats) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Virtual Candles</h1>
                    <p className="text-gray-600 mt-1">Manage and track virtual candle usage and revenue</p>
                </div>
                <button
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Revenue Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">💰</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Candles */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Active Candles</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.activeCandles}</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Flame className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    {/* Expired Candles */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Expired (History)</p>
                                <p className="text-2xl font-bold text-gray-400 mt-1">{stats.expiredCandles}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Total All Time */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Created</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCandles}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Revenue by Tier */}
            {stats && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="font-bold text-lg text-gray-900">Revenue by Candle Tier</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {stats.byTier.map((tier: any) => (
                            <div key={tier.duration} className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${tier.duration === 'THIRTY_DAYS' ? 'bg-amber-100 text-amber-700' :
                                        tier.duration === 'SEVEN_DAYS' ? 'bg-sky-100 text-sky-700' :
                                            tier.duration === 'THREE_DAYS' ? 'bg-rose-100 text-rose-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {tier.duration.replace('_', ' ').toLowerCase()}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(tier.revenue)}</p>
                                <p className="text-sm text-gray-500 mt-1">{tier.count} candles purchased</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Candles Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="font-bold text-lg text-gray-900">Recent Candles</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search intentions..."
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">User / Intention</th>
                                <th className="px-6 py-3">Tier</th>
                                <th className="px-6 py-3">Created</th>
                                <th className="px-6 py-3">Expires</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {candles.map((candle) => (
                                <tr key={candle.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {candle.isExpired ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Expired
                                            </span>
                                        ) : candle.isActive ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {candle.isAnonymous ? 'Anonymous' : candle.displayName}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            "{candle.intention}"
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {candle.duration === 'THIRTY_DAYS' && (
                                            <div className="flex items-center text-amber-600">
                                                <Crown className="w-4 h-4 mr-1.5" />
                                                <span className="text-sm font-medium">Premium</span>
                                            </div>
                                        )}
                                        {candle.duration === 'SEVEN_DAYS' && (
                                            <div className="flex items-center text-sky-600">
                                                <Star className="w-4 h-4 mr-1.5" />
                                                <span className="text-sm font-medium">Standard</span>
                                            </div>
                                        )}
                                        {(candle.duration === 'THREE_DAYS' || candle.duration === 'ONE_DAY') && (
                                            <div className="flex items-center text-gray-500">
                                                <Flame className="w-4 h-4 mr-1.5" />
                                                <span className="text-sm font-medium">Basic</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(candle.litAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(candle.expiresAt)}
                                        {candle.isExpired && (
                                            <span className="ml-2 text-xs text-red-500">(Ended)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {candle.amount > 0 ? (
                                            <span className="text-green-600">{formatCurrency(candle.amount)}</span>
                                        ) : (
                                            <span className="text-gray-400">Free</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {!candle.isActive && !candle.isExpired ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(candle.id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Approve"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(candle.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleReject(candle.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing page {page}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!hasMore}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
