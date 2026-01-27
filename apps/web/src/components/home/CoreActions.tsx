'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Flame, Church, Heart } from 'lucide-react';
import { SACRED_COPY } from '@/lib/sacred-copy';

const CORE_ACTIONS = [
    {
        id: 'pray',
        icon: Users,
        title: 'Pray With Others',
        description: 'Join Catholics around the world in shared prayer.',
        cta: 'Join in Prayer',
        href: '/prayer-wall',
        color: 'from-indigo-500 to-purple-600',
        bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50',
        iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
        id: 'candle',
        icon: Flame,
        title: 'Light a Candle',
        description: 'A sign of hope, remembrance, and continued prayer.',
        cta: 'Light a Candle',
        href: '/candles',
        color: 'from-amber-500 to-orange-600',
        bgColor: 'from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50',
        iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
        id: 'memorials',
        icon: Heart,
        title: 'Eternal Memorials',
        description: 'Create lasting tributes for loved ones who have passed.',
        cta: 'Honor Your Loved Ones',
        href: '/memorials',
        color: 'from-rose-500 to-pink-600',
        bgColor: 'from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50',
        iconColor: 'text-rose-600 dark:text-rose-400'
    },
    {
        id: 'mass',
        icon: Church,
        title: 'Request a Mass',
        description: 'Have a Holy Mass offered for your intentions.',
        cta: 'Request a Mass',
        href: '/mass-offerings',
        color: 'from-blue-500 to-sky-600',
        bgColor: 'from-blue-50 to-sky-50 dark:from-blue-950/50 dark:to-sky-950/50',
        iconColor: 'text-blue-600 dark:text-blue-400'
    }
];

export function CoreActions() {
    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-3">
                        Ways to Participate
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Choose how you wish to engage with our community of faith today.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {CORE_ACTIONS.map((action, idx) => (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-700 hover:border-gold-500/30 transition-all duration-500 group overflow-hidden`}
                        >
                            {/* Subtle Background Accent */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 rounded-bl-full`} />

                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.bgColor} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                <action.icon className={`w-7 h-7 ${action.iconColor}`} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                                {action.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-sm">
                                {action.description}
                            </p>

                            <Link
                                href={action.href}
                                className={`inline-flex items-center justify-center w-full py-3.5 bg-gradient-to-r ${action.color} text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transform active:scale-95 transition-all text-sm`}
                            >
                                {action.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CoreActions;
