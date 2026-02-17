import { getLibraryPrayers, getPrayerCategories } from '@/app/actions/prayer-library';
import { PrayerSearch, PrayerFilter, Pagination } from '@/components/library/LibraryControls';
import Link from 'next/link';
import { Book, Heart, Sun, Moon, Calendar, ChevronRight, Sparkles, Anchor, Feather, Flame } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

// Fixed Suggested Section for Top of Page (preserved style)
const SUGGESTED_TODAY = [
    {
        title: "Morning Offering",
        description: "Offer your day to the Lord.",
        icon: Sun,
        color: "text-amber-500 bg-amber-50",
        href: "/prayers/morning-offering"
    },
    {
        title: "The Angelus",
        description: "Recall the Incarnation at noon.",
        icon: Book,
        color: "text-blue-500 bg-blue-50",
        href: "/prayers/angelus"
    },
    {
        title: "Evening Reflection",
        description: "Review your day with gratitude.",
        icon: Moon,
        color: "text-indigo-500 bg-indigo-50",
        href: "/examen"
    }
];

export default async function PrayerLibraryPage({ searchParams }: Props) {
    const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
    const search = typeof searchParams.q === 'string' ? searchParams.q : undefined;
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

    // Fetch Data Parallel
    const [libraryData, categories] = await Promise.all([
        getLibraryPrayers(page, 20, search, category),
        getPrayerCategories()
    ]);

    const { prayers, totalPages, totalItems } = libraryData;

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Elegant Hero */}
            <div className="relative bg-sacred-900 text-white overflow-hidden pt-32 pb-24">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-gold-200 text-xs font-medium tracking-widest uppercase mb-6">
                        Sacred Treasury
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Prayer Library
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-8">
                        Draw from the deep wells of tradition. Find words for every season of the soul.
                    </p>

                    {/* Search Component inside Hero */}
                    <PrayerSearch />
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">

                {/* Only show 'Suggested' on home view (no search/filter) */}
                {!search && !category && page === 1 && (
                    <div className="-mt-20 relative z-20 mb-16">
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <h2 className="font-serif text-2xl text-gray-900 mb-8 flex items-center gap-3">
                                <Sun className="w-6 h-6 text-gold-500" />
                                Suggested for Today
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {SUGGESTED_TODAY.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-sacred-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <PrayerFilter categories={categories} />

                {/* Results Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-3xl text-gray-900">
                        {search
                            ? `Search Results for "${search}"`
                            : category && category !== 'All'
                                ? `${category} Prayers`
                                : 'Complete Treasury'
                        }
                        <span className="ml-3 text-lg font-sans text-gray-500 font-normal">
                            ({totalItems} prayers)
                        </span>
                    </h2>
                </div>

                {/* Prayer Grid */}
                {prayers.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        {prayers.map((prayer) => (
                            <Link
                                key={prayer.id}
                                href={`/prayers/${prayer.slug}`}
                                className="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-gold-200"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-1">
                                        {prayer.title}
                                    </h3>
                                    {prayer.category && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded-md group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                                            {prayer.category}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                                    {prayer.content}
                                </p>
                                <div className="mt-4 flex items-center text-xs font-medium text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    Read Prayer <ChevronRight className="w-3 h-3 ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Book className="w-6 h-6 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No prayers found</h3>
                        <p className="text-gray-500">Try adjusting your search or category filter.</p>
                        {(search || category) && (
                            <Link href="/prayers" className="inline-block mt-4 text-gold-600 font-medium hover:underline">
                                Clear Filters
                            </Link>
                        )}
                    </div>
                )}

                {/* Pagination */}
                <Pagination currentPage={page} totalPages={totalPages} />

                {/* Bottom Ad */}
                <div className="mt-8">
                    <SmartAdSlot page="prayers" position="bottom" showPlaceholder={false} />
                </div>

            </div>
        </div>
    );
}
