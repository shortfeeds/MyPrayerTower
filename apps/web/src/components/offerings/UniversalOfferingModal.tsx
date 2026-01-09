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

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] max-w-lg bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl shadow-2xl z-[9999] overflow-hidden border border-white/10"
                            >
                                {/* Decorative glow */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl" />
                                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl" />

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Header */}
                                <div className="relative pt-8 pb-4 px-6 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                        className="w-16 h-16 bg-gradient-to-br from-gold-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/30"
                                    >
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Make an Offering
                                    </h2>
                                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                        Choose a way to share your faith and support the community
                                    </p>
                                </div>

                                {/* Offerings Grid */}
                                <div className="relative px-4 sm:px-6 pb-6 pt-2 space-y-3">
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
                                                className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
                                            >
                                                {/* Icon */}
                                                <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${offering.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                    <offering.icon className="w-6 h-6 text-white" />
                                                    <div className={`absolute inset-0 ${offering.bgGlow} rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity`} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-semibold group-hover:text-gold-300 transition-colors">
                                                        {offering.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm line-clamp-1">
                                                        {offering.description}
                                                    </p>
                                                </div>

                                                {/* Arrow */}
                                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="relative px-6 pb-6 pt-2 text-center">
                                    <p className="text-gray-600 text-xs">
                                        Thank you for your generosity ❤️
                                    </p>
                                </div>
                            </motion.div>
                        </>,
                        document.body
                    )}
                </>
            )}
        </AnimatePresence>
    );
}
