'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Flame, Church } from 'lucide-react';
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
        id: 'mass',
        icon: Church,
        title: 'Offer a Mass Intention',
        description: 'Entrust your intention through the tradition of the Holy Mass.',
        cta: 'Offer a Mass Intention',
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

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {CORE_ACTIONS.map((action, idx) => (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`bg-gradient-to-br ${action.bgColor} rounded-3xl p-8 border border-gray-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 group`}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 ${action.iconColor} group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{action.description}</p>
                            <Link
                                href={action.href}
                                className={`inline-flex items-center justify-center w-full py-3 bg-gradient-to-r ${action.color} text-white font-medium rounded-xl hover:shadow-lg transition-all`}
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
