
import { PrismaClient } from '@mpt/database';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Share2, BookOpen, Tag, Heart, Sparkles, Copy, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

interface Props {
    params: { slug: string };
}

// Ad Component
function AdBanner({ position }: { position: 'sidebar' | 'bottom' }) {
    return (
        <div className={`${position === 'sidebar' ? 'aspect-[4/5]' : 'h-32'} bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200/50 relative overflow-hidden group hover:border-gray-300 transition-all`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center relative z-10">
                <Sparkles className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500 font-medium">Sponsored</p>
                <Link href="/advertise" className="text-[10px] text-blue-500 hover:underline">Advertise here</Link>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const prayerId = parseInt(params.slug, 10);

    if (isNaN(prayerId)) {
        return { title: 'Prayer Not Found' };
    }

    const prayer = await prisma.prayer.findUnique({
        where: { id: prayerId },
    });

    if (!prayer) return { title: 'Prayer Not Found' };

    return {
        title: `${prayer.title} | Catholic Prayers`,
        description: prayer.content.substring(0, 150) + '...',
    };
}

export default async function PrayerDetailPage({ params }: Props) {
    const prayerId = parseInt(params.slug, 10);

    if (isNaN(prayerId)) {
        notFound();
    }

    const prayer = await prisma.prayer.findUnique({
        where: { id: prayerId },
    });

    if (!prayer || !prayer.is_active) {
        notFound();
    }

    const relatedPrayers = await prisma.prayer.findMany({
        where: {
            category: prayer.category,
            id: { not: prayer.id },
            is_active: true,
        },
        take: 3,
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Premium Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 pt-28 pb-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/prayers"
                            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Prayer Library</span>
                        </Link>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <Link
                                href={`/prayers?category=${prayer.category}`}
                                className="inline-flex items-center text-sm font-semibold px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all border border-white/20"
                            >
                                <Tag size={14} className="mr-2" />
                                {prayer.category_label}
                            </Link>
                            {prayer.tags && prayer.tags.length > 0 && prayer.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="inline-flex items-center text-sm px-4 py-2 bg-white/10 text-white/80 rounded-full border border-white/10">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                            {prayer.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <main className="flex-1">
                        <article className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            {/* Prayer Content */}
                            <div className="p-8 md:p-12 lg:p-16">
                                <div className="relative">
                                    {/* Decorative Quote */}
                                    <div className="absolute -top-4 -left-4 text-8xl text-blue-100 font-serif select-none">"</div>

                                    <div className="relative prose prose-lg max-w-none text-gray-700 font-serif leading-loose whitespace-pre-wrap">
                                        {prayer.content}
                                    </div>

                                    <div className="absolute -bottom-8 -right-4 text-8xl text-blue-100 font-serif select-none rotate-180">"</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-gradient-to-r from-gray-50 to-white px-8 md:px-12 py-6 border-t border-gray-100">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <button className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                                            <Copy size={18} />
                                            <span>Copy</span>
                                        </button>
                                        <button className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium">
                                            <Heart size={18} />
                                            <span>Save</span>
                                        </button>
                                        <button className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-medium">
                                            <Share2 size={18} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        Prayer #{prayer.id.toString()}
                                    </span>
                                </div>
                            </div>
                        </article>

                        {/* Related Prayers */}
                        {relatedPrayers.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                    Related Prayers
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {relatedPrayers.map(rp => (
                                        <Link
                                            key={rp.id.toString()}
                                            href={`/prayers/${rp.id}`}
                                            className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <h4 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {rp.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{rp.content}</p>
                                            <div className="flex items-center text-blue-600 text-sm font-medium">
                                                <span>Read</span>
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bottom Ad */}
                        <div className="mt-12">
                            <AdBanner position="bottom" />
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-28 space-y-6">
                            {/* Sidebar Ad */}
                            <AdBanner position="sidebar" />

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4">More from this category</h4>
                                <Link
                                    href={`/prayers?category=${prayer.category}`}
                                    className="block w-full text-center py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                                >
                                    View {prayer.category_label}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
