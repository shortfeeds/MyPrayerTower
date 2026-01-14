'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Search, Filter, Play, Clock, ChevronRight, Sparkles, Flame, Heart, Scroll, AlertCircle } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { PrayerSearch } from '@/components/features/PrayerSearch';
import { PrayerCategorySidebar } from '@/components/prayers/PrayerCategorySidebar';

interface Prayer {
    id: string;
    title: string;
    content: string;
    slug: string;
    category?: {
        name: string;
        slug: string;
    };
    readingTime?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
    'marian': { bg: 'bg-blue-100', text: 'text-blue-700', accent: 'bg-blue-500' },
    'saints': { bg: 'bg-purple-100', text: 'text-purple-700', accent: 'bg-purple-500' },
    'novenas': { bg: 'bg-amber-100', text: 'text-amber-700', accent: 'bg-amber-500' },
    'healing': { bg: 'bg-emerald-100', text: 'text-emerald-700', accent: 'bg-emerald-500' },
    'litanies': { bg: 'bg-rose-100', text: 'text-rose-700', accent: 'bg-rose-500' },
    'default': { bg: 'bg-gray-100', text: 'text-gray-700', accent: 'bg-gray-500' },
};

function PrayerList() {
    const searchParams = useSearchParams();
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const duration = searchParams.get('duration') || '';

    useEffect(() => {
        const fetchPrayers = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (query) params.set('q', query);
                if (category) params.set('category', category);
                if (duration) params.set('duration', duration);

                const res = await fetch(`/api/prayers?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to load prayers');

                const data = await res.json();
                setPrayers(data.prayers);
                setTotal(data.pagination.total);
            } catch (err) {
                console.error(err);
                setError('Unable to load prayers at this time.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrayers();
    }, [query, category, duration]);

    const getCategoryStyle = (slug: string = 'default') => {
        const key = slug.toLowerCase();
        return CATEGORY_COLORS[key] || CATEGORY_COLORS['default'];
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-full mb-4" />
                        <div className="flex gap-2">
                            <div className="h-6 w-20 bg-gray-100 rounded-full" />
                            <div className="h-6 w-20 bg-gray-100 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-red-50 rounded-xl p-8">
                <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-red-700">Unable to load prayers</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (prayers.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No prayers found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    We couldn't find any prayers matching your search. Try adjusting your filters or search terms.
                </p>
                <Link href="/prayers" className="text-amber-600 font-semibold hover:text-amber-700 flex items-center justify-center gap-2">
                    Clear all filters
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-500 px-1">
                <span>Showing {prayers.length} of {total} prayers</span>
                {category && (
                    <span className="font-medium text-amber-600">
                        In {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prayers.map(prayer => {
                    const style = getCategoryStyle(prayer.category?.slug);
                    return (
                        <Link
                            key={prayer.id}
                            href={`/prayers/${prayer.slug}`}
                            className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${style.bg} group-hover:scale-110 transition-transform duration-300`}>
                                    <BookOpen className={`w-6 h-6 ${style.text}`} />
                                </div>
                                {prayer.category && (
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                                        {prayer.category.name}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                                {prayer.title}
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1 font-serif">
                                {prayer.content.replace(/<[^>]*>?/gm, '')}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs text-gray-400">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    {prayer.readingTime || '1 min read'}
                                </span>
                                <span className="flex items-center gap-1 text-amber-600 font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    Read Prayer <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Pagination Placeholder - API supports it, can add button later */}
            {prayers.length < total && (
                <div className="flex justify-center pt-8">
                    <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                        Load More Prayers
                    </button>
                </div>
            )}
        </div>
    );
}

export default function PrayersPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-white/50">
            {/* Hero Section */}
            <div className="relative bg-white border-b border-gray-200 pt-16 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-transparent" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            Catholic Treasury
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                            Library of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Sacred Prayers</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Explore our comprehensive collection of traditional Catholic prayers, litanies, and novenas to deepen your spiritual life.
                        </p>

                        <div className="pt-6 max-w-xl mx-auto">
                            <Suspense>
                                <PrayerSearch />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <SmartAdSlot page="prayers" position="top" />

                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 shrink-0 space-y-8">
                        <PrayerCategorySidebar />
                        <div className="hidden lg:block sticky top-24">
                            <SmartAdSlot page="prayers" position="sidebar" />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <Suspense fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        }>
                            <PrayerList />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}
