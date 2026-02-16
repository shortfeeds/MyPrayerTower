import Link from 'next/link';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

interface RelatedItem {
    title: string;
    slug: string;
    category?: string;
    description?: string;
    type: 'prayer' | 'guide' | 'post';
}

interface RelatedContentProps {
    title?: string;
    items: RelatedItem[];
}

export function RelatedContent({ title = 'You Might Also Like', items }: RelatedContentProps) {
    if (items.length === 0) return null;

    return (
        <section className="py-12 border-t border-gray-100">
            <div className="container mx-auto">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-gold-500" />
                    {title}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <Link
                            key={item.slug}
                            href={item.type === 'prayer' ? `/prayers/${item.slug}` : item.type === 'post' ? `/blog/${item.slug}` : `/guides/${item.slug}`}
                            className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-200 transition-all block"
                        >
                            <div className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-2">
                                {item.category || (item.type === 'prayer' ? 'Prayer' : item.type === 'post' ? 'Article' : 'Guide')}
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-gold-700 transition-colors">
                                {item.title}
                            </h4>
                            {item.description && (
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                    {item.description}
                                </p>
                            )}
                            <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-gold-600 transition-colors">
                                Read <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
