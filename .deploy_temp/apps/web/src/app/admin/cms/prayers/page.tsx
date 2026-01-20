'use client';

import { useState, useEffect } from 'react';
import { getAdminPrayerRequests, updatePrayerStatus, type AdminPrayerRequest } from '@/app/actions/admin/prayers';
import { format } from 'date-fns';
import { Search, Filter, CheckCircle, XCircle, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PrayersCMSPage() {
    const [prayers, setPrayers] = useState<AdminPrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('PENDING'); // Default to PENDING to show work queue
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    // Action State
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [statusFilter, page, searchQuery]); // In real app, debounce search

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAdminPrayerRequests(page, 20, statusFilter === 'ALL' ? undefined : statusFilter as any, searchQuery);
            setPrayers(data.prayers);
        } catch (error) {
            toast.error('Failed to load prayer requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
        setProcessingId(id);
        try {
            await updatePrayerStatus(id, newStatus);
            toast.success(`Prayer ${newStatus.toLowerCase()}`);
            // Optimistic update or reload
            loadData();
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
            ARCHIVED: 'bg-gray-100 text-gray-800',
            ON_HOLD: 'bg-orange-100 text-orange-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Prayer Requests CMS</h1>
                    <p className="text-gray-500 mt-1">Review and manage user prayer submissions</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search content or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {status === 'ALL' ? 'All Requests' : status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Prayer Details</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Author</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td>
                            </tr>
                        ) : prayers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No prayer requests found</td>
                            </tr>
                        ) : (
                            prayers.map((prayer) => (
                                <tr key={prayer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 max-w-md">
                                        <div className="font-medium text-gray-900 mb-1">{prayer.title || 'Untitled Prayer'}</div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{prayer.content}</p>
                                        <div className="text-xs text-gray-400 mt-2">
                                            {format(new Date(prayer.createdAt), 'MMM d, yyyy • h:mm a')} • {prayer.visibility}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium text-gray-900">{prayer.userName}</div>
                                        <div className="text-gray-500">{prayer.userEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {prayer.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(prayer.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {prayer.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(prayer.id, 'APPROVED')}
                                                        disabled={processingId === prayer.id}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Approve"
                                                    >
                                                        {processingId === prayer.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(prayer.id, 'REJECTED')}
                                                        disabled={processingId === prayer.id}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        {processingId === prayer.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                                                    </button>
                                                </>
                                            )}
                                            {prayer.status !== 'PENDING' && (
                                                <button
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-500">Page {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
