'use client';

import { useState } from 'react';
import { Sparkles, Calendar, ChevronRight, BookOpen, Heart, Clock, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { NOVENAS } from '@/lib/novenas';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { id: 'all', label: 'All Novenas' },
    { id: 'marian', label: 'Marian' },
    { id: 'saints', label: 'Saints' },
    { id: 'special', label: 'Special Intentions' },
];

export default function NovenasPage() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filtered = NOVENAS.filter(n => {
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
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Immersive Hero */}
            <div className="relative bg-[#2d1b4e] text-white pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b4e]/80 via-[#2d1b4e]/90 to-slate-50" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium mb-6 border border-white/20">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span className="text-amber-100">Powerful Nine-Day Devotions</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
                            Novena <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-200">Library</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                            Join millions of Catholics in the ancient tradition of praying for nine consecutive days.
                            Find hope, healing, and intercession.
                        </p>

                        {/* Search Input */}
                        <div className="max-w-xl mx-auto relative group">
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
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
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
        </div>
    );
}
