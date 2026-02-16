import { Metadata } from 'next';
import { db } from '@/lib/db';
import SaintList from './SaintList';
import { JsonLd } from '@/components/seo/JsonLd';
import { User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Catholic Saints Library | Biographies & Patronages',
    description: 'Explore our comprehensive library of Catholic Saints. Read biographies, find patron saints, and learn about their feast days.',
};

export default async function SaintsPage() {
    // Fetch all saints - ordered by feast day or name could be good, let's do name for now
    const saints = await db.saint.findMany({
        take: 60,
        orderBy: { name: 'asc' },
        select: {
            id: true,
            name: true,
            slug: true,
            title: true,
            feastDay: true,
            imageUrl: true,
            patronOf: true,
            shortBio: true
            // biography: true - Excluded for performance on list view
        }
    });

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <JsonLd<any> data={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Catholic Saints Library',
                description: 'Comprehensive library of Catholic Saints.',
                url: 'https://myprayertower.com/saints'
            }} />

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-bold mb-6">
                        <User className="w-4 h-4" />
                        <span>The Communion of Saints</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                        Catholic <span className="text-amber-600">Saints</span> Library
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        "The saints were not superhuman. They were people who loved God in their hearts, and who shared this joy with others." — Pope Francis
                    </p>
                </div>
            </div>

            {/* Client Side List */}
            <SaintList initialSaints={saints} />
        </div>
    );
}
