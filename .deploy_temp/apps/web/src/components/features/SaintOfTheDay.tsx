'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ChevronRight, Calendar } from 'lucide-react';

interface Saint {
    name: string;
    feastDay: string;
    patronOf?: string;
    slug: string;
    imageUrl?: string;
}

/**
 * SaintOfTheDay Widget - Shows today's saint with elegant card design
 */
export function SaintOfTheDay({ variant = 'default' }: { variant?: 'default' | 'compact' | 'hero' }) {
    const [saint, setSaint] = useState<Saint | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/saints/today')
            .then(r => r.json())
            .then(data => {
                setSaint(data.saint);
                setLoading(false);
            })
            .catch(() => {
                // Fallback saint data
                setSaint({
                    name: 'St. Thomas Becket',
                    feastDay: 'December 29',
                    patronOf: 'Secular clergy',
                    slug: 'thomas-becket'
                });
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={`animate-pulse ${variant === 'hero' ? 'bg-white/10' : 'bg-purple-50'} rounded-2xl p-6`}>
                <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-6 bg-gray-200 rounded w-40" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (!saint) return null;

    // Hero variant for homepage
    if (variant === 'hero') {
        return (
            <Link
                href={`/saints/${saint.slug}`}
                className="group block bg-gradient-to-br from-purple-600/90 to-indigo-700/90 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Star className="w-8 h-8 text-gold-300 fill-current" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-purple-200 text-sm mb-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{saint.feastDay}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">
                            {saint.name}
                        </h3>
                        {saint.patronOf && (
                            <p className="text-white/60 text-sm">
                                Patron of {saint.patronOf}
                            </p>
                        )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
            </Link>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <Link
                href={`/saints/${saint.slug}`}
                className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
            >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Star className="w-5 h-5 text-purple-600 fill-current" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-purple-600 font-medium">Saint of the Day</p>
                    <p className="font-semibold text-gray-900">{saint.name}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
        );
    }

    // Default card variant
    return (
        <Link
            href={`/saints/${saint.slug}`}
            className="group block bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all"
        >
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                    <Star className="w-10 h-10 text-white fill-current" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-purple-600 text-sm font-medium mb-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Saint of the Day</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">
                        {saint.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {saint.feastDay}
                    </p>
                    {saint.patronOf && (
                        <p className="text-gray-400 text-sm mt-1">
                            Patron of {saint.patronOf}
                        </p>
                    )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all mt-2" />
            </div>
        </Link>
    );
}

export default SaintOfTheDay;
