'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Loader2,
    Flame,
    Mail
} from 'lucide-react';
import { toast } from 'sonner';

interface Candle {
    id: string;
    intention: string;
    amount: number;
    duration: string;
    isActive: boolean;
    expiresAt: string;
    createdAt: string;
    email?: string;
    creator?: {
        email: string;
        firstName: string;
        lastName: string;
    }
}

export default function CandlesPage() {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchCandles();
    }, [page, searchQuery]);

    const fetchCandles = async () => {
        try {
            setLoading(true);
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const res = await fetch(`${API_BASE}/admin/candles?page=${page}&limit=20&search=${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setCandles(data.candles);
            }
        } catch (error) {
            toast.error('Failed to fetch candles');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Virtual Candles</h1>
                    <p className="text-gray-500">Manage active and expired virtual candles</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by intention or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden pb-32">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Intention</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Duration</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Lit By</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Expires</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : candles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No candles found.
                                    </td>
                                </tr>
                            ) : (
                                candles.map((candle) => (
                                    <tr key={candle.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{candle.intention}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {candle.duration.replace(/_/g, ' ')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ${(candle.amount / 100).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${candle.isActive
                                                    ? 'bg-orange-50 text-orange-700 border-orange-100'
                                                    : 'bg-gray-50 text-gray-700 border-gray-100'
                                                }`}>
                                                {candle.isActive && <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />}
                                                {candle.isActive ? 'Burning' : 'Extinguished'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {candle.creator?.firstName || 'Guest'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {candle.creator?.email || candle.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(candle.expiresAt).toLocaleDateString()}
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
