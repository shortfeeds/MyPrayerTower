'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Play, Users, Heart, Star, Flame, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TrendingPrayer {
    id: string;
    title: string;
    subtitle: string;
    users: string;
    link?: string;
    slug: string;
}

interface TrendingPrayersCarouselProps {
    prayers?: TrendingPrayer[];
}

export function TrendingPrayersCarousel({ prayers = [] }: TrendingPrayersCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -320 : 320;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Styling configurations to cycle through
    const styleConfigs = [
        {
            icon: Star,
            gradient: "from-blue-600 via-blue-700 to-indigo-900",
            accent: "bg-blue-500/30",
            pattern: "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 40%)"
        },
        {
            icon: Heart,
            gradient: "from-rose-500 via-red-600 to-rose-900",
            accent: "bg-rose-500/30",
            pattern: "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)"
        },
        {
            icon: Flame,
            gradient: "from-emerald-600 via-emerald-700 to-teal-900",
            accent: "bg-emerald-500/30",
            pattern: "repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px)"
        },
        {
            icon: Sun,
            gradient: "from-amber-400 via-orange-500 to-red-600",
            accent: "bg-amber-500/30",
            pattern: "radial-gradient(circle at bottom left, rgba(255,223,0,0.3) 0%, transparent 50%)"
        },
        {
            icon: Moon,
            gradient: "from-indigo-600 via-indigo-800 to-slate-900",
            accent: "bg-indigo-500/30",
            pattern: "radial-gradient(1px 1px at 10% 10%, white 100%, transparent), radial-gradient(1px 1px at 20% 20%, white 100%, transparent)"
        }
    ];

    // Combine data with styles
    const items = prayers.length > 0 ? prayers.map((p, i) => {
        const style = styleConfigs[i % styleConfigs.length];
        return {
            ...p,
            ...style,
            link: p.link || `/prayers/${p.slug}`
        };
    }) : []; // If empty, don't show (page component will handle fetching)

    if (items.length === 0) return null;

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden transition-colors duration-300">
            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-gold-100 dark:bg-gold-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                Live Now
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Trending Prayers
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Join the community in prayer right now.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all hover:scale-105 active:scale-95"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all hover:scale-105 active:scale-95"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={item.link}
                            className="flex-shrink-0 w-[300px] md:w-[340px] snap-start group"
                        >
                            <div className="relative h-[420px] rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                                {/* Abstract Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-700 group-hover:scale-110`}></div>

                                {/* Pattern Overlay */}
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: item.pattern }}></div>

                                {/* Large Background Icon Faded */}
                                <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                    <item.icon className="w-64 h-64 text-white" />
                                </div>

                                {/* Content Container */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                                    {/* Top Metadata */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                            <Users className="w-4 h-4" />
                                            <span className="text-sm font-medium">{item.users} praying</span>
                                        </div>
                                    </div>

                                    {/* Bottom Info */}
                                    <div>
                                        <div className={`w-14 h-14 rounded-2xl ${item.accent} backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/20`}>
                                            <item.icon className="w-7 h-7 text-white fill-current opacity-90" />
                                        </div>

                                        <h3 className="font-display text-3xl font-bold mb-2 leading-tight tracking-tight line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/80 text-lg font-medium mb-6 line-clamp-1">
                                            {item.subtitle}
                                        </p>

                                        <div className="flex items-center gap-2 text-white/90 font-bold group/btn">
                                            <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center group-hover/btn:scale-110 transition-transform shadow-lg">
                                                <Play className="w-4 h-4 ml-0.5 fill-current" />
                                            </div>
                                            <span className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                Start Prayer
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
