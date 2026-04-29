import { getPrayerBySlug, getLibraryPrayers } from '@/app/actions/prayer-library';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PrayerInteractions } from '@/components/prayer/PrayerInteractions';
import { ShareButtons } from '@/components/social/ShareButtons';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { FAQModule } from '@/components/seo/FAQModule';
import { DailyPrayerCTA } from '@/components/seo/DailyPrayerCTA';
import { getPrayerFAQs } from '@/lib/seo/prayerFAQs';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const prayer = await getPrayerBySlug(params.slug);

    if (!prayer) {
        return {
            title: 'Prayer Not Found',
        };
    }

    const title = `${prayer.title} — Powerful Catholic Prayer for ${prayer.category || 'Help'} (With Reflection)`;

    return {
        title: `${title} | MyPrayerTower`,
        description: prayer.content.slice(0, 160),
        keywords: prayer.tags,
        alternates: {
            canonical: `https://myprayertower.com/prayers/${params.slug}`
        },
        openGraph: {
            title: title,
            description: prayer.content.slice(0, 160),
            type: 'article',
            publishedTime: new Date().toISOString(), // In real app, use updated_at
            authors: ['MyPrayerTower'],
        }
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

    // Simple formatting for content: split by newlines and wrap in paragraphs
    const paragraphs = prayer.content.split('\n').filter(p => p.trim() !== '');

    // Generate FAQs
    const faqs = getPrayerFAQs(prayer.category || 'general', prayer.title);

    // SEO Schema
    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: prayer.title,
        description: prayer.content.slice(0, 160),
        datePublished: new Date().toISOString(), // Mock for now, should be DB field
        author: {
            '@type': 'Organization',
            name: 'MyPrayerTower',
        },
        publisher: {
            '@type': 'Organization',
            name: 'MyPrayerTower',
            logo: {
                '@type': 'ImageObject',
                url: 'https://myprayertower.com/icon.png'
            }
        },
        articleSection: prayer.category || 'Prayers'
    };

    const breadcrumbs = [
        { label: 'Prayers', href: '/prayers' },
        { label: prayer.category || 'General', href: `/prayers?category=${prayer.category}` },
        { label: prayer.title, href: `/prayers/${prayer.slug}` },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* SEO Data */}
            <ArticleJsonLd data={articleLd as any} />
            <BreadcrumbJsonLd data={{
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbs.map((crumb, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: crumb.label,
                    item: `https://myprayertower.com${crumb.href}`
                }))
            }} />

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
                        <span className="text-gold-500 text-xs font-bold tracking-widest uppercase">
                            {prayer.category}
                        </span>
                        <span className="h-px w-8 bg-gold-300"></span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                        {prayer.title}
                    </h1>

                    {prayer.tags && prayer.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {prayer.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Prayer Content Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 relative overflow-hidden mb-16">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300"></div>
                    <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>

                    {/* Text Content */}
                    <div className="font-serif text-lg md:text-xl leading-loose text-gray-800 space-y-6">
                        {paragraphs.map((paragraph, idx) => (
                            <p key={idx} className={idx === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:text-gold-600 first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]" : ""}>
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Amen footer */}
                    <div className="mt-16 text-center">
                        <p className="font-serif text-2xl italic text-gray-400">Amen.</p>
                    </div>

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
                            contentType="prayer"
                            label="Share This Prayer"
                            variant="cta"
                        />
                    </div>
                </div>

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
