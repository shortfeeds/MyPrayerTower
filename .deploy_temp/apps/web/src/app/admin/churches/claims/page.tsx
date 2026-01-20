'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Church,
    CheckCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Eye,
    Check,
    X
} from 'lucide-react';

interface Claim {
    id: string;
    churchName: string;
    churchId: string;
    claimerName: string;
    claimerEmail: string;
    status: string;
    createdAt: string;
}

export default function AdminChurchClaimsPage() {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchClaims();
    }, [page]);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/claims?page=${page}&limit=${limit}&status=PENDING`);
            const data = await res.json();
            setClaims(data.claims || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch claims:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (claimId: string, action: 'approve' | 'reject') => {
        try {
            await fetch(`/api/admin/claims/${claimId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            fetchClaims();
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Pending Church Claims</h1>
                <p className="text-gray-500 mt-1">{total} claims awaiting review</p>
            </div>

            {/* Claims List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : claims.length === 0 ? (
                    <div className="text-center py-20">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No pending claims</p>
                        <p className="text-gray-500 text-sm">All church claims have been processed</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {claims.map(claim => (
                            <div key={claim.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                            <Church className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{claim.churchName}</h3>
                                            <p className="text-sm text-gray-500">
                                                Claimed by: {claim.claimerName} ({claim.claimerEmail})
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-400">
                                                    {new Date(claim.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAction(claim.id, 'approve')}
                                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                                            title="Approve"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(claim.id, 'reject')}
                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                            title="Reject"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {total > limit && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Page {page} of {totalPages}
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
                )}
            </div>
        </div>
    );
}
