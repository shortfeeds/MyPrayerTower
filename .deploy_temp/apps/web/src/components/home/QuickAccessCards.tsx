'use client';

import Link from 'next/link';
import { Sparkles, BookOpen, Building2, Users, Heart, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * QuickAccessCards - Simple feature cards for logged-out users
 * Shows 4 main public features with direct links
 */
export function QuickAccessCards() {
    const features = [
        {
            icon: BookOpen,
            title: "Today's Readings",
            description: 'Daily Mass readings and gospel reflection',
            link: '/readings',
            color: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600'
        },
        {
            icon: Sparkles,
            title: 'Browse Prayers',
            description: 'Hundreds of Catholic prayers and devotions',
            link: '/prayers',
            color: 'bg-sacred-500',
            hoverColor: 'hover:bg-sacred-600'
        },
        {
            icon: Building2,
            title: 'Find a Church',
            description: '10,000+ parishes with Mass times',
            link: '/churches',
            color: 'bg-emerald-500',
            hoverColor: 'hover:bg-emerald-600'
        },
        {
            icon: Star,
            title: 'Saint of the Day',
            description: 'Learn about a saint each day',
            link: '/saints',
            color: 'bg-purple-500',
            hoverColor: 'hover:bg-purple-600'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 bg-sacred-100 text-sacred-700 text-sm font-bold rounded-full mb-4">
                        START EXPLORING
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Would You Like to Do <span className="text-sacred-600">Today?</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        No account needed. Jump right into prayer and spiritual reading.
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={feature.link}
                                className="group block bg-cream-50 rounded-2xl p-6 border border-gray-100 hover:border-sacred-200 hover:shadow-lg transition-all h-full"
                            >
                                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-sacred-700 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {feature.description}
                                </p>
                                <span className="text-sacred-600 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Quick Actions */}
                <div className="flex flex-wrap justify-center gap-4 mt-10">
                    <Link
                        href="/candles"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-700 font-semibold rounded-full hover:bg-amber-200 transition-colors"
                    >
                        <Heart className="w-4 h-4" />
                        Light a Candle
                    </Link>
                    <Link
                        href="/sessions"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-100 text-rose-700 font-semibold rounded-full hover:bg-rose-200 transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        View Live Sessions
                    </Link>
                    <Link
                        href="/prayers/rosary"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-100 text-indigo-700 font-semibold rounded-full hover:bg-indigo-200 transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        Pray the Rosary
                    </Link>
                </div>
            </div>
        </section>
    );
}
