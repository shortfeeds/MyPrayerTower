import { db } from '@/lib/db';
import { getPrayerBySlug, getLibraryPrayers } from '@/app/actions/prayer-library';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Scroll, Sparkles } from 'lucide-react';
import { PrayerInteractions } from '@/components/prayer/PrayerInteractions';
import { PrayerReaderExperience } from '@/components/prayer/PrayerReaderExperience';
import { AnsweredGraces } from '@/components/prayer/AnsweredGraces';
import { ShareButtons } from '@/components/social/ShareButtons';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';
import { FAQModule } from '@/components/seo/FAQModule';
import { DailyPrayerCTA } from '@/components/seo/DailyPrayerCTA';
import { getPrayerFAQs } from '@/lib/seo/prayerFAQs';
import { CATHOLIC_INTENTIONS } from '@/lib/seo/intentionsData';

interface Props {
    params: {
        slug: string;
    };
}

const BASE_URL = 'https://www.myprayertower.com';

// Enable ISR: Cache generated prayer pages on Vercel Edge CDN for 7 days
export const revalidate = 604800; // 7 days (seconds)
export const dynamicParams = true;

// Pre-render top prayers at build time; all others generated on demand and cached via ISR
export async function generateStaticParams() {
    try {
        const prayers = await db.prayer.findMany({
            where: { is_active: true, slug: { not: null } },
            select: { slug: true },
            take: 60,
        });
        return prayers
            .filter((p) => Boolean(p.slug))
            .map((p) => ({
                slug: p.slug,
            }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const prayer = await getPrayerBySlug(params.slug);

    if (!prayer) {
        return {
            title: 'Prayer Not Found',
        };
    }

    const title = `${prayer.title} — Powerful Catholic Prayer for ${prayer.category || 'Help'} (With Reflection)`;
    const description = prayer.content.slice(0, 160).replace(/\s+/g, ' ').trim();
    const prayerUrl = `${BASE_URL}/prayers/${params.slug}`;

    return {
        title: `${title} | MyPrayerTower`,
        description,
        keywords: prayer.tags,
        alternates: {
            canonical: prayerUrl
        },
        openGraph: {
            title,
            description,
            url: prayerUrl,
            type: 'article',
            locale: 'en_US',
            siteName: 'MyPrayerTower',
            authors: ['MyPrayerTower'],
            images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: prayer.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${BASE_URL}/og-image.png`],
        },
    };
}

export default async function PrayerPage({ params }: Props) {
    const prayer = await getPrayerBySlug(params.slug);

    if (!prayer) {
        notFound();
    }

    // Fetch related prayers (same category, exclude current)
    const { prayers: relatedPrayersData } = await getLibraryPrayers(1, 4, undefined, prayer.category || undefined);
    const relatedItems = relatedPrayersData
        .filter(p => p.id !== prayer.id)
        .slice(0, 3)
        .map(p => ({
            title: p.title,
            slug: p.slug!,
            category: p.category || 'Prayer',
            type: 'prayer' as const
        }));

    // Parse liturgical rubrics (starting with >) and sacred prayer petitions
    const lines = prayer.content.split('\n');
    const rubrics: string[] = [];
    const bodyParagraphs: string[] = [];
    let inRubricSection = true;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        if (inRubricSection && line.startsWith('>')) {
            rubrics.push(line.replace(/^>\s*/, ''));
        } else {
            inRubricSection = false;
            bodyParagraphs.push(line);
        }
    }

    // Generate FAQs
    const faqs = getPrayerFAQs(prayer.category || 'general', prayer.title);
    const prayerUrl = `${BASE_URL}/prayers/${prayer.slug}`;

    // Find matching Intention Hub for topical authority linking
    const matchingHub = Object.values(CATHOLIC_INTENTIONS).find(hub => 
        (prayer.category && hub.categories.includes(prayer.category.toLowerCase())) ||
        hub.searchTerms.some(term => prayer.title.toLowerCase().includes(term))
    );

    // SEO Schema
    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${prayerUrl}#article`,
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'MyPrayerTower',
            url: BASE_URL,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': prayerUrl,
        },
        headline: prayer.title,
        description: prayer.content.slice(0, 160).replace(/\s+/g, ' ').trim(),
        datePublished: new Date().toISOString(),
        inLanguage: 'en-US',
        about: [
            { '@type': 'Thing', name: prayer.category || 'Catholic Prayer' },
            { '@type': 'Thing', name: 'Catholic Church' }
        ],
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'article .font-serif.text-lg'],
        },
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
        articleSection: prayer.category || 'Prayers'
    };

    const faqLd = faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    } : null;

    const breadcrumbs = [
        { label: 'Prayers', href: '/prayers' },
        { label: prayer.category || 'General', href: `/prayers?category=${prayer.category}` },
        { label: prayer.title, href: `/prayers/${prayer.slug}` },
    ];

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
            ...breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: crumb.label,
                item: `${BASE_URL}${crumb.href}`
            }))
        ]
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* SEO Data */}
            <ArticleJsonLd data={articleLd as any} />
            {faqLd && <FaqJsonLd data={faqLd as any} />}
            <BreadcrumbJsonLd data={breadcrumbsLd as any} />

            {/* Header / Nav */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/prayers"
                        className="flex items-center text-gray-500 hover:text-sacred-600 transition-colors font-medium text-sm"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Library
                    </Link>

                    <div className="flex items-center gap-4">
                        <ShareButtons
                            url={`/prayers/${params.slug}`}
                            title={prayer.title}
                            description={prayer.content.slice(0, 160)}
                            fullText={prayer.content}
                            contentType="prayer"
                            variant="compact"
                        />
                    </div>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 py-12">
                <Breadcrumbs items={breadcrumbs} />

                {/* Meta Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="h-px w-8 bg-gold-300"></span>
                        <span className="text-gold-600 text-xs font-bold tracking-widest uppercase">
                            {prayer.category_label || prayer.category}
                        </span>
                        <span className="h-px w-8 bg-gold-300"></span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                        {prayer.title}
                    </h1>

                    {prayer.tags && prayer.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {prayer.tags.map(tag => (
                                <Link
                                    key={tag}
                                    href={`/prayers?q=${encodeURIComponent(tag.replace(/^[^:]+:/, ''))}`}
                                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full text-xs font-medium border border-amber-200/50 transition-colors"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Topic Cluster: Link to Parent Intention Pillar */}
                    {matchingHub && (
                        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50/90 dark:bg-amber-950/60 border border-amber-200/80 text-xs text-amber-900 dark:text-amber-200 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>
                                Intention Guide:{' '}
                                <Link href={`/prayers/intention/${matchingHub.slug}`} className="font-bold underline hover:text-amber-700 ml-1">
                                    {matchingHub.title}
                                </Link>
                            </span>
                        </div>
                    )}
                </div>

                {/* Sacred Reader Experience & Content */}
                <PrayerReaderExperience
                    prayer={prayer}
                    rubrics={rubrics}
                    bodyParagraphs={bodyParagraphs}
                    prayerUrl={prayerUrl}
                />

                {/* Action Footer */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center justify-center gap-4">
                        <PrayerInteractions
                            prayerId={prayer.id}
                            prayerTitle={prayer.title}
                            initialCount={Math.floor(Math.random() * 50) + 10}
                        />
                    </div>

                    {/* Share CTA */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm mb-4 font-serif italic">
                            This prayer touched your heart? Share it with someone who needs it 🙏
                        </p>
                        <ShareButtons
                            url={`/prayers/${params.slug}`}
                            title={prayer.title}
                            description={prayer.content.slice(0, 160)}
                            fullText={prayer.content}
                            contentType="prayer"
                            label="Share This Prayer"
                            variant="cta"
                        />
                    </div>

                {/* Living Faith & Answered Graces Testimonials */}
                <AnsweredGraces category={prayer.category || undefined} />

                {/* Related Prayers */}
                {relatedItems.length > 0 && (
                    <RelatedContent items={relatedItems} title="Prayers offering similar graces" />
                )}

                {/* FAQ Section */}
                <FAQModule items={faqs} title={`Common Questions about ${prayer.title}`} />

                {/* Global CTA */}
                <DailyPrayerCTA />
            </article>
        </div>
    );
}
