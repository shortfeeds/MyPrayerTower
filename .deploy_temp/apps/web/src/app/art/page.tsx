import { Palette, ExternalLink, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Artwork {
    title: string;
    artist: string;
    year: string;
    location: string;
    description: string;
    imageUrl: string;
}

const ARTWORKS: Artwork[] = [
    { title: 'The Creation of Adam', artist: 'Michelangelo', year: '1508-1512', location: 'Sistine Chapel, Vatican', description: 'The iconic fresco depicting God giving life to Adam.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1200px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg' },
    { title: 'The Last Supper', artist: 'Leonardo da Vinci', year: '1495-1498', location: 'Santa Maria delle Grazie, Milan', description: 'Jesus\'s final meal with the Twelve Apostles.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/1200px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg' },
    { title: 'Pietà', artist: 'Michelangelo', year: '1498-1499', location: 'St. Peter\'s Basilica, Vatican', description: 'Mary holding the body of Christ after the Crucifixion.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Michelangelo%27s_Pieta_5450_cropncleaned_edit.jpg/800px-Michelangelo%27s_Pieta_5450_cropncleaned_edit.jpg' },
    { title: 'The Annunciation', artist: 'Fra Angelico', year: '1438-1445', location: 'San Marco, Florence', description: 'The Angel Gabriel announces to Mary that she will bear the Son of God.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Annunciation_%28Fra_Angelico%2C_San_Marco%29.jpg/1200px-Annunciation_%28Fra_Angelico%2C_San_Marco%29.jpg' },
    { title: 'The Transfiguration', artist: 'Raphael', year: '1516-1520', location: 'Vatican Museums', description: 'Christ revealed in glory on Mount Tabor.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Transfiguration_Raphael.jpg/800px-Transfiguration_Raphael.jpg' },
    { title: 'Christ in the Garden of Gethsemane', artist: 'El Greco', year: '1590-1595', location: 'Toledo Museum', description: 'Jesus praying in agony before His arrest.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/El_Greco_-_The_Agony_in_the_Garden_-_WGA10558.jpg/800px-El_Greco_-_The_Agony_in_the_Garden_-_WGA10558.jpg' },
];

export default function ArtPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
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
                                <img
                                    src={art.imageUrl}
                                    alt={art.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                                        <span>{art.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* More Resources */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-6">Explore More</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://www.wga.hu/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            Web Gallery of Art <ExternalLink className="w-4 h-4" />
                        </a>
                        <a href="https://www.metmuseum.org/art/collection" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            The Met Collection <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
