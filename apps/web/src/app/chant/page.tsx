'use client';

import { useState } from 'react';
import { Music, ExternalLink, Volume2, BookOpen, Search, Play, Pause } from 'lucide-react';

interface ChantResource {
    name: string;
    description: string;
    url: string;
    type: 'library' | 'audio' | 'notation';
}

const chantResources: ChantResource[] = [
    {
        name: 'GregoBase',
        description: 'Open-source database of Gregorian chant scores in modern notation. Searchable by incipit, mode, or feast.',
        url: 'https://gregobase.selapa.net/',
        type: 'notation'
    },
    {
        name: 'Corpus Christi Watershed',
        description: 'High-quality scores for the Propers of the Mass, including English and Latin options.',
        url: 'https://www.ccwatershed.org/gregorian/',
        type: 'notation'
    },
    {
        name: 'Gregorian Chant Hymns',
        description: 'Audio recordings of traditional Gregorian chant hymns by various monasteries.',
        url: 'https://www.youtube.com/results?search_query=gregorian+chant+hymns',
        type: 'audio'
    },
    {
        name: 'Solesmes Abbey',
        description: 'The authoritative source for Gregorian chant. Official recordings and resources.',
        url: 'https://www.solesmes.com/',
        type: 'library'
    },
    {
        name: 'CMAA - Church Music Association of America',
        description: 'Resources for sacred music including the Liber Usualis, Parish Book of Chant, and more.',
        url: 'https://musicasacra.com/resources/',
        type: 'library'
    },
    {
        name: 'Cantica Nova',
        description: 'Publisher of sacred music with both traditional chant and contemporary settings.',
        url: 'https://www.canticanova.com/',
        type: 'library'
    }
];

const featuredChants = [
    { name: 'Salve Regina', mode: 'Mode I', occasion: 'Marian Antiphon', duration: '3:45' },
    { name: 'Veni Creator Spiritus', mode: 'Mode VIII', occasion: 'Pentecost', duration: '4:20' },
    { name: 'Pange Lingua', mode: 'Mode III', occasion: 'Corpus Christi', duration: '5:12' },
    { name: 'Victimae Paschali Laudes', mode: 'Mode I', occasion: 'Easter Sequence', duration: '2:58' },
    { name: 'Dies Irae', mode: 'Mode I', occasion: 'Requiem Mass', duration: '8:30' },
    { name: 'Ave Maris Stella', mode: 'Mode I', occasion: 'Marian Hymn', duration: '3:15' },
];

export default function ChantPage() {
    const [playing, setPlaying] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-neutral-900 text-white pt-28 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-mathematics.png')]"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Music className="w-4 h-4 text-amber-300" />
                        <span>Sacred Music</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Gregorian Chant</h1>
                    <p className="text-xl text-stone-300 max-w-2xl mx-auto">
                        The prayer of the Church sung for over a millennium. Explore scores, recordings, and resources.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Featured Chants */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <Volume2 className="w-6 h-6 text-amber-600" />
                        Featured Chants
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredChants.map((chant) => (
                            <div
                                key={chant.name}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                onClick={() => setPlaying(playing === chant.name ? null : chant.name)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                        {playing === chant.name ? (
                                            <Pause className="w-5 h-5 text-amber-600" />
                                        ) : (
                                            <Play className="w-5 h-5 text-stone-600 group-hover:text-amber-600" />
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-400">{chant.duration}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{chant.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="px-2 py-0.5 bg-stone-100 rounded-full">{chant.mode}</span>
                                    <span>•</span>
                                    <span>{chant.occasion}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-500 mt-6 text-sm italic">
                        The digital audio library is currently being curated. In the meantime, please explore the external resources and notation databases below.
                    </p>
                </section>

                {/* Resources */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-amber-600" />
                        Chant Resources
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {chantResources.map((resource) => (
                            <a
                                key={resource.name}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex gap-4"
                            >
                                <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${resource.type === 'notation' ? 'bg-blue-100 text-blue-600' :
                                    resource.type === 'audio' ? 'bg-green-100 text-green-600' :
                                        'bg-amber-100 text-amber-600'
                                    }`}>
                                    {resource.type === 'notation' ? <BookOpen className="w-6 h-6" /> :
                                        resource.type === 'audio' ? <Volume2 className="w-6 h-6" /> :
                                            <Music className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                        {resource.name}
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                                    </h3>
                                    <p className="text-gray-600 text-sm">{resource.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
