'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Heart, Flame, Cross, Calendar, ChevronRight, Loader2, Sparkles, Gift, CheckCircle } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads';
import { OfferingDialog } from '@/components/memorials/OfferingDialog';

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
    const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null);

    const fetchMemorials = async (reset = false) => {
        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const res = await fetch(`/api/memorials?page=${currentPage}&limit=24&search=${encodeURIComponent(search)}`);

            if (!res.ok) {
                console.error('API returned error:', res.status);
                if (reset) setMemorials([]);
                setHasMore(false);
                return;
            }

            const data = await res.json();
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

    // Generate a consistent gradient based on memorial ID string
    const getPlaceholderGradient = (id: string) => {
        const colors = [
            'from-blue-100 to-indigo-100',
            'from-amber-100 to-orange-100',
            'from-rose-100 to-pink-100',
            'from-emerald-100 to-teal-100',
            'from-violet-100 to-purple-100',
            'from-slate-100 to-gray-200',
        ];
        // Simple hash to pick color
        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    // Separate premium and basic memorials
    const premiumMemorials = memorials.filter(m => m.tier === 'PREMIUM');
    const basicMemorials = memorials.filter(m => m.tier === 'BASIC');

    const MemorialCard = ({ memorial, isPremium = false }: { memorial: Memorial; isPremium?: boolean }) => {
        const placeholderGradient = getPlaceholderGradient(memorial.id);

        return (
            <div className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 relative ${isPremium
                ? 'shadow-xl hover:shadow-2xl hover:-translate-y-1 border-2 border-amber-200 ring-4 ring-amber-50/50'
                : 'shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200'
                }`}>
                {/* Premium Shine Effect */}
                {isPremium && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                )}

                {/* Photo */}
                <Link href={`/memorials/${memorial.slug}`} className="block relative overflow-hidden">
                    <div className={`${isPremium ? 'aspect-[4/3]' : 'aspect-[3/2]'} bg-gradient-to-br ${placeholderGradient} relative`}>
                        {memorial.photoUrl ? (
                            <Image
                                src={memorial.photoUrl}
                                alt={`${memorial.firstName} ${memorial.lastName}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-slate-500 transition-colors">
                                <Cross className={`w-12 h-12 mb-2 ${isPremium ? 'text-amber-300' : 'opacity-50'}`} />
                                <span className="text-xs font-medium uppercase tracking-widest opacity-60">Rest in Peace</span>
                            </div>
                        )}

                        {/* Premium Badge */}
                        {isPremium && (
                            <div className="absolute top-0 right-0 p-3">
                                <div className="bg-white/90 backdrop-blur-md text-amber-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-amber-100">
                                    <Sparkles className="w-3 h-3 fill-amber-600" />
                                    <span>FELLOWSHIP</span>
                                </div>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Info */}
                <div className={`${isPremium ? 'p-6' : 'p-5'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <Link href={`/memorials/${memorial.slug}`} className="flex-1">
                            <h3 className={`font-serif font-bold text-gray-900 leading-tight group-hover:text-amber-700 transition-colors ${isPremium ? 'text-2xl' : 'text-lg'
                                }`}>
                                {memorial.firstName} {memorial.lastName}
                            </h3>
                        </Link>
                        {memorial.isVerified && (
                            <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-50" title="Verified Memorial" />
                        )}
                    </div>

                    {(memorial.birthDate || memorial.deathDate) && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-medium">
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>
                                {formatDate(memorial.birthDate) || '?'} — {formatDate(memorial.deathDate) || '?'}
                            </span>
                        </div>
                    )}

                    {isPremium && memorial.shortBio && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-5 leading-relaxed">
                            {memorial.shortBio}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 py-3 border-t border-gray-50">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500" title="Candles Lit">
                            <Flame className={`w-3.5 h-3.5 ${isPremium ? 'text-amber-500' : 'text-gray-400'}`} />
                            {memorial.totalCandles}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500" title="Masses Offered">
                            <Cross className={`w-3.5 h-3.5 ${isPremium ? 'text-blue-500' : 'text-gray-400'}`} />
                            {memorial.totalMasses}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500" title="Tributes">
                            <Heart className={`w-3.5 h-3.5 ${isPremium ? 'text-rose-400' : 'text-gray-400'}`} />
                            {memorial.totalFlowers}
                        </div>
                    </div>

                    {/* Quick Tribute Button - Only primary on Premium, subtle on Basic */}
                    <div className="mt-4">
                        {isPremium ? (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedMemorial(memorial);
                                }}
                                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                <Gift className="w-4 h-4" />
                                Send Tribute
                            </button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedMemorial(memorial);
                                }}
                                className="w-full py-2 rounded-lg font-semibold text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                            >
                                Send Tribute
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
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

            {/* Memorials Content */}
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
                    <>
                        {/* Featured Memorials Section */}
                        {premiumMemorials.length > 0 && (
                            <section className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-gray-900">Featured Memorials</h2>
                                        <p className="text-sm text-gray-500">Premium tributes with enhanced visibility</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {premiumMemorials.map((memorial) => (
                                        <MemorialCard key={memorial.id} memorial={memorial} isPremium />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Basic Memorials Section */}
                        {basicMemorials.length > 0 && (
                            <section>
                                {premiumMemorials.length > 0 && (
                                    <h2 className="text-xl font-semibold text-gray-700 mb-6">All Memorials</h2>
                                )}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {basicMemorials.map((memorial) => (
                                        <MemorialCard key={memorial.id} memorial={memorial} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-amber-300">Premium Features</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold mb-4">
                            Honor Your Loved One Forever
                        </h2>
                        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                            Create a beautiful memorial page where family and friends can light candles,
                            request Masses, and share cherished memories. Premium memorials get featured placement.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/memorials/create"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Free Memorial
                            </Link>
                            <Link
                                href="/memorials/create?tier=premium"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-lg"
                            >
                                <Sparkles className="w-5 h-5 text-white" />
                                Create Featured — $49.99
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offering Dialog */}
            {selectedMemorial && (
                <OfferingDialog
                    memorial={selectedMemorial}
                    isOpen={!!selectedMemorial}
                    onClose={() => setSelectedMemorial(null)}
                />
            )}
        </div>
    );
}
