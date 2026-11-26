'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Flame, Gift, Calendar, ArrowRight } from 'lucide-react';

/**
 * MemorialsBanner Component
 * 
 * A dedicated promotional section for Eternal Memorials feature
 * Meant to be placed prominently on the homepage
 */
export function MemorialsBanner() {
    return (
        <section className="py-16 bg-gradient-to-br from-[#18120D] via-[#120E0A] to-[#1F1412] border-y border-gold-500/20 text-[#FAF6EE] overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-crimson-600/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crimson-600/25 border border-gold-500/30 text-gold-300 mb-6">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm font-medium">Honor Those You Love</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#FAF6EE] mb-4">
                                Create an <span className="text-gold-300">Eternal Memorial</span>
                            </h2>

                            <p className="text-[#CFC5B4] text-lg leading-relaxed mb-6">
                                Keep the memory of your loved ones alive with a beautiful digital memorial.
                                Light candles, share memories, and invite others to pray.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link
                                    href="/memorials/create"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] hover:brightness-110 text-[#120E0A] font-bold rounded-xl shadow-lg transition-all group"
                                >
                                    Create Memorial
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/memorials"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-[#FAF6EE] font-medium rounded-xl border border-gold-500/30 hover:bg-white/10 transition-colors"
                                >
                                    View Memorials
                                </Link>
                            </div>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { icon: Flame, title: 'Virtual Candles', description: 'Light candles in memory', href: '/candles' },
                                { icon: Heart, title: 'Share Memories', description: 'Photos & stories', href: '/memorials' },
                                { icon: Gift, title: 'Spiritual Bouquets', description: 'Send prayers & Masses', href: '/bouquets' },
                                { icon: Calendar, title: 'Anniversaries', description: 'Never forget key dates', href: '/anniversaries' },
                            ].map((feature) => (
                                <Link
                                    href={feature.href}
                                    key={feature.title}
                                    className="block bg-[#18120D] p-5 rounded-2xl border border-gold-500/25 hover:border-gold-400 shadow-lg transition-all"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mb-3">
                                        <feature.icon className="w-5 h-5 text-gold-300" />
                                    </div>
                                    <h3 className="font-semibold text-[#FAF6EE] mb-1">{feature.title}</h3>
                                    <p className="text-sm text-[#CFC5B4]">{feature.description}</p>
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MemorialsBanner;
