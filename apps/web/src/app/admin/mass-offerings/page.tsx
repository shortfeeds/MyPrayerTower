'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    Heart,
    Gift,
    RefreshCw,
    ChevronRight
} from 'lucide-react';

interface OfferingStats {
    total: number;
    pending: number;
    completed: number;
    revenue: number;
    recent: any[];
}

interface DonationStats {
    total: number;
    revenue: number;
    recent: any[];
}

export default function AdminMassOfferingsPage() {
    const [offerings, setOfferings] = useState<OfferingStats | null>(null);
    const [donations, setDonations] = useState<DonationStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/mass-offerings');
            const data = await res.json();
            setOfferings(data.massOfferings);
            setDonations(data.donations);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mass Offerings & Donations</h1>
                    <p className="text-gray-500 mt-1">Live analytics from your app</p>
                </div>
                <button
                    onClick={fetchData}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Total Revenue</span>
                    </div>
                    <p className="text-3xl font-bold">
                        {offerings ? formatCurrency(offerings.revenue + (donations?.revenue || 0)) : '$0'}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Heart className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Mass Offerings</span>
                    </div>
                    <p className="text-3xl font-bold">{offerings?.total || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Gift className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Donations</span>
                    </div>
                    <p className="text-3xl font-bold">{donations?.total || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Pending</span>
                    </div>
                    <p className="text-3xl font-bold">{offerings?.pending || 0}</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Mass Offerings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Mass Offerings</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {offerings?.recent.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No offerings yet</div>
                        ) : (
                            offerings?.recent.map((o: any) => (
                                <div key={o.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">For: {o.intentionFor}</p>
                                        <p className="text-sm text-gray-500">{o.offeringType} • #{o.orderNumber?.slice(0, 8)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">{formatCurrency(o.amount)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {o.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Donations */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {donations?.recent.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No donations yet</div>
                        ) : (
                            donations?.recent.map((d: any) => (
                                <div key={d.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{d.donorName || 'Anonymous'}</p>
                                        <p className="text-sm text-gray-500">{d.tier} Tier</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">{formatCurrency(d.amount)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {d.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Pricing Management Link */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Manage Pricing</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Update Mass offering and subscription prices from Settings
                        </p>
                    </div>
                    <a
                        href="/admin/settings"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                    >
                        Go to Settings
                        <ChevronRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
