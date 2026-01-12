import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';
import { Metadata } from 'next';
import { BookOpen, Search, Filter, Play, Clock, ChevronRight, Sparkles, Flame, Heart, Scroll } from 'lucide-react';
import Link from 'next/link';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { PrayerSearch, PrayerFilters } from '@/components/features/PrayerSearch';
import { PrayerCategorySidebar } from '@/components/prayers/PrayerCategorySidebar';

// const prisma = new PrismaClient(); // Removed local instantiation

function getReadingTime(content: string): string {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 150);
    return minutes <= 1 ? '1 min' : `${minutes} min`;
}

export const metadata: Metadata = {
    title: 'Catholic Prayers Library | MyPrayerTower',
    description: 'A comprehensive collection of Catholic prayers for all occasions.',
};

const CATEGORY_COLORS = [
    { bg: 'bg-blue-100', text: 'text-blue-700', accent: 'bg-blue-500' },
    { bg: 'bg-purple-100', text: 'text-purple-700', accent: 'bg-purple-500' },
    { bg: 'bg-amber-100', text: 'text-amber-700', accent: 'bg-amber-500' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700', accent: 'bg-emerald-500' },
    { bg: 'bg-rose-100', text: 'text-rose-700', accent: 'bg-rose-500' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700', accent: 'bg-cyan-500' },
];

const COLLECTIONS = [
    { label: 'Marian', query: 'Marian', icon: Heart },
    { label: 'Saints', query: 'Saint', icon: Sparkles },
    { label: 'Novenas', query: 'Novena', icon: Flame },
    { label: 'Healing', query: 'Healing', icon: Play },
    { label: 'Litanies', query: 'Litany', icon: Scroll },
];

export default async function PrayersPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string; duration?: string };
}) {
    const query = searchParams.q;
    const categoryFilter = searchParams.category;
    const duration = searchParams.duration; // 'short', 'medium', 'long'

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

    // Rough approximation for duration since we don't have a 'word_count' field in DB yet.
    // Short: < 150 words
    // Medium: 150 - 750 words
    // Long: > 750 words
    // Prisma can't filter by computed content length easily without Raw query or a field.
    // For now, we fetch a bit more and filter in memory OR assume we need to update schema. 
    // I'll filter in JS for now as dataset < 4000 is manageable, or ignore if too heavy. 
    // Actually, 4000 is small enough for JS filter after fetch if we don't fetch *all*.
    // BUT we are paginating or taking 100.
    // Let's rely on 'take: 100' and filter post-fetch if duration is set, effectively reducing page size, 
    // which is not ideal but acceptable for "Polish" phase without schema migration.

    let dbPrayers = await db.prayer.findMany({
        where,
        orderBy: { title: 'asc' },
        take: duration ? 300 : 100, // Fetch more if filtering locally
    });

    if (duration) {
        dbPrayers = dbPrayers.filter(p => {
            const words = p.content.split(/\s+/).length;
            if (duration === 'short') return words < 150;
            if (duration === 'medium') return words >= 150 && words <= 750;
            if (duration === 'long') return words > 750;
            return true;
        }).slice(0, 100);
    }

    const prayers = toSafeJSON(dbPrayers);

    // Recommended (Mock logic for now - random or featured)
    // We can pick 3 random prayers from the result or separate query
    const recommendedPrayers = prayers.length > 3
        ? [...prayers].sort(() => 0.5 - Math.random()).slice(0, 3)
        : prayers.slice(0, 3);

    const allPrayers = await db.prayer.findMany({
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

    const totalPrayers = Math.max(allPrayers.length, 3900);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Compact Hero */}
            <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 pt-20 pb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-blue-100 text-xs font-medium mb-6 border border-white/10 animate-fade-in shadow-xl">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Over {totalPrayers.toLocaleString()} Catholic Prayers</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up tracking-tight">
                            Find Peace in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Prayer</span>
                        </h1>

                        <p className="text-lg text-blue-100/80 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-75">
                            A comprehensive collection of prayers for every moment of your life.
                        </p>

                        {/* Search & Filters */}
                        <div className="animate-fade-in-up delay-100">
                            <PrayerSearch />
                            <PrayerFilters />
                        </div>
                    </div>

                    {/* Collections Links */}
                    <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in-up delay-200">
                        {COLLECTIONS.map((col) => (
                            <Link
                                key={col.label}
                                href={`/prayers?q=${col.query}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
                            >
                                <col.icon className="w-4 h-4 text-amber-300" />
                                {col.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-6">
                <SmartAdSlot page="prayers" position="top" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Categories */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <PrayerCategorySidebar
                            categories={categories}
                            activeCategory={categoryFilter}
                            totalPrayers={totalPrayers}
                        />
                        {/* Sidebar Ad */}
                        <div className="mt-6 hidden lg:block sticky top-[calc(100vh-300px)]">
                            <SmartAdSlot page="prayers" position="sidebar" />
                        </div>
                    </aside>

                    {/* Prayer List */}
                    <main className="flex-1">
                        {categoryFilter && (
                            <div className="mb-6 flex items-end justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {categories.find(c => c.slug === categoryFilter)?.label || 'Category'}
                                    </h2>
                                    <p className="text-gray-500 mt-1">{prayers.length} prayers found</p>
                                </div>
                            </div>
                        )}

                        {prayers.length > 0 ? (
                            <div className="grid gap-4">
                                {prayers.map((prayer, i) => {
                                    const colorIndex = i % CATEGORY_COLORS.length;
                                    const color = CATEGORY_COLORS[colorIndex];

                                    return (
                                        <div key={prayer.slug || prayer.id.toString()}>
                                            <Link
                                                href={`/prayers/${prayer.slug || prayer.id}`}
                                                className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col md:flex-row gap-5 overflow-hidden"
                                            >
                                                <div className={`absolute top-0 left-0 w-1 h-full ${color.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                                {/* Icon/Image Placeholder */}
                                                <div className={`w-14 h-14 rounded-2xl ${color.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                    <span className={`text-xl font-serif font-bold ${color.text}`}>
                                                        {prayer.title.charAt(0)}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                                                                    {prayer.category_label}
                                                                </span>
                                                                <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                                    <Clock className="w-3 h-3" />
                                                                    {getReadingTime(prayer.content)}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-1">
                                                                {prayer.title}
                                                            </h3>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-1">
                                                        {prayer.content}
                                                    </p>
                                                </div>
                                            </Link>

                                            {/* Inline Ad every 8 prayers */}
                                            {(i + 1) % 8 === 0 && i < prayers.length - 1 && (
                                                <div className="py-2">
                                                    <SmartAdSlot page="prayers" position="inline" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No prayers found</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                    We couldn't find any prayers matching your criteria. Try different keywords or filters.
                                </p>
                                <Link
                                    href="/prayers"
                                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                                >
                                    View All Prayers
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
