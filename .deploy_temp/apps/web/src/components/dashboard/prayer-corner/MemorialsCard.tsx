'use client';

import { motion } from 'framer-motion';
import { Heart, Calendar, Plus, ChevronRight } from 'lucide-react';
import { SACRED_COPY } from '@/lib/sacred-copy';
import Link from 'next/link';
import Image from 'next/image';

const MOCK_MEMORIALS = [
    {
        id: '1',
        name: 'Grandmother Maria',
        date: 'Anniversary: Oct 12',
        image: '/images/saints/placeholder_saint.jpg'
    }
];

export function MemorialsCard() {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    Memorial Chapels
                </h2>
                <Link href="/memorials" className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1">
                    See All <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-4">
                {MOCK_MEMORIALS.map((memorial, idx) => (
                    <motion.div
                        key={memorial.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50 border border-slate-100 p-4 group"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border-2 border-white">
                                <div className="w-full h-full bg-slate-200" /> {/* Placeholder */}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{memorial.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {memorial.date}
                                </p>
                            </div>
                            <button className="ml-auto px-3 py-1 bg-white/50 hover:bg-white text-xs font-medium text-rose-600 rounded-full border border-rose-100 transition-colors">
                                {SACRED_COPY.memorials.visit}
                            </button>
                        </div>
                    </motion.div>
                ))}

                <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{SACRED_COPY.memorials.create}</span>
                </button>
            </div>

            <p className="text-xs text-center text-slate-400 mt-4 italic">
                {SACRED_COPY.memorials.rest}
            </p>
        </div>
    );
}
