'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ExternalLink, Globe, Plane, Church, Compass, Sparkles, BookOpen } from 'lucide-react';
import { PilgrimagePassport } from '@/components/pilgrimages/PilgrimagePassport';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

interface Pilgrimage {
    id: string;
    name: string;
    location: string;
    country: string;
    description: string;
    significance: string;
    virtualTourUrl?: string;
    imageUrl: string;
    history?: string;
}

const PILGRIMAGES: Pilgrimage[] = [
    {
        id: 'vatican',
        name: 'Vatican City & St. Peter\'s Basilica',
        location: 'Rome',
        country: 'Italy',
        description: 'The heart of Catholicism, home to the Pope and the tomb of St. Peter.',
        significance: 'Center of the Universal Church',
        virtualTourUrl: 'https://www.vatican.va/various/basiliche/san_pietro/vr_tour/index-en.html',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/St_Peter%27s_Basilica_1.jpg/1200px-St_Peter%27s_Basilica_1.jpg',
        history: 'Built over the burial site of St. Peter the Apostle.'
    },
    {
        id: 'holy-land',
        name: 'Holy Land - Jerusalem',
        location: 'Jerusalem',
        country: 'Israel',
        description: 'Walk where Jesus walked. Visit the Church of the Holy Sepulchre and Via Dolorosa.',
        significance: 'Sites of Christ\'s life, death, and resurrection',
        imageUrl: 'https://images.unsplash.com/photo-1548126466-419586aba1a9?auto=format&fit=crop&q=80&w=2000',
        history: 'Direct connection to the Gospel events.'
    },
    {
        id: 'lourdes',
        name: 'Sanctuary of Our Lady of Lourdes',
        location: 'Lourdes',
        country: 'France',
        description: 'Where Our Lady appeared to St. Bernadette. A place of deep healing.',
        significance: 'Marian apparition site',
        virtualTourUrl: 'https://www.lourdes-france.org/en/virtual-tour/',
        imageUrl: 'https://images.unsplash.com/photo-1610450503022-7945d83669c5?auto=format&fit=crop&q=80&w=2000'
    },
    {
        id: 'fatima',
        name: 'Sanctuary of Fátima',
        location: 'Fátima',
        country: 'Portugal',
        description: 'Site of the 1917 apparitions. Home of the Miracle of the Sun.',
        significance: 'Marian apparition site',
        imageUrl: 'https://images.unsplash.com/photo-1590059392358-132ced7d863f?auto=format&fit=crop&q=80&w=2000'
    },
    {
        id: 'santiago',
        name: 'Santiago de Compostela',
        location: 'Santiago',
        country: 'Spain',
        description: 'End point of the Camino pilgrimage. Burial site of St. James.',
        significance: 'Apostolic shrine',
        imageUrl: 'https://images.unsplash.com/photo-1579621970795-87faff38317a?auto=format&fit=crop&q=80&w=2000'
    },
    {
        id: 'guadalupe',
        name: 'Basilica of Our Lady of Guadalupe',
        location: 'Mexico City',
        country: 'Mexico',
        description: 'Where Our Lady appeared to St. Juan Diego. The tilma is preserved here.',
        significance: 'Marian apparition site',
        imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=2000'
    },
];

export default function PilgrimagesPage() {
    const [visitedIds, setVisitedIds] = useState<string[]>([]);
    const [selectedSite, setSelectedSite] = useState<Pilgrimage | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('pilgrimage_passport');
        if (saved) {
            const data = JSON.parse(saved);
            setVisitedIds(data.map((s: any) => s.id));
        }
    }, []);

    const markAsVisited = (site: Pilgrimage) => {
        if (visitedIds.includes(site.id)) return;

        const newVisited = [...visitedIds, site.id];
        setVisitedIds(newVisited);

        const saved = JSON.parse(localStorage.getItem('pilgrimage_passport') || '[]');
        const updated = [...saved, { id: site.id, name: site.name, visitedAt: new Date().toISOString() }];
        localStorage.setItem('pilgrimage_passport', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage')); // Trigger update for passport component
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 selection:text-amber-200">
            {/* Immersive Hero */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1511252178225-cc70bf4f71a0?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover opacity-30 saturate-[0.5]"
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]" />
                    <ParticleBackground count={12} opacity={0.3} />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8">
                            <Compass className="w-4 h-4 animate-spin-slow" />
                            <span>Journey to the Sacred</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tighter drop-shadow-2xl">
                            Virtual <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Pilgrimages</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100/60 max-w-3xl mx-auto font-light leading-relaxed italic">
                            "To go on pilgrimage is not simply to visit a place to admire its treasures of nature, art or history. To go on pilgrimage means to step out of ourselves."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Grid */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {PILGRIMAGES.map((site, index) => (
                        <motion.div
                            key={site.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[#0F0F0F] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500"
                        >
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img
                                    src={site.imageUrl}
                                    alt={site.name}
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />

                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-amber-500" />
                                    {site.country}
                                </div>

                                {visitedIds.includes(site.id) && (
                                    <div className="absolute top-6 right-6 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] border-2 border-white/20">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                )}

                                <div className="absolute bottom-8 left-8 right-8">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">{site.name}</h3>
                                    <p className="text-sm text-blue-100/60 font-medium tracking-wide mb-6">{site.location}</p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedSite(site)}
                                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Learn More
                                        </button>
                                        {site.virtualTourUrl && (
                                            <a
                                                href={site.virtualTourUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                                onClick={() => markAsVisited(site)}
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedSite && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSite(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        />
                        <motion.div
                            layoutId={selectedSite.id}
                            className="relative w-full max-w-4xl bg-[#0A0A0A] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
                        >
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="h-[300px] md:h-full relative">
                                    <img src={selectedSite.imageUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]" />
                                </div>
                                <div className="p-12">
                                    <div className="flex items-center gap-3 text-amber-500 mb-6">
                                        <Sparkles className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">Sacred Context</span>
                                    </div>
                                    <h2 className="text-4xl font-serif font-bold mb-6 text-amber-200">{selectedSite.name}</h2>
                                    <div className="space-y-8 text-blue-100/70 leading-relaxed font-light">
                                        <section>
                                            <div className="flex items-center gap-2 text-white font-bold mb-3">
                                                <BookOpen className="w-4 h-4 text-amber-400" />
                                                <span>The Vision</span>
                                            </div>
                                            <p className="text-sm">{selectedSite.description}</p>
                                        </section>
                                        <section>
                                            <div className="flex items-center gap-2 text-white font-bold mb-3">
                                                <Church className="w-4 h-4 text-amber-400" />
                                                <span>Spiritual Significance</span>
                                            </div>
                                            <p className="text-sm italic">"{selectedSite.significance}"</p>
                                        </section>
                                        {selectedSite.history && (
                                            <section>
                                                <div className="flex items-center gap-2 text-white font-bold mb-3">
                                                    <Compass className="w-4 h-4 text-amber-400" />
                                                    <span>Heritage</span>
                                                </div>
                                                <p className="text-sm">{selectedSite.history}</p>
                                            </section>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setSelectedSite(null)}
                                        className="mt-12 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        Return to the Journey
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <PilgrimagePassport />
        </div>
    );
}

