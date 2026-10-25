export const revalidate = 86400; // 24 hours

import { getAllGuides } from '@/lib/content';
import Link from 'next/link';
import { BookOpen, Calendar, ChevronRight, Search } from 'lucide-react';
import { Metadata } from 'next';
import { format } from 'date-fns';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { JsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://www.myprayertower.com';

export const metadata: Metadata = {
    title: 'Catholic Guides & Resources | How to Pray, Traditions & Devotions | MyPrayerTower',
    description: 'Learn how to pray the Rosary, discover Novenas, and deepen your Catholic faith with our comprehensive step-by-step guides and theological reflections.',
    keywords: 'Catholic guides, how to pray catholic, rosary guide, novena guide, catholic traditions, examination of conscience, spiritual life',
    alternates: {
        canonical: `${BASE_URL}/guides`,
    },
    openGraph: {
        title: 'Catholic Guides & Resources | MyPrayerTower',
        description: 'Learn how to pray the Rosary, discover Novenas, and deepen your Catholic faith with our comprehensive guides.',
        url: `${BASE_URL}/guides`,
        type: 'website',
        locale: 'en_US',
        siteName: 'MyPrayerTower',
        images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Catholic Guides & Resources' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Catholic Guides & Resources | MyPrayerTower',
        description: 'Learn how to pray the Rosary, discover Novenas, and deepen your Catholic faith with our comprehensive guides.',
        images: [`${BASE_URL}/og-image.png`],
    },
};

const CATEGORIES = [
    { id: 'all', label: 'All Guides' },
    { id: 'how-to', label: 'How-To' },
    { id: 'prayer', label: 'Prayer' },
    { id: 'rosary', label: 'Rosary' },
    { id: 'novena', label: 'Novenas' },
    { id: 'catholic-life', label: 'Catholic Life' },
];

export default async function GuidesPage() {
    const guides = await getAllGuides();

    const collectionLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/guides#collection`,
        name: 'Catholic Guides & Resources',
        description: 'Comprehensive guides, tutorials, and explanations of Catholic prayers, traditions, and devotions.',
        url: `${BASE_URL}/guides`,
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
                name: 'Guides',
                item: `${BASE_URL}/guides`,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <JsonLd data={collectionLd as any} />
            <BreadcrumbJsonLd data={breadcrumbsLd as any} />

            {/* Hero Section */}
            <div className="bg-sacred-900 text-white pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-gold-200 text-xs font-medium tracking-widest uppercase mb-6">
                        Spiritual Library
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                        Catholic <span className="text-gold-400">Guides</span> & Resources
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Deepen your understanding of the faith with step-by-step guides, prayer explanations, and spiritual insights.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {CATEGORIES.map(cat => (
                        <Link
                            key={cat.id}
                            href={cat.id === 'all' ? '/guides' : `/guides?category=${cat.id}`}
                            className="px-6 py-2 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm hover:shadow-md hover:text-gold-600 transition-all border border-gray-100"
                        >
                            {cat.label}
                        </Link>
                    ))}
                </div>

                {/* Guides Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {guides.map((guide) => (
                        <Link
                            key={guide.slug}
                            href={`/guides/${guide.slug}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                        >
                            {/* Image Placeholder if content system expands to images */}
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {guide.image ? (
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${guide.image})` }} />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-sacred-50">
                                        <BookOpen className="w-12 h-12 text-sacred-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gold-600 shadow-sm">
                                    {guide.category}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-medium">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(guide.publishedAt), 'MMMM d, yyyy')}
                                    {guide.readingTime && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span>{guide.readingTime}</span>
                                        </>
                                    )}
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3 group-hover:text-gold-600 transition-colors leading-tight">
                                    {guide.title}
                                </h3>

                                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
                                    {guide.description}
                                </p>

                                <div className="flex items-center text-sm font-bold text-sacred-600 group-hover:text-gold-600 transition-colors mt-auto">
                                    Read Guide <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {guides.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No guides found. Check back soon!</p>
                    </div>
                )}

                {/* Bottom Ad */}
                <div className="mt-12">
                    <SmartAdSlot page="guides" position="bottom" showPlaceholder={false} />
                </div>
            </div>
        </div>
    );
}
