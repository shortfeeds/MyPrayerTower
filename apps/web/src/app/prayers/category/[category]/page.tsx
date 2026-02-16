
import { getLibraryPrayers } from '@/app/actions/prayer-library';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Share2, ChevronLeft } from 'lucide-react';
import { DailyPrayerCTA } from '@/components/seo/DailyPrayerCTA';
import { FAQModule } from '@/components/seo/FAQModule';
import { getPrayerFAQs } from '@/lib/seo/prayerFAQs'; // Reusing for now, or expand
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

interface Props {
    params: {
        category: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

// Map slugs to display titles and descriptions
const CATEGORY_META: Record<string, { title: string; description: string; heroDesc: string }> = {
    'healing': {
        title: 'Catholic Prayers for Healing',
        description: 'A collection of powerful Catholic prayers for physical, emotional, and spiritual healing. Find comfort and strength in God\'s grace.',
        heroDesc: 'Turn to the Divine Physician. Ancient prayers for body, mind, and soul.'
    },
    'protection': {
        title: 'Prayers for Spiritual Protection',
        description: 'Defend yourself and your loved ones with these Catholic prayers for protection against evil, anxiety, and harm.',
        heroDesc: 'Put on the Armor of God. Prayers to guard your heart and home.'
    },
    'morning': {
        title: 'Catholic Morning Prayers',
        description: 'Start your day with God. Traditional and contemporary morning prayers to offer your day to the Lord.',
        heroDesc: 'Rise and shine with the Lord. Consecrate your day to His will.'
    },
    'evening': {
        title: 'Catholic Evening & Night Prayers',
        description: 'End your day in peace. Examination of conscience, gratitude, and prayers for valid rest.',
        heroDesc: 'Rest in His presence. Give thanks and find peace before sleep.'
    },
    'peace': {
        title: 'Prayers for Peace & Anxiety',
        description: 'Find the peace that surpasses all understanding. Prayers for when you are anxious, overwhelmed, or afraid.',
        heroDesc: 'Let not your heart be troubled. Find the peace that only Christ can give.'
    },
    'marian': {
        title: 'Marian Prayers & Devotions',
        description: 'Honor the Mother of God with these traditional Marian prayers. Rosary, Memorare, Hail Holy Queen, and more.',
        heroDesc: 'To Jesus through Mary. Honor our Blessed Mother.'
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const categoryKey = params.category.toLowerCase();
    const meta = CATEGORY_META[categoryKey] || {
        title: `${params.category.charAt(0).toUpperCase() + params.category.slice(1).replace('-', ' ')} Prayers`,
        description: `Browse our collection of Catholic prayers for ${params.category.replace('-', ' ')}.`,
        heroDesc: 'Deepen your prayer life with our curated collection.'
    };

    return {
        title: `${meta.title} | MyPrayerTower`,
        description: meta.description,
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: 'website',
        },
        alternates: {
            canonical: `https://myprayertower.com/prayers/category/${params.category}`
        }
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
    const categoryKey = params.category.toLowerCase();

    // Fallback for unknown categories
    const meta = CATEGORY_META[categoryKey] || {
        title: params.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: `Browse our collection of Catholic prayers for ${params.category.replace('-', ' ')}.`,
        heroDesc: 'Deepen your prayer life with our curated collection.'
    };

    // Use the category slug directly for fetching
    const { prayers, totalPages, totalItems } = await getLibraryPrayers(page, 20, undefined, params.category);

    if (prayers.length === 0 && page === 1) {
        // Optional: specific 404 or empty state handling
    }

    // Generate FAQs for this category hub
    // We can use a generic "Catholic Prayers" as the context or the category name
    const faqs = getPrayerFAQs(categoryKey, meta.title);

    const breadcrumbs = [
        { label: 'Prayers', href: '/prayers' },
        { label: meta.title, href: `/prayers/category/${params.category}` },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero Section */}
            <div className="relative bg-sacred-900 text-white overflow-hidden pt-32 pb-24">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Breadcrumbs items={breadcrumbs} className="justify-center mb-8 text-white/60" />

                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-gold-200 text-xs font-medium tracking-widest uppercase mb-6">
                        Prayer Collection
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        {meta.title}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-8">
                        {meta.heroDesc}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">

                {/* Intro Content (SEO Text) */}
                <div className="max-w-3xl mx-auto mb-16 text-center text-gray-600 leading-relaxed font-serif text-lg">
                    <p>{meta.description}</p>
                </div>

                {/* Prayer Grid */}
                {prayers.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {prayers.map((prayer) => (
                            <Link
                                key={prayer.id}
                                href={`/prayers/${prayer.slug}`}
                                className="group block p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-gold-200"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-serif font-bold text-xl text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-2">
                                        {prayer.title}
                                    </h3>
                                </div>
                                <p className="text-gray-500 line-clamp-3 leading-relaxed mb-6">
                                    {prayer.content}
                                </p>
                                <div className="flex items-center text-sm font-bold text-gold-600 uppercase tracking-wider group-hover:gap-2 transition-all">
                                    Pray Now <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No prayers found in this category.</p>
                        <Link href="/prayers" className="inline-block mt-4 text-gold-600 font-medium hover:underline">
                            View All Prayers
                        </Link>
                    </div>
                )}

                {/* Pagination would go here if needed, reused from main library */}

                {/* FAQ Section */}
                <FAQModule items={faqs} title={`Common Questions about ${meta.title}`} />

                {/* Global CTA */}
                <DailyPrayerCTA />

            </div>
        </div>
    );
}
