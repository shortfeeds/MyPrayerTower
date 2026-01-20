'use client';

import { useState } from 'react';
import { BookA, Search, ChevronDown } from 'lucide-react';

interface Term {
    term: string;
    definition: string;
    category: string;
}

const GLOSSARY: Term[] = [
    { term: 'Absolution', definition: 'The act of a priest forgiving sins in the Sacrament of Reconciliation.', category: 'Sacraments' },
    { term: 'Advent', definition: 'The four-week liturgical season of preparation before Christmas.', category: 'Liturgy' },
    { term: 'Apostolic Succession', definition: 'The unbroken line of bishops from the Apostles to the present.', category: 'Ecclesiology' },
    { term: 'Beatification', definition: 'The second step toward canonization, allowing public veneration.', category: 'Saints' },
    { term: 'Catechumen', definition: 'A person preparing to receive Baptism through the RCIA process.', category: 'Sacraments' },
    { term: 'Charism', definition: 'A spiritual gift given by the Holy Spirit for the good of the Church.', category: 'Theology' },
    { term: 'Conclave', definition: 'The meeting of cardinals to elect a new pope.', category: 'Hierarchy' },
    { term: 'Contrition', definition: 'Sorrow for sins committed, with the intention to avoid future sin.', category: 'Sacraments' },
    { term: 'Dogma', definition: 'A truth revealed by God and definitively taught by the Church.', category: 'Theology' },
    { term: 'Encyclical', definition: 'A formal letter from the Pope addressed to the universal Church.', category: 'Hierarchy' },
    { term: 'Eucharist', definition: 'The sacrament of Christ\'s Body and Blood under the forms of bread and wine.', category: 'Sacraments' },
    { term: 'Ex Cathedra', definition: 'When the Pope speaks with full papal authority on faith or morals.', category: 'Hierarchy' },
    { term: 'Grace', definition: 'The free and unmerited gift of God\'s life and assistance.', category: 'Theology' },
    { term: 'Immaculate Conception', definition: 'The doctrine that Mary was conceived without original sin.', category: 'Mariology' },
    { term: 'Incarnation', definition: 'The mystery of the Son of God becoming man in Jesus Christ.', category: 'Christology' },
    { term: 'Indulgence', definition: 'Remission of temporal punishment due to sin already forgiven.', category: 'Theology' },
    { term: 'Magisterium', definition: 'The teaching authority of the Church, exercised by the Pope and bishops.', category: 'Hierarchy' },
    { term: 'Monstrance', definition: 'A sacred vessel used to display the Blessed Sacrament for adoration.', category: 'Liturgy' },
    { term: 'Novena', definition: 'A nine-day period of prayer for a special intention.', category: 'Devotion' },
    { term: 'Original Sin', definition: 'The fallen state inherited from Adam and Eve\'s first sin.', category: 'Theology' },
    { term: 'Purgatory', definition: 'The state of purification after death before entering Heaven.', category: 'Eschatology' },
    { term: 'Real Presence', definition: 'Christ\'s true presence in the Eucharist—body, blood, soul, and divinity.', category: 'Sacraments' },
    { term: 'Sacrament', definition: 'An outward sign instituted by Christ that gives grace.', category: 'Sacraments' },
    { term: 'Transubstantiation', definition: 'The change of bread and wine into Christ\'s Body and Blood at Mass.', category: 'Sacraments' },
    { term: 'Trinity', definition: 'The one God in three Persons: Father, Son, and Holy Spirit.', category: 'Theology' },
    { term: 'Venial Sin', definition: 'A lesser sin that weakens but does not destroy our relationship with God.', category: 'Theology' },
];

const CATEGORIES = ['All', 'Sacraments', 'Theology', 'Hierarchy', 'Liturgy', 'Ecclesiology', 'Mariology', 'Christology', 'Eschatology', 'Devotion', 'Saints'];

export default function GlossaryPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const filtered = GLOSSARY.filter(t => {
        const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) ||
            t.definition.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || t.category === category;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-cyan-700 via-teal-800 to-emerald-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <BookA className="w-4 h-4 text-cyan-300" />
                        <span>A-Z Reference</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Catholic Glossary</h1>
                    <p className="text-xl text-cyan-100 max-w-2xl mx-auto mb-10">
                        Definitions of key Catholic terms, doctrines, and concepts.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search terms..."
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-10 justify-center">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${category === cat
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Terms */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {filtered.map(term => (
                        <div key={term.term} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{term.term}</h3>
                                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                                    {term.category}
                                </span>
                            </div>
                            <p className="text-gray-600">{term.definition}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
