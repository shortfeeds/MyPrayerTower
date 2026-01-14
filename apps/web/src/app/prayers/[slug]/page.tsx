import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Tag, BookOpen, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';
import { generatePrayerSchema } from '@/lib/seo/structuredData';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { PrayerContent } from './PrayerContent';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const prayer = toSafeJSON(await db.prayer.findFirst({
        where: { slug: params.slug },
        select: { title: true, content: true, created_at: true }
    }));

    if (!prayer) return { title: 'Prayer Not Found' };

    return {
        title: `${prayer.title} | Catholic Prayers`,
        description: (prayer.content || '').substring(0, 150) + '...',
        openGraph: {
            title: `${prayer.title} | Catholic Prayers`,
            description: (prayer.content || '').substring(0, 150) + '...',
            type: 'article',
            publishedTime: prayer.created_at || undefined,
            authors: ['MyPrayerTower'],
        },
    };
}

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Pre-generate static pages for all active prayers
export async function generateStaticParams() {
    const prayers = await db.prayer.findMany({
        where: { is_active: true },
        select: { slug: true },
    });
    return prayers
        .filter(p => p.slug)
        .map(p => ({ slug: p.slug! }));
}

import { PrayerCategorySidebar } from '@/components/prayers/PrayerCategorySidebar';
import { PrayerContextBox } from '@/components/prayers/PrayerContextBox';

export default async function PrayerDetailPage({ params }: Props) {
    const prayer = toSafeJSON(await db.prayer.findFirst({
        where: { slug: params.slug },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            category: true,
            category_label: true,
            tags: true,
            created_at: true,
        }
    }));

    // Check if prayer exists (is_active field is optional, default to showing)
    if (!prayer) {
        notFound();
    }

    // Fetch category stats using new flat schema
    const categoryCounts = await db.prayer.groupBy({
        by: ['category', 'category_label'],
        _count: { category: true },
    });

    const categories = categoryCounts.map((c: any) => ({
        slug: c.category,
        label: c.category_label || c.category,
        count: c._count.category,
    })).sort((a, b) => a.label.localeCompare(b.label));

    const totalPrayers = categoryCounts.reduce((sum: number, c: any) => sum + c._count.category, 0);

    // Fetch related prayers (same category, different prayer)
    const relatedPrayers = toSafeJSON(await db.prayer.findMany({
        where: {
            category: prayer.category,
            id: { not: prayer.id },
        },
        take: 3,
    }));

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generatePrayerSchema({
                        id: prayer.id,
                        title: prayer.title,
                        content: prayer.content,
                        category: prayer.category,
                        category_label: prayer.category_label
                    }))
                }}
            />
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
                                    {prayer.category_label || prayer.category}
                                </Link>
                                {prayer.tags && prayer.tags.length > 0 && prayer.tags.slice(0, 3).map((tag: string, i: number) => (
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

                {/* Top Ad */}
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <SmartAdSlot page="prayers" position="top" />
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <main className="lg:flex-1">
                            {/* Contextual Notes */}
                            <PrayerContextBox title={prayer.title} category={prayer.category} />

                            <PrayerContent
                                prayerId={prayer.id.toString()}
                                prayerTitle={prayer.title}
                                prayerContent={prayer.content}
                                category={prayer.category}
                                categoryLabel={prayer.category_label}
                            />

                            {/* Tags */}
                            {prayer.tags && (prayer.tags as string[]).length > 0 && (
                                <div className="mt-8 flex flex-wrap gap-2">
                                    {(prayer.tags as string[]).map((tag, i) => (
                                        <Link
                                            key={i}
                                            href={`/prayers?tag=${tag}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-full hover:bg-slate-200 transition-colors"
                                        >
                                            <Tag size={14} />
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Related Prayers */}
                            {relatedPrayers.length > 0 && (
                                <div className="mt-12 pt-12 border-t border-slate-100">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                                        <BookOpen className="text-blue-600" size={20} />
                                        Related Prayers
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex flex-wrap gap-3 flex-1">
                                            {relatedPrayers.map((p: any) => (
                                                <Link
                                                    key={p.id}
                                                    href={`/prayers/${p.slug || p.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 bg-slate-50 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors border border-slate-100"
                                                >
                                                    {p.title}
                                                </Link>
                                            ))}
                                        </div>
                                        <Link
                                            href={`/prayers?category=${prayer.category}`}
                                            className="whitespace-nowrap inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            View all in {prayer.category_label || prayer.category}
                                            <ChevronRight size={16} className="ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Bottom Ad */}
                            <div className="mt-12">
                                <SmartAdSlot page="prayers" position="inline" />
                            </div>
                        </main>

                        {/* Sidebar */}
                        <aside className="lg:w-80 flex-shrink-0">
                            <div className="sticky top-28 space-y-6">
                                <PrayerCategorySidebar
                                    categories={categories}
                                    activeCategory={prayer.category}
                                    totalPrayers={totalPrayers}
                                />
                                {/* Sidebar Ad */}
                                <SmartAdSlot page="prayers" position="sidebar" />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
