import { BookOpen, Search, ExternalLink, ChevronRight, Book, FileText } from 'lucide-react';
import Link from 'next/link';

const CATECHISM_PARTS = [
    {
        part: 1,
        title: 'The Profession of Faith',
        sections: [
            { name: 'The Creed', paragraphs: '26-1065' },
            { name: 'God the Father', paragraphs: '268-324' },
            { name: 'Jesus Christ', paragraphs: '422-682' },
            { name: 'The Holy Spirit', paragraphs: '683-1065' }
        ]
    },
    {
        part: 2,
        title: 'The Celebration of the Christian Mystery',
        sections: [
            { name: 'The Sacramental Economy', paragraphs: '1076-1209' },
            { name: 'The Seven Sacraments', paragraphs: '1210-1690' }
        ]
    },
    {
        part: 3,
        title: 'Life in Christ',
        sections: [
            {
                name: "Man's Vocation", paragraphs: '1691 - 1876'
            },
            { name: 'The Ten Commandments', paragraphs: '2052-2557' }
        ]
    },
    {
        part: 4,
        title: 'Christian Prayer',
        sections: [
            { name: 'Prayer in the Christian Life', paragraphs: '2558-2758' },
            { name: "The Lord's Prayer", paragraphs: '2759 - 2865' }
        ]
    }
];

const EXTERNAL_RESOURCES = [
    {
        name: 'Vatican Official Catechism',
        url: 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM',
        description: 'Complete text from the Holy See'
    },
    {
        name: 'USCCB Catechism',
        url: 'https://www.usccb.org/beliefs-and-teachings/what-we-believe/catechism',
        description: 'United States Catholic Conference of Bishops'
    },
    {
        name: 'Catechism Search API',
        url: 'https://www.catholiccrossreference.online/catechism/',
        description: 'Search paragraphs by number or keyword'
    }
];

export default function CatechismPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Book className="w-4 h-4 text-emerald-300" />
                        <span>Catechism of the Catholic Church</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Catechism</h1>
                    <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
                        The official compendium of Catholic doctrine — 2,865 paragraphs covering faith, sacraments, morality, and prayer.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
                        <input
                            type="text"
                            placeholder="Search by paragraph number or keyword..."
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Parts Overview */}
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    Browse by Part
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {CATECHISM_PARTS.map((part) => (
                        <div key={part.part} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                                    {part.part}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{part.title}</h3>
                            </div>
                            <ul className="space-y-2">
                                {part.sections.map((section, i) => (
                                    <li key={i} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{section.name}</span>
                                        <span className="text-emerald-600 font-medium">§{section.paragraphs}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* External Resources */}
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <ExternalLink className="w-6 h-6 text-emerald-600" />
                    Official Resources
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {EXTERNAL_RESOURCES.map((resource) => (
                        <a
                            key={resource.name}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
                        >
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                {resource.name}
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                            </h3>
                            <p className="text-gray-600 text-sm">{resource.description}</p>
                        </a>
                    ))}
                </div>

                {/* Quick Access */}
                <div className="mt-16 text-center">
                    <h3 className="text-xl font-bold mb-6">Quick Access</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['§1', '§27', '§422', '§1076', '§1691', '§2558'].map(para => (
                            <a
                                key={para}
                                href={`https://www.catholiccrossreference.online/catechism/#!/search/${para.replace('§', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-medium hover:bg-emerald-100 transition-colors"
                            >
                                {para}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
