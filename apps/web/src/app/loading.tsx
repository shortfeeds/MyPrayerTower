import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a1835]">
            <div className="relative h-16 w-16">
                {/* Spiritual/Sacred CSS-only loading animation */}
                <div className="absolute inset-0 border-2 border-[#d4af37]/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-t-2 border-[#d4af37] rounded-full animate-spin [animation-duration:1.5s]"></div>
                <div className="absolute inset-4 border-2 border-[#d4af37]/40 rounded-full animate-ping [animation-duration:3s]"></div>
            </div>
            <p className="absolute mt-24 text-sm font-medium tracking-widest text-[#d4af37] uppercase animate-pulse">
                Blessings...
            </p>
        </div>
    );
}
