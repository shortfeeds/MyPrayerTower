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
        <section className="py-16 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-amber-950/20 border-y border-gray-100 dark:border-slate-800 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-200/30 dark:bg-rose-800/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-200/30 dark:bg-amber-800/10 rounded-full blur-3xl" />
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
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 mb-6">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm font-medium">Honor Those You Love</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                                Create an <span className="text-rose-600 dark:text-rose-400">Eternal Memorial</span>
                            </h2>

                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                Keep the memory of your loved ones alive with a beautiful digital memorial.
                                Light candles, share memories, and invite others to pray.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link
                                    href="/memorials/create"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 transition-all group"
                                >
                                    Create Memorial
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/memorials"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
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
                                { icon: Flame, title: 'Virtual Candles', description: 'Light candles in memory' },
                                { icon: Heart, title: 'Share Memories', description: 'Photos & stories' },
                                { icon: Gift, title: 'Spiritual Bouquets', description: 'Send prayers & Masses' },
                                { icon: Calendar, title: 'Anniversaries', description: 'Never forget key dates' },
                            ].map((feature, idx) => (
                                <div
                                    key={feature.title}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-3">
                                        <feature.icon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MemorialsBanner;
