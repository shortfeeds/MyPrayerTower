'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, X } from 'lucide-react';

interface FloatingPrayerButtonProps {
    /** URL to link to */
    href?: string;
    /** Custom label */
    label?: string;
    /** Show/hide */
    enabled?: boolean;
}

/**
 * Floating action button for quick prayer access
 * Pulses to draw attention, dismissable
 */
export function FloatingPrayerButton({
    href = '/prayers',
    label = 'Pray Now',
    enabled = true,
}: FloatingPrayerButtonProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if user has dismissed today
        const dismissed = localStorage.getItem('mpt-fab-dismissed');
        if (dismissed) {
            const dismissedDate = new Date(dismissed);
            const now = new Date();
            // Reset after 24 hours
            if (now.getTime() - dismissedDate.getTime() < 24 * 60 * 60 * 1000) {
                setIsDismissed(true);
            }
        }

        // Show FAB after scroll
        const handleScroll = () => {
            setIsVisible(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDismiss = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDismissed(true);
        localStorage.setItem('mpt-fab-dismissed', new Date().toISOString());
    };

    if (!enabled || isDismissed || !isVisible) return null;

    return (
        <div className="fixed bottom-48 right-6 z-[60] flex flex-col items-end gap-2">
            {/* Dismiss button */}
            <button
                onClick={handleDismiss}
                className="p-1.5 bg-gray-800/80 rounded-full text-white/60 hover:text-white transition-colors"
                aria-label="Dismiss"
            >
                <X size={14} />
            </button>

            {/* Main FAB */}
            <Link
                href={href}
                className="
                    flex items-center gap-2 px-5 py-3
                    bg-gradient-to-r from-gold-500 to-amber-500
                    text-white font-bold rounded-full
                    shadow-lg fab-pulse
                    hover:from-gold-400 hover:to-amber-400
                    transition-all duration-300
                    transform hover:scale-105
                "
            >
                <Flame size={20} className="animate-pulse" />
                <span>{label}</span>
            </Link>
        </div>
    );
}

/**
 * Quick "Pray Now" button that registers a prayer with one click
 */
export function PrayNowButton({
    prayerId,
    onPrayed,
    className = '',
}: {
    prayerId?: string;
    onPrayed?: () => void;
    className?: string;
}) {
    const [isPrayed, setIsPrayed] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [count, setCount] = useState(0);

    const handleClick = async () => {
        if (isPrayed) return;

        setIsAnimating(true);
        setIsPrayed(true);
        setCount(prev => prev + 1);

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }

        try {
            // If prayerId is provided, register the prayer
            if (prayerId) {
                await fetch('/api/prayers/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prayerId }),
                });
            }
            onPrayed?.();
        } catch (error) {
            console.error('Failed to register prayer:', error);
        }

        setTimeout(() => setIsAnimating(false), 400);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPrayed}
            className={`
                inline-flex items-center justify-center gap-2 px-6 py-3
                font-bold rounded-xl transition-all duration-300
                ripple btn-hover-lift
                ${isPrayed
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                    : 'bg-gradient-to-r from-sacred-600 to-sacred-700 text-white hover:from-sacred-500 hover:to-sacred-600'
                }
                ${className}
            `}
        >
            <Flame
                size={18}
                className={`${isAnimating ? 'animate-heart-burst' : ''} ${isPrayed ? 'fill-current' : ''}`}
            />
            <span>{isPrayed ? 'Prayed! 🙏' : 'Pray Now'}</span>
            {count > 0 && (
                <span className={`
                    ml-1 px-2 py-0.5 text-xs rounded-full
                    ${isPrayed ? 'bg-emerald-200 dark:bg-emerald-800' : 'bg-white/20'}
                `}>
                    +{count}
                </span>
            )}
        </button>
    );
}
