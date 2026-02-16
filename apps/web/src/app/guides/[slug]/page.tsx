import { getGuideBySlug, getAllGuides } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft, Clock, Calendar, Share2, User } from 'lucide-react';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { Metadata } from 'next';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const guides = await getAllGuides();
    return guides.map((guide) => ({
        slug: guide.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const guide = await getGuideBySlug(params.slug);
    if (!guide) return { title: 'Guide Not Found' };

    return {
        title: guide.title,
        description: guide.description,
        openGraph: {
            title: guide.title,
            description: guide.description,
            type: 'article',
            publishedTime: guide.publishedAt,
            authors: guide.author?.name ? [guide.author.name] : undefined,
            images: guide.image ? [guide.image] : undefined,
            url: `https://myprayertower.com/guides/${params.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: guide.title,
            description: guide.description,
            images: guide.image ? [guide.image] : undefined,
        },
        alternates: {
            canonical: `/guides/${params.slug}`,
        }
    };
}

export default async function GuidePage({ params }: Props) {
    const guide = await getGuideBySlug(params.slug);

    if (!guide) {
        notFound();
    }

    // JSON-LD Data
    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        image: guide.image ? `https://myprayertower.com${guide.image}` : undefined,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt || guide.publishedAt,
        author: {
            '@type': 'Person',
            name: guide.author?.name || 'MyPrayerTower Team',
        },
        publisher: {
            '@type': 'Organization',
            name: 'MyPrayerTower',
            logo: {
                '@type': 'ImageObject',
                url: 'https://myprayertower.com/logo.png'
            }
        },
    };

    const breadcrumbs = [
        { label: 'Guides', href: '/guides' },
        { label: guide.title, href: `/guides/${guide.slug}` },
    ];

    // Related Content Mock (In real app, fetch based on tags/category)
    const relatedItems = guide.relatedGuides ? await Promise.all(
        guide.relatedGuides.map(slug => getGuideBySlug(slug))
    ).then(items => items.filter(Boolean).map(item => ({
        title: item!.title,
        slug: item!.slug,
        category: item!.category,
        type: 'guide' as const
    }))) : [];

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
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 opacity-95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/guides"
                        className="flex items-center text-gray-500 hover:text-sacred-600 transition-colors font-medium text-sm"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        All Guides
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
                            {guide.category}
                        </span>
                    </div>
                </div>
            </div>

            <article className="container mx-auto px-4 py-12 max-w-4xl">
                <Breadcrumbs items={breadcrumbs} />

                {/* Article Header */}
                <div className="text-center mb-16">
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                        {guide.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {guide.author?.name || 'MyPrayerTower Team'}
                        </div>
                        <div className="flex items-center gap-2" suppressHydrationWarning>
                            <Calendar className="w-4 h-4" />
                            {format(new Date(guide.publishedAt), 'MMMM d, yyyy')}
                        </div>
                        {guide.readingTime && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {guide.readingTime}
                            </div>
                        )}
                    </div>
                </div>

                {/* Featured Image (if exists) */}
                {guide.image && (
                    <div className="rounded-2xl overflow-hidden shadow-xl mb-16 aspect-video bg-gray-100 relative">
                        {/* Placeholder for actual Next.js Image component if using remote images */}
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${guide.image})` }} />
                    </div>
                )}

                {/* Content Body */}
                <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100">
                    <div className="prose prose-lg prose-stone prose-headings:font-serif prose-headings:font-bold prose-a:text-gold-600 max-w-none">
                        <MDXRemote source={guide.content} components={MDXComponents} />
                    </div>
                </div>

                {/* Related Content */}
                {relatedItems.length > 0 && (
                    <div className="mt-16">
                        <RelatedContent items={relatedItems} />
                    </div>
                )}
            </article>
        </div>
    );
}
