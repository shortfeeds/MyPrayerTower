'use client';

import { useState } from 'react';
import { Sparkles, Calendar, ChevronRight, Heart, Search } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { id: 'all', label: 'All Novenas' },
    { id: 'marian', label: 'Marian' },
    { id: 'saints', label: 'Saints' },
    { id: 'special', label: 'Special Intentions' },
];

interface NovenaListProps {
    novenas: any[]; // Using any for simplicity with lib object, ideally typed with Novena interface
}

export function NovenaList({ novenas }: NovenaListProps) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filtered = novenas.filter(n => {
        const matchesSearch =
            n.name.toLowerCase().includes(search.toLowerCase()) ||
            n.patron.toLowerCase().includes(search.toLowerCase()) ||
            n.patronOf?.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (activeCategory === 'all') return true;
        if (activeCategory === 'marian') {
            return n.name.includes('Lady') || n.name.includes('Mary') || n.name.includes('Immaculate') || n.name.includes('Assumption');
        }
        if (activeCategory === 'saints') {
            return n.name.includes('St.') || n.name.includes('Padre') || n.name.includes('Mother Teresa');
        }
        if (activeCategory === 'special') {
            return !n.name.includes('Lady') && !n.name.includes('Mary') && !n.name.includes('St.') && !n.name.includes('Padre');
        }
        return true;
    });

    return (
        <div className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
            {/* Search Input - Elevated out of hero visually */}
            <div className="max-w-xl mx-auto relative group mb-12 -mt-20">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full opacity-50 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
                <div className="relative flex items-center bg-white rounded-full overflow-hidden shadow-2xl">
                    <Search className="absolute left-6 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for a saint, intention, or prayer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full py-4 pl-14 pr-6 text-gray-900 placeholder:text-gray-400 focus:outline-none text-lg"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md ${activeCategory === cat.id
                            ? 'bg-amber-500 text-white shadow-amber-500/30 scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filtered.map((novena) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={novena.id}
                            className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100"
                        >
                            {/* Card Header */}
                            <div className={`h-32 bg-gradient-to-br ${novena.color} relative p-6 flex flex-col justify-between overflow-hidden`}>
                                <div className="absolute top-0 right-0 p-4 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <Sparkles className="w-24 h-24 text-white" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-white/80 text-xs font-bold tracking-wider uppercase mb-1">{novena.patron}</p>
                                    <h3 className="text-white font-serif font-bold text-xl leading-tight text-shadow-sm">{novena.name}</h3>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {novena.patronOf && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                                            <Heart className="w-3 h-3" /> {novena.patronOf}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                                        <Calendar className="w-3 h-3" /> {novena.duration}
                                    </span>
                                </div>

                                <p className="text-gray-500 text-sm mb-6 flex-1 user-select-none">
                                    {novena.description}
                                </p>

                                <Link
                                    href={`/novenas/${novena.id}`}
                                    className="w-full py-3 rounded-xl bg-gray-50 text-gray-900 font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-amber-500 group-hover:text-white transition-colors"
                                >
                                    Pray Now <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-xl">No novenas found matching your criteria.</p>
                    <button onClick={() => { setSearch(''); setActiveCategory('all'); }} className="mt-4 text-amber-600 font-medium hover:underline">Clear Filters</button>
                </div>
            )}
        </div>
    );
}
