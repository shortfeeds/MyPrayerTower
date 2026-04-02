import React from 'react';

/**
 * Root loading skeleton — replaces the previous full-screen fixed overlay
 * that was causing CLS 0.59 on desktop (the overlay disappearing triggered
 * a massive layout shift).
 * 
 * This inline skeleton preserves document flow so no shift occurs.
 */
export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Header skeleton */}
            <div className="h-16 bg-white/80 dark:bg-slate-900/80 border-b border-gray-100 dark:border-slate-800" />
            
            {/* Content skeleton — matches typical page structure */}
            <div className="container mx-auto px-4 pt-12 pb-20 animate-pulse">
                {/* Hero area */}
                <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto" />
                    <div className="h-10 w-3/4 bg-gray-200 dark:bg-slate-700 rounded-lg mx-auto" />
                    <div className="h-6 w-2/3 bg-gray-100 dark:bg-slate-800 rounded-lg mx-auto" />
                </div>

                {/* Content blocks */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-xl bg-gray-100 dark:bg-slate-800 h-48" />
                    ))}
                </div>
            </div>
        </div>
    );
}
