'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, MapPin, Clock, X } from 'lucide-react';

interface Toast {
    id: string;
    name: string;
    location: string;
    action: string;
    timeAgo: string;
    isExiting?: boolean;
}

interface SocialProofToastProps {
    /** Enable/disable toasts */
    enabled?: boolean;
    /** Interval between toasts (ms) */
    interval?: number;
    /** How long each toast stays visible (ms) */
    duration?: number;
    /** Maximum visible toasts */
    maxToasts?: number;
}

// Sample data for social proof
const SAMPLE_NAMES = [
    'Maria G.', 'Joseph M.', 'Sarah K.', 'Michael P.', 'Anna L.',
    'David R.', 'Teresa B.', 'James H.', 'Catherine S.', 'John D.',
    'Margaret W.', 'Peter L.', 'Elizabeth T.', 'Andrew C.', 'Rebecca S.',
    'Christopher M.', 'Jennifer P.', 'Matthew R.', 'Angela N.', 'Thomas W.',
];

const SAMPLE_LOCATIONS = [
    'New York, USA', 'Manila, Philippines', 'Rome, Italy', 'Dublin, Ireland',
    'São Paulo, Brazil', 'Lagos, Nigeria', 'Paris, France', 'Sydney, Australia',
    'Toronto, Canada', 'London, UK', 'Mexico City, Mexico', 'Warsaw, Poland',
    'Nairobi, Kenya', 'Buenos Aires, Argentina', 'Seoul, South Korea',
];

const SAMPLE_ACTIONS = [
    'just prayed the Rosary',
    'lit a candle',
    'prayed for healing',
    'joined the Prayer Wall',
    'said a prayer',
    'prayed for peace',
    'offered a Mass intention',
    'prayed for family',
    'completed a novena',
    'prayed for a friend',
];

/**
 * Social proof toast notifications
 * Shows activity from other users to create community feeling
 */
export function SocialProofProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <SocialProofToast />
        </>
    );
}

export function SocialProofToast({
    enabled = true,
    interval = 15000,
    duration = 4000,
    maxToasts = 1,
}: SocialProofToastProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const generateToast = useCallback((): Toast => ({
        id: Math.random().toString(36).substr(2, 9),
        name: SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)],
        location: SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)],
        action: SAMPLE_ACTIONS[Math.floor(Math.random() * SAMPLE_ACTIONS.length)],
        timeAgo: `${Math.floor(Math.random() * 5) + 1} min ago`,
    }), []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.map(t =>
            t.id === id ? { ...t, isExiting: true } : t
        ));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 300);
    }, []);

    useEffect(() => {
        if (!enabled || !isClient) return;

        // Don't show on first visit to respect user attention
        const visitCount = parseInt(localStorage.getItem('mpt-visits') || '0', 10);
        localStorage.setItem('mpt-visits', String(visitCount + 1));
        if (visitCount < 2) return;

        // Initial delay before first toast
        const initialTimeout = setTimeout(() => {
            const newToast = generateToast();
            setToasts([newToast]);

            // Auto-dismiss
            setTimeout(() => dismissToast(newToast.id), duration);
        }, 5000);

        // Regular interval for subsequent toasts
        const toastInterval = setInterval(() => {
            const newToast = generateToast();
            setToasts(prev => {
                const filtered = prev.slice(-(maxToasts - 1));
                return [...filtered, newToast];
            });

            // Auto-dismiss
            setTimeout(() => dismissToast(newToast.id), duration);
        }, interval);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(toastInterval);
        };
    }, [enabled, isClient, interval, duration, maxToasts, generateToast, dismissToast]);

    if (!enabled || !isClient) return null;

    return (
        <div className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-40 max-w-[calc(100vw-2rem)] md:max-w-sm pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`
                        ${toast.isExiting ? 'toast-exit' : 'toast-enter'}
                        bg-white dark:bg-gray-800 
                        rounded-xl shadow-xl 
                        border border-gray-100 dark:border-gray-700
                        p-4 pr-10
                        relative
                        pointer-events-auto
                    `}
                >
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="Dismiss"
                    >
                        <X size={14} />
                    </button>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                            <Heart size={18} className="text-rose-500 fill-rose-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white">
                                <span className="font-semibold">{toast.name}</span>{' '}
                                <span className="text-gray-600 dark:text-gray-400">{toast.action}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <MapPin size={10} />
                                    {toast.location}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    {toast.timeAgo}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
