'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GentleNudgeProps {
    message: string;
    action: () => void;
    actionLabel: string;
    onClose: () => void;
    className?: string;
}

export function GentleNudge({ message, action, actionLabel, onClose, className }: GentleNudgeProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Small delay for entrance animation
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
    };

    return (
        <div
            className={cn(
                "fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 max-w-sm w-full transition-all duration-500 transform",
                visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                className
            )}
        >
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gold-200 dark:border-gold-800 rounded-2xl shadow-xl shadow-gold-900/5 p-4 flex gap-4 items-start ring-1 ring-gold-100">
                <div className="bg-gold-50 dark:bg-gold-900/30 p-2 rounded-full flex-shrink-0 text-gold-600 dark:text-gold-400">
                    <Sparkles className="w-5 h-5" />
                </div>

                <div className="flex-1 pt-1">
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed mb-3">
                        {message}
                    </p>
                    <button
                        onClick={() => {
                            action();
                            handleClose();
                        }}
                        className="text-xs font-bold text-sacred-600 dark:text-sacred-400 hover:text-sacred-700 hover:underline uppercase tracking-wide"
                    >
                        {actionLabel}
                    </button>
                </div>

                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
