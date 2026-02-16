import { getPostsByCategory, getAllPosts } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, Calendar, ChevronRight, Tag, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: {
        category: string;
    };
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    const categories = Array.from(new Set(posts.map(p => p.category)));
    return categories.map(category => ({
        category,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const categoryLabel = params.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
        title: `${categoryLabel} Articles | MyPrayerTower Blog`,
        description: `Read our latest articles about ${categoryLabel} and grow in your Catholic faith.`,
        openGraph: {
            title: `${categoryLabel} Articles | MyPrayerTower Blog`,
            url: `https://myprayertower.com/blog/category/${params.category}`,
        }
    };
}

export default async function BlogCategoryPage({ params }: Props) {
    const posts = await getPostsByCategory(params.category);

    if (posts.length === 0) {
        // Technically this might be reached if valid category but no posts, 
        // though generateStaticParams handles build time.
        // For dynamic requests we might want to handle gracefully or 404.
        // Let's 404 if truly empty to avoid soft 404s.
        // Actually, let's show an empty state instead of 404ing valid layouts.
    }

    const categoryLabel = params.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-12">
                <div className="container mx-auto px-4 text-center">
                    <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-sacred-600 mb-6 text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blog
                    </Link>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
                        {categoryLabel}
                    </h1>
                    <span className="inline-block py-1 px-3 rounded-full bg-gold-50 text-gold-700 text-xs font-bold uppercase tracking-widest">
                        Category Archive
                    </span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                            >
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {post.image ? (
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${post.image})` }} />
                                    ) : (
                                        <div className="absolute inset-0 bg-sacred-50 flex items-center justify-center">
                                            <span className="text-sacred-200 text-2xl font-serif">MPT</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                                        {post.readingTime && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span>{post.readingTime}</span>
                                            </>
                                        )}
                                    </div>

                                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-gold-600 transition-colors leading-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
                                        {post.description}
                                    </p>

                                    <div className="flex items-center text-sm font-bold text-sacred-600 group-hover:text-gold-600 transition-colors mt-auto pt-4 border-t border-gray-50">
                                        Read Article <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No articles found</h3>
                        <p className="text-gray-500">There are no articles in this category yet.</p>
                        <Link href="/blog" className="inline-block mt-4 text-sacred-600 font-bold hover:underline">
                            View all articles
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
