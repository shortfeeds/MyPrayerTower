import { Sparkles } from 'lucide-react';
import { NOVENAS } from '@/lib/novenas';
import { NovenaList } from './NovenaList';
import { Metadata } from 'next';
import { FAQSection } from '@/components/seo/FAQSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

export const metadata: Metadata = {
    title: 'Catholic Novenas | 9-Day Prayers for Every Intention',
    description: 'Browse our complete library of Catholic Novenas. Find powerful 9-day prayers for healing, hope, employment, and intercession from the saints.',
};

const FAQS = [
    {
        question: "What is a Novena?",
        answer: "A Novena is a traditional Catholic devotion consisting of prayers said over nine consecutive days. The word comes from the Latin 'novem', meaning nine."
    },
    {
        question: "Do I have to pray a Novena for 9 days straight?",
        answer: "While the tradition is nine consecutive days, God hears your prayers regardless. If you miss a day, simply continue where you left off with increased devotion."
    },
    {
        question: "Which Novena is for lost causes?",
        answer: "St. Jude Thaddeus is the patron saint of lost causes and desperate situations. The St. Jude Novena is one of the most popular prayers for difficult times."
    }
];

export default function NovenasPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* SEO Data */}
            <JsonLd<any> data={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Catholic Novenas Library',
                description: 'Complete collection of 9-day Catholic prayers.',
                url: 'https://myprayertower.com/novenas',
                about: { '@type': 'Thing', name: 'Catholic Novena' }
            }} />

            {/* Immersive Hero */}
            <div className="relative bg-[#2d1b4e] text-white pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b4e]/80 via-[#2d1b4e]/90 to-slate-50" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium mb-6 border border-white/20">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-amber-100">Powerful Nine-Day Devotions</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
                        Novena <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-200">Library</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Join millions of Catholics in the ancient tradition of praying for nine consecutive days.
                        Find hope, healing, and intercession.
                    </p>
                </div>
            </div>

            {/* Interactive List (Client Component) */}
            <NovenaList novenas={NOVENAS} />

            {/* Ad Slot */}
            <div className="container mx-auto px-4 max-w-4xl py-8">
                <SmartAdSlot page="novenas" position="inline" showPlaceholder={false} />
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 max-w-4xl pb-16">
                <FAQSection items={FAQS} title="Common Questions About Novenas" />
            </div>
        </div>
    );
}
