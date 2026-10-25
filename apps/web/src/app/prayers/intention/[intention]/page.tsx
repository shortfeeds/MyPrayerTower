export const revalidate = 86400; // 24 hours ISR

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { CATHOLIC_INTENTIONS, IntentionHub } from '@/lib/seo/intentionsData';
import { JsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';
import { ShareButtons } from '@/components/social/ShareButtons';
import {
    Heart,
    BookOpen,
    Sparkles,
    ChevronRight,
    ArrowRight,
    Shield,
    Cross,
    Clock,
    Share2,
    CheckCircle2,
    Compass
} from 'lucide-react';

const BASE_URL = 'https://www.myprayertower.com';

interface Props {
    params: { intention: string };
}

export function generateStaticParams() {
    return Object.keys(CATHOLIC_INTENTIONS).map(intention => ({ intention }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const hub = CATHOLIC_INTENTIONS[params.intention];
    if (!hub) return { title: 'Prayers by Intention | MyPrayerTower' };

    const canonicalUrl = `${BASE_URL}/prayers/intention/${hub.slug}`;

    return {
        title: hub.metaTitle,
        description: hub.metaDescription,
        keywords: [
            hub.shortTitle,
            'Catholic prayers',
            'Catholic prayer intentions',
            'novena',
            'intercessory prayer',
            hub.badge,
            hub.patronSaint.name
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: hub.metaTitle,
            description: hub.metaDescription,
            url: canonicalUrl,
            type: 'website',
            siteName: 'MyPrayerTower',
            locale: 'en_US',
            images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: hub.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: hub.metaTitle,
            description: hub.metaDescription,
            images: [`${BASE_URL}/og-image.png`],
        },
    };
}

export default async function IntentionHubPage({ params }: Props) {
    const hub: IntentionHub = CATHOLIC_INTENTIONS[params.intention];
    if (!hub) notFound();

    // Fetch matching prayers from database
    const orConditions: any[] = [];
    if (hub.categories.length > 0) {
        orConditions.push({ category: { in: hub.categories } });
    }
    hub.searchTerms.forEach(term => {
        orConditions.push({ title: { contains: term, mode: 'insensitive' } });
    });

    let prayers: { id: bigint | number; title: string; slug: string | null; content: string; category: string | null }[] = [];
    try {
        prayers = await db.prayer.findMany({
            where: {
                is_active: true,
                OR: orConditions.length > 0 ? orConditions : undefined,
            },
            take: 36,
            orderBy: { title: 'asc' },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                category: true,
            }
        });
    } catch (e) {
        console.error('Failed to query prayers for intention:', e);
    }

    const canonicalUrl = `${BASE_URL}/prayers/intention/${hub.slug}`;

    const collectionLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        name: hub.title,
        description: hub.metaDescription,
        url: canonicalUrl,
        inLanguage: 'en-US',
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'MyPrayerTower',
            url: BASE_URL,
        },
    };

    const breadcrumbItems = [
        { name: 'Home', url: '/' },
        { name: 'Catholic Prayers', url: '/prayers' },
        { name: hub.shortTitle, url: `/prayers/intention/${hub.slug}` },
    ];

    const breadcrumbsLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `${BASE_URL}${crumb.url}`
        }))
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: hub.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };

    const allIntentions = Object.values(CATHOLIC_INTENTIONS);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Structured Data */}
            <JsonLd data={collectionLd as any} />
            <BreadcrumbJsonLd data={breadcrumbsLd as any} />
            <FaqJsonLd data={faqLd as any} />

            {/* Breadcrumb Navigation */}
            <div className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur sticky top-16 z-20">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <nav className="flex items-center space-x-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <Link href="/prayers" className="hover:text-amber-600 transition-colors">Prayers Library</Link>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-slate-900 dark:text-slate-100 font-medium">{hub.shortTitle}</span>
                    </nav>
                </div>
            </div>

            {/* Hero Header */}
            <header className="relative bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pt-10 pb-12 border-b border-amber-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 mb-4 tracking-wide uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        {hub.badge}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                        {hub.title}
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        {hub.theologicalIntro}
                    </p>

                    {/* Scripture Card */}
                    <div className="max-w-2xl mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl p-5 border border-amber-200 dark:border-amber-900/40 shadow-sm">
                        <p className="font-serif italic text-base md:text-lg text-slate-800 dark:text-slate-200 mb-2">
                            &ldquo;{hub.scripture.verse}&rdquo;
                        </p>
                        <p className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
                            — {hub.scripture.citation}
                        </p>
                    </div>

                    {/* Quick WhatsApp Share Pill */}
                    <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
                        <ShareButtons
                            url={canonicalUrl}
                            title={hub.title}
                            description={hub.metaDescription}
                            variant="cta"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Prayers Collection Grid (2 cols on lg) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-amber-600" />
                                Treasury of Prayers ({prayers.length})
                            </h2>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Curated Liturgical Collection
                            </span>
                        </div>

                        {prayers.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
                                <p className="text-slate-600 dark:text-slate-400">No prayers found matching this intention currently. Please check the full prayer library.</p>
                                <Link href="/prayers" className="mt-4 inline-block px-5 py-2 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition">
                                    Browse All 3,900+ Prayers
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {prayers.map((prayer) => {
                                    const preview = prayer.content
                                        ? prayer.content.slice(0, 140).replace(/#+\s+/g, '') + '...'
                                        : 'A traditional Catholic prayer offered with devotion and faith.';
                                    const prayerUrl = `/prayers/${prayer.slug || prayer.id.toString()}`;

                                    return (
                                        <article
                                            key={prayer.id.toString()}
                                            className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                                                        {prayer.category || hub.shortTitle}
                                                    </span>
                                                </div>
                                                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                                                    <Link href={prayerUrl}>
                                                        {prayer.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                                                    {preview}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-amber-600 dark:text-amber-400">
                                                <Link href={prayerUrl} className="flex items-center gap-1 group-hover:underline">
                                                    Pray Now <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> 2 min
                                                </span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        {/* Frequently Asked Questions */}
                        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-amber-600" />
                                Understanding Prayer for {hub.shortTitle}
                            </h2>
                            <div className="space-y-4">
                                {hub.faqs.map((faq, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
                                    >
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-2">
                                            {faq.question}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Patron Saint Spotlight & Intention Directory (1 col) */}
                    <aside className="space-y-6">
                        {/* Patron Saint Card */}
                        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/60 rounded-3xl p-6 border border-amber-200 dark:border-slate-800 shadow-sm">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                Heavenly Patron
                            </span>
                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mt-1 mb-1">
                                {hub.patronSaint.name}
                            </h3>
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-3">
                                {hub.patronSaint.title}
                            </p>
                            <blockquote className="italic text-xs text-slate-600 dark:text-slate-300 border-l-2 border-amber-400 pl-3 mb-4">
                                &ldquo;{hub.patronSaint.quote}&rdquo;
                            </blockquote>
                            <Link
                                href="/saints"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                            >
                                Explore Lives of the Saints <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* All Prayer Intentions Directory */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Compass className="w-5 h-5 text-amber-600" />
                                Explore Other Intentions
                            </h3>
                            <ul className="space-y-2">
                                {allIntentions.map(item => {
                                    const isCurrent = item.slug === hub.slug;
                                    return (
                                        <li key={item.slug}>
                                            <Link
                                                href={`/prayers/intention/${item.slug}`}
                                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                                    isCurrent
                                                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-semibold'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                <span>{item.shortTitle}</span>
                                                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Daily Devotion Card */}
                        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md">
                            <Cross className="w-8 h-8 text-amber-300 mb-3" />
                            <h4 className="text-lg font-serif font-bold mb-1">
                                Daily Holy Rosary
                            </h4>
                            <p className="text-xs text-blue-200 leading-relaxed mb-4">
                                Meditate on today&apos;s mysteries with our interactive bead-by-bead virtual rosary.
                            </p>
                            <Link
                                href="/rosary"
                                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition"
                            >
                                Pray the Rosary Today
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
