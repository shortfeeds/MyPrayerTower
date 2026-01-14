'use client';

import { useState, useEffect } from 'react';
import { getFinancialTransactions, type AdminTransaction } from '@/app/actions/admin/finance';
import { format } from 'date-fns';
import { Search, Filter, Download, ArrowLeft, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'MASS_OFFERING' | 'VIRTUAL_CANDLE' | 'DONATION'>('ALL');
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [filter, page]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getFinancialTransactions(page, 20, filter);
            setTransactions(data.transactions);
        } catch (error) {
            toast.error('Failed to load transactions');
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'FAILED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Financial Transactions</h1>
                    <p className="text-gray-500 mt-1">Live log of all purchases</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm"
                    >
                        <option value="ALL">All Transactions</option>
                        <option value="MASS_OFFERING">Mass Offerings</option>
                        <option value="VIRTUAL_CANDLE">Virtual Candles</option>
                        <option value="DONATION">Donations</option>
                    </select>
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
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date / ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading transactions...</td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No transactions found</td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{format(new Date(tx.date), 'MMM d, yyyy')}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-1">
                                            {tx.id.substring(0, 8)}...
                                            <button onClick={() => copyToClipboard(tx.id)} className="hover:text-gray-600">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{tx.userName}</div>
                                        <div className="text-xs text-gray-500">{tx.userEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                        {tx.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs font-medium text-gray-600">
                                            {tx.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                                        {formatCurrency(tx.amount, tx.currency)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                            {tx.status}
                                        </span>
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
                    onClick={() => setPage(p => p + 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
