import { getAllPosts } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, Calendar, ChevronRight, BookOpen, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { BlogAnalytics } from '@/components/analytics/BlogAnalytics';

export const metadata: Metadata = {
    title: 'Catholic Blog & Spiritual Index | MyPrayerTower',
    description: 'Explore 300+ deep-dive articles on Catholic prayer, the lives of the saints, liturgical traditions, and modern spiritual life.',
    openGraph: {
        title: 'Catholic Blog & Spiritual Index | MyPrayerTower',
        description: 'Explore 300+ deep-dive articles on Catholic prayer and spiritual life.',
        type: 'website',
        url: 'https://myprayertower.com/blog',
    }
};

const CATEGORIES = [
    { label: 'All', id: 'all' },
    { label: 'Prayer', id: 'prayer' },
    { label: 'Saints', id: 'saints' },
    { label: 'Liturgy', id: 'liturgy' },
    { label: 'Catholic Life', id: 'catholic-life' },
    { label: 'Novenas', id: 'novena' },
    { label: 'How-To', id: 'how-to' },
];

export default async function BlogHubPage({
    searchParams,
}: {
    searchParams: { category?: string; page?: string };
}) {
    const activeCategory = searchParams.category || 'all';
    const currentPage = parseInt(searchParams.page || '1');
    const postsPerPage = 12;

    let allPosts = await getAllPosts();
    
    // Filter by category if needed
    if (activeCategory !== 'all') {
        allPosts = allPosts.filter(p => p.category === activeCategory);
    }

    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    
    const featuredPost = allPosts.find(p => p.featured) || allPosts[0];
    
    // Pagination slicing
    const startIndex = (currentPage - 1) * postsPerPage;
    const displayedPosts = allPosts.slice(startIndex, startIndex + postsPerPage);

    return (
        <div className="min-h-screen bg-[#fffefc] selection:bg-sacred-100 selection:text-sacred-900">
            <BlogAnalytics />
            {/* Elegant Hero Section */}
            <div className="relative bg-sacred-950 pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/patterns/catholic-pattern.svg')] opacity-[0.03] scale-150 rotate-12" />
                <div className="absolute inset-0 bg-gradient-to-b from-sacred-950 via-transparent to-sacred-950/50" />
                
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                        <Sparkles className="w-3 h-3" />
                        The Spiritual Index
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl font-medium text-white mb-8 tracking-tight">
                        Timeless Wisdom for the <br />
                        <span className="italic font-light text-gold-200">Modern Soul</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                        Explore our library of 300+ guides, reflections, and prayers designed to nourish your daily walk with Christ.
                    </p>

                    <div className="max-w-2xl mx-auto">
                        <BlogSearch />
                    </div>
                </div>
            </div>

            {/* Category Navigation Bar */}
            <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-1 min-w-max">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/blog?category=${cat.id}`}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-sacred-900 text-white shadow-lg shadow-sacred-900/20'
                                        : 'text-gray-500 hover:text-sacred-900 hover:bg-gray-50'
                                }`}
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                
                {/* Featured Headline Post - Large Magazine Style */}
                {currentPage === 1 && featuredPost && activeCategory === 'all' && (
                    <div className="mb-24 max-w-6xl mx-auto">
                        <Link href={`/blog/${featuredPost.slug}`} className="group relative block overflow-hidden rounded-[2.5rem] bg-stone-100 border border-gray-100 shadow-2xl transition-all hover:shadow-gold-100/50">
                            <div className="flex flex-col lg:flex-row min-h-[500px]">
                                <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-xs font-black uppercase tracking-widest text-gold-600 px-3 py-1 bg-gold-50 rounded-lg">Featured</span>
                                        <span className="text-xs text-gray-400 font-medium">{featuredPost.category.replace('-', ' ')}</span>
                                    </div>
                                    <h2 className="font-serif text-4xl md:text-6xl text-gray-900 font-medium mb-8 leading-[1.1] group-hover:text-sacred-800 transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-gray-500 text-xl font-light leading-relaxed mb-10 line-clamp-3">
                                        {featuredPost.description}
                                    </p>
                                    <div className="mt-auto flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-sacred-900 flex items-center justify-center text-white font-bold text-sm">
                                                {featuredPost.author?.name?.charAt(0) || 'M'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{featuredPost.author?.name || 'MPT Team'}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Spiritual Contributor</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-200" />
                                        <div className="text-[10px] uppercase font-black tracking-widest flex items-center gap-2 text-sacred-600">
                                            Read More <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:w-1/2 relative bg-stone-200 overflow-hidden min-h-[300px]">
                                    {/* Abstract Religious Pattern as Placeholder if no image */}
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544427928-c49cdfebf49c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-transparent to-stone-100" />
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Main Articles Grid */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                                {activeCategory !== 'all' ? `Category: ${activeCategory}` : 'Latest Reflections'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-300 font-medium">Page {currentPage} of {totalPages}</span>
                    </div>
                </div>
                
                {/* Modern Editorial Grid */}
                <div className="container mx-auto px-4 pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                        {displayedPosts.map((post, idx) => (
                            <div key={post.slug} className="group flex flex-col">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="flex flex-col pt-8 border-t border-gray-100 hover:border-gold-500/30 transition-all duration-500 h-full"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-sacred-50 text-sacred-600 rounded-lg group-hover:bg-sacred-950 group-hover:text-gold-400 transition-all duration-500">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 group-hover:text-sacred-950 transition-colors">
                                            {post.category}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
                                            {format(new Date(post.publishedAt), 'MMM dd')}
                                        </span>
                                    </div>

                                    <h2 className="font-serif text-2xl md:text-3xl font-medium text-gray-900 mb-6 leading-[1.2] group-hover:text-gold-600 transition-colors line-clamp-3">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-500 text-sm leading-relaxed font-light mb-8 line-clamp-3 font-serif italic">
                                        {post.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <Clock className="w-3.5 h-3.5 text-gold-500" />
                                            {post.readingTime || '5 min read'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-sacred-950 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                                            Read Reflection
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </Link>

                                {/* Periodic Ad Spot */}
                                {(idx + 1) % 6 === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-10 mt-10 border-t border-gray-50">
                                        <SmartAdSlot page="blog" position="inline" showPlaceholder={false} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {displayedPosts.length === 0 && (
                        <div className="text-center py-40">
                            <BookOpen className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif text-gray-900 mb-2">No articles found</h3>
                            <p className="text-gray-500 font-light">Try adjusting your filters or search query.</p>
                            <Link href="/blog" className="mt-8 inline-block text-sacred-900 font-bold border-b-2 border-sacred-100 hover:border-sacred-900 transition-all">Clear Filters</Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-center gap-4">
                            {currentPage > 1 && (
                                <Link
                                    href={`/blog?category=${activeCategory}&page=${currentPage - 1}`}
                                    className="px-6 py-3 rounded-full bg-white border border-gray-100 text-xs font-bold text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <ChevronRight className="w-3 h-3 rotate-180" /> Previous
                                </Link>
                            )}
                            
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const p = i + 1;
                                    return (
                                        <Link
                                            key={p}
                                            href={`/blog?category=${activeCategory}&page=${p}`}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                                currentPage === p
                                                    ? 'bg-sacred-900 text-white shadow-lg'
                                                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        >
                                            {p}
                                        </Link>
                                    );
                                })}
                                {totalPages > 5 && <span className="text-gray-300">...</span>}
                            </div>

                            {currentPage < totalPages && (
                                <Link
                                    href={`/blog?category=${activeCategory}&page=${currentPage + 1}`}
                                    className="px-6 py-3 rounded-full bg-white border border-gray-100 text-xs font-bold text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    Next <ChevronRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Newsletter Subscription or App Promo */}
            <div className="bg-sacred-950 py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/patterns/ornament.svg')] opacity-5" />
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <BookOpen className="w-12 h-12 text-gold-500 mx-auto mb-8" />
                    <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 uppercase tracking-wider">
                        Spiritual Nourishment <br />
                        <span className="italic text-gold-200">Delivered</span>
                    </h2>
                    <p className="text-lg text-gray-400 font-light leading-relaxed mb-12">
                        Get the best of MyPrayerTower reflections, prayer alerts, and liturgical guides sent directly to your device.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app" className="w-full sm:w-auto px-10 py-5 bg-gold-500 text-sacred-950 font-black rounded-2xl hover:bg-gold-400 transition-all uppercase tracking-widest text-xs shadow-xl shadow-gold-500/20">
                            Download App
                        </Link>
                        <Link href="https://t.me/MyPrayerTowerBot" className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest text-xs backdrop-blur-md border border-white/10">
                            Telegram Bot
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
