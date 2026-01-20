'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Heart, Globe, Clock, X, ChevronRight, Church } from 'lucide-react';
import Link from 'next/link';

interface SavedPrayer {
    id: string;
    content: string;
    category: string;
    user: { firstName: string | null; lastName: string | null } | null;
    prayerCount: number;
    createdAt: string; // JSON date
    savedAt: string; // JSON date
    country?: string;
    isAnswered: boolean;
}

export function SavedPrayersList() {
    const [savedPrayers, setSavedPrayers] = useState<SavedPrayer[]>([]);

    useEffect(() => {
        const loadSaved = () => {
            try {
                const stored = localStorage.getItem('mpt-saved-prayers');
                if (stored) {
                    setSavedPrayers(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Failed to load saved prayers', e);
            }
        };

        loadSaved();

        // Listen for updates from other tabs/components
        window.addEventListener('storage', loadSaved);
        return () => window.removeEventListener('storage', loadSaved);
    }, []);

    const removePrayer = (id: string) => {
        const updated = savedPrayers.filter(p => p.id !== id);
        setSavedPrayers(updated);
        localStorage.setItem('mpt-saved-prayers', JSON.stringify(updated));
    };

    if (savedPrayers.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Saved Prayers Yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Browse the Prayer Wall or Library and look for the bookmark icon to save prayers here.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/prayer-wall" className="px-6 py-2.5 bg-sacred-600 hover:bg-sacred-700 text-white font-medium rounded-full transition-colors inline-flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Visit Prayer Wall
                    </Link>
                    <Link href="/library" className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors inline-flex items-center gap-2">
                        <Church className="w-4 h-4" />
                        Browse Library
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-gold-500" />
                My Saved Prayers
                <span className="text-sm font-normal text-gray-500 ml-2">({savedPrayers.length})</span>
            </h2>

            <div className="grid gap-4">
                {savedPrayers.map((prayer) => (
                    <div key={prayer.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition-shadow relative group">
                        <button
                            onClick={() => removePrayer(prayer.id)}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-50 rounded"
                            title="Remove from saved"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-start gap-3 mb-3">
                            <span className="px-2 py-0.5 bg-sacred-100 text-sacred-700 text-xs font-semibold rounded-full">
                                {prayer.category}
                            </span>
                            {prayer.isAnswered && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                    Prayer Answered
                                </span>
                            )}
                        </div>

                        <p className="text-gray-800 dark:text-gray-200 text-lg font-serif mb-4 leading-relaxed">
                            "{prayer.content}"
                        </p>

                        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 border-t border-gray-50 pt-3">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {prayer.user ? `${prayer.user.firstName} ${prayer.user.lastName?.charAt(0)}.` : 'Anonymous'}
                                </span>
                                {prayer.country && (
                                    <span className="flex items-center gap-1">
                                        <Globe className="w-3 h-3" />
                                        {prayer.country}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-gold-600">
                                <Heart className="w-3.5 h-3.5" />
                                {prayer.prayerCount} prayers
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
