'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur border-t border-stone-200 shadow-lg animate-in slide-in-from-bottom">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-stone-600 text-center sm:text-left">
                    <p>
                        We use cookies to enhance your spiritual journey and improve our website.
                        By continuing, you agree to our{' '}
                        <Link href="/privacy-policy" className="text-stone-900 underline hover:text-stone-700">
                            Privacy Policy
                        </Link>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 text-sm bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors shadow-sm"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 text-stone-400 hover:text-stone-600 sm:hidden"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
