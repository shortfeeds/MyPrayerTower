'use client';

import Link from 'next/link';
import { Flame, Heart, Clock, ArrowRight } from 'lucide-react';

// Mock trending prayers - in production, fetch from API
const TRENDING_PRAYERS = [
    { id: 1, title: 'Prayer for Peace', category: 'Peace', prayerCount: 15420, trend: '+12%' },
    { id: 2, title: 'Hail Mary', category: 'Marian', prayerCount: 12890, trend: '+8%' },
    { id: 3, title: 'Prayer for Healing', category: 'Healing', prayerCount: 9876, trend: '+15%' },
    { id: 4, title: "St. Michael's Prayer", category: 'Protection', prayerCount: 8654, trend: '+5%' },
    { id: 5, title: 'Act of Contrition', category: 'Confession', prayerCount: 7432, trend: '+10%' },
];

export function TrendingPrayers() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Trending Prayers</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Most prayed this week</p>
                    </div>
                </div>
                <Link href="/prayers" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-3">
                {TRENDING_PRAYERS.map((prayer, i) => (
                    <Link
                        key={prayer.id}
                        href={`/prayers/${prayer.id}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    >
                        <span className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300">
                            {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                                {prayer.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded-full">{prayer.category}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-rose-500">
                                <Heart className="w-3.5 h-3.5 fill-current" />
                                <span className="font-semibold text-sm">{(prayer.prayerCount / 1000).toFixed(1)}k</span>
                            </div>
                            <span className="text-xs text-emerald-500 font-medium">{prayer.trend}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function TrendingPrayersCompact() {
    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {TRENDING_PRAYERS.slice(0, 3).map((prayer) => (
                <Link
                    key={prayer.id}
                    href={`/prayers/${prayer.id}`}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary-300 transition-colors"
                >
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{prayer.title}</span>
                    <span className="text-xs text-gray-400">{(prayer.prayerCount / 1000).toFixed(1)}k</span>
                </Link>
            ))}
        </div>
    );
}
