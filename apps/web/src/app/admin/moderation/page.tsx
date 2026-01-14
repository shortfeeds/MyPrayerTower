'use client';

import { useState, useEffect } from 'react';
import { getAdminReports, resolveReport, type AdminReport } from '@/app/actions/admin/moderation';
import { format } from 'date-fns';
import { Shield, CheckCircle, XCircle, AlertTriangle, UserX, MessageSquare, Flag } from 'lucide-react';
import { toast } from 'sonner';

export default function ModerationPage() {
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'OPEN' | 'RESOLVED'>('OPEN');
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [filter, page]);

    const loadData = async () => {
        setLoading(true);
        try {
            const status = filter === 'OPEN' ? 'PENDING' : undefined;
            const data = await getAdminReports(page, 20, status as any); // If undefined, gets all? Logic in server action handles status filter
            // Actually server action expects explicit status or undefined for all. 
            // Let's adjust logic: 'OPEN' -> 'PENDING', 'RESOLVED' -> 'RESOLVED' (roughly)
            // For simplicity, let's just fetch PENDING for OPEN, and everything else for History
            setReports(data.reports);
        } catch (error) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'DISMISS' | 'RESOLVE' | 'WARN' | 'SUSPEND') => {
        try {
            await resolveReport(id, action);
            toast.success('Report updated');
            loadData();
        } catch (error) {
            toast.error('Failed to update report');
        }
    };

    const getReasonBadge = (reason: string) => {
        return (
            <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold uppercase">
                {reason.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Moderation Queue</h1>
                    <p className="text-gray-500 mt-1">Review reported content and user behavior</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilter('OPEN')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'OPEN' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Open Reports
                    </button>
                    <button
                        onClick={() => setFilter('RESOLVED')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'RESOLVED' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading reports...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                        <p className="text-gray-500">No open reports to review.</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                                            <Flag className="w-5 h-5 text-red-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {getReasonBadge(report.reason)}
                                            <span className="text-sm text-gray-500">• {format(new Date(report.createdAt), 'MMM d, h:mm a')}</span>
                                            <span className="text-sm text-gray-400">• by {report.reporterName}</span>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            Reported {report.targetType}: {report.targetId}
                                        </h3>
                                        {report.description && (
                                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm mb-3">
                                                "{report.description}"
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <AlertTriangle className="w-4 h-4" />
                                            Target: <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{report.targetId}</span>
                                        </div>
                                    </div>
                                </div>

                                {report.status === 'PENDING' && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAction(report.id, 'DISMISS')}
                                            className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                        <button
                                            onClick={() => handleAction(report.id, 'WARN')}
                                            className="px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                        >
                                            Warn User
                                        </button>
                                        <button
                                            onClick={() => handleAction(report.id, 'RESOLVE')}
                                            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            Resolve
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex items-center justify-between mt-8">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <div className="text-sm text-gray-500">Page {page}</div>
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
