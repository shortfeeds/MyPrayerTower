'use client';

import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check initial state
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            // Show "back online" briefly then hide
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showBanner && isOnline) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 p-3 text-center text-sm font-medium transition-all duration-300 ${isOnline
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
        >
            <div className="flex items-center justify-center gap-2">
                {isOnline ? (
                    <>
                        <RefreshCw className="w-4 h-4" />
                        <span>You're back online!</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-4 h-4" />
                        <span>You're offline. Some features may be unavailable.</span>
                    </>
                )}
            </div>
        </div>
    );
}
