import { getPostBySlug, getAllPosts } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Calendar, BookOpen, Share2, Rss, Layers, Tag, ArrowRight } from 'lucide-react';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Metadata } from 'next';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { SocialShareBar } from '@/components/blog/SocialShareBar';
import { TableOfContents } from '@/components/blog/TableOfContents';

interface Props {
    params: {
        slug: string;
    };
}

const BASE_URL = 'https://myprayertower.com';

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    if (!post) return { title: 'Post Not Found' };

    const ogImage = post.image
        ? `${BASE_URL}${post.image}`
        : `${BASE_URL}/og-default.png`;

    return {
        title: `${post.title} | MyPrayerTower Blog`,
        description: post.description,
        keywords: post.tags?.join(', '),
        authors: post.author?.name ? [{ name: post.author.name }] : undefined,
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt || post.publishedAt,
            section: post.category,
            tags: post.tags,
            authors: post.author?.name ? [post.author.name] : undefined,
            images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
            url: `${BASE_URL}/blog/${params.slug}`,
            siteName: 'MyPrayerTower',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: [ogImage],
        },
        alternates: {
            canonical: `${BASE_URL}/blog/${params.slug}`,
        },
        other: {
            'article:published_time': post.publishedAt,
            'article:modified_time': post.updatedAt || post.publishedAt,
            'article:section': post.category,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const post = await getPostBySlug(params.slug);
    if (!post) notFound();

    // Get all posts for prev/next navigation and related
    const allPosts = await getAllPosts();
    const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
    const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    // Related posts: same category, excluding current
    const relatedPosts = allPosts
        .filter(p => p.slug !== post.slug && p.category === post.category)
        .slice(0, 3);

    // If not enough same-category posts, fill with recent
    const recentFill = relatedPosts.length < 3
        ? allPosts.filter(p => p.slug !== post.slug && !relatedPosts.find(r => r.slug === p.slug)).slice(0, 3 - relatedPosts.length)
        : [];
    const displayRelated = [...relatedPosts, ...recentFill];

    // Collect unique categories and tags across all posts for sidebar
    const allCategories = [...new Set(allPosts.map(p => p.category).filter(Boolean))];
    const allTags = [...new Set(allPosts.flatMap(p => p.tags || []))];


    const categoryLabel = post.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const postUrl = `${BASE_URL}/blog/${post.slug}`;

    // Enhanced JSON-LD — BlogPosting type w/ wordCount
    const wordCount = post.content.split(/\s+/).length;
    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
        },
        headline: post.title,
        description: post.description,
        image: post.image ? `${BASE_URL}${post.image}` : undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        wordCount,
        articleSection: post.category,
        keywords: post.tags?.join(', '),
        author: {
            '@type': 'Person',
            name: post.author?.name || 'MyPrayerTower Team',
            url: post.author?.url || BASE_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: 'MyPrayerTower',
            url: BASE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
                width: 512,
                height: 512,
            },
        },
        isAccessibleForFree: true,
    };

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: categoryLabel, href: `/blog/category/${post.category}` },
        { label: post.title, href: `/blog/${post.slug}` },
    ];

    return (
        <div className="min-h-screen bg-[#fffefc] selection:bg-gold-100 selection:text-sacred-900">
            {/* Reading Progress Bar */}
            <ReadingProgressBar />

            {/* SEO Schema */}
            <ArticleJsonLd data={articleLd as any} />
            <BreadcrumbJsonLd data={{
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbItems.map((crumb, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: crumb.label,
                    item: `${BASE_URL}${crumb.href}`,
                })),
            }} />

            {/* Sticky Article Top Bar */}
            <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all duration-300">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <Link
                        href="/blog"
                        className="flex items-center text-gray-500 hover:text-sacred-600 transition-colors font-medium text-sm gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline font-serif italic">Return to Blog</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <SocialShareBar title={post.title} url={postUrl} description={post.description} />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Left Article Column */}
                    <article className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
                        {/* Header Section */}
                        <header className="mb-14 text-center lg:text-left">
                            <Link
                                href={`/blog/category/${post.category}`}
                                className="inline-block text-gold-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-6 hover:text-sacred-600 transition-colors"
                            >
                                {categoryLabel}
                            </Link>

                            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-medium text-gray-900 mb-8 leading-[1.1] tracking-tight text-balance">
                                {post.title}
                            </h1>

                            <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-light mb-10 text-balance font-serif italic">
                                {post.description}
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm border-t border-b border-gray-100 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-serif font-bold text-lg">
                                        {(post.author?.name || 'M').charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-gray-900 font-medium text-sm">{post.author?.name || 'MyPrayerTower'}</div>
                                    </div>
                                </div>

                                <span className="hidden sm:block w-px h-8 bg-gray-100" />

                                <div className="flex items-center gap-2 text-gray-500">
                                    <Calendar className="w-4 h-4 text-gray-300" />
                                    <time dateTime={post.publishedAt}>
                                        {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                                    </time>
                                </div>

                                {post.readingTime && (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <Clock className="w-4 h-4 text-gray-300" />
                                        <span>{post.readingTime}</span>
                                    </div>
                                )}
                            </div>
                        </header>

                        {/* Article Body */}
                        <div id="article-body" className="prose prose-lg prose-stone max-w-none
                            prose-headings:font-serif prose-headings:font-medium prose-headings:text-gray-900
                            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:tracking-tight
                            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                            prose-p:leading-[1.8] prose-p:text-gray-700 prose-p:mb-8
                            prose-a:text-sacred-700 prose-a:font-medium prose-a:underline prose-a:decoration-sacred-200 prose-a:underline-offset-4 hover:prose-a:decoration-sacred-600 hover:prose-a:text-sacred-900 transition-colors
                            prose-blockquote:border-l-2 prose-blockquote:border-gold-400 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:text-gray-800 prose-blockquote:my-12
                            prose-ul:my-8 prose-li:my-2 prose-li:text-gray-700
                            prose-img:rounded-sm prose-img:shadow-none prose-img:my-12 prose-img:w-full prose-img:aspect-[16/9] prose-img:object-cover prose-img:bg-gray-50
                            prose-code:text-sacred-700 prose-code:bg-sacred-50 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                        ">
                            <MDXRemote source={post.content} components={MDXComponents} />
                        </div>

                        {/* Tags & Share */}
                        <div className="mt-16 pt-8 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2 mb-8">
                                {post.tags?.map(tag => (
                                    <span key={tag} className="text-xs font-medium bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Prev / Next Navigation Minimal */}
                        <div className="grid sm:grid-cols-2 gap-8 py-10 border-t border-gray-100">
                            {prevPost && (
                                <Link
                                    href={`/blog/${prevPost.slug}`}
                                    className="group block"
                                >
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1 group-hover:text-gold-600">
                                        <ChevronLeft className="w-3 h-3" /> Previous
                                    </div>
                                    <h4 className="font-serif text-lg font-medium text-gray-800 leading-snug">
                                        {prevPost.title}
                                    </h4>
                                </Link>
                            )}
                            {nextPost && (
                                <Link
                                    href={`/blog/${nextPost.slug}`}
                                    className="group block text-right ml-auto"
                                >
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1 justify-end group-hover:text-gold-600">
                                        Next <ChevronRight className="w-3 h-3" />
                                    </div>
                                    <h4 className="font-serif text-lg font-medium text-gray-800 leading-snug">
                                        {nextPost.title}
                                    </h4>
                                </Link>
                            )}
                        </div>

                    </article>

                    {/* ─── Right Sidebar ─── */}
                    <aside className="w-full lg:w-72 lg:shrink-0 hidden lg:block">
                        <div className="sticky top-24 space-y-12">

                            {/* Author Intro */}
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-sacred-50 mx-auto mb-4 flex items-center justify-center text-2xl font-serif text-sacred-900 border border-sacred-100">
                                    M
                                </div>
                                <h3 className="font-serif font-bold text-gray-900 mb-2">MyPrayerTower</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    Deepening the Catholic faith through digital prayer tools and timeless wisdom.
                                </p>
                            </div>

                            {/* Table of Contents */}
                            <div className="relative">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">
                                    On this page
                                </h4>
                                <TableOfContents />
                            </div>

                            {/* Minimal Related Articles */}
                            {displayRelated.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">
                                        Read Next
                                    </h4>
                                    <div className="space-y-6">
                                        {displayRelated.slice(0, 3).map((rp) => (
                                            <Link
                                                key={rp.slug}
                                                href={`/blog/${rp.slug}`}
                                                className="block group"
                                            >
                                                <h5 className="font-serif text-base text-gray-800 leading-snug group-hover:text-gold-600 transition-colors mb-1">
                                                    {rp.title}
                                                </h5>
                                                <span className="text-[10px] text-gray-400">
                                                    {format(new Date(rp.publishedAt), 'MMM d, yyyy')}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Minimal CTA */}
                            <div className="bg-sacred-50 p-6 rounded-lg text-center">
                                <h4 className="font-serif font-bold text-sacred-900 mb-2">Pray Daily</h4>
                                <p className="text-xs text-sacred-700 mb-4 leading-relaxed">
                                    Join thousands of Catholics growing in faith with MyPrayerTower.
                                </p>
                                <Link
                                    href="/"
                                    className="block w-full bg-sacred-900 text-white text-xs font-bold py-3 px-4 rounded hover:bg-sacred-800 transition-colors"
                                >
                                    Download App
                                </Link>
                            </div>

                        </div>
                    </aside>
                </div>
            </div>

            {/* CTA Section for Mobile (bottom of page) */}
            <div className="lg:hidden container mx-auto px-4 pb-12">
                <div className="bg-sacred-50 p-8 rounded-xl text-center">
                    <h4 className="font-serif font-bold text-sacred-900 text-xl mb-3">Begin Your Prayer Journey</h4>
                    <p className="text-sm text-sacred-700 mb-6 leading-relaxed max-w-md mx-auto">
                        Track prayers, novenas, and daily readings. The MyPrayerTower app is designed to help you build a consistent prayer habit.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-sacred-900 text-white text-sm font-bold py-3 px-8 rounded hover:bg-sacred-800 transition-colors"
                    >
                        Download Free App
                    </Link>
                </div>
            </div>
        </div>
    );
}

