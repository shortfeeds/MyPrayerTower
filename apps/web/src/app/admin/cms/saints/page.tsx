'use client';

import { useState, useEffect } from 'react';
import { getAdminSaints, deleteSaint, type AdminSaint } from '@/app/actions/admin/saints';
import { Search, Plus, Trash2, Edit, Calendar, Crown } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function SaintsCMSPage() {
    const [saints, setSaints] = useState<AdminSaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [page, searchQuery]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAdminSaints(page, 20, searchQuery);
            setSaints(data.saints);
        } catch (error) {
            toast.error('Failed to load saints');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this Saint?')) return;
        try {
            await deleteSaint(id);
            toast.success('Saint deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete saint');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Saints CMS</h1>
                    <p className="text-gray-500 mt-1">Manage the library of Saints</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add New Saint
                </button>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search saints by name or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading saints...</div>
            ) : saints.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No saints found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {saints.map((saint) => (
                        <div key={saint.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-48 w-full bg-gray-100 relative">
                                {saint.imageUrl ? (
                                    <Image
                                        src={saint.imageUrl}
                                        alt={saint.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                        <Crown className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(saint.id)}
                                        className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-blue-50"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 line-clamp-1">{saint.name}</h3>
                                <p className="text-sm text-gray-500 mb-3">{saint.title || 'Saint'}</p>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                    <Calendar className="w-3 h-3" />
                                    <span>Feast: {saint.feastDay || 'Unknown'}</span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {saint.patronOf.slice(0, 3).map((patron, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-medium">
                                            {patron}
                                        </span>
                                    ))}
                                    {saint.patronOf.length > 3 && (
                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[10px]">
                                            +{saint.patronOf.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between mt-8">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 disabled:opacity-50"
                >
                    Previous
                </button>
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
