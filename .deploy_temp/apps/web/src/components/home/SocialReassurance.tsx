'use client';

import { motion } from 'framer-motion';
import { Heart, Flame, Cross } from 'lucide-react';

/**
 * SocialReassurance Component
 * 
 * Shows gentle indicators of community activity.
 * Goal: Belonging, not persuasion
 * 
 * Rules:
 * - No large numbers
 * - No urgency language
 * - No comparison messaging
 */
export function SocialReassurance() {
    return (
        <section className="py-12 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 text-slate-600 dark:text-slate-300"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Prayers are being offered right now</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 text-slate-600 dark:text-slate-300"
                    >
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">Candles are currently lit in remembrance</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 text-slate-600 dark:text-slate-300"
                    >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span className="text-sm font-medium">Intentions remembered today</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default SocialReassurance;
