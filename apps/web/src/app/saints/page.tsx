'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Search, ChevronRight, User, Loader2, Crown, X, Sparkles, Heart } from 'lucide-react';

interface SaintData {
    id: string;
    name: string;
    slug: string | null;
    title: string | null;
    feastMonth: number | null;
    feastDayOfMonth: number | null;
    feastDay: string | null;
    bornDate: string | null;
    diedDate: string | null;
    canonizationType: string | null;
    biography: string | null;
    shortBio: string | null;
    patronOf: string[] | null;
    imageUrl: string | null;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Ad Banner Component
function AdBanner({ position }: { position: 'top' | 'inline' }) {
    const styles = {
        top: 'w-full h-24 bg-gradient-to-r from-gray-100 to-gray-200',
        inline: 'w-full h-36 bg-gradient-to-r from-amber-50 to-orange-50',
    };

    return (
        <div className={`${styles[position]} rounded-2xl flex items-center justify-center border border-gray-200/50 relative overflow-hidden group hover:border-gray-300 transition-all`}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center relative z-10">
                <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500 font-medium">Sponsored</p>
                <Link href="/advertise" className="text-[10px] text-amber-600 hover:underline">Advertise here</Link>
            </div>
        </div>
    );
}

export default function SaintsPage() {
    const [saints, setSaints] = useState<SaintData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchSaints = async (reset = false) => {
        try {
            setLoading(true);
            const currentPage = reset ? 1 : page;
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '24',
                ...(searchQuery && { search: searchQuery }),
                ...(selectedMonth !== null && { month: (selectedMonth + 1).toString() })
            });

            const res = await fetch(`/api/saints?${params}`);
            const data = await res.json();

            if (reset) {
                setSaints(data.saints || []);
                setPage(2);
            } else {
                setSaints(prev => [...prev, ...(data.saints || [])]);
                setPage(prev => prev + 1);
            }

            setTotal(data.total || 0);
            setHasMore((data.saints?.length || 0) === 24);
        } catch (err) {
            console.error('Failed to fetch saints:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchSaints(true), 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedMonth]);

    const getFeastDate = (month: number | null, day: number | null) => {
        if (!month || !day) return null;
        return `${MONTHS[month - 1]} ${day}`;
    };

    const getCanonizationBadge = (type: string | null) => {
        if (!type) return null;
        const lower = type.toLowerCase();
        if (lower.includes('saint')) return { text: 'Saint', gradient: 'from-amber-500 to-yellow-500' };
        if (lower.includes('blessed')) return { text: 'Blessed', gradient: 'from-purple-500 to-violet-500' };
        if (lower.includes('venerable')) return { text: 'Venerable', gradient: 'from-blue-500 to-cyan-500' };
        return { text: type, gradient: 'from-gray-400 to-gray-500' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-400 rounded-full blur-3xl animate-pulse delay-700" />
                </div>

                <div className="relative z-10 pt-32 pb-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
                            <Crown className="w-4 h-4 text-yellow-200" />
                            <span>{total.toLocaleString()}+ Holy Men & Women</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                            Lives of the
                            <span className="block bg-gradient-to-r from-yellow-200 to-amber-100 bg-clip-text text-transparent">
                                Saints
                            </span>
                        </h1>
                        <p className="text-xl text-amber-100/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Explore the inspiring lives of saints, blesseds, and holy figures throughout Christian history.
                        </p>

                        {/* Glassmorphism Search */}
                        <div className="relative max-w-2xl mx-auto group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center">
                                <Search className="absolute left-6 w-6 h-6 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search saints by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-16 pr-12 py-5 bg-transparent text-gray-900 rounded-2xl placeholder-gray-400 focus:outline-none text-lg"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-5 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Month Filter */}
            <div className="bg-white/80 backdrop-blur-xl border-y border-gray-100 py-5 sticky top-16 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setSelectedMonth(null)}
                            className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${selectedMonth === null
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All Saints
                        </button>
                        {MONTHS.map((month, i) => (
                            <button
                                key={month}
                                onClick={() => setSelectedMonth(i)}
                                className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedMonth === i
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Ad Banner */}
            <div className="container mx-auto px-4 py-6">
                <AdBanner position="top" />
            </div>

            {/* Results */}
            <div className="container mx-auto px-4 pb-16">
                <div className="mb-8">
                    <h2 className="text-2xl font-serif font-bold text-gray-900">
                        {searchQuery ? `Results for "${searchQuery}"` : selectedMonth !== null ? `Saints of ${MONTHS[selectedMonth]}` : 'All Saints'}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {loading && saints.length === 0 ? 'Loading...' : `Showing ${saints.length} of ${total.toLocaleString()} saints`}
                    </p>
                </div>

                {loading && saints.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                        <p className="text-gray-500">Loading saints...</p>
                    </div>
                ) : saints.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Crown className="w-10 h-10 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Saints Found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                        <button onClick={() => { setSearchQuery(''); setSelectedMonth(null); }} className="text-amber-600 font-semibold hover:underline">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {saints.map((saint, index) => {
                            const badge = getCanonizationBadge(saint.canonizationType);
                            const feastDate = getFeastDate(saint.feastMonth, saint.feastDayOfMonth);

                            return (
                                <>
                                    <Link
                                        href={`/saints/${saint.slug || saint.id}`}
                                        key={saint.id}
                                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden flex items-center justify-center">
                                            {saint.imageUrl ? (
                                                <img src={saint.imageUrl} alt={saint.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <User className="w-16 h-16 text-amber-200" />
                                            )}

                                            {badge && (
                                                <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full text-white bg-gradient-to-r ${badge.gradient} shadow-lg`}>
                                                    {badge.text}
                                                </span>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <div className="p-5">
                                            <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors text-lg mb-1 line-clamp-1">
                                                {saint.name}
                                            </h3>
                                            {saint.title && (
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-1">{saint.title}</p>
                                            )}

                                            <div className="flex items-center justify-between text-sm mt-3">
                                                {feastDate ? (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Calendar className="w-4 h-4 text-amber-500" />
                                                        <span>{feastDate}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Feast day unlisted</span>
                                                )}

                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Inline Ad after every 8 saints */}
                                    {(index + 1) % 8 === 0 && index < saints.length - 1 && (
                                        <div key={`ad-${index}`} className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                                            <AdBanner position="inline" />
                                        </div>
                                    )}
                                </>
                            );
                        })}
                    </div>
                )}

                {/* Load More */}
                {!loading && hasMore && saints.length > 0 && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => fetchSaints(false)}
                            className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
                        >
                            Load More Saints
                        </button>
                    </div>
                )}

                {loading && saints.length > 0 && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
