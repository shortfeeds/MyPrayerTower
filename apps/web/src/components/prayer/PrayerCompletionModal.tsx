'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrayerCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    autoCloseDuration?: number; // in milliseconds
}

/**
 * Universal Prayer Completion Modal
 * 
 * Provides a consistent sacred moment after any prayer action.
 * Displays for 2-3 seconds with no buttons or distractions.
 * 
 * Design principles:
 * - Freeze UI completely
 * - Dim background
 * - Pure text, no CTAs
 * - Auto-dismisses gracefully
 */
export function PrayerCompletionModal({
    isOpen,
    onClose,
    autoCloseDuration = 3000
}: PrayerCompletionModalProps) {
    useEffect(() => {
        if (isOpen) {
            // Freeze scroll
            document.body.style.overflow = 'hidden';

            // Auto-close after duration
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);

            return () => {
                document.body.style.overflow = 'unset';
                clearTimeout(timer);
            };
        }
    }, [isOpen, onClose, autoCloseDuration]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Background Overlay - Dim but not black */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        aria-hidden="true"
                    />

                    {/* Centered Sacred Moment */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 flex items-center justify-center z-[101] px-4"
                    >
                        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
                            {/* Main Message */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-2xl font-serif text-gray-800 mb-6 leading-relaxed"
                            >
                                Your prayer has been offered.
                            </motion.p>

                            {/* Reassurance */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="text-lg text-gray-600 font-light italic"
                            >
                                You are not alone.
                            </motion.p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
