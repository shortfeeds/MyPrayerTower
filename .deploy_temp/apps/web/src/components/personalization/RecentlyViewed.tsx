'use client';

import { useRecentPrayers } from '@/hooks/useRecentPrayers';
import Link from 'next/link';
import { Clock, ArrowRight, X } from 'lucide-react';

/**
 * Recently viewed prayers widget
 * Shows horizontal scroll of recently viewed prayers
 */
export function RecentlyViewed() {
    const { recentPrayers, clearRecentPrayers, isLoaded } = useRecentPrayers();

    if (!isLoaded || recentPrayers.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gray-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Recently Viewed
                    </h3>
                </div>
                <button
                    onClick={clearRecentPrayers}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    Clear
                </button>
            </div>

            {/* Horizontal scroll container */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                <div className="flex gap-3" style={{ width: 'max-content' }}>
                    {recentPrayers.map(prayer => (
                        <Link
                            key={prayer.id}
                            href={`/prayers/${prayer.id}`}
                            className="
                                flex-shrink-0 w-56 p-4
                                bg-white dark:bg-gray-800 
                                rounded-xl border border-gray-100 dark:border-gray-700
                                hover:shadow-md hover:border-sacred-200 dark:hover:border-sacred-800
                                transition-all group
                            "
                        >
                            <span className="text-xs font-medium text-sacred-600 dark:text-sacred-400 mb-1 block">
                                {prayer.category}
                            </span>
                            <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm group-hover:text-sacred-600 transition-colors">
                                {prayer.title}
                            </h4>
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-2 group-hover:text-sacred-500">
                                Continue <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Compact recent prayers list for sidebar
 */
export function RecentPrayersList({ limit = 5 }: { limit?: number }) {
    const { recentPrayers, isLoaded } = useRecentPrayers();

    if (!isLoaded || recentPrayers.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Clock size={14} />
                Recent Prayers
            </h4>
            <ul className="space-y-1">
                {recentPrayers.slice(0, limit).map(prayer => (
                    <li key={prayer.id}>
                        <Link
                            href={`/prayers/${prayer.id}`}
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors truncate"
                        >
                            {prayer.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
