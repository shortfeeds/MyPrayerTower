'use client';

import * as React from 'react';
import { Quote, Sparkles, BookOpen, Church, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface SaintQuote {
    id: number;
    quote: string;
    author: string;
    title: string;
    era: string;
    source?: string;
    initials: string;
    color: string;
}

const SAINTS_WISDOM: SaintQuote[] = [
    {
        id: 1,
        quote: "Pray, hope, and don't worry. Worry is useless. God is merciful and will hear your prayer.",
        author: "St. Pio of Pietrelcina (Padre Pio)",
        title: "Priest & Mystic",
        era: "1887 – 1968",
        source: "Letters of Padre Pio",
        initials: "PP",
        color: "bg-amber-600"
    },
    {
        id: 2,
        quote: "For me, prayer is a surge of the heart; it is a simple look turned toward heaven, it is a cry of recognition and of love, embracing both trial and joy.",
        author: "St. Thérèse of Lisieux",
        title: "Doctor of the Church",
        era: "1873 – 1897",
        source: "Story of a Soul",
        initials: "TL",
        color: "bg-rose-500"
    },
    {
        id: 3,
        quote: "Prayer is nothing else than being on terms of friendship with God, frequently conversing in secret with Him who we know loves us.",
        author: "St. Teresa of Ávila",
        title: "Doctor of the Church",
        era: "1515 – 1582",
        source: "The Way of Perfection",
        initials: "TA",
        color: "bg-sacred-600"
    },
    {
        id: 4,
        quote: "To fall in love with God is the greatest romance; to seek Him the greatest adventure; to find Him, the greatest human achievement.",
        author: "St. Augustine of Hippo",
        title: "Bishop & Doctor of the Church",
        era: "354 – 430",
        source: "Confessions",
        initials: "SA",
        color: "bg-blue-600"
    },
    {
        id: 5,
        quote: "Do not be afraid. Open wide the doors to Christ! Prayer joined to sacrifice constitutes the most powerful force in human history.",
        author: "St. John Paul II",
        title: "Supreme Pontiff",
        era: "1920 – 2005",
        source: "Papal Encyclicals",
        initials: "JP",
        color: "bg-gold-600"
    },
    {
        id: 6,
        quote: "Prayer enlarges the heart until it is capable of containing God's gift of Himself. Ask and seek, and your heart will grow big enough to receive Him.",
        author: "St. Teresa of Calcutta (Mother Teresa)",
        title: "Foundress & Missionary",
        era: "1910 – 1997",
        source: "No Greater Love",
        initials: "MT",
        color: "bg-cyan-600"
    },
    {
        id: 7,
        quote: "He who prays most receives most. Acquire the holy habit of speaking to God with loving confidence, as to your dearest Friend.",
        author: "St. Alphonsus Liguori",
        title: "Doctor of the Church",
        era: "1696 – 1787",
        source: "The Great Means of Salvation",
        initials: "AL",
        color: "bg-emerald-600"
    },
    {
        id: 8,
        quote: "Half an hour's meditation each day is essential, except when you are busy. Then a full hour is needed.",
        author: "St. Francis de Sales",
        title: "Bishop & Doctor of the Church",
        era: "1567 – 1622",
        source: "Introduction to the Devout Life",
        initials: "FS",
        color: "bg-indigo-600"
    },
    {
        id: 9,
        quote: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        author: "Sacred Scripture",
        title: "Apostle Paul to the Philippians",
        era: "New Testament",
        source: "Philippians 4:6–7",
        initials: "NT",
        color: "bg-purple-600"
    }
];

export function TestimonialsSection() {
    const [visibleCount, setVisibleCount] = React.useState(6);
    const visibleWisdom = SAINTS_WISDOM.slice(0, visibleCount);
    const hasMore = visibleCount < SAINTS_WISDOM.length;

    return (
        <section className="relative py-24 overflow-hidden bg-[#fafafa] dark:bg-[#020202]">
            {/* Background Decorations - Subtle & Sacred */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
            <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-sacred-500/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-full text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-6">
                            <Sparkles className="w-3.5 h-3.5" />
                            Wisdom of the Saints
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.15]">
                            Voices of <span className="italic text-sacred-600 dark:text-sacred-400">Faith</span> & <span className="relative inline-block">
                                Grace
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                            Throughout Catholic history, the doctors, mystics, and saints of the Church have reminded us that prayer is the life of the soul and communion with God.
                        </p>
                    </motion.div>
                </div>

                {/* Grid Layout - Saint Quotes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleWisdom.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.6 }}
                            className="h-full"
                        >
                            <div className="h-full bg-white dark:bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden flex flex-col justify-between">
                                {/* Quote Icon */}
                                <Quote className="absolute top-6 right-6 w-10 h-10 text-gray-100 dark:text-white/5 group-hover:text-gold-200 dark:group-hover:text-gold-500/20 transition-colors fill-current" />

                                <div className="relative z-10 mb-6">
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-serif text-lg italic">
                                        "{item.quote}"
                                    </p>
                                </div>

                                {/* Author Block */}
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/10 relative z-10 mt-auto">
                                    <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-white/10 shrink-0`}>
                                        {item.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-gray-900 dark:text-white truncate text-base">{item.author}</div>
                                        <div className="text-xs font-semibold text-sacred-600 dark:text-sacred-400 tracking-wide uppercase truncate">{item.title}</div>
                                        <div className="text-[11px] text-gray-400">{item.era} {item.source && `• ${item.source}`}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Show More Button */}
                {hasMore && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setVisibleCount(SAINTS_WISDOM.length)}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-gray-900 dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-md hover:shadow-lg"
                        >
                            Read More Saints' Reflections
                        </button>
                    </div>
                )}

                {/* Catholic Foundations Footer (Verified Features, Not Fake Media) */}
                <div className="mt-20 text-center border-t border-gray-200 dark:border-white/10 pt-14">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-[0.2em] mb-8">
                        Rooted in Sacred Catholic Tradition
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <BookOpen className="w-5 h-5 text-gold-500" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Roman Missal</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Daily Readings & Gospel</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <Heart className="w-5 h-5 text-rose-500" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Traditional Devotions</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Rosary, Chaplets & Novenas</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <Church className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">8,500+ Parishes</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Catholic Church Directory</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <Shield className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Private & Sacred</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Confidential Prayer Space</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
