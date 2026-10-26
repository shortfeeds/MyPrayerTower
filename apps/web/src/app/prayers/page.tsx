export const revalidate = 86400; // 24 hours

import { Metadata } from 'next';
import { getLibraryPrayers, getPrayerCategories } from '@/app/actions/prayer-library';
import { PrayerSearch, PrayerFilter, Pagination } from '@/components/library/LibraryControls';
import Link from 'next/link';
import { Book, Heart, Sun, Moon, Calendar, ChevronRight, Sparkles, Anchor, Feather, Flame } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { JsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { PrayerReminderBanner } from '@/components/notifications/PrayerReminderBanner';
import { CATHOLIC_INTENTIONS } from '@/lib/seo/intentionsData';

const BASE_URL = 'https://www.myprayertower.com';

export const metadata: Metadata = {
    title: 'Catholic Prayer Library | 4,000+ Traditional & Modern Prayers | MyPrayerTower',
    description: 'Explore over 4,000 traditional and modern Catholic prayers, litanies, devotions, and daily offerings. Search by occasion, intention, crisis, saint, or historical tradition.',
    keywords: 'Catholic prayers, daily prayers, traditional Catholic prayers, litanies, Catholic devotions, morning offering, evening prayers, Catholic treasury, occasions, surgery, house blessing',
    alternates: {
        canonical: `${BASE_URL}/prayers`,
    },
    openGraph: {
        title: 'Catholic Prayer Library | 4,000+ Traditional & Modern Prayers | MyPrayerTower',
        description: 'Explore over 4,000 traditional and modern Catholic prayers, litanies, devotions, and daily offerings.',
        url: `${BASE_URL}/prayers`,
        type: 'website',
        locale: 'en_US',
        siteName: 'MyPrayerTower',
        images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Catholic Prayer Library' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Catholic Prayer Library | 4,000+ Catholic Prayers | MyPrayerTower',
        description: 'Explore over 4,000 traditional and modern Catholic prayers, litanies, devotions, and daily offerings.',
        images: [`${BASE_URL}/og-image.png`],
    },
};

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

// Fixed Suggested Section for Top of Page
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

    const collectionLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/prayers#collection`,
        name: 'Catholic Prayer Library',
        description: 'Comprehensive digital treasury of 4,000+ traditional and contemporary Catholic prayers, novenas, and litanies.',
        url: `${BASE_URL}/prayers`,
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'MyPrayerTower',
            url: BASE_URL,
        },
    };

    const breadcrumbsLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: BASE_URL,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Prayers',
                item: `${BASE_URL}/prayers`,
            },
        ],
    };

    const intentionList = Object.values(CATHOLIC_INTENTIONS);

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <JsonLd data={collectionLd as any} />
            <BreadcrumbJsonLd data={breadcrumbsLd as any} />

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
                    <div className="-mt-20 relative z-20 mb-12">
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

                {/* High-Intent Catholic Collections (Intention SEO Hub Pills) */}
                <div className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gold-500" />
                            Pray by Catholic Intention
                        </h2>
                        <span className="text-xs text-gray-400">Curated Thematic Collections</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {intentionList.map((hub) => (
                            <Link
                                key={hub.slug}
                                href={`/prayers/intention/${hub.slug}`}
                                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 transition-all hover:scale-105 active:scale-95"
                            >
                                {hub.shortTitle}
                            </Link>
                        ))}
                    </div>
                </div>

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
                                <div className="flex justify-between items-start gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-sacred-700 transition-colors line-clamp-1">
                                        {prayer.title}
                                    </h3>
                                    {(prayer.category_label || prayer.category) && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/50 px-2.5 py-1 rounded-md shrink-0 group-hover:bg-amber-100 transition-colors">
                                            {prayer.category_label || prayer.category}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-3">
                                    {prayer.content}
                                </p>
                                {prayer.tags && prayer.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {prayer.tags.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                #{tag.replace(/^[^:]+:/, '')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-2 flex items-center text-xs font-semibold text-gold-600 group-hover:translate-x-1 transition-transform">
                                    Read Full Prayer & Instructions <ChevronRight className="w-3.5 h-3.5 ml-1" />
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

                {/* Daily Liturgical Reminder & Community Telegram Banner */}
                <PrayerReminderBanner />

                {/* Bottom Ad */}
                <div className="mt-8">
                    <SmartAdSlot page="prayers" position="bottom" showPlaceholder={false} />
                </div>

            </div>
        </div>
    );
}
