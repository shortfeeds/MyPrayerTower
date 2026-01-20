'use client';

import { useState } from 'react';
import { BookOpen, Search, ExternalLink, ChevronDown, ChevronRight, Lightbulb, Scale, MessageCircle } from 'lucide-react';

interface Question {
    number: number;
    title: string;
    articles: number;
}

interface Part {
    name: string;
    shortName: string;
    questions: Question[];
}

const SUMMA_STRUCTURE: Part[] = [
    {
        name: 'Prima Pars (First Part)',
        shortName: 'I',
        questions: [
            { number: 1, title: 'The Nature and Extent of Sacred Doctrine', articles: 10 },
            { number: 2, title: 'The Existence of God', articles: 3 },
            { number: 3, title: 'The Simplicity of God', articles: 8 },
            { number: 4, title: 'The Perfection of God', articles: 3 },
            { number: 5, title: 'The Goodness in General', articles: 6 },
            // More questions would be loaded dynamically
        ]
    },
    {
        name: 'Prima Secundae (First Part of the Second Part)',
        shortName: 'I-II',
        questions: [
            { number: 1, title: 'The Last End of Man', articles: 8 },
            { number: 2, title: 'Those Things in Which Man\'s Happiness Consists', articles: 8 },
            { number: 6, title: 'The Voluntary and the Involuntary', articles: 8 },
        ]
    },
    {
        name: 'Secunda Secundae (Second Part of the Second Part)',
        shortName: 'II-II',
        questions: [
            { number: 1, title: 'Faith', articles: 10 },
            { number: 17, title: 'Hope', articles: 8 },
            { number: 23, title: 'Charity', articles: 8 },
        ]
    },
    {
        name: 'Tertia Pars (Third Part)',
        shortName: 'III',
        questions: [
            { number: 1, title: 'The Fitness of the Incarnation', articles: 6 },
            { number: 60, title: 'The Sacraments', articles: 8 },
            { number: 73, title: 'The Eucharist', articles: 6 },
        ]
    }
];

const EXTERNAL_LINKS = [
    { name: 'New Advent Summa', url: 'https://www.newadvent.org/summa/', description: 'Full searchable text' },
    { name: 'Aquinas Institute', url: 'https://aquinas.cc/', description: 'Latin/English parallel' },
    { name: 'Corpus Thomisticum', url: 'https://www.corpusthomisticum.org/', description: 'Complete works in Latin' }
];

export default function SummaPage() {
    const [expandedPart, setExpandedPart] = useState<string | null>('I');
    const [search, setSearch] = useState('');

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-yellow-700 via-amber-800 to-orange-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Scale className="w-4 h-4 text-yellow-300" />
                        <span>St. Thomas Aquinas</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Summa Theologica</h1>
                    <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-10">
                        The masterwork of scholastic theology — systematic examination of Christian doctrine in questions and articles.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold">512</div>
                            <div className="text-amber-200 text-sm">Questions</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">2,669</div>
                            <div className="text-amber-200 text-sm">Articles</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">4</div>
                            <div className="text-amber-200 text-sm">Parts</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Search */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search questions or articles (e.g., 'existence of God', 'I q2 a3')..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Summa Parts */}
                <div className="space-y-4 mb-16">
                    {SUMMA_STRUCTURE.map(part => (
                        <div key={part.shortName} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setExpandedPart(expandedPart === part.shortName ? null : part.shortName)}
                                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold">
                                        {part.shortName}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-bold text-gray-900">{part.name}</h3>
                                        <p className="text-sm text-gray-500">{part.questions.length}+ questions</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedPart === part.shortName ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedPart === part.shortName && (
                                <div className="border-t border-gray-100 p-6 bg-gray-50">
                                    <div className="space-y-3">
                                        {part.questions.map(q => (
                                            <a
                                                key={q.number}
                                                href={`https://www.newadvent.org/summa/${part.shortName === 'I' ? '1' : part.shortName === 'I-II' ? '2' : part.shortName === 'II-II' ? '3' : '4'}${q.number.toString().padStart(3, '0')}.htm`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-amber-600">Q{q.number}</span>
                                                    <span className="text-gray-700">{q.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <span>{q.articles} articles</span>
                                                    <ExternalLink className="w-4 h-4 group-hover:text-amber-600" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <a
                                        href={`https://www.newadvent.org/summa/${part.shortName === 'I' ? '1' : part.shortName === 'I-II' ? '2' : part.shortName === 'II-II' ? '3' : '4'}.htm`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-amber-600 font-medium mt-4 hover:underline"
                                    >
                                        View all questions in {part.shortName}
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* External Resources */}
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <ExternalLink className="w-6 h-6 text-amber-600" />
                    Study Resources
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {EXTERNAL_LINKS.map(link => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
                        >
                            <BookOpen className="w-8 h-8 text-amber-600 mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                {link.name}
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                            </h3>
                            <p className="text-gray-600 text-sm">{link.description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
