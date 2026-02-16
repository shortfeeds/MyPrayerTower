import { getAllGuides } from '@/lib/content';
import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ChevronRight, BookOpen, HelpCircle } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Catholic How-To Guides | Learn the Faith',
    description: 'Practical guides on how to live the Catholic faith. Learn how to go to Confession, pray the Rosary, attend Mass, and more.',
};

export default async function HowToHubPage() {
    const guides = await getAllGuides();
    const howToGuides = guides.filter(g => g.category === 'how-to' || g.category === 'rosary'); // Including Rosary guides here too as they are "how-to" in nature

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <JsonLd<any> data={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Catholic How-To Guides',
                description: 'Practical guides on how to live the Catholic faith.',
                url: 'https://myprayertower.com/how-to'
            }} />

            {/* Hero */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6">
                        <HelpCircle className="w-4 h-4" />
                        <span>Practical Faith</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                        Catholic <span className="text-blue-600">How-To</span> Guides
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Step-by-step instructions for the sacraments, prayers, and traditions of the Church.
                        Feel confident in your faith practice.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {howToGuides.map((guide) => (
                        <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group block h-full">
                            <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {/* Fallback pattern if no image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                                        <BookOpen className="w-12 h-12 text-blue-200" />
                                    </div>
                                    {/* Real image would go here */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider text-gray-600">
                                            {guide.readingTime}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {guide.title}
                                    </h2>
                                    <p className="text-gray-500 mb-6 flex-1 line-clamp-3">
                                        {guide.description}
                                    </p>
                                    <div className="flex items-center text-blue-600 font-bold text-sm">
                                        Read Guide <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
