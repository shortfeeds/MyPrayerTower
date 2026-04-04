import { getPostBySlug, getAllPosts } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Calendar, BookOpen, Share2, Rss, Layers, Tag, ArrowRight, Bookmark, MessageSquare, Sparkles, Mail } from 'lucide-react';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Metadata } from 'next';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { SocialShareBar } from '@/components/blog/SocialShareBar';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { FloatingShareBar } from '@/components/blog/FloatingShareBar';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { BlogAnalytics } from '@/components/analytics/BlogAnalytics';

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
        : `${BASE_URL}/blog-og-fallback.png`;

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
    const allCategories = Array.from(new Set(allPosts.map(post => post.category).filter(Boolean)));
    const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags || [])));


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
            <BlogAnalytics />
            {/* Social Floating Bar - Desktop Only */}
            <FloatingShareBar title={post.title} url={postUrl} />

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
            {/* Hero Top Bar with Progress */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/blog"
                        className="flex items-center text-gray-500 hover:text-sacred-950 transition-colors font-medium text-xs gap-2 group/back"
                    >
                        <ChevronLeft className="w-4 h-4 translate-x-0 group-hover/back:-translate-x-1 transition-transform" />
                        <span className="font-serif italic">Archive</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gold-600">
                            <Sparkles className="w-3.5 h-3.5" />
                            Premium Reflection
                        </div>
                        <SocialShareBar title={post.title} url={postUrl} description={post.description} />
                    </div>
                </div>
                <ReadingProgressBar />
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
                <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-16 xl:gap-24">

                    {/* Left Article Column */}
                    <article className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
                        {/* Header Section */}
                        <header className="mb-20">
                            <div className="flex items-center gap-3 mb-10">
                                <Link
                                    href={`/blog?category=${post.category}`}
                                    className="text-gold-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-gold-400/5 rounded-full border border-gold-400/10 hover:bg-gold-50 transition-colors"
                                >
                                    {categoryLabel}
                                </Link>
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-200" />
                                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
                                    {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
                                </span>
                            </div>

                            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[5.5rem] font-medium text-gray-900 mb-12 leading-[1] tracking-tight text-balance">
                                {post.title}
                            </h1>

                            <p className="text-gray-500 text-xl md:text-3xl leading-relaxed font-light mb-16 font-serif italic max-w-2xl text-balance">
                                {post.description}
                            </p>

                            <div className="flex items-center gap-5 border-y border-gray-100 py-10">
                                <div className="w-16 h-16 rounded-full bg-sacred-950 flex items-center justify-center text-white font-serif font-bold text-2xl shadow-xl ring-4 ring-gold-50/50">
                                    {(post.author?.name || 'M').charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="text-gray-900 font-bold text-lg leading-none mb-2">{post.author?.name || 'MyPrayerTower Team'}</div>
                                    <div className="text-gray-400 text-xs font-medium flex items-center gap-4">
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold-500" /> {post.readingTime || '5 min read'}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                                        <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-gold-500" /> Theological Reflection</span>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                   <button className="p-3 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gold-600 transition-colors">
                                       <Bookmark className="w-5 h-5" />
                                   </button>
                                </div>
                            </div>
                        </header>

                        {/* Article Body */}
                        <div id="article-body" className="blog-content prose prose-stone prose-lg max-w-none 
                            prose-headings:font-serif prose-headings:font-medium prose-headings:text-gray-900
                            prose-h2:text-4xl prose-h2:mt-24 prose-h2:mb-8 prose-h2:tracking-tight prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-50
                            prose-h3:text-2xl prose-h3:mt-16 prose-h3:mb-6
                            prose-p:text-xl prose-p:leading-[1.8] prose-p:text-gray-800 prose-p:mb-10
                            prose-a:text-sacred-700 prose-a:font-bold prose-a:underline prose-a:decoration-sacred-200 prose-a:underline-offset-4 hover:prose-a:decoration-sacred-600 transition-all
                            prose-img:rounded-sm prose-img:shadow-2xl prose-img:my-20
                            prose-li:text-xl prose-li:text-gray-800 prose-li:mb-4
                            prose-strong:text-gray-900 prose-strong:font-bold
                        ">
                            <MDXRemote source={post.content} components={MDXComponents} />
                        </div>

                        {/* After-Article Ad */}
                        <div className="my-12">
                            <SmartAdSlot page="blog" position="bottom" showPlaceholder={false} />
                        </div>

                        {/* Editorial Divider */}
                        <div className="blog-section-divider">
                            <span />
                            <span className="scale-150 bg-gold-400" />
                            <span />
                        </div>

                        {/* Footer Signature */}
                        <div className="bg-sacred-50/50 border border-sacred-100 rounded-2xl p-10 text-center mb-20 italic font-serif text-sacred-800 text-lg">
                            "O Mary, conceived without sin, pray for us who have recourse to thee."
                        </div>

                        {/* Pagination */}
                        <div className="grid sm:grid-cols-2 gap-10 py-16 border-t border-gray-100">
                            {prevPost ? (
                                <Link href={`/blog/${prevPost.slug}`} className="group space-y-4">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gold-600">Previous Reading</div>
                                    <h4 className="font-serif text-2xl font-bold text-gray-900 group-hover:text-sacred-600 transition-colors leading-snug">
                                        {prevPost.title}
                                    </h4>
                                </Link>
                            ) : <div />}
                            {nextPost ? (
                                <Link href={`/blog/${nextPost.slug}`} className="group space-y-4 text-right">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gold-600">Next Reading</div>
                                    <h4 className="font-serif text-2xl font-bold text-gray-900 group-hover:text-sacred-600 transition-colors leading-snug">
                                        {nextPost.title}
                                    </h4>
                                </Link>
                            ) : <div />}
                        </div>

                    </article>

                    {/* ─── Premium Sidebar ─── */}
                    <aside className="w-full lg:w-80 lg:shrink-0">
                        <div className="blog-sticky-sidebar space-y-16">

                            {/* Author Box */}
                            <div className="bg-sacred-50 border border-sacred-100/50 rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-gold-400 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
                                <div className="w-20 h-20 rounded-full bg-sacred-950 mx-auto mb-6 flex items-center justify-center text-2xl font-serif text-white shadow-xl ring-4 ring-gold-50 relative z-10">
                                    M
                                </div>
                                <h3 className="font-serif font-bold text-gray-900 text-center text-xl mb-4 relative z-10">MyPrayerTower</h3>
                                <p className="text-[11px] text-gray-500 leading-relaxed text-center mb-8 relative z-10 text-balance italic">
                                    Providing a digital sanctuary for the modern faithful through beautiful technology and clear teaching.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Link href="https://t.me/MyPrayerTowerBot" className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-sacred-950 hover:bg-gold-500 hover:text-white transition-all">
                                        Join Bot
                                    </Link>
                                    <Link href="/prayer-wall" className="px-4 py-2 bg-sacred-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gold-600 transition-all">
                                        Prayer Wall
                                    </Link>
                                </div>
                            </div>

                            {/* Newsletter Signup - High Conversion */}
                            <div className="bg-white border-2 border-gold-500/10 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gold-600 mb-4">
                                    <Mail className="w-3.5 h-3.5" />
                                    Daily Grace
                                </div>
                                <h4 className="font-serif font-bold text-lg mb-4 text-gray-900">Spiritual Nourishment</h4>
                                <p className="text-[11px] text-gray-400 mb-6 leading-relaxed">
                                    Join 5,000+ faithful receiving daily reflections and prayer alerts.
                                </p>
                                <form className="space-y-3">
                                    <input 
                                        type="email" 
                                        placeholder="your@email.com" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                                    />
                                    <button className="w-full bg-sacred-950 text-white font-black text-[10px] py-4 rounded-xl hover:bg-gold-500 transition-all uppercase tracking-widest">
                                        Subscribe
                                    </button>
                                </form>
                            </div>

                            {/* Table of Contents */}
                            <div className="px-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 border-b border-gray-100 pb-4">
                                    Navigation
                                </h4>
                                <TableOfContents />
                            </div>

                            {/* Related Readings */}
                            <div className="px-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 border-b border-gray-100 pb-4">
                                    Deepen Your Study
                                </h4>
                                <div className="space-y-10">
                                    {displayRelated.map((rp) => (
                                        <Link key={rp.slug} href={`/blog/${rp.slug}`} className="block group">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-600 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {rp.category}
                                            </div>
                                            <h5 className="font-serif text-lg font-medium text-gray-900 group-hover:text-gold-600 transition-colors leading-tight mb-3">
                                                {rp.title}
                                            </h5>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-medium text-gray-400 italic">
                                                    {format(new Date(rp.publishedAt), 'MMMM d')}
                                                </span>
                                                <div className="w-1 h-1 rounded-full bg-gray-100" />
                                                <span className="text-[10px] font-medium text-gray-400">
                                                    {rp.readingTime || '5 min read'}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* App CTA */}
                            <div className="bg-sacred-950 rounded-3xl p-10 text-center text-white shadow-2xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-gold-400/20 rounded-full blur-3xl group-hover:bg-gold-400/30 transition-all duration-700" />
                                <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-6 opacity-50 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-700" />
                                <h4 className="font-serif font-medium text-2xl mb-6 relative z-10 text-balance leading-tight">Your Daily Companion in Prayer</h4>
                                <p className="text-xs text-sacred-200 mb-10 leading-relaxed opacity-80 relative z-10 font-light">
                                    Access offline prayers, guided novenas, and a personal prayer journal. Fully free, always meaningful.
                                </p>
                                <Link
                                    href="https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app"
                                    className="block w-full bg-gold-500 text-sacred-950 text-[11px] font-black py-4.5 rounded-2xl hover:bg-white hover:text-sacred-950 transition-all active:scale-95 relative z-10 uppercase tracking-[0.2em]"
                                >
                                    GET THE APP
                                </Link>
                            </div>

                        </div>
                    </aside>
                </div>
            </div>

            {/* Scroll to Top / Floating Actions for Mobile */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <SocialShareBar title={post.title} url={postUrl} />
            </div>
        </div>
    );
}

