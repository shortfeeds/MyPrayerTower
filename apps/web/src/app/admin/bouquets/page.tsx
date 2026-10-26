'use client';

import { useState, useEffect } from 'react';
import {
    Gift,
    DollarSign,
    Heart,
    RefreshCw,
    CheckCircle,
    Clock,
    Search,
    Flame,
    Sparkles,
    BookOpen
} from 'lucide-react';

interface BouquetStats {
    total: number;
    paid: number;
    pending: number;
    revenue: number;
    massesCount: number;
    rosariesCount: number;
    prayersCount: number;
    candlesCount: number;
}

interface BouquetRecord {
    id: string;
    creatorName: string;
    creatorEmail: string;
    recipientName: string;
    recipientEmail: string;
    occasion?: string;
    message?: string;
    massesCount: number;
    rosariesCount: number;
    prayersCount: number;
    candlesCount: number;
    amount: number;
    paymentStatus: string;
    paymentId?: string;
    sentAt?: string;
    sendDate?: string;
}

export default function AdminBouquetsPage() {
    const [stats, setStats] = useState<BouquetStats>({
        total: 0,
        paid: 0,
        pending: 0,
        revenue: 0,
        massesCount: 0,
        rosariesCount: 0,
        prayersCount: 0,
        candlesCount: 0
    });
    const [bouquets, setBouquets] = useState<BouquetRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/bouquets');
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                setBouquets(data.bouquets || []);
            }
        } catch (err) {
            console.error('Failed to load bouquets:', err);
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

    const filteredBouquets = bouquets.filter(b => {
        const matchesSearch =
            b.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.creatorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.occasion && b.occasion.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = filterStatus === 'ALL' || b.paymentStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Spiritual Bouquets</h1>
                    <p className="text-gray-500 mt-1">Live digital spiritual bouquets, devotions & prayer gifts</p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Bouquet Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue)}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">{stats.paid} fulfilled bouquets</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Created</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Gift className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3 text-xs">
                        <span className="text-emerald-600 font-semibold">{stats.paid} Paid</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-amber-600">{stats.pending} Pending</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Masses Dedicated</p>
                            <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.massesCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">{stats.rosariesCount} Rosaries offered</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Candles & Prayers</p>
                            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.candlesCount + stats.prayersCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Flame className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">{stats.candlesCount} Candles, {stats.prayersCount} Prayers</p>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search sender, recipient, occasion..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    {(['ALL', 'PAID', 'PENDING'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                                filterStatus === status
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {status === 'ALL' ? 'All' : status === 'PAID' ? 'Paid' : 'Pending'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bouquets Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">From (Donor)</th>
                                <th className="px-6 py-4">To (Recipient)</th>
                                <th className="px-6 py-4">Occasion</th>
                                <th className="px-6 py-4">Prayers Pledged</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBouquets.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No spiritual bouquets found matching your query.
                                    </td>
                                </tr>
                            ) : (
                                filteredBouquets.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{b.creatorName}</p>
                                            <p className="text-xs text-gray-500">{b.creatorEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{b.recipientName}</p>
                                            <p className="text-xs text-gray-500">{b.recipientEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
                                                {b.occasion || 'Spiritual Blessing'}
                                            </span>
                                            {b.message && (
                                                <p className="text-xs text-gray-400 line-clamp-1 mt-1 italic max-w-xs">
                                                    "{b.message}"
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 text-xs">
                                                {b.massesCount > 0 && <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">{b.massesCount} Masses</span>}
                                                {b.rosariesCount > 0 && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">{b.rosariesCount} Rosaries</span>}
                                                {b.prayersCount > 0 && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">{b.prayersCount} Prayers</span>}
                                                {b.candlesCount > 0 && <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">{b.candlesCount} Candles</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {formatCurrency(b.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                b.paymentStatus === 'PAID'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {b.paymentStatus === 'PAID' ? (
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                ) : (
                                                    <Clock className="w-3.5 h-3.5" />
                                                )}
                                                {b.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                            {b.sentAt ? new Date(b.sentAt).toLocaleDateString() : b.sendDate ? new Date(b.sendDate).toLocaleDateString() : 'Immediate'}
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
