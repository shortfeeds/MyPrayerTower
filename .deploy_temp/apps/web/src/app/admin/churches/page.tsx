'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    MoreVertical,
    MapPin,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Plus,
    Loader2,
    Eye,
    Edit2,
    Trash2,
    ExternalLink,
    Globe,
    Church
} from 'lucide-react';

interface ChurchData {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
    type: string | null;
    isVerified: boolean;
    address: string | null;
    createdAt: string;
}

export default function AdminChurchesPage() {
    const [churches, setChurches] = useState<ChurchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [verifiedFilter, setVerifiedFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedChurches, setSelectedChurches] = useState<string[]>([]);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

    const limit = 20;

    useEffect(() => {
        fetchChurches();
    }, [page, searchQuery, verifiedFilter]);

    const fetchChurches = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(searchQuery && { search: searchQuery }),
                ...(verifiedFilter !== 'all' && { verified: verifiedFilter })
            });

            const res = await fetch(`/api/admin/churches?${params}`);
            const data = await res.json();
            setChurches(data.churches || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch churches:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (churchId: string, action: 'verify' | 'unverify' | 'delete') => {
        try {
            await fetch(`/api/admin/churches/${churchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            fetchChurches();
            setShowActionMenu(null);
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Churches</h1>
                    <p className="text-gray-500 mt-1">{total.toLocaleString()} churches in database</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <Link
                        href="/admin/churches/new"
                        className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Church
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                            <Church className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Total Churches</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {churches.filter(c => c.isVerified).length}
                            </p>
                            <p className="text-sm text-gray-500">Verified</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-xl">
                            <Globe className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">150+</p>
                            <p className="text-sm text-gray-500">Countries</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <MapPin className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-sm text-gray-500">Pending Claims</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search churches by name, city, or country..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <select
                        value={verifiedFilter}
                        onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="true">Verified Only</option>
                        <option value="false">Unverified Only</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Church</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading churches...</p>
                                    </td>
                                </tr>
                            ) : churches.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                                        No churches found
                                    </td>
                                </tr>
                            ) : churches.map(church => (
                                <tr key={church.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                <Church className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate max-w-xs">{church.name}</p>
                                                <p className="text-sm text-gray-500 truncate max-w-xs">{church.address}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {church.city}, {church.country}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {church.type && (
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {church.type}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {church.isVerified ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                <CheckCircle className="w-3 h-3" /> Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                <XCircle className="w-3 h-3" /> Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative flex justify-end gap-2">
                                            <Link
                                                href={`/churches/${church.id}`}
                                                target="_blank"
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="View Public Page"
                                            >
                                                <ExternalLink className="w-4 h-4 text-gray-500" />
                                            </Link>
                                            <button
                                                onClick={() => handleAction(church.id, church.isVerified ? 'unverify' : 'verify')}
                                                className={`p-2 rounded-lg transition-colors ${church.isVerified ? 'hover:bg-red-50 text-red-500' : 'hover:bg-green-50 text-green-500'}`}
                                                title={church.isVerified ? 'Remove Verification' : 'Verify Church'}
                                            >
                                                {church.isVerified ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleAction(church.id, 'delete')}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} churches
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium">
                            Page {page} of {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
