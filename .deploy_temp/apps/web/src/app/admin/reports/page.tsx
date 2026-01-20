'use client';

import { useState, useEffect } from 'react';
import {
    Search,
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
    AlertTriangle,
    Shield,
    MessageSquare
} from 'lucide-react';

interface Report {
    id: string;
    type: string;
    reason: string;
    description: string | null;
    status: string;
    createdAt: string;
    reporter: {
        id: string;
        name: string | null;
        email: string;
    } | null;
    targetType: string;
    targetId: string;
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const limit = 20;

    useEffect(() => {
        fetchReports();
    }, [page, statusFilter]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                status: statusFilter
            });

            const res = await fetch(`/api/admin/reports?${params}`);
            const data = await res.json();
            setReports(data.reports || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (reportId: string, action: 'resolve' | 'dismiss' | 'delete') => {
        try {
            await fetch(`/api/admin/reports/${reportId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            fetchReports();
            if (selectedReport?.id === reportId) setSelectedReport(null);
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

    const getReasonColor = (reason: string) => {
        switch (reason.toLowerCase()) {
            case 'spam': return 'bg-yellow-100 text-yellow-700';
            case 'harassment': return 'bg-red-100 text-red-700';
            case 'inappropriate': return 'bg-orange-100 text-orange-700';
            case 'misinformation': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Reports</h1>
                    <p className="text-gray-500 mt-1">Review and resolve reported content</p>
                </div>
            </div>

            {/* Alert */}
            {statusFilter === 'PENDING' && total > 0 && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <div className="flex-1">
                        <p className="font-medium text-red-800">{total} Pending Reports</p>
                        <p className="text-sm text-red-600">These reports require immediate attention</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex gap-2">
                    {['PENDING', 'RESOLVED', 'DISMISSED'].map(status => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setPage(1); }}
                            className={`px-4 py-2 rounded-xl font-medium transition-colors ${statusFilter === status
                                    ? status === 'PENDING' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-6">
                {/* Reports List */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                            <p className="text-gray-500 mt-2">Loading reports...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">{statusFilter === 'PENDING' ? 'No pending reports' : 'No reports found'}</p>
                            <p className="text-sm">Great job keeping the community safe!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {reports.map(report => (
                                <div
                                    key={report.id}
                                    onClick={() => setSelectedReport(report)}
                                    className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors ${selectedReport?.id === report.id ? 'bg-red-50' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Flag className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getReasonColor(report.reason)}`}>
                                                    {report.reason}
                                                </span>
                                                <span className="text-xs text-gray-400">{report.targetType}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 line-clamp-2">{report.description || 'No description provided'}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {report.reporter?.name || report.reporter?.email || 'Anonymous'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {formatDate(report.createdAt)}
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
                {selectedReport && (
                    <div className="w-96 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Report Details</h3>
                            <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Reason</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getReasonColor(selectedReport.reason)}`}>
                                    {selectedReport.reason}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Description</p>
                                <p className="text-gray-700 text-sm">{selectedReport.description || 'No description provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Reported By</p>
                                <p className="text-gray-700">
                                    {selectedReport.reporter?.name || selectedReport.reporter?.email || 'Anonymous'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Target</p>
                                <p className="text-gray-700">{selectedReport.targetType}: {selectedReport.targetId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Date</p>
                                <p className="text-gray-700">{formatDate(selectedReport.createdAt)}</p>
                            </div>

                            <hr />

                            {selectedReport.status === 'PENDING' && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleAction(selectedReport.id, 'resolve')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Resolve
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedReport.id, 'dismiss')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-500 text-white font-medium rounded-xl hover:bg-gray-600"
                                    >
                                        <XCircle className="w-4 h-4" /> Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
