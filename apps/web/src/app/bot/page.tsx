'use client';

import React from 'react';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Heart, Church, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function BotMiniAppPlaceholder() {
    return (
        <div className="flex flex-col min-h-screen bg-sacred-950 text-white overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sacred-600/20 rounded-full blur-[120px]"></div>
                <ParticleBackground count={15} opacity={0.3} />
            </div>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
                {/* Visual Header */}
                <div className="mb-8 relative">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-2xl shadow-gold-500/40 animate-float">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Main Content */}
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
                    My Prayer Tower
                    <span className="block text-xl md:text-2xl mt-2 text-gold-400 font-sans font-medium uppercase tracking-[0.2em] opacity-80">
                        Companion App
                    </span>
                </h1>

                <p className="text-lg text-blue-100/70 max-w-md mx-auto mb-10 leading-relaxed font-light">
                    Your spiritual journey, now fully integrated with Telegram. Access the prayer wall, daily mass readings, and saints in a seamless mobile experience.
                </p>

                {/* Feature Grid Placeholder */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center gap-3 transform transition-transform hover:scale-105">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-xs font-semibold text-blue-100/60 uppercase tracking-widest">Readings</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center gap-3 transform transition-transform hover:scale-105">
                        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                            <Church className="w-5 h-5 text-gold-400" />
                        </div>
                        <span className="text-xs font-semibold text-gold-100/60 uppercase tracking-widest">Churches</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center gap-3 transform transition-transform hover:scale-105">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="text-xs font-semibold text-red-100/60 uppercase tracking-widest">Prayers</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center gap-3 transform transition-transform hover:scale-105">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-100/60 uppercase tracking-widest">Streaks</span>
                    </div>
                </div>

                {/* Coming Soon Indicator */}
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 border border-gold-500/30 rounded-full mb-8">
                    <div className="w-2 h-2 rounded-full bg-gold-400 animate-ping"></div>
                    <span className="text-sm font-bold text-gold-400 uppercase tracking-widest">Initializing Sacred Space...</span>
                </div>

                {/* Action */}
                <Link href="/" className="w-full max-w-sm">
                    <Button className="w-full py-6 text-lg font-bold rounded-2xl shadow-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 shadow-gold-600/20 group">
                        Enter Main Sanctuary
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </main>

            {/* Subtle Footer */}
            <footer className="relative z-10 py-8 px-6 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
                <p className="text-xs text-blue-100/30 font-medium tracking-widest uppercase">
                    Uniting the World in Prayer
                </p>
            </footer>
        </div>
    );
}
