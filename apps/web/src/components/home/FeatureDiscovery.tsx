'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Users, CircleDot, Church, Heart, ChevronRight } from 'lucide-react';

const FEATURES = [
    {
        id: 'prayers',
        icon: BookOpen,
        title: 'Prayer Library',
        description: 'Explore traditional Catholic prayers, litanies, and novenas.',
        href: '/prayers'
    },
    {
        id: 'saints',
        icon: Users,
        title: 'Saints & Devotions',
        description: 'Learn about the lives and wisdom of the saints.',
        href: '/saints'
    },
    {
        id: 'rosary',
        icon: CircleDot,
        title: 'Rosary & Daily Readings',
        description: 'Pray the Rosary and reflect on daily Scripture.',
        href: '/rosary'
    },
    {
        id: 'churches',
        icon: Church,
        title: 'Church Finder',
        description: 'Find Catholic churches and Mass times near you.',
        href: '/churches'
    },
    {
        id: 'memorials',
        icon: Heart,
        title: 'Memorials',
        description: 'Create digital chapels for loved ones.',
        href: '/memorials'
    }
];

/**
 * FeatureDiscovery Component
 * 
 * Goal: Exploration, not conversion
 * 
 * Rules:
 * - One sentence per feature
 * - One calm icon
 * - Optional "Explore" link (no urgency)
 */
export function FeatureDiscovery() {
    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
                        Explore Your Faith
                    </h2>
                    <p className="text-gray-600">
                        Discover resources to deepen your spiritual journey.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
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
                                className="block p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group text-center h-full"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 group-hover:text-indigo-600 transition-colors">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                                <span className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    Explore <ChevronRight className="w-3 h-3" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeatureDiscovery;
