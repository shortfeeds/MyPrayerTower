'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Heart, Users, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * CandleBanner - Beautiful promotional banner for the Light a Candle feature
 * Shows animated candle flames and live statistics
 */
export function CandleBanner() {
    // Base count starts at 2000, then we fetch real count and add
    const [activeCandles, setActiveCandles] = useState(2000);
    const [prayerCount, setPrayerCount] = useState(45000);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Fetch actual candle count from API and add to base
        const fetchCandleCount = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${API_BASE}/api/v1/candles/count`);
                if (res.ok) {
                    const data = await res.json();
                    // Add real candles to base of 2000
                    setActiveCandles(2000 + (data.count || 0));
                    setPrayerCount(45000 + (data.prayerCount || 0));
                }
            } catch {
                // Keep default values on error
            }
        };

        fetchCandleCount();

        // Initial fetch complete (Polling removed to save Vercel limits)
    }, []);

    // Slight random fluctuation for engagement
    useEffect(() => {
        if (!mounted) return;
        const interval = setInterval(() => {
            setPrayerCount(prev => prev + Math.floor(Math.random() * 3) + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, [mounted]);

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    className="relative rounded-3xl overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700" />

                    {/* Animated Pattern Overlay */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,215,0,0.4) 0%, transparent 40%),
                                             radial-gradient(circle at 80% 70%, rgba(255,100,0,0.3) 0%, transparent 40%)`,
                        }}
                    />

                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {mounted && [...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-60"
                                style={{
                                    left: `${10 + Math.random() * 80}%`,
                                    bottom: '-5%',
                                }}
                                animate={{
                                    y: [0, -400 - Math.random() * 200],
                                    x: [0, (Math.random() - 0.5) * 50],
                                    opacity: [0, 0.8, 0],
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 3,
                                    repeat: Infinity,
                                    delay: Math.random() * 3,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            {/* Left Side - Candle Illustration + Text */}
                            <div className="flex-1 text-center lg:text-left">
                                {/* Animated Candle Icons */}
                                <div className="flex items-end justify-center lg:justify-start gap-2 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="relative" style={{ animationDelay: `${i * 0.2}s` }}>
                                            {/* Candle Body */}
                                            <div
                                                className="w-4 md:w-5 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 rounded-sm shadow-lg"
                                                style={{ height: `${30 + i * 8}px` }}
                                            />
                                            {/* Flame */}
                                            <motion.div
                                                className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-5 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full"
                                                style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
                                                animate={{
                                                    scaleY: [1, 1.2, 0.9, 1.1, 1],
                                                    scaleX: [1, 0.9, 1.1, 0.95, 1],
                                                }}
                                                transition={{
                                                    duration: 0.5 + Math.random() * 0.3,
                                                    repeat: Infinity,
                                                    delay: Math.random() * 0.5,
                                                }}
                                            />
                                            {/* Glow */}
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-400/40 rounded-full blur-lg" />
                                        </div>
                                    ))}
                                </div>

                                <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-bold rounded-full mb-4 backdrop-blur-sm">
                                    🕯️ VIRTUAL PRAYER CANDLES
                                </span>

                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                    Light a Candle for <br className="hidden md:block" />
                                    <span className="text-yellow-300">Your Intentions</span>
                                </h2>

                                <p className="text-white/90 text-lg max-w-xl mx-auto lg:mx-0 mb-6">
                                    Join our global prayer community. Light a virtual candle and have thousands of faithful Catholics pray for your intentions.
                                </p>

                                {/* Stats */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                            <Flame className="w-5 h-5 text-yellow-300" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xl text-white">
                                                {mounted ? activeCandles.toLocaleString() : '2,000'}+
                                            </div>
                                            <div className="text-xs text-white/70">Active Candles</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                            <Heart className="w-5 h-5 text-pink-300" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xl text-white">
                                                {mounted ? prayerCount.toLocaleString() : '45,000'}+
                                            </div>
                                            <div className="text-xs text-white/70">Prayers Offered</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                            <Users className="w-5 h-5 text-blue-300" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xl text-white">24/7</div>
                                            <div className="text-xs text-white/70">Global Community</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - CTA */}
                            <div className="flex-shrink-0 text-center">
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                                    <Sparkles className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        Share Your Prayer
                                    </h3>
                                    <p className="text-white/80 text-sm mb-6 max-w-xs">
                                        Light a candle for free or choose a premium offering for extended visibility and more prayers.
                                    </p>
                                    <Link
                                        href="/candles"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:from-yellow-300 hover:to-amber-400 transition-all transform hover:scale-105"
                                    >
                                        <Flame className="w-5 h-5" />
                                        Light a Candle
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-900/50 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
}
