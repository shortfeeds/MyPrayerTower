'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Heart, Gift, CreditCard, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface UniversalOfferingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UniversalOfferingModal({ isOpen, onClose }: UniversalOfferingModalProps) {
    const offerings = [
        {
            title: 'Light a Candle',
            description: 'Light a virtual candle for your intentions and join thousands in prayer.',
            icon: Flame,
            gradient: 'from-amber-400 to-orange-500',
            bgGlow: 'bg-amber-500/20',
            href: '/candles',
        },
        {
            title: 'Mass Offerings',
            description: 'Request a Mass to be said for your loved ones or special intentions.',
            icon: Gift,
            gradient: 'from-purple-500 to-indigo-600',
            bgGlow: 'bg-purple-500/20',
            href: '/mass-offerings',
        },
        {
            title: 'Spiritual Bouquet',
            description: 'Send a beautiful bouquet of prayers and spiritual acts to someone special.',
            icon: Heart,
            gradient: 'from-rose-400 to-pink-500',
            bgGlow: 'bg-rose-500/20',
            href: '/bouquets',
        },
        {
            title: 'Support Us',
            description: 'Help us maintain this platform and reach more souls with your donation.',
            icon: CreditCard,
            gradient: 'from-emerald-400 to-teal-500',
            bgGlow: 'bg-emerald-500/20',
            href: '/donate',
        }
    ];

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {typeof document !== 'undefined' && createPortal(
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]"
                                onClick={onClose}
                            />

                            {/* Modal / Bottom Sheet */}
                            <motion.div
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "100%" }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 w-full sm:w-[90%] sm:max-w-lg sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-gradient-to-b from-gray-900 to-gray-950 rounded-t-3xl sm:rounded-3xl shadow-2xl z-[9999] overflow-hidden border-t sm:border border-white/10 pointer-events-auto max-h-[90vh] overflow-y-auto"
                            >
                                {/* Drag Handle (Mobile only) */}
                                <div className="w-12 h-1.5 bg-gray-700/50 rounded-full mx-auto mt-3 sm:hidden" />

                                {/* Decorative glow */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl pointer-events-none" />

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Header */}
                                <div className="relative pt-6 pb-4 px-6 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/30"
                                    >
                                        <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                    </motion.div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                        Make an Offering
                                    </h2>
                                    <p className="text-gray-400 text-xs sm:text-sm max-w-xs mx-auto">
                                        Choose a way to share your faith and support the community
                                    </p>
                                </div>

                                {/* Offerings Grid */}
                                <div className="relative px-4 sm:px-6 pb-8 pt-2 space-y-3">
                                    {offerings.map((offering, index) => (
                                        <motion.div
                                            key={offering.title}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.15 + index * 0.08 }}
                                        >
                                            <Link
                                                href={offering.href}
                                                onClick={onClose}
                                                className="group relative flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
                                            >
                                                {/* Icon */}
                                                <div className={`relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${offering.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                    <offering.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                    <div className={`absolute inset-0 ${offering.bgGlow} rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity`} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 text-left">
                                                    <h3 className="text-white font-semibold group-hover:text-gold-300 transition-colors text-sm sm:text-base">
                                                        {offering.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-1">
                                                        {offering.description}
                                                    </p>
                                                </div>

                                                {/* Arrow */}
                                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Footer Link removed for cleaner mobile UI */}
                            </motion.div>
                        </>,
                        document.body
                    )}
                </>
            )}
        </AnimatePresence>
    );
}
