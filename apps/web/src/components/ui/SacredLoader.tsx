'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const MESSAGES = [
    "Preparing your sanctuary...",
    "Lifting up prayers...",
    "Connecting to the communion of saints...",
    "Finding peace...",
    "Gathering grace..."
];

export function SacredLoader({ size = 'default' }: { size?: 'default' | 'small' | 'screen' }) {
    const [message, setMessage] = useState(MESSAGES[0]);

    useEffect(() => {
        // Rotate messages for long loads
        const interval = setInterval(() => {
            setMessage(prev => {
                const idx = MESSAGES.indexOf(prev);
                return MESSAGES[(idx + 1) % MESSAGES.length];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    if (size === 'small') {
        return <Loader2 className="w-4 h-4 animate-spin text-current" />;
    }

    if (size === 'screen') {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-gold-400/20 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 className="w-12 h-12 text-gold-600 animate-spin relative z-10" />
                </div>
                <p className="mt-6 text-gray-500 font-serif text-lg animate-pulse text-center">
                    {message}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-4" />
            <p className="text-gray-400 font-serif text-sm">
                {message}
            </p>
        </div>
    );
}
