'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, User, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ContentPreview - Tabbed preview of daily spiritual content
 */
export function ContentPreview() {
    const [activeTab, setActiveTab] = useState<'gospel' | 'saint' | 'prayer'>('gospel');

    const tabs = [
        { id: 'gospel' as const, label: "Today's Gospel", icon: BookOpen },
        { id: 'saint' as const, label: 'Saint of the Day', icon: User },
        { id: 'prayer' as const, label: 'Featured Prayer', icon: Sparkles },
    ];

    const content = {
        gospel: {
            title: "Gospel - Matthew 5:1-12",
            subtitle: "The Beatitudes",
            excerpt: `"Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn, for they will be comforted. Blessed are the meek, for they will inherit the earth..."`,
            link: "/readings",
            linkText: "Read Full Gospel"
        },
        saint: {
            title: "Saint of the Day",
            subtitle: "St. Francis of Assisi",
            excerpt: `"Lord, make me an instrument of your peace. Where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith..."`,
            link: "/saints",
            linkText: "Learn More About This Saint"
        },
        prayer: {
            title: "Prayer of the Week",
            subtitle: "Prayer for Inner Peace",
            excerpt: `"Almighty God, we bless You for our lives. We give You praise for Your abundant mercy and grace. We thank You for Your faithfulness even when we are not faithful..."`,
            link: "/prayers",
            linkText: "Pray This Prayer"
        }
    };

    const activeContent = content[activeTab];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-cream-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full mb-4">
                        DAILY INSPIRATION
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Fresh Spiritual Content <span className="text-sacred-600">Every Day</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Start each day with carefully curated readings, reflections, and prayers.
                    </p>
                </motion.div>

                {/* Content Card */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-semibold text-sm transition-all ${activeTab === tab.id
                                        ? 'text-sacred-600 bg-sacred-50 border-b-2 border-sacred-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-12">
                            <div className="text-center">
                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                                    {activeContent.title}
                                </span>
                                <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                    {activeContent.subtitle}
                                </h3>
                                <blockquote className="text-lg md:text-xl text-gray-600 leading-relaxed italic mb-8 max-w-2xl mx-auto">
                                    {activeContent.excerpt}
                                </blockquote>
                                <Link
                                    href={activeContent.link}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-sacred-600 text-white font-bold rounded-full hover:bg-sacred-700 transition-colors"
                                >
                                    {activeContent.linkText}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-cream-50 px-8 py-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                            <span>Updated daily at midnight</span>
                            <span className="text-gray-300">•</span>
                            <span>Based on the Roman Catholic Liturgical Calendar</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
