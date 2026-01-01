'use client';

import { useState, useEffect } from 'react';
import {
    Activity,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
    Database,
    User,
    Settings
} from 'lucide-react';

interface AuditLog {
    id: string;
    source: string;
    type: string;
    status: string;
    startedAt: string;
    completedAt: string | null;
    recordsProcessed: number;
    recordsCreated: number;
    recordsUpdated: number;
    recordsFailed: number;
    errorMessage: string | null;
    triggeredBy: string | null;
}

export default function AdminAuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [typeFilter, setTypeFilter] = useState('');
    const limit = 20;

    useEffect(() => {
        fetchLogs();
    }, [page, typeFilter]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(typeFilter && { type: typeFilter })
            });

            const res = await fetch(`/api/admin/audit?${params}`);
            const data = await res.json();
            setLogs(data.logs || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'FAILED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'RUNNING':
                return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'admin':
                return <User className="w-4 h-4" />;
            case 'sync':
                return <Database className="w-4 h-4" />;
            case 'system':
                return <Settings className="w-4 h-4" />;
            default:
                return <Activity className="w-4 h-4" />;
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
                    <p className="text-gray-500 mt-1">Track system activities and admin actions</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="">All Types</option>
                        <option value="action">Actions</option>
                        <option value="sync">Sync Operations</option>
                        <option value="import">Imports</option>
                        <option value="export">Exports</option>
                    </select>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Time</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Source</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Records</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Triggered By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading logs...</p>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                                        No audit logs found
                                    </td>
                                </tr>
                            ) : logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {formatDate(log.startedAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            {getSourceIcon(log.source)}
                                            {log.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-900">{log.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${log.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                log.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {getStatusIcon(log.status)}
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {log.recordsProcessed > 0 && (
                                            <span>{log.recordsProcessed} processed</span>
                                        )}
                                        {log.recordsFailed > 0 && (
                                            <span className="text-red-500 ml-2">({log.recordsFailed} failed)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {log.triggeredBy || 'System'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} logs
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
