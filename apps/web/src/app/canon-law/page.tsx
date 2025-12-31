'use client';

import { useState } from 'react';
import { Scale, Search, ChevronDown, ExternalLink, BookOpen } from 'lucide-react';

interface CanonLawBook {
    number: number;
    title: string;
    canons: string;
    summary: string;
}

const CANON_LAW_BOOKS: CanonLawBook[] = [
    { number: 1, title: 'General Norms', canons: '1-203', summary: 'Definitions, types of laws, custom, dispensations, and time computation' },
    { number: 2, title: 'The People of God', canons: '204-746', summary: 'The Christian faithful, hierarchy, institutes of consecrated life' },
    { number: 3, title: 'The Teaching Function of the Church', canons: '747-833', summary: 'Preaching, catechetics, Catholic education, communications' },
    { number: 4, title: 'The Sanctifying Function of the Church', canons: '834-1253', summary: 'Sacraments, sacred places, sacred times, divine worship' },
    { number: 5, title: 'The Temporal Goods of the Church', canons: '1254-1310', summary: 'Acquisition, administration, contracts, pious wills' },
    { number: 6, title: 'Sanctions in the Church', canons: '1311-1399', summary: 'Delicts, penalties, penal process' },
    { number: 7, title: 'Processes', canons: '1400-1752', summary: 'Trials, marriage cases, penal procedures, administrative recourse' },
];

const POPULAR_CANONS = [
    { number: 96, topic: 'Baptism and Church Membership' },
    { number: 213, topic: 'Right to Word and Sacraments' },
    { number: 844, topic: 'Receiving Sacraments from Non-Catholics' },
    { number: 915, topic: 'Communion and Grave Sin' },
    { number: 916, topic: 'Confession Before Communion' },
    { number: 1055, topic: 'Marriage Definition' },
    { number: 1141, topic: 'Indissolubility of Marriage' },
    { number: 1398, topic: 'Penalty for Abortion' },
];

export default function CanonLawPage() {
    const [expanded, setExpanded] = useState<number | null>(2);
    const [search, setSearch] = useState('');

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Scale className="w-4 h-4 text-slate-300" />
                        <span>1983 Code</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Code of Canon Law</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        The universal law of the Latin Catholic Church — 1,752 canons governing Church life and discipline.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by canon number or keyword..."
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Books */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Seven Books</h2>
                <div className="space-y-4 mb-16">
                    {CANON_LAW_BOOKS.map(book => (
                        <div key={book.number} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setExpanded(expanded === book.number ? null : book.number)}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 font-bold">
                                        {book.number}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-gray-900">{book.title}</h3>
                                        <p className="text-sm text-gray-500">Canons {book.canons}</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded === book.number ? 'rotate-180' : ''}`} />
                            </button>
                            {expanded === book.number && (
                                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                                    <p className="text-gray-600 mb-4">{book.summary}</p>
                                    <a
                                        href={`https://www.vatican.va/archive/cod-iuris-canonici/cic_index_en.html`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-slate-600 font-medium hover:underline"
                                    >
                                        Read on Vatican.va <ExternalLink className="w-4 h-4 ml-1" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Popular Canons */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Referenced Canons</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {POPULAR_CANONS.map(canon => (
                        <a
                            key={canon.number}
                            href={`https://www.vatican.va/archive/cod-iuris-canonici/eng/documents/cic_lib1-cann1-22_en.html#Can.${canon.number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div className="text-2xl font-bold text-slate-600 mb-1">Can. {canon.number}</div>
                            <div className="text-sm text-gray-500 group-hover:text-slate-600">{canon.topic}</div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
