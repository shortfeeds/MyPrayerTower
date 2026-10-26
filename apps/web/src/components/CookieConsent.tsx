'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
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
        <aside
            aria-label="Privacy & Cookie Consent"
            className="fixed bottom-0 inset-x-0 z-[200] border-t border-white/10 bg-[#0a0612]/95 backdrop-blur-xl shadow-2xl text-white transition-all animate-in slide-in-from-bottom duration-300 select-none"
        >
            <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
                {/* Concise notice text */}
                <div className="flex items-center gap-2 text-xs text-white/80 leading-tight text-center sm:text-left">
                    <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0 hidden sm:block" />
                    <span>
                        We use cookies to maintain your spiritual sanctuary and prayer intentions. By continuing, you accept our{' '}
                        <Link href="/privacy" className="text-gold-400 hover:text-gold-300 underline font-medium transition-colors">
                            Privacy Policy
                        </Link>.
                    </span>
                </div>

                {/* Compact action buttons */}
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center sm:justify-end pb-1 sm:pb-0">
                    <button
                        onClick={handleAccept}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-[#0a0612] text-xs font-bold rounded-lg shadow-sm hover:shadow-gold-500/20 active:scale-95 transition-all"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleDecline}
                        className="px-3 py-1.5 border border-white/15 hover:border-white/30 text-white/70 hover:text-white text-xs font-medium rounded-lg hover:bg-white/5 active:scale-95 transition-all"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleDecline}
                        className="p-1 text-white/40 hover:text-white/80 rounded-md hover:bg-white/5 transition-colors hidden sm:block"
                        aria-label="Dismiss banner"
                        title="Dismiss"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
