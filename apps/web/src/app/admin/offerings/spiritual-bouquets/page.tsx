'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Loader2,
    Flower,
    Mail
} from 'lucide-react';
import { toast } from 'sonner';

interface Bouquet {
    id: string;
    recipientName: string;
    recipientEmail: string;
    occasion?: string;
    massesCount: number;
    rosariesCount: number;
    prayersCount: number;
    candlesCount: number;
    amount: number;
    createdAt: string;
    creatorName: string;
    creatorEmail: string;
}

export default function SpiritualBouquetsPage() {
    const [bouquets, setBouquets] = useState<Bouquet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchBouquets();
    }, [page, searchQuery]);

    const fetchBouquets = async () => {
        try {
            setLoading(true);
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const res = await fetch(`${API_BASE}/admin/spiritual-bouquets?page=${page}&limit=20&search=${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setBouquets(data.bouquets);
            }
        } catch (error) {
            toast.error('Failed to fetch spiritual bouquets');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Spiritual Bouquets</h1>
                    <p className="text-gray-500">Manage sent spiritual bouquets</p>
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
                        placeholder="Search by recipient or sender..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden pb-32">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Recipient</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Occasion</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contents</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sender</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : bouquets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No bouquets found.
                                    </td>
                                </tr>
                            ) : (
                                bouquets.map((bouquet) => (
                                    <tr key={bouquet.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{bouquet.recipientName}</div>
                                            <div className="text-xs text-gray-500">{bouquet.recipientEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {bouquet.occasion || 'General'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-500 space-y-0.5">
                                                {bouquet.massesCount > 0 && <div>{bouquet.massesCount} Masses</div>}
                                                {bouquet.rosariesCount > 0 && <div>{bouquet.rosariesCount} Rosaries</div>}
                                                {bouquet.candlesCount > 0 && <div>{bouquet.candlesCount} Candles</div>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ${(bouquet.amount / 100).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{bouquet.creatorName}</div>
                                            <div className="text-xs text-gray-500">{bouquet.creatorEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(bouquet.createdAt).toLocaleDateString()}
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
