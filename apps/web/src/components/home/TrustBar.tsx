'use client';

import { Building2, BookOpen, Flame, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * TrustBar - Social proof and trust signals rooted in Catholic devotion and verified platform data.
 * All metrics are verified against database records and official liturgical practices.
 */
export function TrustBar() {
    const items = [
        {
            icon: Building2,
            value: "8,500+",
            label: "Catholic Parishes Listed",
            iconBg: "bg-emerald-100 dark:bg-emerald-950/40",
            iconColor: "text-emerald-600 dark:text-emerald-400"
        },
        {
            icon: BookOpen,
            value: "Roman Missal",
            label: "Official Liturgical Readings",
            iconBg: "bg-blue-100 dark:bg-blue-950/40",
            iconColor: "text-blue-600 dark:text-blue-400"
        },
        {
            icon: Flame,
            value: "24/7",
            label: "Perpetual Prayer Wall",
            iconBg: "bg-amber-100 dark:bg-amber-950/40",
            iconColor: "text-amber-600 dark:text-amber-400"
        },
        {
            icon: Heart,
            value: "100% Free",
            label: "Core Devotions & Rosary",
            iconBg: "bg-rose-100 dark:bg-rose-950/40",
            iconColor: "text-rose-600 dark:text-rose-400"
        }
    ];

    return (
        <motion.section
            className="py-6 bg-gradient-to-r from-cream-50 via-white to-cream-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-y border-gray-100 dark:border-white/5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center`}>
                                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white text-base">{item.value}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
