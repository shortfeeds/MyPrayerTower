'use client';

import { usePrayerRecommendations } from '@/hooks/useRecentPrayers';
import Link from 'next/link';
import { Sparkles, Sun, Moon, Sunset, Star, ArrowRight } from 'lucide-react';

interface Recommendation {
    id: string;
    title: string;
    category: string;
    reason: string;
}

// Time-based prayer recommendations
const TIME_PRAYERS = {
    morning: [
        { id: 'morning-offering', title: 'Morning Offering', category: 'morning', reason: 'Perfect for starting your day' },
        { id: 'divine-office-lauds', title: 'Lauds (Morning Prayer)', category: 'liturgy-hours', reason: 'Traditional morning prayer' },
    ],
    afternoon: [
        { id: 'angelus', title: 'The Angelus', category: 'marian', reason: 'Midday Marian devotion' },
        { id: 'divine-office-sext', title: 'Sext (Midday Prayer)', category: 'liturgy-hours', reason: 'Pause for prayer at noon' },
    ],
    evening: [
        { id: 'divine-mercy-chaplet', title: 'Divine Mercy Chaplet', category: 'chaplets', reason: 'Traditional 3pm prayer' },
        { id: 'divine-office-vespers', title: 'Vespers (Evening Prayer)', category: 'liturgy-hours', reason: 'End of day reflection' },
    ],
    night: [
        { id: 'night-prayer', title: 'Night Prayer (Compline)', category: 'liturgy-hours', reason: 'Before sleep blessing' },
        { id: 'act-of-contrition', title: 'Act of Contrition', category: 'reconciliation', reason: 'Examine your day' },
    ],
};

const TIME_ICONS = {
    morning: Sun,
    afternoon: Sunset,
    evening: Moon,
    night: Star,
};

/**
 * Personalized prayer recommendations based on time, history, and season
 */
export function PrayerRecommendations() {
    const { timeOfDay, categories, liturgicalSeason } = usePrayerRecommendations();
    const TimeIcon = TIME_ICONS[timeOfDay];
    const timePrayers = TIME_PRAYERS[timeOfDay];

    const timeLabels = {
        morning: 'Good Morning',
        afternoon: 'Good Afternoon',
        evening: 'Good Evening',
        night: 'Good Night',
    };

    return (
        <div className="space-y-6">
            {/* Time-based recommendations */}
            <div className="bg-gradient-to-r from-sacred-50 to-gold-50 dark:from-sacred-900/20 dark:to-gold-900/20 rounded-2xl p-6 border border-sacred-100 dark:border-sacred-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                        <TimeIcon size={20} className="text-gold-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            {timeLabels[timeOfDay]}! 🙏
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Prayers for this time of day
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {timePrayers.map(prayer => (
                        <Link
                            key={prayer.id}
                            href={`/prayers?category=${prayer.category}`}
                            className="
                                flex items-center justify-between p-3
                                bg-white dark:bg-gray-800 rounded-xl
                                hover:shadow-md transition-all group
                            "
                        >
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-sacred-600 transition-colors">
                                    {prayer.title}
                                </h4>
                                <p className="text-xs text-gray-500">{prayer.reason}</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 group-hover:text-sacred-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Category-based recommendations (if user has history) */}
            {categories.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={18} className="text-gold-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Because You Prayed...
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <Link
                                key={category}
                                href={`/prayers?category=${category}`}
                                className="
                                    px-4 py-2 bg-white dark:bg-gray-800
                                    border border-gray-200 dark:border-gray-700
                                    rounded-full text-sm font-medium
                                    text-gray-700 dark:text-gray-300
                                    hover:border-sacred-300 dark:hover:border-sacred-700
                                    hover:text-sacred-600 dark:hover:text-sacred-400
                                    transition-colors
                                "
                            >
                                More {category.replace('-', ' ')}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Compact recommendation card for sidebar
 */
export function QuickRecommendation() {
    const { timeOfDay } = usePrayerRecommendations();
    const prayer = TIME_PRAYERS[timeOfDay][0];
    const TimeIcon = TIME_ICONS[timeOfDay];

    return (
        <Link
            href={`/prayers?category=${prayer.category}`}
            className="
                block p-4 bg-gradient-to-r from-sacred-50 to-gold-50 
                dark:from-sacred-900/20 dark:to-gold-900/20
                rounded-xl border border-sacred-100 dark:border-sacred-800
                hover:shadow-lg transition-all group
            "
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
                    <TimeIcon size={16} className="text-gold-500" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Suggested for you</p>
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-sacred-600 transition-colors">
                        {prayer.title}
                    </h4>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-sacred-500 group-hover:translate-x-1 transition-all" />
            </div>
        </Link>
    );
}
