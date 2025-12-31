'use client';

import { useState } from 'react';
import { Music, Search, ExternalLink, BookOpen } from 'lucide-react';

interface Hymn {
    title: string;
    latinTitle?: string;
    type: 'traditional' | 'marian' | 'eucharistic' | 'seasonal';
    firstLine: string;
    verses: number;
}

const HYMNS: Hymn[] = [
    { title: 'Holy God, We Praise Thy Name', latinTitle: 'Grosser Gott', type: 'traditional', firstLine: 'Holy God, we praise Thy name; Lord of all, we bow before Thee...', verses: 4 },
    { title: 'Immaculate Mary', type: 'marian', firstLine: 'Immaculate Mary, your praises we sing...', verses: 4 },
    { title: 'Hail, Holy Queen Enthroned Above', latinTitle: 'Salve, Regina', type: 'marian', firstLine: 'Hail, Holy Queen enthroned above, O Maria...', verses: 3 },
    { title: 'O Salutaris Hostia', type: 'eucharistic', firstLine: 'O saving Victim, opening wide the gate of heaven to us below...', verses: 2 },
    { title: 'Tantum Ergo', type: 'eucharistic', firstLine: 'Down in adoration falling, this great sacrament we hail...', verses: 2 },
    { title: 'Panis Angelicus', type: 'eucharistic', firstLine: 'Bread of angels, made the bread of those who journey from their homes...', verses: 2 },
    { title: 'Adeste Fideles', type: 'seasonal', firstLine: 'O come, all ye faithful, joyful and triumphant...', verses: 4 },
    { title: 'Veni, Veni Emmanuel', type: 'seasonal', firstLine: 'O come, O come, Emmanuel, and ransom captive Israel...', verses: 7 },
    { title: 'Stabat Mater', type: 'marian', firstLine: 'At the cross her station keeping, stood the mournful Mother weeping...', verses: 20 },
    { title: 'Ave Maria', type: 'marian', firstLine: 'Ave Maria, gratia plena, Dominus tecum...', verses: 1 },
    { title: 'Faith of Our Fathers', type: 'traditional', firstLine: 'Faith of our fathers, living still, in spite of dungeon, fire, and sword...', verses: 4 },
    { title: 'Amazing Grace', type: 'traditional', firstLine: 'Amazing grace, how sweet the sound, that saved a wretch like me...', verses: 5 },
];

const TYPE_COLORS = {
    traditional: 'bg-blue-100 text-blue-700',
    marian: 'bg-rose-100 text-rose-700',
    eucharistic: 'bg-amber-100 text-amber-700',
    seasonal: 'bg-green-100 text-green-700',
};

export default function HymnsPage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = HYMNS.filter(h => {
        const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || h.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Music className="w-4 h-4 text-violet-300" />
                        <span>Sacred Music</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Hymn Library</h1>
                    <p className="text-xl text-violet-100 max-w-2xl mx-auto mb-10">
                        Traditional Catholic hymns and canticles for worship and devotion.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-300 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search hymns..."
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-10 justify-center">
                    {['all', 'traditional', 'marian', 'eucharistic', 'seasonal'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-full font-medium capitalize transition-all ${filter === type
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Hymns Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(hymn => (
                        <div key={hymn.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[hymn.type]}`}>
                                    {hymn.type}
                                </span>
                                <span className="text-sm text-gray-400">{hymn.verses} verses</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{hymn.title}</h3>
                            {hymn.latinTitle && <p className="text-violet-600 text-sm mb-2">{hymn.latinTitle}</p>}
                            <p className="text-gray-500 text-sm italic">&ldquo;{hymn.firstLine}&rdquo;</p>
                        </div>
                    ))}
                </div>

                {/* Resources */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-6">Sheet Music & Recordings</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://www.cpdl.org/wiki/index.php/Main_Page" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            CPDL (Choral Wiki) <ExternalLink className="w-4 h-4" />
                        </a>
                        <a href="https://hymnary.org/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            Hymnary.org <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
