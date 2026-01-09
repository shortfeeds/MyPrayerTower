'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Search, ChevronRight, Loader2, Crown, X, Star } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads';

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
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                limit: '30',
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
            setHasMore((data.saints?.length || 0) === 30);
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
        return `${MONTHS_SHORT[month - 1]} ${day}`;
    };

    const getCanonizationStyle = (type: string | null) => {
        if (!type) return { text: '', bg: 'bg-gray-100', color: 'text-gray-600' };
        const lower = type.toLowerCase();
        if (lower.includes('saint')) return { text: 'Saint', bg: 'bg-amber-100', color: 'text-amber-700' };
        if (lower.includes('blessed')) return { text: 'Blessed', bg: 'bg-purple-100', color: 'text-purple-700' };
        if (lower.includes('venerable')) return { text: 'Venerable', bg: 'bg-blue-100', color: 'text-blue-700' };
        return { text: type, bg: 'bg-gray-100', color: 'text-gray-600' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
            {/* Compact Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl" />
                    <div className="absolute bottom-5 right-10 w-56 h-56 bg-rose-400 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 pt-24 pb-12 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-4 border border-white/20">
                            <Crown className="w-4 h-4 text-yellow-200" />
                            <span>{total.toLocaleString()}+ Saints</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
                            Lives of the Saints
                        </h1>

                        {/* Compact Search */}
                        <div className="relative max-w-xl mx-auto group">
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-xl shadow-xl flex items-center">
                                <Search className="absolute left-5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search saints..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-10 py-4 bg-transparent text-gray-900 rounded-xl placeholder-gray-400 focus:outline-none text-base"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-4 p-1.5 hover:bg-gray-100 rounded-full">
                                        <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Month Filter - Compact Scrollable Pills */}
            <div className="bg-white border-b border-gray-100 py-3 sticky top-16 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setSelectedMonth(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedMonth === null
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        {MONTHS_SHORT.map((month, i) => (
                            <button
                                key={month}
                                onClick={() => setSelectedMonth(i)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedMonth === i
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-4">
                <SmartAdSlot page="saints" position="top" />
            </div>

            {/* Compact List Layout */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {searchQuery ? `Results for "${searchQuery}"` : selectedMonth !== null ? MONTHS[selectedMonth] : 'All Saints'}
                            </h2>
                            <span className="text-sm text-gray-500">
                                {loading && saints.length === 0 ? 'Loading...' : `${saints.length} of ${total.toLocaleString()}`}
                            </span>
                        </div>

                        {loading && saints.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
                                <p className="text-gray-500 text-sm">Loading saints...</p>
                            </div>
                        ) : saints.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <Crown className="w-12 h-12 text-amber-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saints Found</h3>
                                <button onClick={() => { setSearchQuery(''); setSelectedMonth(null); }} className="text-amber-600 text-sm font-medium hover:underline">
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                                {saints.map((saint, index) => {
                                    const canonization = getCanonizationStyle(saint.canonizationType);
                                    const feastDate = getFeastDate(saint.feastMonth, saint.feastDayOfMonth);

                                    return (
                                        <>
                                            <Link
                                                href={`/saints/${saint.slug || saint.id}`}
                                                key={saint.id}
                                                className="flex items-center gap-4 px-4 py-3 hover:bg-amber-50/50 transition-colors group"
                                            >
                                                {/* Icon */}
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                                    <Star className="w-5 h-5 text-white" />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
                                                            {saint.name}
                                                        </h3>
                                                        {canonization.text && (
                                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${canonization.bg} ${canonization.color}`}>
                                                                {canonization.text}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {saint.title && (
                                                        <p className="text-sm text-gray-500 truncate">{saint.title}</p>
                                                    )}
                                                </div>

                                                {/* Feast Date */}
                                                {feastDate && (
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-shrink-0">
                                                        <Calendar className="w-4 h-4 text-amber-500" />
                                                        <span>{feastDate}</span>
                                                    </div>
                                                )}

                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 flex-shrink-0 transition-colors" />
                                            </Link>

                                            {/* Inline Ad every 10 items */}
                                            {(index + 1) % 10 === 0 && index < saints.length - 1 && (
                                                <div key={`ad-${index}`} className="px-4 py-3 bg-gray-50">
                                                    <SmartAdSlot page="saints" position="inline" />
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        )}

                        {/* Load More */}
                        {!loading && hasMore && saints.length > 0 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => fetchSaints(false)}
                                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg transition-all"
                                >
                                    Load More
                                </button>
                            </div>
                        )}

                        {loading && saints.length > 0 && (
                            <div className="flex justify-center py-6">
                                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Sidebar Ad */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-28">
                            <SmartAdSlot page="saints" position="sidebar" />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
