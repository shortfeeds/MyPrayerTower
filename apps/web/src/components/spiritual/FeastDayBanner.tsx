'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, Flame, ChevronRight } from 'lucide-react';
import { SACRED_COPY } from '@/lib/sacred-copy';
import Link from 'next/link';

interface FeastDayBannerProps {
    saintName?: string;
    feastName?: string;
    isOpen?: boolean;
}

/**
 * FeastDayBanner Component
 * 
 * A gentle, non-intrusive banner that invites users to pray on feast days.
 * Appears at the top of the page, easily dismissible.
 * 
 * Examples:
 * - "Today is the Feast of St. Francis. Would you like to pray with us?"
 * - "Today we celebrate the Solemnity of the Assumption."
 */
export function FeastDayBanner({
    saintName = "St. Francis of Assisi",
    feastName = "Peace and Creation",
    isOpen = true
}: FeastDayBannerProps) {
    const [visible, setVisible] = useState(isOpen);
    const [dismissed, setDismissed] = useState(false);

    // Check if user has dismissed today
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dismissedDate = localStorage.getItem('feastBannerDismissed');
            const today = new Date().toDateString();
            if (dismissedDate === today) {
                setDismissed(true);
                setVisible(false);
            }
        }
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        setDismissed(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('feastBannerDismissed', new Date().toDateString());
        }
    };

    if (dismissed) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white relative">
                        <div className="container mx-auto px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {SACRED_COPY.retention.feastDay(saintName)}
                                        </p>
                                        <p className="text-sm text-white/70">
                                            Patron of {feastName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/saints?name=${encodeURIComponent(saintName)}`}
                                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors flex items-center gap-1"
                                    >
                                        <Flame className="w-4 h-4" />
                                        Pray with Us
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={handleDismiss}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                        aria-label="Dismiss"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default FeastDayBanner;
