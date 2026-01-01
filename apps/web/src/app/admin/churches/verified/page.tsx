'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Church,
    CheckCircle,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Eye,
    ExternalLink
} from 'lucide-react';

interface VerifiedChurch {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
    address: string | null;
    verifiedAt: string | null;
}

export default function AdminVerifiedChurchesPage() {
    const [churches, setChurches] = useState<VerifiedChurch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchChurches();
    }, [page, searchQuery]);

    const fetchChurches = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                verified: 'true',
                ...(searchQuery && { search: searchQuery })
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

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Verified Churches</h1>
                <p className="text-gray-500 mt-1">{total} verified churches</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search verified churches..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </div>

            {/* Churches List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : churches.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No verified churches found</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {churches.map(church => (
                            <div key={church.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{church.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin className="w-3 h-3" />
                                            {church.city}, {church.country}
                                        </div>
                                        {church.verifiedAt && (
                                            <p className="text-xs text-green-600 mt-1">
                                                Verified: {new Date(church.verifiedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    href={`/churches/${church.id}`}
                                    target="_blank"
                                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total}
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
