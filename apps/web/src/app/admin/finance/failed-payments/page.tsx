'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Filter, Download, ArrowLeft, ChevronLeft, ChevronRight, Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FailedPayment {
    id: string;
    userId: string | null;
    userEmail: string;
    amount: number;
    currency: string;
    paymentType: string;
    failureReason: string;
    metadata: any;
    stripeSessionId: string | null;
    createdAt: string;
    user?: {
        firstName: string | null;
        lastName: string | null;
    };
}

export default function FailedPaymentsPage() {
    const [payments, setPayments] = useState<FailedPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [page]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/failed-payments?page=${page}&limit=20`);
            if (res.ok) {
                const data = await res.json();
                setPayments(data.items || []);
            } else {
                toast.error('Failed to load failed payments from API.');
            }
        } catch (error) {
            toast.error('Failed to load failed payments');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount / 100);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Failed Payments</h1>
                    <p className="text-gray-500 mt-1">Review declined and failed PayPal transactions</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 section">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date / Tx ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading transactions...</td>
                            </tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No failed payments found</td>
                            </tr>
                        ) : (
                            payments.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{format(new Date(tx.createdAt), 'MMM d, yyyy HH:mm')}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-1">
                                            {(tx.stripeSessionId || tx.id).substring(0, 15)}...
                                            <button onClick={() => copyToClipboard(tx.stripeSessionId || tx.id)} className="hover:text-gray-600">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {tx.user ? `${tx.user.firstName || ''} ${tx.user.lastName || ''}`.trim() : 'Guest'}
                                        </div>
                                        <div className="text-xs text-gray-500">{tx.userEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-xs font-medium text-blue-700">
                                            {tx.paymentType.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-red-600 max-w-xs">
                                        <div className="flex items-start gap-1">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>{tx.failureReason}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                                        {formatCurrency(tx.amount, tx.currency)}
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
                    <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-sm text-gray-500">Page {page}</span>
                <button
                    disabled={payments.length < 20}
                    onClick={() => setPage(p => p + 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
