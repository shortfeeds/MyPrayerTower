'use client';

import { motion } from 'framer-motion';
import { Flame, Star, Sparkles, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function CandleHero() {
    return (
        <div className="relative overflow-hidden bg-sacred-900 min-h-[60vh] flex items-center justify-center">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-sacred-950/50 to-sacred-950" />
            </div>

            {/* Particle Effects (CSS based for performance) */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-amber-200 rounded-full"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: Math.random() * 0.5 + 0.2
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [null, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                        style={{
                            width: Math.random() * 4 + 1 + 'px',
                            height: Math.random() * 4 + 1 + 'px',
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Sacred Prayer Space</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 mb-6 drop-shadow-lg">
                        Light a Candle
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 md:text-gray-200 leading-relaxed mb-10">
                        Join our global community in prayer. Light a virtual candle to represent your intentions, gratitude, or memory of a loved one.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => document.getElementById('candle-types')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white font-semibold shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
                        >
                            <span className="flex items-center gap-2">
                                <Flame className="w-5 h-5 fill-current animate-pulse" />
                                Light Your Candle
                            </span>
                        </button>

                        <Link
                            href="/prayers"
                            className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-medium transition-colors"
                        >
                            Browse Prayers
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <ChevronDown className="w-6 h-6" />
            </motion.div>
        </div>
    );
}
