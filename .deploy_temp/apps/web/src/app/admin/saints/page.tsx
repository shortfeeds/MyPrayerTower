'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Crown,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Eye,
    ExternalLink
} from 'lucide-react';

interface Saint {
    id: string;
    name: string;
    slug: string;
    title: string | null;
    feastDay: string | null;
    feastMonth: number | null;
    feastDayOfMonth: number | null;
    shortBio: string | null;
    imageUrl: string | null;
    patronOf: string[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminSaintsPage() {
    const [saints, setSaints] = useState<Saint[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchSaints();
    }, [page, searchQuery, monthFilter]);

    const fetchSaints = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(searchQuery && { search: searchQuery }),
                ...(monthFilter && { month: monthFilter })
            });

            const res = await fetch(`/api/admin/saints?${params}`);
            const data = await res.json();
            setSaints(data.saints || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch saints:', err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Saints Database</h1>
                    <p className="text-gray-500 mt-1">{total.toLocaleString()} saints in database</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search saints by name..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <select
                        value={monthFilter}
                        onChange={(e) => { setMonthFilter(e.target.value); setPage(1); }}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="">All Months</option>
                        {MONTHS.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Saints Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : saints.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No saints found</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {saints.map(saint => (
                            <div key={saint.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Crown className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{saint.name}</h3>
                                        {saint.title && (
                                            <p className="text-sm text-gray-500 truncate">{saint.title}</p>
                                        )}
                                        {saint.feastDay && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                                                <Calendar className="w-3 h-3" />
                                                {saint.feastDay}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {saint.patronOf && saint.patronOf.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {saint.patronOf.slice(0, 3).map((p, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                {p}
                                            </span>
                                        ))}
                                        {saint.patronOf.length > 3 && (
                                            <span className="px-2 py-0.5 text-gray-400 text-xs">
                                                +{saint.patronOf.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}
                                <a
                                    href={`/saints/${saint.slug}`}
                                    target="_blank"
                                    className="mt-3 flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Page
                                    <ExternalLink className="w-3 h-3" />
                                </a>
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
