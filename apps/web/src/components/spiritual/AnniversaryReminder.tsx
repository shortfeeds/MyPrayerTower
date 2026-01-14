'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flame, X } from 'lucide-react';
import { SACRED_COPY } from '@/lib/sacred-copy';
import Link from 'next/link';

interface AnniversaryReminderProps {
    memorialName: string;
    memorialSlug: string;
    isOpen?: boolean;
    onClose?: () => void;
}

/**
 * AnniversaryReminder Component
 * 
 * A gentle modal/toast that reminds users about memorial anniversaries.
 * Non-intrusive, easily dismissible.
 */
export function AnniversaryReminder({
    memorialName,
    memorialSlug,
    isOpen = true,
    onClose
}: AnniversaryReminderProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm"
                >
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 fill-white" />
                                <span className="font-medium">Remembrance</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <p className="text-slate-700 mb-4">
                                {SACRED_COPY.retention.anniversary(memorialName)}
                            </p>

                            <div className="flex gap-2">
                                <Link
                                    href={`/memorials/${memorialSlug}`}
                                    className="flex-1 py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium text-center text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                                >
                                    <Flame className="w-4 h-4" />
                                    {SACRED_COPY.memorials.light}
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="py-2 px-4 text-slate-500 hover:text-slate-700 text-sm font-medium"
                                >
                                    Later
                                </button>
                            </div>
                        </div>

                        {/* Footer note */}
                        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100">
                            <p className="text-xs text-slate-400 text-center italic">
                                {SACRED_COPY.memorials.rest}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default AnniversaryReminder;
