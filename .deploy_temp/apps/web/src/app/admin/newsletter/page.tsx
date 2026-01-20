'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Users, Mail, Search, Download, Trash2, ToggleLeft, ToggleRight,
    RefreshCw, ChevronLeft, ChevronRight, Check, X, Loader2
} from 'lucide-react';

interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    isActive: boolean;
    subscribedAt: string;
    unsubscribedAt: string | null;
    source: string | null;
}

interface Stats {
    total: number;
    active: number;
    inactive: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function NewsletterManagement() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0 });
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const fetchSubscribers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                status: statusFilter,
            });
            if (search) params.set('search', search);

            const res = await fetch(`/api/admin/newsletter?${params}`);
            const data = await res.json();

            setSubscribers(data.subscribers || []);
            setStats(data.stats || { total: 0, active: 0, inactive: 0 });
            setPagination(data.pagination || pagination);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, statusFilter, search]);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await fetch('/api/admin/newsletter', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });
            fetchSubscribers();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;
        try {
            await fetch('/api/admin/newsletter', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            fetchSubscribers();
        } catch (error) {
            console.error('Error deleting subscriber:', error);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Email', 'Name', 'Status', 'Subscribed At', 'Source'];
        const rows = subscribers.map(s => [
            s.email,
            s.name || '',
            s.isActive ? 'Active' : 'Inactive',
            new Date(s.subscribedAt).toLocaleDateString(),
            s.source || 'footer'
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === subscribers.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(subscribers.map(s => s.id)));
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Mail className="w-8 h-8 text-indigo-600" />
                    Newsletter Subscribers
                </h1>
                <p className="text-gray-600 mt-2">Manage your newsletter subscriber list</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Subscribers</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Users className="w-12 h-12 text-indigo-100" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active</p>
                            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <Check className="w-12 h-12 text-green-100" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Unsubscribed</p>
                            <p className="text-3xl font-bold text-gray-400">{stats.inactive}</p>
                        </div>
                        <X className="w-12 h-12 text-gray-100" />
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email or name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button
                        onClick={() => fetchSubscribers()}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Refresh"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : subscribers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No subscribers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size === subscribers.length}
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subscribed</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {subscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(subscriber.id)}
                                                onChange={(e) => {
                                                    const newSet = new Set(selectedIds);
                                                    if (e.target.checked) {
                                                        newSet.add(subscriber.id);
                                                    } else {
                                                        newSet.delete(subscriber.id);
                                                    }
                                                    setSelectedIds(newSet);
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{subscriber.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{subscriber.name || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriber.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {subscriber.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                                            {subscriber.source || 'footer'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(subscriber.id, subscriber.isActive)}
                                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                                    title={subscriber.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {subscriber.isActive ? (
                                                        <ToggleRight className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <ToggleLeft className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subscriber.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
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
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                disabled={pagination.page === pagination.totalPages}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
