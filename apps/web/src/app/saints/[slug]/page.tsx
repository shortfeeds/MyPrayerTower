import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Calendar, User, BookOpen } from 'lucide-react';
import { ShareButtons } from '@/components/social/ShareButtons';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FAQModule, FAQItem } from '@/components/seo/FAQModule';

interface Props {
    params: {
        slug: string;
    };
}

// SSG for all saints
export async function generateStaticParams() {
    // Limit to popular saints or all if list is manageable. 
    // Given the previous timeout on 250 pages, we might want to be careful here.
    // However, generateStaticParams only runs at build time. 
    // If we have 1000 saints, this might be slow but valid.
    // Let's fetch all slugs but rely on the build system's concurrency.
    // If it fails again, we can limit it.
    const saints = await db.saint.findMany({
        select: { slug: true },
        take: 60,
    });
    return saints.map((saint) => ({
        slug: saint.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const saint = await db.saint.findUnique({
        where: { slug: params.slug },
        select: { name: true, title: true, shortBio: true, imageUrl: true }
    });

    if (!saint) return { title: 'Saint Not Found' };

    const type = saint.title ? saint.title : 'Saint';
    const fullName = `${type} ${saint.name}`.trim();

    return {
        title: `${fullName} | Catholic Saints`,
        description: saint.shortBio || `Learn about the life, miracles, and patronage of ${fullName}.`,
        openGraph: {
            title: fullName,
            description: saint.shortBio || `Learn about the life of ${fullName}.`,
            images: saint.imageUrl ? [saint.imageUrl] : undefined,
            type: 'article',
            url: `https://myprayertower.com/saints/${params.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullName,
            description: saint.shortBio || `Learn about the life of ${fullName}.`,
            images: saint.imageUrl ? [saint.imageUrl] : undefined,
        },
        alternates: {
            canonical: `/saints/${params.slug}`,
        }
    };
}

export default async function SaintPage({ params }: Props) {
    const saint = await db.saint.findUnique({
        where: { slug: params.slug }
    });

    if (!saint) {
        notFound();
    }

    const title = saint.title ? saint.title : '';
    const fullName = `${title} ${saint.name}`.trim();

    // SEO Data
    // We can use 'Person' schema or 'Article' schema. Article is better for the biography content itself.
    // Adding Person as primary entity is also good.
    const personLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: saint.name,
        honorificPrefix: saint.title,
        description: saint.shortBio,
        image: saint.imageUrl,
        birthDate: saint.bornDate,
        deathDate: saint.diedDate,
        mainEntityOfPage: `https://myprayertower.com/saints/${saint.slug}`
    };

    const breadcrumbs = [
        { label: 'Saints', href: '/saints' },
        { label: fullName, href: `/saints/${saint.slug}` },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* SEO Scripts */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
            />
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
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 opacity-95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/saints"
                        className="flex items-center text-gray-500 hover:text-amber-600 transition-colors font-medium text-sm"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        All Saints
                    </Link>
                    <div className="flex items-center gap-4">
                        <ShareButtons
                            url={`/saints/${params.slug}`}
                            title={fullName}
                            description={saint.shortBio || `Learn about the life of ${fullName}.`}
                            contentType="saint"
                            variant="compact"
                        />
                    </div>
                </div>
            </div>

            <article className="container mx-auto px-4 py-12 max-w-4xl">
                <Breadcrumbs items={breadcrumbs} />

                {/* Hero Header */}
                <div className="text-center mb-12">
                    {saint.imageUrl && (
                        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl mb-8 relative bg-amber-50">
                            <Image
                                src={saint.imageUrl}
                                alt={fullName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        {saint.feastDay ? `Feast: ${saint.feastDay}` : 'Saint of God'}
                    </div>

                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        {fullName}
                    </h1>

                    {saint.patronOf && saint.patronOf.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                            <span className="text-sm font-bold text-gray-500 mr-2">Patron of:</span>
                            {saint.patronOf.map((patron, i) => (
                                <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-sm">
                                    {patron}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Facts Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto">
                    {saint.bornDate && (
                        <div className="bg-white p-4 rounded-2xl text-center border border-gray-100">
                            <div className="text-xs text-gray-400 uppercase font-bold mb-1">Born</div>
                            <div className="font-serif text-gray-900">{saint.bornDate}</div>
                        </div>
                    )}
                    {saint.diedDate && (
                        <div className="bg-white p-4 rounded-2xl text-center border border-gray-100">
                            <div className="text-xs text-gray-400 uppercase font-bold mb-1">Died</div>
                            <div className="font-serif text-gray-900">{saint.diedDate}</div>
                        </div>
                    )}
                    {saint.canonizedDate && (
                        <div className="bg-white p-4 rounded-2xl text-center border border-gray-100">
                            <div className="text-xs text-gray-400 uppercase font-bold mb-1">Canonized</div>
                            <div className="font-serif text-gray-900">{saint.canonizedDate}</div>
                        </div>
                    )}
                    <div className="bg-white p-4 rounded-2xl text-center border border-gray-100">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Feast</div>
                        <div className="font-serif text-gray-900">{saint.feastDay || 'Unknown'}</div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-600" />
                        Biography
                    </h2>

                    {saint.shortBio && (
                        <div className="text-xl font-serif leading-relaxed text-gray-800 mb-8 pb-8 border-b border-gray-100 italic">
                            {saint.shortBio}
                        </div>
                    )}

                    {saint.biography ? (
                        <div
                            className="prose prose-lg prose-stone prose-headings:font-serif prose-headings:font-bold prose-a:text-amber-600 max-w-none"
                            dangerouslySetInnerHTML={{ __html: saint.biography }}
                        />
                    ) : (
                        <p className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-xl px-4">
                            We are currently expanding our library. A detailed biography for {fullName} will be available soon.
                        </p>
                    )}
                </div>

                {/* Share CTA */}
                <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-sm mb-4 font-serif italic">
                        Inspire others with the story of {fullName} ✠️
                    </p>
                    <ShareButtons
                        url={`/saints/${params.slug}`}
                        title={fullName}
                        description={saint.shortBio || `Learn about the life of ${fullName}.`}
                        contentType="saint"
                        label="Share This Saint's Story"
                        variant="cta"
                    />
                </div>

                {/* FAQ Section */}
                {(() => {
                    const faqItems: FAQItem[] = [];

                    if (saint.feastDay) {
                        faqItems.push({
                            question: `When is the feast day of ${fullName}?`,
                            answer: `The feast day of ${fullName} is celebrated on <strong>${saint.feastDay}</strong>.`
                        });
                    }

                    if (saint.patronOf && saint.patronOf.length > 0) {
                        faqItems.push({
                            question: `What is ${fullName} the patron saint of?`,
                            answer: `${fullName} is the patron saint of ${saint.patronOf.join(', ')}.`
                        });
                    }

                    if (saint.bornDate || saint.diedDate) {
                        let answer = '';
                        if (saint.bornDate) answer += `${fullName} was born on ${saint.bornDate}. `;
                        if (saint.diedDate) answer += `He/She died on ${saint.diedDate}.`;

                        faqItems.push({
                            question: `When did ${fullName} live?`,
                            answer: answer.trim()
                        });
                    }

                    if (faqItems.length > 0) {
                        return (
                            <FAQModule
                                items={faqItems}
                                title={`Common Questions about ${fullName}`}
                            />
                        );
                    }
                    return null;
                })()}

            </article>
        </div>
    );
}
