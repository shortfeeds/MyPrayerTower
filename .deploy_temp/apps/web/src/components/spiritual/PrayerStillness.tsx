'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SACRED_COPY } from '@/lib/sacred-copy';

interface PrayerStillnessProps {
    isVisible: boolean;
    onComplete?: () => void;
    duration?: number; // in milliseconds
    affirmation?: string;
}

/**
 * PrayerStillness Component
 * 
 * Displays a moment of stillness after prayer submission.
 * Part of the guided emotional journey:
 * Arrival → Prayer → Stillness → Continuity → Belonging → Gentle Return
 */
export function PrayerStillness({
    isVisible,
    onComplete,
    duration = 5000,
    affirmation = SACRED_COPY.affirmations.prayerReceived
}: PrayerStillnessProps) {
    const [showContinue, setShowContinue] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setShowContinue(true);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900/95 to-indigo-950/95 backdrop-blur-sm"
                >
                    <div className="max-w-lg mx-auto px-8 text-center">
                        {/* Candle Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="mb-8"
                        >
                            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-amber-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2c.5 0 1 .19 1.41.59.41.4.59.91.59 1.41 0 1-1.5 2.5-2 3.5-.5-1-2-2.5-2-3.5 0-.5.19-1 .59-1.41C10.99 2.19 11.5 2 12 2zm2 5.5V20c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1V7.5c.78.5 1.5.5 2 .5s1.22 0 2-.5z" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Affirmation */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-xl text-white font-medium mb-4"
                        >
                            {affirmation}
                        </motion.p>

                        {/* Stillness prompt */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="text-lg text-slate-400 mb-6"
                        >
                            {SACRED_COPY.prayers.stillness}
                        </motion.p>

                        {/* Scripture */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="text-sm text-slate-500 italic"
                        >
                            {SACRED_COPY.prayers.stillnessVerse}
                        </motion.p>

                        {/* Continue button (appears after duration) */}
                        <AnimatePresence>
                            {showContinue && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    onClick={onComplete}
                                    className="mt-10 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/20"
                                >
                                    {SACRED_COPY.cta.continue}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PrayerStillness;
