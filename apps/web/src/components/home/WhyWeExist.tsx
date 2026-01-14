'use client';

import { motion } from 'framer-motion';

/**
 * WhyWeExist Component
 * 
 * Goal: Meaning before monetization
 * 
 * Rules:
 * - No CTAs in this section
 * - Focus on mission and purpose
 */
export function WhyWeExist() {
    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                        Why MyPrayerTower Exists
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        In moments of need, remembrance, or gratitude, prayer brings us together.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        MyPrayerTower exists to provide a peaceful place where intentions are shared, remembered, and lifted in faith.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

export default WhyWeExist;
