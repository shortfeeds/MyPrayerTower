'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Heart, Gift, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface UniversalOfferingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UniversalOfferingModal({ isOpen, onClose }: UniversalOfferingModalProps) {
    const offerings = [
        {
            title: 'Light a Candle',
            description: 'Light a virtual candle for your intentions. Join thousands in prayer.',
            icon: Flame,
            color: 'text-amber-500',
            bg: 'bg-amber-100',
            hover: 'hover:bg-amber-50',
            href: '/candles',
            cta: 'Light Candle'
        },
        {
            title: 'Mass Offerings',
            description: 'Request a Mass to be said for your loved ones or special intentions.',
            icon: Gift,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            hover: 'hover:bg-purple-50',
            href: '/mass-offerings',
            cta: 'Request Mass'
        },
        {
            title: 'Spiritual Bouquet',
            description: 'Send a beautiful bouquet of prayers and spiritual acts to someone.',
            icon: Heart,
            color: 'text-rose-500',
            bg: 'bg-rose-100',
            hover: 'hover:bg-rose-50',
            href: '/bouquets',
            cta: 'Create Bouquet'
        },
        {
            title: 'Support Us',
            description: 'Help us maintain this platform and reach more souls with your donation.',
            icon: CreditCard,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100',
            hover: 'hover:bg-emerald-50',
            href: '/donate',
            cta: 'Donate Now'
        }
    ];

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Portal to body to avoid z-index/transform issues */}
                    {typeof document !== 'undefined' && createPortal(
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                                onClick={onClose}
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[9999] overflow-hidden"
                            >
                                {/* Header */}
                                <div className="relative bg-gradient-to-r from-sacred-800 to-sacred-900 p-8 text-white text-center">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <Heart className="w-12 h-12 mx-auto mb-4 text-gold-400 fill-current" />
                                    <h2 className="text-2xl font-bold font-display mb-2">Make an Offering</h2>
                                    <p className="text-white/80 max-w-md mx-auto">
                                        Choose a way to support the community and share your prayers.
                                    </p>
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                                    {offerings.map((offering) => (
                                        <Link
                                            key={offering.title}
                                            href={offering.href}
                                            onClick={onClose}
                                            className={`group relative flex flex-col p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 ${offering.hover} hover:shadow-md hover:-translate-y-1`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-xl ${offering.bg} ${offering.color}`}>
                                                    <offering.icon className="w-6 h-6" />
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                            </div>

                                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                                                {offering.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4 flex-grow">
                                                {offering.description}
                                            </p>

                                            <span className={`text-sm font-semibold ${offering.color} flex items-center gap-1`}>
                                                {offering.cta}
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
                                    Thank you for your generosity and support.
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
