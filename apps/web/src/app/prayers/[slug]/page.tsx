import { getPrayerBySlug } from '@/app/actions/prayer-library';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Share2, Printer } from 'lucide-react';
import { PrayerInteractions } from '@/components/prayer/PrayerInteractions';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const prayer = await getPrayerBySlug(params.slug);

    if (!prayer) {
        return {
            title: 'Prayer Not Found',
        };
    }

    return {
        title: `${prayer.title} | Catholic Prayers`,
        description: prayer.content.slice(0, 160),
        openGraph: {
            title: prayer.title,
            description: prayer.content.slice(0, 160),
            type: 'article',
        }
    };
}

export default async function PrayerPage({ params }: Props) {
    const prayer = await getPrayerBySlug(params.slug);

    if (!prayer) {
        notFound();
    }

    // Simple formatting for content: split by newlines and wrap in paragraphs
    const paragraphs = prayer.content.split('\n').filter(p => p.trim() !== '');

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Header / Nav */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/prayers"
                        className="flex items-center text-gray-500 hover:text-sacred-600 transition-colors font-medium text-sm"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Library
                    </Link>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all" title="Share">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 py-16">
                {/* Meta Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="h-px w-8 bg-gold-300"></span>
                        <span className="text-gold-500 text-xs font-bold tracking-widest uppercase">
                            {prayer.category}
                        </span>
                        <span className="h-px w-8 bg-gold-300"></span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                        {prayer.title}
                    </h1>

                    {prayer.tags && prayer.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {prayer.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Prayer Content Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300"></div>
                    <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>

                    {/* Text Content */}
                    <div className="font-serif text-lg md:text-xl leading-loose text-gray-800 space-y-6">
                        {paragraphs.map((paragraph, idx) => (
                            <p key={idx} className={idx === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:text-gold-600 first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]" : ""}>
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Amen footer */}
                    <div className="mt-16 text-center">
                        <p className="font-serif text-2xl italic text-gray-400">Amen.</p>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center justify-center gap-4">
                        <PrayerInteractions
                            prayerId={prayer.id}
                            prayerTitle={prayer.title}
                            // Mock count for engagement feel, real implementation would fetch relation count
                            initialCount={Math.floor(Math.random() * 50) + 10}
                        />
                    </div>
                </div>
            </article>
        </div>
    );
}
