'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrayerClosureProps {
    isOpen: boolean;
    onComplete?: () => void;
    primaryMessage?: string;
    secondaryMessage?: string;
    duration?: number; // Duration in ms before auto-close
}

/**
 * PrayerClosure Component
 * 
 * A universal prayer closure experience that creates a moment of stillness
 * after any prayer action. Following Faith UX principles:
 * - Freeze UI for 2-3 seconds
 * - Dim background
 * - Show ONLY spiritual affirmation
 * - No buttons, links, or scrolling
 * - UI must disappear during prayer
 */
export function PrayerClosure({
    isOpen,
    onComplete,
    primaryMessage = "Your prayer has been offered.",
    secondaryMessage = "You are not alone.",
    duration = 3000,
}: PrayerClosureProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Prevent scrolling during prayer moment
            document.body.style.overflow = 'hidden';

            const timer = setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = 'unset';
                onComplete?.();
            }, duration);

            return () => {
                clearTimeout(timer);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, duration, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{ touchAction: 'none' }}
                >
                    {/* Dimmed Background */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                    />

                    {/* Centered Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 text-center px-8 max-w-md"
                    >
                        {/* Subtle Glow Effect */}
                        <div className="absolute inset-0 -z-10 bg-gold-500/10 rounded-full blur-3xl scale-150" />

                        {/* Primary Message */}
                        <p className="font-serif text-2xl md:text-3xl text-white/95 mb-4 leading-relaxed">
                            {primaryMessage}
                        </p>

                        {/* Secondary Message */}
                        <p className="text-lg text-gold-200/80 font-light">
                            {secondaryMessage}
                        </p>

                        {/* Small Cross or Spiritual Symbol */}
                        <div className="mt-8 flex justify-center">
                            <span className="text-3xl text-gold-400/60">✝</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Hook for triggering prayer closure
 */
export function usePrayerClosure() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState({
        primary: "Your prayer has been offered.",
        secondary: "You are not alone.",
    });

    const showClosure = (primary?: string, secondary?: string) => {
        if (primary) setMessages(prev => ({ ...prev, primary }));
        if (secondary) setMessages(prev => ({ ...prev, secondary }));
        setIsOpen(true);
    };

    const closeClosure = () => {
        setIsOpen(false);
    };

    return {
        isOpen,
        messages,
        showClosure,
        closeClosure,
    };
}

export default PrayerClosure;
