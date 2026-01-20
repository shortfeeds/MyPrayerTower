'use client';

import { useState, useEffect, useCallback } from 'react';

interface RecentPrayer {
    id: string;
    title: string;
    category: string;
    viewedAt: number;
}

const MAX_ITEMS = 10;
const EXPIRY_DAYS = 30;
const STORAGE_KEY = 'mpt-recent-prayers';

/**
 * Hook to manage recently viewed prayers
 * Stores in localStorage with auto-expiry
 */
export function useRecentPrayers() {
    const [recentPrayers, setRecentPrayers] = useState<RecentPrayer[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed: RecentPrayer[] = JSON.parse(stored);
                // Filter out expired items
                const now = Date.now();
                const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
                const valid = parsed.filter(p => now - p.viewedAt < expiryMs);
                setRecentPrayers(valid);
            } catch (error) {
                console.error('Failed to parse recent prayers:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when updated
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recentPrayers));
        }
    }, [recentPrayers, isLoaded]);

    // Add a prayer to recent list
    const addRecentPrayer = useCallback((prayer: Omit<RecentPrayer, 'viewedAt'>) => {
        setRecentPrayers(prev => {
            // Remove if already exists
            const filtered = prev.filter(p => p.id !== prayer.id);
            // Add to front with timestamp
            const updated = [
                { ...prayer, viewedAt: Date.now() },
                ...filtered,
            ].slice(0, MAX_ITEMS);
            return updated;
        });
    }, []);

    // Clear all recent prayers
    const clearRecentPrayers = useCallback(() => {
        setRecentPrayers([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        recentPrayers,
        addRecentPrayer,
        clearRecentPrayers,
        isLoaded,
    };
}

/**
 * Hook for personalized prayer recommendations
 */
export function usePrayerRecommendations() {
    const { recentPrayers } = useRecentPrayers();
    const [recommendations, setRecommendations] = useState<{
        categories: string[];
        timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
        liturgicalSeason: string;
    }>({
        categories: [],
        timeOfDay: 'morning',
        liturgicalSeason: 'ordinary',
    });

    useEffect(() => {
        // Analyze recent prayers to find favorite categories
        const categoryCount = new Map<string, number>();
        recentPrayers.forEach(p => {
            categoryCount.set(p.category, (categoryCount.get(p.category) || 0) + 1);
        });
        const topCategories = Array.from(categoryCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat]) => cat);

        // Determine time of day
        const hour = new Date().getHours();
        let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
        if (hour >= 5 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
        else timeOfDay = 'night';

        // TODO: Get liturgical season from API
        const liturgicalSeason = 'ordinary';

        setRecommendations({
            categories: topCategories,
            timeOfDay,
            liturgicalSeason,
        });
    }, [recentPrayers]);

    return recommendations;
}

/**
 * Hook for tracking prayer history and stats
 */
export function usePrayerHistory() {
    const [history, setHistory] = useState<{
        todayPrayers: number;
        weeklyPrayers: number;
        streak: number;
        lastPrayerDate: string | null;
    }>({
        todayPrayers: 0,
        weeklyPrayers: 0,
        streak: 0,
        lastPrayerDate: null,
    });

    useEffect(() => {
        const stored = localStorage.getItem('mpt-prayer-history');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setHistory(parsed);
            } catch (error) {
                console.error('Failed to parse prayer history:', error);
            }
        }
    }, []);

    const recordPrayer = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];

        setHistory(prev => {
            const isNewDay = prev.lastPrayerDate !== today;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            const newHistory = {
                todayPrayers: isNewDay ? 1 : prev.todayPrayers + 1,
                weeklyPrayers: prev.weeklyPrayers + 1,
                streak: prev.lastPrayerDate === yesterdayStr ? prev.streak + 1 : isNewDay ? 1 : prev.streak,
                lastPrayerDate: today,
            };

            localStorage.setItem('mpt-prayer-history', JSON.stringify(newHistory));
            return newHistory;
        });
    }, []);

    return { ...history, recordPrayer };
}
