import { db } from '@/lib/db';

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

    const dbPrayers = await db.prayer.findMany({
        where,
        orderBy: { title: 'asc' },
        take: 100,
    });

    const prayers = dbPrayers.map(p => ({
        ...p,
        id: p.id.toString(),
    }));

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

    // Force display count to 3900+ as requested by user if actual count is lower
    const totalPrayers = Math.max(allPrayers.length, 3900);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Compact Hero */}
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-48 h-48 bg-blue-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-5 right-10 w-56 h-56 bg-purple-400 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 pt-24 pb-12 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-4 border border-white/20">
                            <BookOpen className="w-4 h-4" />
                            <span>{totalPrayers.toLocaleString()}+ Prayers</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                            Catholic Prayer Library
                        </h1>

                        {/* Search */}
                        <form className="relative max-w-xl mx-auto">
                            <div className="relative bg-white rounded-xl shadow-xl flex items-center">
                                <Search className="absolute left-5 w-5 h-5 text-gray-400" />
                                <input
                                    name="q"
                                    defaultValue={query}
                                    placeholder="Search prayers..."
                                    className="w-full pl-14 pr-6 py-4 bg-transparent text-gray-900 rounded-xl placeholder-gray-400 focus:outline-none text-base"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-4">
                <SmartAdSlot page="prayers" position="top" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Categories */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                                        <Filter className="w-4 h-4 text-blue-600" />
                                        <span>Categories</span>
                                    </div>
                                </div>
                                <div className="p-2 max-h-[60vh] overflow-y-auto">
                                    <Link
                                        href="/prayers"
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${!categoryFilter
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span>All Prayers</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${!categoryFilter ? 'bg-white/20' : 'bg-gray-100'}`}>
                                            {totalPrayers}
                                        </span>
                                    </Link>
                                    <div className="mt-1 space-y-0.5">
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`/prayers?category=${cat.slug}`}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${categoryFilter === cat.slug
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span className="truncate">{cat.label}</span>
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${categoryFilter === cat.slug ? 'bg-white/20' : 'bg-gray-100'}`}>
                                                    {cat.count}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Ad */}
                            <div className="mt-4 hidden lg:block">
                                <SmartAdSlot page="prayers" position="sidebar" />
                            </div>
                        </div>
                    </aside>

                    {/* Prayer List */}
                    <main className="flex-1">
                        {categoryFilter && (
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {categories.find(c => c.slug === categoryFilter)?.label || 'Category'}
                                </h2>
                                <p className="text-sm text-gray-500">{prayers.length} prayers</p>
                            </div>
                        )}

                        {prayers.length > 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                                {prayers.map((prayer, i) => {
                                    const colorIndex = i % CATEGORY_COLORS.length;
                                    const color = CATEGORY_COLORS[colorIndex];

                                    return (
                                        <>
                                            <Link
                                                key={prayer.slug || prayer.id.toString()}
                                                href={`/prayers/${prayer.slug || prayer.id}`}
                                                className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50/50 transition-colors group"
                                            >
                                                {/* Play Icon */}
                                                <div className={`w-10 h-10 rounded-full ${color.accent} flex items-center justify-center flex-shrink-0`}>
                                                    <Play className="w-4 h-4 text-white ml-0.5" />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                                            {prayer.title}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-gray-500 line-clamp-1">{prayer.content}</p>
                                                </div>

                                                {/* Meta */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${color.bg} ${color.text}`}>
                                                        {prayer.category_label}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        {getReadingTime(prayer.content)}
                                                    </span>
                                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                            </Link>

                                            {/* Inline Ad every 10 prayers */}
                                            {(i + 1) % 10 === 0 && i < prayers.length - 1 && (
                                                <div key={`ad-${i}`} className="px-4 py-3 bg-gray-50">
                                                    <SmartAdSlot page="prayers" position="inline" />
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <Search className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No prayers found</h3>
                                <p className="text-gray-500 mb-4 text-sm">Try adjusting your search or category filter.</p>
                                <Link
                                    href="/prayers"
                                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Clear filters
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
