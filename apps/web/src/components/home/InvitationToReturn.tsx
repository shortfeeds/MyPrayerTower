'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookHeart, Bell } from 'lucide-react';
import { SACRED_COPY } from '@/lib/sacred-copy';

/**
 * InvitationToReturn Component
 * 
 * Goal: Retention without pressure
 * 
 * Copy: "Create your personal prayer space and return whenever you need."
 * 
 * CTAs:
 * - Create My Prayer Corner
 * - Receive Gentle Prayer Reminders
 */
export function InvitationToReturn() {
    return (
        <section className="relative py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
            {/* Sacred UX: Mid-page Emotional Anchor */}
            <div className="container mx-auto px-4 text-center mb-16">
                <p className="text-xl text-gray-600 dark:text-gray-400 font-light italic mb-2">
                    A quiet place to return whenever you need prayer.
                </p>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-30"></div> {/* This div seems to be for a background effect, closing it here */}

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Your Sacred Space Awaits
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        Create your personal prayer space and return whenever you need.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/dashboard/prayer-corner"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                        >
                            <BookHeart className="w-5 h-5" />
                            Create My Prayer Corner
                        </Link>
                        <Link
                            href="/settings/reminders"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                        >
                            <Bell className="w-5 h-5" />
                            Receive Gentle Reminders
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 italic">
                        {SACRED_COPY.journey.return}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

export default InvitationToReturn;
