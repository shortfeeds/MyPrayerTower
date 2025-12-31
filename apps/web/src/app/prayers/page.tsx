
import { PrismaClient } from '@mpt/database';
import { Metadata } from 'next';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight, Filter, Sparkles, Heart, Clock, Play } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads';

const prisma = new PrismaClient();

// Estimate reading time based on content length
function getReadingTime(content: string): string {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 150); // ~150 words per minute for prayers
    return minutes <= 1 ? '1 min' : `${minutes} min`;
}

export const metadata: Metadata = {
    title: 'Catholic Prayers Library | MyPrayerTower',
    description: 'A comprehensive collection of Catholic prayers for all occasions.',
};

// Premium gradient colors for categories
const CATEGORY_GRADIENTS = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
];

// Using SmartAdSlot from components/ads

export default async function PrayersPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string };
}) {
    const query = searchParams.q;
    const categoryFilter = searchParams.category;

    const where: any = {
        is_active: true,
    };

    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
        ];
    }

    if (categoryFilter) {
        where.category = categoryFilter;
    }

    const prayers = await prisma.prayer.findMany({
        where,
        orderBy: { title: 'asc' },
        take: 100,
    });

    const allPrayers = await prisma.prayer.findMany({
        where: { is_active: true },
        select: { category: true, category_label: true },
    });

    const categoryMap = new Map<string, { label: string; count: number }>();
    allPrayers.forEach(p => {
        const existing = categoryMap.get(p.category);
        if (existing) {
            existing.count++;
        } else {
            categoryMap.set(p.category, { label: p.category_label, count: 1 });
        }
    });

    const categories = Array.from(categoryMap.entries())
        .map(([slug, data]) => ({ slug, label: data.label, count: data.count }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const totalPrayers = allPrayers.length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 pt-28 pb-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
                            <Heart className="w-4 h-4 text-rose-300" />
                            <span>{totalPrayers.toLocaleString()} Prayers Available</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                            Catholic Prayer
                            <span className="block bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
                                Library
                            </span>
                        </h1>
                        <p className="text-xl text-blue-100/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Discover thousands of traditional and contemporary prayers for every moment of your spiritual journey.
                        </p>

                        {/* Glassmorphism Search */}
                        <form className="max-w-2xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                <input
                                    name="q"
                                    defaultValue={query}
                                    placeholder="Search for prayers..."
                                    className="w-full pl-16 pr-6 py-5 bg-transparent text-gray-900 rounded-2xl placeholder-gray-400 focus:outline-none text-lg"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Top Ad Banner */}
            <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
                <SmartAdSlot page="prayers" position="top" />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="lg:w-72 flex-shrink-0">
                    <div className="sticky top-28 space-y-6">
                        {/* Categories */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center gap-2 font-bold text-gray-800">
                                    <Filter className="w-5 h-5 text-blue-600" />
                                    <span>Categories</span>
                                </div>
                            </div>
                            <div className="p-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <Link
                                    href="/prayers"
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${!categoryFilter
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>All Prayers</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${!categoryFilter ? 'bg-white/20' : 'bg-gray-100'}`}>
                                        {totalPrayers}
                                    </span>
                                </Link>
                                <div className="mt-2 space-y-1">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/prayers?category=${cat.slug}`}
                                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${categoryFilter === cat.slug
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="truncate">{cat.label}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${categoryFilter === cat.slug ? 'bg-white/20' : 'bg-gray-100'}`}>
                                                {cat.count}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Ad */}
                        <SmartAdSlot page="prayers" position="sidebar" />
                    </div>
                </aside>

                {/* Prayer Grid */}
                <main className="flex-1">
                    {categoryFilter && (
                        <div className="mb-8">
                            <h2 className="text-3xl font-serif font-bold text-gray-900">
                                {categories.find(c => c.slug === categoryFilter)?.label || 'Category'}
                            </h2>
                            <p className="text-gray-500 mt-1">{prayers.length} prayers found</p>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {prayers.length > 0 ? (
                            prayers.map((prayer, i) => (
                                <>
                                    <Link
                                        key={prayer.id.toString()}
                                        href={`/prayers/${prayer.id}`}
                                        className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Gradient accent */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length]} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-3 mb-4">
                                                <span className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 bg-gradient-to-r ${CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length]} text-white rounded-full shadow-sm`}>
                                                    <BookOpen className="w-3 h-3 mr-1.5" />
                                                    {prayer.category_label}
                                                </span>
                                                <span className="inline-flex items-center text-xs text-gray-400 font-medium">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {getReadingTime(prayer.content)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                                {prayer.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                                                {prayer.content}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all">
                                                    <span>Read Prayer</span>
                                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                                    <Play className="w-4 h-4 text-blue-600 group-hover:text-white ml-0.5 transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Inline Ad after every 8 prayers */}
                                    {(i + 1) % 8 === 0 && i < prayers.length - 1 && (
                                        <div key={`ad-${i}`} className="sm:col-span-2 xl:col-span-3">
                                            <SmartAdSlot page="prayers" position="inline" />
                                        </div>
                                    )}
                                </>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No prayers found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your search or category filter.</p>
                                <Link
                                    href="/prayers"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                                >
                                    Clear filters
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
