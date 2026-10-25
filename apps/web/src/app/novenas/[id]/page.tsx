export const revalidate = 86400; // Cache for 24 hours

import { NOVENAS } from '@/lib/novenas';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Heart, Share2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { RelatedContent } from '@/components/seo/RelatedContent';

interface Props {
    params: {
        id: string;
    };
}

const BASE_URL = 'https://www.myprayertower.com';

export async function generateStaticParams() {
    return NOVENAS.map((novena) => ({
        id: novena.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const novena = NOVENAS.find(n => n.id === params.id);
    if (!novena) return { title: 'Novena Not Found' };

    const novenaUrl = `${BASE_URL}/novenas/${novena.id}`;
    const ogImage = `${BASE_URL}/og-image.png`;

    return {
        title: `${novena.name} - 9-Day Catholic Novena Prayers & Meditations | MyPrayerTower`,
        description: novena.description,
        alternates: {
            canonical: novenaUrl,
        },
        openGraph: {
            title: `${novena.name} - 9-Day Catholic Novena`,
            description: novena.description,
            type: 'article',
            locale: 'en_US',
            siteName: 'MyPrayerTower',
            url: novenaUrl,
            images: [{ url: ogImage, width: 1200, height: 630, alt: novena.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${novena.name} - 9-Day Catholic Novena`,
            description: novena.description,
            images: [ogImage],
        },
    };
}

export default function NovenaPage({ params }: Props) {
    const novena = NOVENAS.find(n => n.id === params.id);

    if (!novena) {
        notFound();
    }

    const novenaUrl = `${BASE_URL}/novenas/${novena.id}`;

    // SEO Schema
    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${novenaUrl}#article`,
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'MyPrayerTower',
            url: BASE_URL,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': novenaUrl,
        },
        headline: `${novena.name} - 9-Day Catholic Novena`,
        description: novena.description,
        inLanguage: 'en-US',
        about: [
            { '@type': 'Thing', name: 'Catholic Novena' },
            { '@type': 'Thing', name: novena.patron || 'Catholic Prayer' },
        ],
        author: {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: 'MyPrayerTower',
            url: BASE_URL,
        },
        publisher: {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: 'MyPrayerTower',
            url: BASE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
                width: 512,
                height: 512,
            }
        },
        image: `${BASE_URL}/og-image.png`,
        datePublished: '2024-01-01',
    };

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Novenas', href: '/novenas' },
        { label: novena.name, href: `/novenas/${novena.id}` },
    ];

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            item: `${BASE_URL}${crumb.href}`,
        })),
    };

    // Simple related logic: same category or random
    const relatedItems = NOVENAS
        .filter(n => n.id !== novena.id)
        .slice(0, 3)
        .map(n => ({
            title: n.name,
            slug: n.id,
            category: 'Novena',
            type: 'guide' as const // Reusing guide card style
        }));

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <ArticleJsonLd data={articleLd as any} />
            <BreadcrumbJsonLd data={breadcrumbLd as any} />

            {/* Nav */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/novenas"
                        className="flex items-center text-gray-500 hover:text-amber-600 transition-colors font-medium text-sm"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        All Novenas
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all" title="Share" aria-label="Share this novena">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 py-12">
                <Breadcrumbs items={breadcrumbs.slice(1)} />

                {/* Header */}
                <div className={`rounded-3xl p-8 md:p-12 mb-12 text-white bg-gradient-to-br ${novena.color} shadow-lg relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-12 opacity-10 transform rotate-12">
                        <Heart className="w-64 h-64 text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-bold flex items-center gap-2">
                                <User className="w-4 h-4" /> Patron: {novena.patron}
                            </span>
                            {novena.patronOf && (
                                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-bold flex items-center gap-2">
                                    <Heart className="w-4 h-4" /> {novena.patronOf}
                                </span>
                            )}
                        </div>

                        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            {novena.name}
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl font-light">
                            {novena.description}
                        </p>
                    </div>
                </div>

                {/* Content Body */}
                <div className="space-y-12">
                    {/* Opening Prayer */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-8 bg-amber-400 rounded-full"></span>
                            Opening Prayer
                            <span className="text-sm font-sans font-normal text-gray-400 ml-auto uppercase tracking-widest">Recite Daily</span>
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed italic">
                            {novena.openingPrayer}
                        </p>
                    </div>

                    {/* Daily Prayers */}
                    <div className="space-y-6">
                        <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-8">Daily Meditations</h2>
                        {novena.dailyPrayers.map((prayer, index) => (
                            <div key={index} id={`day-${index + 1}`} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 scroll-mt-24">
                                <h3 className="font-serif text-xl font-bold text-amber-600 mb-4 uppercase tracking-widest">
                                    Day {index + 1}
                                </h3>
                                <div className="text-lg text-gray-700 leading-loose whitespace-pre-wrap">
                                    {prayer}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Closing Prayer */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-8 bg-amber-400 rounded-full"></span>
                            Closing Prayer
                            <span className="text-sm font-sans font-normal text-gray-400 ml-auto uppercase tracking-widest">Recite Daily</span>
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed italic">
                            {novena.closingPrayer}
                        </p>
                    </div>
                </div>

                {/* Related */}
                <div className="mt-20">
                    <RelatedContent items={relatedItems} title="Other Novenas You Might Like" />
                </div>
            </article>
        </div>
    );
}
