import { getAllPosts } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, Calendar, ChevronRight, Tag, BookOpen, Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Catholic Blog & Spiritual Reflections | MyPrayerTower',
    description: 'Read the latest Catholic articles, prayer guides, and spiritual reflections to deepen your faith journey.',
    openGraph: {
        title: 'Catholic Blog & Spiritual Reflections | MyPrayerTower',
        description: 'Read the latest Catholic articles, prayer guides, and spiritual reflections to deepen your faith journey.',
        type: 'website',
        url: 'https://myprayertower.com/blog',
    }
};

import { BlogSearch } from '@/components/blog/BlogSearch';

export default async function BlogHubPage() {
    const posts = await getAllPosts();
    const featuredPost = posts.find(p => p.featured) || posts[0];
    const recentPosts = posts.filter(p => p.slug !== featuredPost?.slug);

    return (
        <div className="min-h-screen bg-[#fffefc] selection:bg-gold-100 selection:text-sacred-900">
            {/* Minimal Hero Section */}
            <div className="bg-white border-b border-gray-100 pt-24 pb-20">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-sacred-50 text-sacred-700 text-[11px] font-bold tracking-widest uppercase mb-6">
                        <Sparkles className="w-3 h-3" />
                        The MyPrayerTower Blog
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl font-medium text-gray-900 mb-6 tracking-tight text-balance">
                        Faith, Prayer & <span className="italic text-gray-400 font-light">Life</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed text-balance mb-12">
                        Timeless Catholic wisdom for the modern soul. Explore reflections on prayer, the saints, and living out your vocation.
                    </p>

                    {/* Live Search Implementation */}
                    <div className="max-w-xl mx-auto">
                        <BlogSearch />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">

                {/* Featured Post - Text Only */}
                {featuredPost && (
                    <div className="mb-20 max-w-5xl mx-auto">
                        <Link href={`/blog/${featuredPost.slug}`} className="group block text-center md:text-left">
                            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 via-sacred-400 to-gold-300 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex flex-col md:flex-row md:items-start gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-gray-400 mb-6 font-medium uppercase tracking-widest">
                                            <span className="text-gold-600 font-bold">{featuredPost.category}</span>
                                            <span className="w-px h-3 bg-gray-200" />
                                            <span>{format(new Date(featuredPost.publishedAt), 'MMMM d, yyyy')}</span>
                                        </div>

                                        <h2 className="font-serif text-3xl md:text-5xl font-medium text-gray-900 mb-6 group-hover:text-sacred-700 transition-colors leading-[1.1] text-balance">
                                            {featuredPost.title}
                                        </h2>

                                        <p className="text-gray-500 text-lg line-clamp-3 leading-relaxed mb-8 max-w-2xl">
                                            {featuredPost.description}
                                        </p>

                                        <div className="inline-flex items-center text-sacred-900 font-bold text-sm border-b-2 border-sacred-200 pb-0.5 group-hover:border-sacred-600 transition-colors">
                                            Read Article <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </div>
                                    </div>

                                    {/* Decorative Element instead of Image */}
                                    <div className="hidden md:block w-px h-64 bg-gray-100 self-center mx-8" />

                                    <div className="hidden md:block w-48 shrink-0 text-right space-y-4 pt-2">
                                        <div className="text-xs font-serif text-gray-400 italic">
                                            "In prayer, we find the silence where God speaks."
                                        </div>
                                        {featuredPost.readingTime && (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-500">
                                                <Clock className="w-3 h-3" /> {featuredPost.readingTime}
                                            </div>
                                        )}
                                        {featuredPost.author?.name && (
                                            <div className="flex items-center justify-end gap-2 text-xs text-gray-900 font-bold">
                                                <div className="w-6 h-6 rounded-full bg-sacred-100 flex items-center justify-center text-sacred-700">
                                                    {featuredPost.author.name.charAt(0)}
                                                </div>
                                                {featuredPost.author.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Recent Posts Grid - Masonry-ish Text Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {recentPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gold-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Meta */}
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600">
                                    {post.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(post.publishedAt), 'MMM d')}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="font-serif text-2xl font-medium text-gray-900 mb-4 group-hover:text-sacred-700 transition-colors leading-[1.2]">
                                {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
                                {post.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-900">
                                    {post.author?.name ? (
                                        <>
                                            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-500">
                                                {post.author.name.charAt(0)}
                                            </span>
                                            {post.author.name}
                                        </>
                                    ) : 'MPT Team'}
                                </div>

                                {post.readingTime && (
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {post.readingTime}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No articles yet</h3>
                        <p className="text-gray-500">We are preparing some amazing content for you. Check back soon!</p>
                    </div>
                )}
            </div>

            {/* Newsletter / CTA Section at bottom */}
            <div className="container mx-auto px-4 pb-20 pt-8">
                <div className="bg-sacred-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden max-w-5xl mx-auto">
                    <div className="hidden md:absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
                    <div className="relative z-10">
                        <BookOpen className="w-10 h-10 text-gold-500 mx-auto mb-6" />
                        <h2 className="font-serif text-3xl md:text-4xl font-medium text-white mb-4">
                            Nourish Your Soul Daily
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
                            Join thousands of Catholics using MyPrayerTower to build a consistent prayer life.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-white text-sacred-900 font-bold py-3.5 px-8 rounded-full hover:bg-gold-50 transition-colors"
                        >
                            Download the App
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
