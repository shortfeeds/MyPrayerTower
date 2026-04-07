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
        <div className="fixed bottom-24 left-4 right-4 z-[200] p-6 bg-[#0a0612]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="text-sm text-white/80 leading-relaxed">
                        <p className="font-bold text-[#d4af37] mb-1 uppercase tracking-widest text-[10px]">Privacy & Sanctuary</p>
                        <p>
                            We use cookies to enhance your spiritual journey. 
                            By continuing, you agree to our{' '}
                            <Link href="/privacy" className="text-[#d4af37] underline font-bold">
                                Privacy Policy
                            </Link>.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 bg-[#d4af37] text-[#0a0612] py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleDecline}
                        className="flex-1 border border-white/10 text-white/50 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}
