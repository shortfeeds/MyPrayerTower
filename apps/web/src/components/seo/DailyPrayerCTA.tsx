'use client';

import Link from 'next/link';
import { Send, Smartphone } from 'lucide-react';

export function DailyPrayerCTA() {
    return (
        <section className="my-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-sacred-900 via-sacred-800 to-sacred-950 text-white shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>

            {/* Glow Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sacred-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex-1 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
                        Free Daily Resource
                    </div>

                    <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                        Grow Closer to God Every Day
                    </h3>

                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Join thousands of Catholics receiving our daily prayer notifications,
                        Mass readings, and spiritual reflections. Completely free.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-sacred-900 font-bold py-3 px-6 rounded-full transition-colors shadow-lg shadow-gold-500/20"
                        >
                            <Smartphone className="w-5 h-5" />
                            Download App
                        </a>

                        <a
                            href="https://t.me/MyPrayerTowerBot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-full transition-colors border border-white/10 backdrop-blur-sm"
                        >
                            <Send className="w-5 h-5" />
                            Join Telegram
                        </a>
                    </div>
                </div>

                {/* Mockup / Visual */}
                <div className="shrink-0 relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                        <span className="text-4xl">🙏</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
