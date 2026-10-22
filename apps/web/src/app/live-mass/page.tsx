export const revalidate = 3600; // Cache for 1 hour
import { Metadata } from 'next';
import { Play, MapPin, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Global Live Mass Hub | Watch Catholic Holy Mass Online | MyPrayerTower',
    description: 'Participate in Holy Mass live streams from world-renowned Catholic basilicas and cathedrals: St. Peter\'s Basilica Vatican, Our Lady of Guadalupe, St. Patrick\'s NYC, and Notre-Dame de Paris.',
    alternates: {
        canonical: 'https://www.myprayertower.com/live-mass',
    },
    openGraph: {
        title: 'Global Live Mass Hub | Watch Holy Mass Online',
        description: 'Join live Catholic Mass broadcasts from St. Peter\'s Basilica, Notre-Dame, Guadalupe, and St. Patrick\'s Cathedral.',
        url: 'https://www.myprayertower.com/live-mass',
        siteName: 'MyPrayerTower',
        images: [
            {
                url: 'https://www.myprayertower.com/images/churches/st-peters-basilica.jpg',
                width: 1200,
                height: 800,
                alt: 'St. Peter\'s Basilica - Live Mass Hub',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Global Live Mass Hub | Watch Catholic Holy Mass Online',
        description: 'Participate in live daily Catholic Mass from the Vatican and world-famous cathedrals.',
        images: ['https://www.myprayertower.com/images/churches/st-peters-basilica.jpg'],
    },
};

const STREAMS = [
    {
        id: 'vatican',
        name: "St. Peter's Basilica",
        location: 'Vatican City',
        imageUrl: '/images/churches/st-peters-basilica.jpg',
        url: 'https://www.youtube.com/channel/UCxIcwuQ8uLmivdJHeSwc0WQ', // Vatican News
        description: 'The papal enclave within Rome, Italy. The headquarters of the Roman Catholic Church.'
    },
    {
        id: 'guadalupe',
        name: 'Basilica of Our Lady of Guadalupe',
        location: 'Mexico City, Mexico',
        imageUrl: '/images/churches/our-lady-of-guadalupe.jpg',
        url: 'https://www.youtube.com/user/BasilicadeGuadalupe',
        description: 'National shrine of Mexico. One of the most visited Catholic pilgrimage sites in the world.'
    },
    {
        id: 'st_patricks',
        name: "St. Patrick's Cathedral",
        location: 'New York, USA',
        imageUrl: '/images/churches/st-patricks-cathedral.jpg',
        url: 'https://saintpatrickscathedral.org/live',
        description: 'A decorated Neo-Gothic-style Roman Catholic cathedral church in the United States.'
    },
    {
        id: 'notre_dame',
        name: 'Notre-Dame de Paris',
        location: 'Paris, France',
        imageUrl: '/images/churches/notre-dame-paris.jpg',
        url: 'https://www.youtube.com/channel/UC-XN1v8O9V7o7_j5x4y9g6A',
        description: 'Ideally located on the Île de la Cité, keeping watch over Paris for more than 850 years.'
    },
];

export default function LiveMassPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Global Live Mass Hub',
        description: 'Participate in live daily and Sunday Holy Mass broadcasts from around the Catholic world.',
        url: 'https://www.myprayertower.com/live-mass',
        hasPart: STREAMS.map((stream) => ({
            '@type': 'BroadcastEvent',
            name: `${stream.name} Live Mass`,
            description: stream.description,
            location: {
                '@type': 'PlaceOfWorship',
                name: stream.name,
                address: stream.location,
            },
            isLiveBroadcast: true,
            video: {
                '@type': 'VideoObject',
                name: `Live Mass at ${stream.name}`,
                thumbnailUrl: `https://www.myprayertower.com${stream.imageUrl}`,
                contentUrl: stream.url,
            },
        })),
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Live Mass Hub</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Participate in the Holy Mass from anywhere in the world. Join global congregations in real-time prayer and worship.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {STREAMS.map((stream) => (
                        <Link
                            key={stream.id}
                            href={stream.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={stream.imageUrl}
                                    alt={stream.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-white" />
                                    LIVE
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-full bg-white/90 text-primary-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 fill-current ml-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-primary-600 text-sm font-semibold mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{stream.location}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {stream.name}
                                    </h3>
                                    <p className="text-slate-600 text-sm line-clamp-2">
                                        {stream.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Globe className="w-4 h-4" /> Official Broadcast
                                    </span>
                                    <span className="font-semibold text-primary-600 group-hover:underline">
                                        Watch Live &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-100 text-center max-w-3xl mx-auto shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Are you a Catholic Parish?</h3>
                    <p className="text-slate-600 mb-6">
                        Stream your Sunday Mass and Daily liturgies to thousands of Catholics worldwide on MyPrayerTower.
                    </p>
                    <Link
                        href="/for-churches"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        List Your Church Stream
                    </Link>
                </div>
            </div>
        </div>
    );
}
