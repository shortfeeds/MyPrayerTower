export const revalidate = 86400; // Cache for 24 hours (0 CPU on Vercel CDN)

import { Metadata } from 'next';
import { BookOpen, Disc, Calendar, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { HowToJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { InteractiveRosary } from '@/components/rosary/InteractiveRosary';
import { PrayerReminderBanner } from '@/components/notifications/PrayerReminderBanner';

const BASE_URL = 'https://www.myprayertower.com';

export const metadata: Metadata = {
    title: 'How to Pray the Rosary Step-by-Step | All Mysteries & Prayers | MyPrayerTower',
    description: 'Learn how to pray the Holy Rosary step-by-step with complete Catholic prayers, meditation on all 20 Mysteries (Joyful, Sorrowful, Glorious, Luminous), and scripture.',
    keywords: 'how to pray the rosary, holy rosary, joyful mysteries, sorrowful mysteries, glorious mysteries, luminous mysteries, catholic rosary guide, hail mary, apostles creed',
    alternates: {
        canonical: `${BASE_URL}/rosary`,
    },
    openGraph: {
        title: 'How to Pray the Rosary Step-by-Step | All Mysteries & Prayers | MyPrayerTower',
        description: 'Learn how to pray the Holy Rosary step-by-step with complete Catholic prayers and meditation on all 20 Mysteries.',
        url: `${BASE_URL}/rosary`,
        type: 'article',
        locale: 'en_US',
        siteName: 'MyPrayerTower',
        images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'How to Pray the Holy Rosary' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'How to Pray the Rosary Step-by-Step | MyPrayerTower',
        description: 'Complete guide to praying the Holy Rosary with all 20 Mysteries and traditional prayers.',
        images: [`${BASE_URL}/og-image.png`],
    },
};

const MYSTERIES = [
    {
        name: 'Joyful Mysteries',
        days: ['Monday', 'Saturday'],
        events: [
            'The Annunciation',
            'The Visitation',
            'The Nativity',
            'The Presentation',
            'The Finding in the Temple'
        ],
        icon: Star,
        color: 'text-yellow-600 bg-yellow-100'
    },
    {
        name: 'Sorrowful Mysteries',
        days: ['Tuesday', 'Friday'],
        events: [
            'The Agony in the Garden',
            'The Scourging at the Pillar',
            'The Crowning with Thorns',
            'The Carrying of the Cross',
            'The Crucifixion'
        ],
        icon: Heart,
        color: 'text-red-600 bg-red-100'
    },
    {
        name: 'Glorious Mysteries',
        days: ['Wednesday', 'Sunday'],
        events: [
            'The Resurrection',
            'The Ascension',
            'The Descent of the Holy Spirit',
            'The Assumption of Mary',
            'The Coronation of Mary'
        ],
        icon: Disc,
        color: 'text-gold-600 bg-gold-100'
    },
    {
        name: 'Luminous Mysteries',
        days: ['Thursday'],
        events: [
            'The Baptism in the Jordan',
            'The Wedding at Cana',
            'The Proclamation of the Kingdom',
            'The Transfiguration',
            'The Institution of the Eucharist'
        ],
        icon: Star,
        color: 'text-blue-600 bg-blue-100'
    }
];

export default function RosaryPage() {
    const howToLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        '@id': `${BASE_URL}/rosary#howto`,
        name: 'How to Pray the Holy Rosary',
        description: 'A complete step-by-step Catholic guide to praying the Holy Rosary, including the opening prayers, decades, and closing devotions.',
        totalTime: 'PT20M',
        inLanguage: 'en-US',
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: 'Sign of the Cross and Apostles\' Creed',
                text: 'Holding the crucifix, make the Sign of the Cross and pray the Apostles\' Creed.',
                url: `${BASE_URL}/rosary#step-1`
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: 'Opening Our Father',
                text: 'On the first large bead, pray the Our Father for the intentions of the Holy Father.',
                url: `${BASE_URL}/rosary#step-2`
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: 'Three Hail Marys for Faith, Hope, and Charity',
                text: 'On the next three small beads, pray three Hail Marys for an increase in faith, hope, and charity, followed by the Glory Be.',
                url: `${BASE_URL}/rosary#step-3`
            },
            {
                '@type': 'HowToStep',
                position: 4,
                name: 'Announce First Mystery and Pray Decade',
                text: 'Announce the first mystery, pray the Our Father on the large bead, 10 Hail Marys on the decade beads, the Glory Be, and the Fatima Prayer.',
                url: `${BASE_URL}/rosary#step-4`
            },
            {
                '@type': 'HowToStep',
                position: 5,
                name: 'Complete the Remaining 4 Decades',
                text: 'Meditate on each of the remaining mysteries, praying an Our Father, 10 Hail Marys, Glory Be, and Fatima Prayer for each decade.',
                url: `${BASE_URL}/rosary#step-5`
            },
            {
                '@type': 'HowToStep',
                position: 6,
                name: 'Hail Holy Queen (Salve Regina)',
                text: 'Conclude the five decades by praying the Hail, Holy Queen.',
                url: `${BASE_URL}/rosary#step-6`
            },
            {
                '@type': 'HowToStep',
                position: 7,
                name: 'Concluding Prayer & Sign of the Cross',
                text: 'Pray the Rosary concluding prayer ("O God, whose only begotten Son...") and finish with the Sign of the Cross.',
                url: `${BASE_URL}/rosary#step-7`
            }
        ]
    };

    const breadcrumbsLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: BASE_URL
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Holy Rosary',
                item: `${BASE_URL}/rosary`
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <HowToJsonLd data={howToLd as any} />
            <BreadcrumbJsonLd data={breadcrumbsLd as any} />

            {/* Hero */}
            <div className="bg-gradient-to-br from-rose-700 to-sacred-800 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Disc className="w-4 h-4 text-rose-300" />
                        <span>Daily Devotion</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">The Holy Rosary</h1>
                    <p className="text-xl text-rose-100 max-w-2xl mx-auto">
                        Meditate on the life of Jesus through the eyes of Mary. A powerful prayer for peace and grace.
                    </p>
                </div>
            </div>

            {/* Guide Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Interactive Virtual Rosary Bead Tracker */}
                    <InteractiveRosary />

                    {/* Prayer Reminder & Telegram Community */}
                    <PrayerReminderBanner />

                    <div className="text-center mb-16 mt-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">How to Pray the 20 Mysteries</h2>
                        <p className="text-gray-600">The Rosary is a Scripture-based prayer. It begins with the Apostles&apos; Creed, which summarizes the great mysteries of the Catholic faith.</p>
                    </div>

                    {/* Mysteries Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {MYSTERIES.map((m) => (
                            <div key={m.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                                        <m.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {m.days.join(' • ')}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{m.name}</h3>
                                <ul className="space-y-2">
                                    {m.events.map((e, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                                            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                                                {i + 1}
                                            </span>
                                            {e}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Ad */}
                    <div className="mb-12">
                        <SmartAdSlot page="rosary" position="bottom" showPlaceholder={false} />
                    </div>

                    {/* App CTA */}
                    <div className="bg-sacred-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pray with Community</h2>
                            <p className="text-sacred-100 mb-8 max-w-xl mx-auto">
                                Join our daily live Rosary sessions or track your personal streaks in the app.
                            </p>
                            <Link
                                href="/journey"
                                className="inline-flex items-center px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-full transition-colors"
                            >
                                Start Your Journey
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
