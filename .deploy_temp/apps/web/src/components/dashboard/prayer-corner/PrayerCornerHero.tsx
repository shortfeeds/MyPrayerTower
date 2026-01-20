'use client';

import { motion } from 'framer-motion';
import { SACRED_COPY } from '@/lib/sacred-copy';
import { Scroll, Sparkles, BookHeart, Flame } from 'lucide-react';

export function PrayerCornerHero() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-8 md:p-12 mb-8 shadow-2xl">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                            <BookHeart className="w-6 h-6 text-amber-200" />
                        </div>
                        <span className="text-amber-200 font-medium tracking-wide uppercase text-sm">Personal Sanctuary</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">
                        My Prayer Corner
                    </h1>

                    <p className="text-lg text-indigo-100/80 max-w-2xl leading-relaxed italic">
                        "{SACRED_COPY.journey.return}"
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm">
                            <Flame className="w-4 h-4 text-amber-400" />
                            <span>3 Active Candles</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm">
                            <Scroll className="w-4 h-4 text-rose-400" />
                            <span>12 Answered Prayers</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
