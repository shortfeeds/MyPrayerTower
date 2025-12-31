
'use client';

import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Share2, Compass } from 'lucide-react';
import Link from 'next/link';

interface DevotionalPoint {
    number: number;
    content: string;
    book: string;
    chapter?: string;
}

export default function TheWayMeditationWidget() {
    const [point, setPoint] = useState<DevotionalPoint | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyPoint();
    }, []);

    const fetchDailyPoint = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/devotionals?daily=true');
            const data = await res.json();
            setPoint(data);
        } catch (err) {
            console.error('Failed to fetch meditation:', err);
        } finally {
            setLoading(false);
        }
    };

    const sharePoint = async () => {
        if (!point) return;
        const text = `The Way, Point ${point.number}:\n\n"${point.content}"\n\n— St. Josemaria Escriva\n\nvia MyPrayerTower`;
        if (navigator.share) {
            try { await navigator.share({ text }); } catch (err) { navigator.clipboard.writeText(text); }
        } else {
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        }
    };

    if (loading && !point) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            </div>
        );
    }

    if (!point) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <Compass className="w-5 h-5" />
                    <h3 className="font-bold">The Way</h3>
                </div>
                <span className="text-blue-100 text-sm font-medium">Point {point.number}</span>
            </div>

            <div className="p-6 flex-grow flex flex-col">
                {point.chapter && (
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3 block">
                        {point.chapter}
                    </span>
                )}

                <p className="text-gray-800 font-serif leading-relaxed italic text-lg mb-6 flex-grow">
                    "{point.content}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <Link
                        href="/devotionals/the-way"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                        View all points
                    </Link>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={fetchDailyPoint}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={sharePoint}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            title="Share"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
