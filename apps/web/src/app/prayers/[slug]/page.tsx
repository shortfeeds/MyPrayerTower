import { db } from '@/lib/db';
import { toSafeJSON } from '@/lib/dto';

// const prisma = new PrismaClient(); // Removed local instantiation

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const prayer = toSafeJSON(await db.prayer.findFirst({
        where: { slug: params.slug },
    }));

    if (!prayer) return { title: 'Prayer Not Found' };

    return {
        title: `${prayer.title} | Catholic Prayers`,
        description: prayer.content.substring(0, 150) + '...',
    };
}

export default async function PrayerDetailPage({ params }: Props) {
    const prayer = toSafeJSON(await db.prayer.findFirst({
        where: { slug: params.slug },
    }));

    if (!prayer || !prayer.is_active) {
        notFound();
    }



    const relatedPrayers = toSafeJSON(await db.prayer.findMany({
        where: {
            category: prayer.category,
            id: { not: prayer.id },
            is_active: true,
        },
        take: 3,
    }));

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

            {/* Top Ad */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <SmartAdSlot page="prayers" position="top" />
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <main className="flex-1">
                        <PrayerContent
                            prayerId={prayer.id.toString()}
                            prayerTitle={prayer.title}
                            prayerContent={prayer.content}
                            categoryLabel={prayer.category_label || undefined}
                            category={prayer.category}
                        />

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
                                            href={`/prayers/${rp.slug}`}
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
                            <SmartAdSlot page="prayers" position="inline" />
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-28 space-y-6">
                            {/* Sidebar Ad */}
                            <SmartAdSlot page="prayers" position="sidebar" />

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
