'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface PrayerCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    autoCloseDuration?: number;
}

export function PrayerCompletionModal({
    isOpen,
    onClose,
    autoCloseDuration = 3500
}: PrayerCompletionModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const timer = setTimeout(onClose, autoCloseDuration);
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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
                    >
                        <div className="bg-gradient-to-b from-white to-amber-50 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/20 relative overflow-hidden text-center">

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl" />

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white"
                            >
                                <Heart className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse" />
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-serif font-bold text-gray-900 mb-2"
                            >
                                Prayer Offered
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-600 font-light italic leading-relaxed"
                            >
                                "For where two or three are gathered in my name, there am I among them."
                            </motion.p>

                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.5, duration: 3 }}
                                className="h-1 bg-amber-500/10 mt-6 rounded-full overflow-hidden"
                            >
                                <motion.div
                                    className="h-full bg-amber-500/40"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
