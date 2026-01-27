
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, Map, ShieldCheck, Star } from 'lucide-react';

interface VisitedSite {
    id: string;
    name: string;
    visitedAt: string;
}

export function PilgrimagePassport() {
    const [visitedSites, setVisitedSites] = useState<VisitedSite[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('pilgrimage_passport');
        if (saved) setVisitedSites(JSON.parse(saved));
    }, []);

    const totalPossible = 6;
    const progress = (visitedSites.length / totalPossible) * 100;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-40 right-6 z-40 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-900/40 hover:scale-110 active:scale-95 transition-all group"
            >
                <ShieldCheck className="w-7 h-7 text-white" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#faf9f6]">
                    {visitedSites.length}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#2a1b1b] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,1)]"
                        >
                            <div className="p-8 pb-0">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-serif font-bold text-amber-200">The Pilgrim's Passport</h2>
                                        <p className="text-amber-100/40 text-xs uppercase tracking-[0.2em] mt-1 italic font-bold">Documentum Peregrini</p>
                                    </div>
                                    <Award className="w-10 h-10 text-amber-500/50" />
                                </div>

                                <div className="relative h-1 bg-white/5 rounded-full mb-12 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="absolute h-full bg-gradient-to-r from-amber-600 to-amber-400"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                    {['Vatican', 'Holy Land', 'Lourdes', 'Fatima', 'Santiago', 'Guadalupe'].map((site) => {
                                        const isVisited = visitedSites.some(s => s.name.includes(site));
                                        return (
                                            <div
                                                key={site}
                                                className={`p-6 rounded-3xl border transition-all flex flex-col items-center justify-center text-center gap-4 ${isVisited
                                                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                                                        : 'bg-white/5 border-white/5 text-white/20'
                                                    }`}
                                            >
                                                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${isVisited ? 'border-amber-400 bg-amber-400/10' : 'border-white/5 bg-transparent'
                                                    }`}>
                                                    {isVisited ? <CheckCircle2 className="w-8 h-8 text-amber-400" /> : <Map className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">{site}</p>
                                                    {isVisited ? (
                                                        <span className="text-[10px] text-amber-500/60 uppercase font-black tracking-tighter">Verified</span>
                                                    ) : (
                                                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-30">Incomplete</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                                >
                                    Close Passport
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
