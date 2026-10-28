'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight, CreditCard, Heart, Loader2 } from 'lucide-react';

interface DonationStats {
    totalDonations: number;
    totalDonationsFormatted: string;
    donationCount: number;
    activeSubscriptions: number;
    estimatedMRR: number;
}

interface DonationRow {
    id: string;
    orderNumber: string;
    amount: number;
    tier: string;
    name: string;
    email: string;
    isAnonymous: boolean;
    status: string;
    createdAt: string;
}

const TIER_LABELS: Record<string, { emoji: string; label: string }> = {
    CANDLE: { emoji: '🕯️', label: 'Light a Candle' },
    ROSARY: { emoji: '📿', label: 'Rosary Partner' },
    SUPPORTER: { emoji: '⛪', label: 'Parish Supporter' },
    GUARDIAN: { emoji: '👼', label: 'Guardian Angel' },
    BENEFACTOR: { emoji: '🌟', label: 'Benefactor' },
    PATRON: { emoji: '💎', label: 'Patron' },
    CORNERSTONE: { emoji: '🏆', label: 'Cornerstone' },
    CUSTOM: { emoji: '❤️', label: 'Custom Gift' },
};

export default function AdminDonationsPage() {
    const [stats, setStats] = useState<DonationStats>({
        totalDonations: 0,
        totalDonationsFormatted: '$0.00',
        donationCount: 0,
        activeSubscriptions: 0,
        estimatedMRR: 0,
    });
    const [donations, setDonations] = useState<DonationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/donations?period=${period}`);
            if (res.ok) {
                const data = await res.json();
                if (data.stats) {
                    setStats(data.stats);
                }
                if (Array.isArray(data.donations)) {
                    setDonations(data.donations);
                }
            }
        } catch (error) {
            console.error('Error fetching donations data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Donations Dashboard</h1>
                    <p className="text-gray-600 mt-1">Platform donation analytics and benefactor registry</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as any)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-gray-700 text-sm"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="all">All time</option>
                    </select>
                    <button
                        onClick={fetchData}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl p-6 text-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-rose-100 text-sm">Total Donations</p>
                            <p className="text-3xl font-bold mt-1">{stats.totalDonationsFormatted}</p>
                            <p className="text-rose-100 text-sm mt-1">{stats.donationCount} donations</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Active Subscriptions</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeSubscriptions}</p>
                            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                                <ArrowUpRight className="w-4 h-4" />
                                <span>Active</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Monthly Recurring</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">${(stats.estimatedMRR / 100).toFixed(2)}</p>
                            <p className="text-gray-500 text-sm mt-1">Estimated MRR</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Avg. Donation</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                ${stats.donationCount > 0 ? (stats.totalDonations / stats.donationCount).toFixed(2) : '0.00'}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">Per donor gift</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Tiers Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Supported Offerings</h2>
                    <div className="space-y-3">
                        {Object.entries(TIER_LABELS).map(([tier, info]) => (
                            <div key={tier} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{info.emoji}</span>
                                    <span className="font-medium text-gray-800">{info.label}</span>
                                </div>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-mono">{tier}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Support Circles</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div>
                                <p className="font-medium text-purple-900">🙏 Prayer Partner</p>
                                <p className="text-sm text-gray-600">$9.99/month</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-purple-200 text-purple-800 rounded">Patron Tier</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                                <p className="font-medium text-blue-900">👨‍👩‍👧‍👦 Family Plan</p>
                                <p className="text-sm text-gray-600">$19.99/month</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded">Family Tier</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                            <div>
                                <p className="font-medium text-amber-900">💎 Patron Circle</p>
                                <p className="text-sm text-gray-600">$49.99/month</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-amber-200 text-amber-800 rounded">Pillar Tier</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Donations Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-900">Recent Donations</h2>
                    <span className="text-sm text-gray-500">{donations.length} total recorded</span>
                </div>
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-2" />
                        <p>Loading donations...</p>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-700">No donations recorded for this period</p>
                        <p className="text-sm text-gray-400 mt-1">Donations will appear here automatically when processed via PayPal/Stripe</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Donor</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {donations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{donation.orderNumber}</td>
                                        <td className="px-6 py-4">
                                            {donation.isAnonymous ? (
                                                <span className="text-gray-400 italic text-sm">Anonymous Benefactor</span>
                                            ) : (
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{donation.name}</p>
                                                    <p className="text-xs text-gray-500">{donation.email}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                                                <span>{TIER_LABELS[donation.tier]?.emoji || '❤️'}</span>
                                                <span>{TIER_LABELS[donation.tier]?.label || donation.tier}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-green-600 text-sm">
                                            ${(donation.amount / 100).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(donation.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
