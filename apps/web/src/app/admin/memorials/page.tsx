'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Crown, // Use Crown instead of Star for premium look
    Loader2,
    Image as ImageIcon,
    Calendar,
    X,
    Save,
    ExternalLink,
    MoreVertical,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface Memorial {
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    deathDate: string | null;
    photoUrl: string | null;
    isPremium: boolean;
    isActive: boolean;
    totalOfferings: number;
    userName: string;
}

export default function AdminMemorialsPage() {
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const limit = 20;

    useEffect(() => {
        fetchMemorials();
    }, [page]);

    const fetchMemorials = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/memorials?page=${page}&limit=${limit}`);
            const data = await res.json();
            setMemorials(data.memorials || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch memorials:', err);
            toast.error('Failed to load memorials');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this memorial? This action cannot be undone.')) return;

        try {
            await fetch(`/api/admin/memorials/${id}`, { method: 'DELETE' });
            toast.success('Memorial deleted');
            fetchMemorials();
        } catch (err) {
            toast.error('Failed to delete memorial');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean, type: 'active' | 'premium') => {
        try {
            const body = type === 'active'
                ? { isActive: !currentStatus }
                : { isPremium: !currentStatus };

            await fetch(`/api/admin/memorials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            fetchMemorials();
            toast.success('Memorial updated');
        } catch (err) {
            toast.error('Update failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Memorials</h1>
                    <p className="text-gray-500 mt-1">Manage tributes and obituaries</p>
                </div>
                <Link
                    href="/admin/memorials/create"
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Create Memorial
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Memorial</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Dates</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Offerings</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : memorials.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                                        No memorials found
                                    </td>
                                </tr>
                            ) : memorials.map(memorial => (
                                <tr key={memorial.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {memorial.photoUrl ? (
                                                <img
                                                    src={memorial.photoUrl}
                                                    alt={memorial.firstName}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {memorial.firstName} {memorial.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">By: {memorial.userName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-semibold w-8">Born:</span>
                                                {memorial.birthDate ? new Date(memorial.birthDate).toLocaleDateString() : '-'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-semibold w-8">Died:</span>
                                                {memorial.deathDate ? new Date(memorial.deathDate).toLocaleDateString() : '-'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(memorial.id, memorial.isPremium, 'premium')}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${memorial.isPremium
                                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Crown className="w-3 h-3" />
                                            {memorial.isPremium ? 'Premium' : 'Free'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(memorial.id, memorial.isActive, 'active')}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${memorial.isActive
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {memorial.isActive ? (
                                                <><CheckCircle className="w-3 h-3" /> Public</>
                                            ) : (
                                                <><XCircle className="w-3 h-3" /> Hidden</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {memorial.totalOfferings} tributes
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/memorials/${memorial.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/memorials/${memorial.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(memorial.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            </div>
        </div>
    );
}
