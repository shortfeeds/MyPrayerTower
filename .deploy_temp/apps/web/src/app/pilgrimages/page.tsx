import { MapPin, ExternalLink, Globe, Plane, Church } from 'lucide-react';

interface Pilgrimage {
    name: string;
    location: string;
    country: string;
    description: string;
    significance: string;
    virtualTourUrl?: string;
    imageUrl: string;
}

const PILGRIMAGES: Pilgrimage[] = [
    { name: 'Vatican City & St. Peter\'s Basilica', location: 'Rome', country: 'Italy', description: 'The heart of Catholicism, home to the Pope and the tomb of St. Peter.', significance: 'Center of the Universal Church', virtualTourUrl: 'https://www.vatican.va/various/basiliche/san_pietro/vr_tour/index-en.html', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/St_Peter%27s_Basilica_1.jpg/1200px-St_Peter%27s_Basilica_1.jpg' },
    { name: 'Holy Land - Jerusalem', location: 'Jerusalem', country: 'Israel', description: 'Walk where Jesus walked. Visit the Church of the Holy Sepulchre, Via Dolorosa, and more.', significance: 'Sites of Christ\'s life, death, and resurrection', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Jerusalem_Holy_Sepulchre_BW_2010-09-21_18-34-14.JPG/1024px-Jerusalem_Holy_Sepulchre_BW_2010-09-21_18-34-14.JPG' },
    { name: 'Lourdes', location: 'Lourdes', country: 'France', description: 'Where Our Lady appeared to St. Bernadette in 1858. Known for miraculous healings.', significance: 'Marian apparition site', virtualTourUrl: 'https://www.lourdes-france.org/en/virtual-tour/', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Lourdes_Basilika_und_Grotte.jpg/1200px-Lourdes_Basilika_und_Grotte.jpg' },
    { name: 'Fatima', location: 'Fátima', country: 'Portugal', description: 'Site of the 1917 apparitions to three shepherd children. Home of the Miracle of the Sun.', significance: 'Marian apparition site', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Fatima_sanctuary.jpg/1200px-Fatima_sanctuary.jpg' },
    { name: 'Santiago de Compostela', location: 'Santiago', country: 'Spain', description: 'End point of the Camino pilgrimage. Burial site of St. James the Apostle.', significance: 'Apostolic shrine', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Catedral_de_Santiago_de_Compostela_agosto_2018_%28cropped%29.jpg/800px-Catedral_de_Santiago_de_Compostela_agosto_2018_%28cropped%29.jpg' },
    { name: 'Guadalupe', location: 'Mexico City', country: 'Mexico', description: 'Where Our Lady appeared to St. Juan Diego in 1531. The tilma is preserved here.', significance: 'Marian apparition site', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG/1200px-Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG' },
];

export default function PilgrimagesPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-violet-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Plane className="w-4 h-4 text-blue-300" />
                        <span>Sacred Journeys</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Virtual Pilgrimages</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Explore the world's holiest Catholic sites from the comfort of your home.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {PILGRIMAGES.map(site => (
                        <div key={site.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={site.imageUrl}
                                    alt={site.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-medium flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {site.country}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{site.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
                                    <MapPin className="w-4 h-4" />
                                    <span>{site.location}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{site.description}</p>
                                <div className="text-sm text-gray-500 mb-4">
                                    <strong>Significance:</strong> {site.significance}
                                </div>
                                {site.virtualTourUrl && (
                                    <a
                                        href={site.virtualTourUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 font-medium hover:underline"
                                    >
                                        Take Virtual Tour <ExternalLink className="w-4 h-4 ml-1" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
