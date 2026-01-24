'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Users, CircleDot, Church, Heart, ChevronRight } from 'lucide-react';

const FEATURES = [
    {
        id: 'memorials',
        icon: Heart,
        title: 'Eternal Memorials',
        description: 'Create lasting tributes for loved ones who have passed.',
        href: '/memorials',
        color: 'from-pink-500 to-rose-500',
        bg: 'bg-pink-50'
    },
    {
        id: 'prayers',
        icon: BookOpen,
        title: 'Prayer Library',
        description: 'Explore traditional Catholic prayers, litanies, and novenas.',
        href: '/prayers',
        color: 'from-blue-500 to-indigo-500',
        bg: 'bg-blue-50'
    },
    {
        id: 'rosary',
        icon: CircleDot,
        title: 'Holy Rosary',
        description: 'Pray the Rosary with guided meditations.',
        href: '/rosary',
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50'
    },
    {
        id: 'saints',
        icon: Users,
        title: 'Saints & Feasts',
        description: 'Learn about the lives of the saints.',
        href: '/saints',
        color: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-50'
    },
    {
        id: 'churches',
        icon: Church,
        title: 'Find a Church',
        description: 'Locate Catholic churches and Mass times near you.',
        href: '/churches',
        color: 'from-violet-500 to-purple-500',
        bg: 'bg-violet-50'
    },
    {
        id: 'stations',
        icon: Heart,
        title: 'Stations of the Cross',
        description: 'Walk the Way of the Cross.',
        href: '/stations',
        color: 'from-red-500 to-rose-600',
        bg: 'bg-red-50'
    },
    {
        id: 'novenas',
        icon: BookOpen,
        title: 'Novenas',
        description: 'Nine-day prayer devotions.',
        href: '/novenas',
        color: 'from-cyan-500 to-blue-500',
        bg: 'bg-cyan-50'
    },
    {
        id: 'bouquets',
        icon: Heart,
        title: 'Spiritual Bouquets',
        description: 'Send spiritual gifts to loved ones.',
        href: '/bouquets',
        color: 'from-fuchsia-500 to-pink-500',
        bg: 'bg-fuchsia-50'
    }
];

export function FeatureDiscovery() {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-gold-600 dark:text-gold-400 font-bold tracking-wider text-xs uppercase mb-3 block">
                        Our Features
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-sacred-900 dark:text-white mb-6">
                        Explore Your Faith
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        A comprehensive suite of spiritual tools designed to deepen your connection with God and the Community.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href={feature.href}
                                className="group relative block p-8 rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 h-full overflow-hidden"
                            >
                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gold-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300 text-white`}>
                                        <feature.icon className="w-8 h-8" strokeWidth={1.5} />
                                    </div>

                                    <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-3 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>

                                    <div className="mt-6 flex items-center text-gold-600 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        Explore <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeatureDiscovery;
