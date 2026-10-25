import { Metadata } from 'next';
import { db } from '@/lib/db';
import SaintList from './SaintList';
import { JsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { User } from 'lucide-react';

const BASE_URL = 'https://www.myprayertower.com';

export const metadata: Metadata = {
    title: 'Catholic Saints Library | Biographies & Patronages | MyPrayerTower',
    description: 'Explore our comprehensive library of Catholic Saints. Read inspirational biographies, find patron saints for your intentions, and learn about feast days.',
    keywords: 'Catholic saints, patron saints, saint feast days, lives of the saints, Christian saints, Catholic martyrs, church doctors',
    alternates: {
        canonical: `${BASE_URL}/saints`,
    },
    openGraph: {
        title: 'Catholic Saints Library | Biographies & Patronages | MyPrayerTower',
        description: 'Explore our comprehensive library of Catholic Saints. Read inspirational biographies, find patron saints, and learn about feast days.',
        url: `${BASE_URL}/saints`,
        type: 'website',
        locale: 'en_US',
        siteName: 'MyPrayerTower',
        images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Catholic Saints Library' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Catholic Saints Library | Biographies & Patronages | MyPrayerTower',
        description: 'Explore our comprehensive library of Catholic Saints. Read biographies, find patron saints, and learn about feast days.',
        images: [`${BASE_URL}/og-image.png`],
    },
};

// Cache Saints directory for 24 hours
export const revalidate = 86400;

export default async function SaintsPage() {
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
        }
    });

    const collectionLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/saints#collection`,
        name: 'Catholic Saints Library',
        description: 'Comprehensive library of Catholic Saints, biographies, feast days, and patronages.',
        url: `${BASE_URL}/saints`,
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'MyPrayerTower',
            url: BASE_URL,
        },
    };

    const breadcrumbsLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: BASE_URL,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Saints',
                item: `${BASE_URL}/saints`,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <JsonLd data={collectionLd as any} />
            <BreadcrumbJsonLd data={breadcrumbsLd as any} />

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
