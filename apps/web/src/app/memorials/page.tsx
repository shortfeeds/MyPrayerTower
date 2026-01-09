'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Heart, Flame, Cross, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads';

interface Memorial {
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    deathDate: string | null;
    shortBio: string | null;
    photoUrl: string | null;
    tier: 'BASIC' | 'PREMIUM';
    isVerified: boolean;
    totalCandles: number;
    totalMasses: number;
    totalFlowers: number;
}

export default function MemorialsPage() {
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMemorials = async (reset = false) => {
        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const res = await fetch(`/api/memorials?page=${currentPage}&limit=12&search=${encodeURIComponent(search)}`);

            if (!res.ok) {
                console.error('API returned error:', res.status);
                if (reset) setMemorials([]);
                setHasMore(false);
                return;
            }

            const data = await res.json();

            // Handle case where data or memorials is undefined
            const memorialsData = data?.memorials || [];
            const paginationData = data?.pagination || { totalPages: 0 };

            if (reset) {
                setMemorials(memorialsData);
            } else {
                setMemorials(prev => [...prev, ...memorialsData]);
            }
            setHasMore(currentPage < (paginationData.totalPages || 0));
            if (reset) setPage(1);
        } catch (error) {
            console.error('Error fetching memorials:', error);
            if (reset) setMemorials([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemorials(true);
    }, [search]);

    const loadMore = () => {
        setPage(p => p + 1);
        fetchMemorials();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).getFullYear();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                            <Heart className="w-4 h-4 text-rose-400" />
                            <span className="text-sm font-medium text-white/90">Eternal Memorials</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Remember Those We Love
                        </h1>
                        <p className="text-lg text-slate-300 mb-8">
                            Create beautiful, lasting tributes for loved ones who have passed. Light candles, request Masses, and share memories.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/memorials/create"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Create a Memorial
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Bar */}
            <div className="container mx-auto px-4 -mt-6 relative z-20">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search memorials by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-6">
                <SmartAdSlot page="memorials" position="top" />
            </div>

            {/* Memorials Grid */}
            <div className="container mx-auto px-4 py-8">
                {loading && memorials.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                ) : memorials.length === 0 ? (
                    <div className="text-center py-20">
                        <Cross className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Memorials Found</h3>
                        <p className="text-gray-500 mb-6">Be the first to create a memorial for your loved one.</p>
                        <Link
                            href="/memorials/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl"
                        >
                            <Plus className="w-4 h-4" />
                            Create Memorial
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memorials.map((memorial) => (
                            <Link
                                key={memorial.id}
                                href={`/memorials/${memorial.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Photo */}
                                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                                    {memorial.photoUrl ? (
                                        <img
                                            src={memorial.photoUrl}
                                            alt={`${memorial.firstName} ${memorial.lastName}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Cross className="w-16 h-16 text-slate-300" />
                                        </div>
                                    )}
                                    {memorial.tier === 'PREMIUM' && (
                                        <div className="absolute top-3 right-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                                        {memorial.firstName} {memorial.lastName}
                                    </h3>

                                    {(memorial.birthDate || memorial.deathDate) && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {formatDate(memorial.birthDate) || '?'} — {formatDate(memorial.deathDate) || '?'}
                                            </span>
                                        </div>
                                    )}

                                    {memorial.shortBio && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {memorial.shortBio}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Flame className="w-4 h-4 text-amber-500" />
                                            {memorial.totalCandles}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Cross className="w-4 h-4 text-blue-500" />
                                            {memorial.totalMasses}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            🌹 {memorial.totalFlowers}
                                        </span>
                                        <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {hasMore && memorials.length > 0 && (
                    <div className="text-center mt-10">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Load More
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Ad */}
            <div className="container mx-auto px-4 py-6">
                <SmartAdSlot page="memorials" position="inline" />
            </div>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px]" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif font-bold mb-4">
                            Honor Your Loved One Forever
                        </h2>
                        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                            Create a beautiful memorial page where family and friends can light candles,
                            request Masses, and share cherished memories.
                        </p>
                        <Link
                            href="/memorials/create"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Create a Memorial — Starting at $20
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
