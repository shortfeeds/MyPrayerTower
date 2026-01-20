'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Heart,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Eye,
    Trash2,
    Flag,
    User,
    Calendar,
    MessageSquare,
    AlertTriangle
} from 'lucide-react';

interface Prayer {
    id: string;
    title: string;
    content: string;
    isAnonymous: boolean;
    isApproved: boolean;
    isFlagged: boolean;
    prayerCount: number;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    } | null;
}

export default function AdminPrayersPage() {
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);

    const limit = 20;

    useEffect(() => {
        fetchPrayers();
    }, [page, searchQuery, statusFilter]);

    const fetchPrayers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(searchQuery && { search: searchQuery }),
                ...(statusFilter !== 'all' && { status: statusFilter })
            });

            const res = await fetch(`/api/admin/prayers?${params}`);
            const data = await res.json();
            setPrayers(data.prayers || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch prayers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (prayerId: string, action: 'approve' | 'reject' | 'delete' | 'flag') => {
        try {
            await fetch(`/api/admin/prayers/${prayerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            fetchPrayers();
            if (selectedPrayer?.id === prayerId) setSelectedPrayer(null);
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalPages = Math.ceil(total / limit);
    const pendingCount = prayers.filter(p => !p.isApproved).length;
    const flaggedCount = prayers.filter(p => p.isFlagged).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Prayer Wall</h1>
                    <p className="text-gray-500 mt-1">Moderate prayer requests and intentions</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-rose-100 rounded-xl">
                            <Heart className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Total Prayers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-xl">
                            <MessageSquare className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                            <p className="text-sm text-gray-500">Pending Review</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <Flag className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{flaggedCount}</p>
                            <p className="text-sm text-gray-500">Flagged</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{prayers.filter(p => p.isApproved).length}</p>
                            <p className="text-sm text-gray-500">Approved</p>
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
                            placeholder="Search prayers by title or content..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="flagged">Flagged</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Prayer List */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                            <p className="text-gray-500 mt-2">Loading prayers...</p>
                        </div>
                    ) : prayers.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            No prayers found
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {prayers.map(prayer => (
                                <div
                                    key={prayer.id}
                                    onClick={() => setSelectedPrayer(prayer)}
                                    className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors ${selectedPrayer?.id === prayer.id ? 'bg-rose-50' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            {prayer.isAnonymous ? (
                                                <User className="w-5 h-5 text-white" />
                                            ) : (
                                                <span className="text-white font-bold text-sm">
                                                    {(prayer.user?.name || prayer.user?.email || '?').charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium text-gray-900 truncate">{prayer.title}</h3>
                                                {!prayer.isApproved && (
                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Pending</span>
                                                )}
                                                {prayer.isFlagged && (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                                                        <Flag className="w-3 h-3" /> Flagged
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2">{prayer.content}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3" /> {prayer.prayerCount} prayers
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {formatDate(prayer.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Page {page} of {totalPages || 1}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
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

                {/* Detail Panel */}
                {selectedPrayer && (
                    <div className="w-96 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Prayer Details</h3>
                            <button onClick={() => setSelectedPrayer(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Title</p>
                                <p className="font-medium text-gray-900">{selectedPrayer.title}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Content</p>
                                <p className="text-gray-700 text-sm">{selectedPrayer.content}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Submitted By</p>
                                <p className="text-gray-700">
                                    {selectedPrayer.isAnonymous ? 'Anonymous' : selectedPrayer.user?.name || selectedPrayer.user?.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Date</p>
                                <p className="text-gray-700">{formatDate(selectedPrayer.createdAt)}</p>
                            </div>

                            <hr />

                            <div className="flex flex-wrap gap-2">
                                {!selectedPrayer.isApproved && (
                                    <button
                                        onClick={() => handleAction(selectedPrayer.id, 'approve')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleAction(selectedPrayer.id, 'reject')}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 text-white font-medium rounded-xl hover:bg-yellow-600"
                                >
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                                <button
                                    onClick={() => handleAction(selectedPrayer.id, 'delete')}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
