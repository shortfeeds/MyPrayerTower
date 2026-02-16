import { getAllGuides } from '@/lib/content';
import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ChevronRight, Heart, Home } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Catholic Life & Culture | Living the Faith',
    description: 'Articles on living the Catholic faith in the modern world. Family traditions, fasting rules, prayer habits, and more.',
};

export default async function CatholicLifeHubPage() {
    const guides = await getAllGuides();
    const lifeGuides = guides.filter(g => g.category === 'catholic-life');

    return (
        <div className="min-h-screen bg-[#faf9f6] font-sans">
            <JsonLd<any> data={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Catholic Life & Culture',
                description: 'Articles on living the Catholic faith daily.',
                url: 'https://myprayertower.com/catholic-life'
            }} />

            {/* Hero */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-700 rounded-full text-sm font-bold mb-6">
                        <Heart className="w-4 h-4" />
                        <span>Living the Faith</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                        Catholic <span className="text-rose-600">Life</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Bringing the beauty of the Church into your home, your work, and your daily habits.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lifeGuides.map((guide) => (
                        <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group block h-full">
                            <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
                                        <Home className="w-12 h-12 text-rose-200" />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider text-gray-600">
                                            {guide.readingTime}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
                                        {guide.title}
                                    </h2>
                                    <p className="text-gray-500 mb-6 flex-1 line-clamp-3">
                                        {guide.description}
                                    </p>
                                    <div className="flex items-center text-rose-600 font-bold text-sm">
                                        Read Article <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
