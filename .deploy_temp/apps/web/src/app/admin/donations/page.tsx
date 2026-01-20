'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight, CreditCard, Heart } from 'lucide-react';

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
            // Fetch statistics
            const statsRes = await fetch('/api/donations/admin/statistics');
            const statsData = await statsRes.json();
            setStats(statsData);

            // TODO: Fetch recent donations list
            // For now, using mock data
            setDonations([]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Donations Dashboard</h1>
                    <p className="text-gray-600 mt-1">Platform donation analytics and management</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as any)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="all">All time</option>
                    </select>
                    <button
                        onClick={fetchData}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl p-6 text-white">
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

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Active Subscriptions</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeSubscriptions}</p>
                            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                                <ArrowUpRight className="w-4 h-4" />
                                <span>Growing</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
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

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Avg. Donation</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                ${stats.donationCount > 0 ? ((stats.totalDonations / 100) / stats.donationCount).toFixed(2) : '0.00'}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">Per donor</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Tiers Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Donation Tiers</h2>
                    <div className="space-y-3">
                        {Object.entries(TIER_LABELS).map(([tier, info]) => (
                            <div key={tier} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{info.emoji}</span>
                                    <span className="font-medium">{info.label}</span>
                                </div>
                                <span className="text-gray-500">-</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Subscription Plans</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div>
                                <p className="font-medium">🙏 Prayer Partner</p>
                                <p className="text-sm text-gray-600">$9.99/month</p>
                            </div>
                            <span className="font-bold text-purple-600">-</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                                <p className="font-medium">👨‍👩‍👧‍👦 Family Plan</p>
                                <p className="text-sm text-gray-600">$19.99/month</p>
                            </div>
                            <span className="font-bold text-blue-600">-</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                            <div>
                                <p className="font-medium">💎 Patron Circle</p>
                                <p className="text-sm text-gray-600">$49.99/month</p>
                            </div>
                            <span className="font-bold text-amber-600">-</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Donations Table */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg text-gray-900">Recent Donations</h2>
                </div>
                {donations.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No donations yet</p>
                        <p className="text-sm">Donations will appear here once they come in</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Order</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Donor</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tier</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(donation => (
                                <tr key={donation.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-sm">{donation.orderNumber}</td>
                                    <td className="px-4 py-3">
                                        {donation.isAnonymous ? (
                                            <span className="text-gray-500 italic">Anonymous</span>
                                        ) : (
                                            <div>
                                                <p className="font-medium">{donation.name}</p>
                                                <p className="text-xs text-gray-500">{donation.email}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-2">
                                            {TIER_LABELS[donation.tier]?.emoji}
                                            {TIER_LABELS[donation.tier]?.label || donation.tier}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-green-600">${(donation.amount / 100).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(donation.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
