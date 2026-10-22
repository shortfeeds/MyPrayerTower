export const revalidate = 86400;
import { Metadata } from 'next';
import { Palette, ExternalLink, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Sacred Catholic Art Gallery | Christian Masterpieces | MyPrayerTower',
    description: 'Explore timeless Christian and Catholic masterpieces from Michelangelo, Da Vinci, Raphael, Fra Angelico, and El Greco. Meditate on sacred art with theological reflections.',
    alternates: {
        canonical: 'https://www.myprayertower.com/art',
    },
    openGraph: {
        title: 'Sacred Catholic Art Gallery | Christian Masterpieces',
        description: 'Explore timeless Christian and Catholic masterpieces from Michelangelo, Da Vinci, Raphael, and Fra Angelico.',
        url: 'https://www.myprayertower.com/art',
        siteName: 'MyPrayerTower',
        images: [
            {
                url: 'https://www.myprayertower.com/images/art/creation-of-adam.jpg',
                width: 1200,
                height: 800,
                alt: 'The Creation of Adam - Michelangelo',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sacred Catholic Art Gallery | Christian Masterpieces',
        description: 'Timeless masterpieces of sacred Christian art for prayer and spiritual meditation.',
        images: ['https://www.myprayertower.com/images/art/creation-of-adam.jpg'],
    },
};

interface Artwork {
    title: string;
    artist: string;
    year: string;
    location: string;
    description: string;
    imageUrl: string;
}

const ARTWORKS: Artwork[] = [
    { title: 'The Creation of Adam', artist: 'Michelangelo', year: '1508-1512', location: 'Sistine Chapel, Vatican', description: 'The iconic fresco depicting God giving life to Adam.', imageUrl: '/images/art/creation-of-adam.jpg' },
    { title: 'The Last Supper', artist: 'Leonardo da Vinci', year: '1495-1498', location: 'Santa Maria delle Grazie, Milan', description: 'Jesus\'s final meal with the Twelve Apostles.', imageUrl: '/images/art/the-last-supper.jpg' },
    { title: 'Pietà', artist: 'Michelangelo', year: '1498-1499', location: 'St. Peter\'s Basilica, Vatican', description: 'Mary holding the body of Christ after the Crucifixion.', imageUrl: '/images/art/pieta.jpg' },
    { title: 'The Annunciation', artist: 'Fra Angelico', year: '1438-1445', location: 'San Marco, Florence', description: 'The Angel Gabriel announces to Mary that she will bear the Son of God.', imageUrl: '/images/art/the-annunciation.jpg' },
    { title: 'The Transfiguration', artist: 'Raphael', year: '1516-1520', location: 'Vatican Museums', description: 'Christ revealed in glory on Mount Tabor.', imageUrl: '/images/art/the-transfiguration.jpg' },
    { title: 'Christ in the Garden of Gethsemane', artist: 'El Greco', year: '1590-1595', location: 'Toledo Museum', description: 'Jesus praying in agony before His arrest.', imageUrl: '/images/art/agony-in-the-garden.jpg' },
];

export default function ArtPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Sacred Catholic Art Gallery',
        description: 'Masterpieces of Christian art that have inspired the faithful for centuries.',
        url: 'https://www.myprayertower.com/art',
        hasPart: ARTWORKS.map((art) => ({
            '@type': 'VisualArtwork',
            name: art.title,
            creator: { '@type': 'Person', name: art.artist },
            artMedium: 'Painting / Fresco / Sculpture',
            locationCreated: { '@type': 'Place', name: art.location },
            image: `https://www.myprayertower.com${art.imageUrl}`,
            description: art.description,
        })),
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero */}
            <div className="bg-gradient-to-br from-rose-700 via-pink-800 to-fuchsia-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Palette className="w-4 h-4 text-rose-300" />
                        <span>Sacred Masterpieces</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Sacred Art Gallery</h1>
                    <p className="text-xl text-rose-100 max-w-2xl mx-auto">
                        Masterpieces of Christian art that have inspired the faithful for centuries.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ARTWORKS.map(art => (
                        <div key={art.title} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <Image
                                    src={art.imageUrl}
                                    alt={art.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{art.title}</h3>
                                <p className="text-rose-600 font-medium mb-3">{art.artist}</p>
                                <p className="text-gray-600 text-sm mb-4">{art.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{art.year}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-[150px]">{art.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
