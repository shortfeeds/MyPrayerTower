/**
 * Centralized API Layer
 * 
 * This module provides a typed, cached, and error-handled interface
 * for all database operations. Use this instead of direct db calls.
 */

import { db } from './db';
import {
    getCachedSaints,
    getCachedSaintById,
    getCachedSaintOfTheDay,
    getCachedChurches,
    getCachedChurchById,
    getCachedPrayers,
    getCachedPrayerById,
    getCachedPrayerCategories,
    getCachedDailyReading,
    getCachedStats,
} from './cache';

// Error handling wrapper
async function withErrorHandling<T>(
    operation: () => Promise<T>,
    fallback?: T,
    errorMessage = 'Database operation failed'
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        console.error(errorMessage, error);
        if (fallback !== undefined) {
            return fallback;
        }
        throw error;
    }
}

// Saints API
export const saintsApi = {
    getAll: async (limit?: number) => {
        return withErrorHandling(
            () => getCachedSaints(limit),
            [],
            'Failed to fetch saints'
        );
    },

    getById: async (id: string) => {
        return withErrorHandling(
            () => getCachedSaintById(id),
            null,
            `Failed to fetch saint ${id}`
        );
    },

    getOfTheDay: async () => {
        return withErrorHandling(
            () => getCachedSaintOfTheDay(),
            null,
            'Failed to fetch saint of the day'
        );
    },

    search: async (query: string) => {
        return withErrorHandling(
            () => db.saint.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' },
                },
                take: 20,
            }),
            [],
            'Failed to search saints'
        );
    },
};

// Churches API
export const churchesApi = {
    getAll: async (limit?: number) => {
        return withErrorHandling(
            () => getCachedChurches(limit),
            [],
            'Failed to fetch churches'
        );
    },

    getById: async (id: string) => {
        return withErrorHandling(
            () => getCachedChurchById(id),
            null,
            `Failed to fetch church ${id}`
        );
    },

    getByDiocese: async (dioceseId: string, limit?: number) => {
        return withErrorHandling(
            () => db.church.findMany({
                where: { dioceseId },
                take: limit || 50,
            }),
            [],
            'Failed to fetch churches by diocese'
        );
    },

    getNearby: async (lat: number, lng: number, radiusKm = 50) => {
        // Note: For production, use PostGIS or a proper geospatial query
        return withErrorHandling(
            () => db.church.findMany({
                where: {
                    AND: [
                        { latitude: { gte: lat - (radiusKm / 111) } },
                        { latitude: { lte: lat + (radiusKm / 111) } },
                        { longitude: { gte: lng - (radiusKm / (111 * Math.cos(lat * Math.PI / 180))) } },
                        { longitude: { lte: lng + (radiusKm / (111 * Math.cos(lat * Math.PI / 180))) } },
                    ],
                },
                take: 50,
            }),
            [],
            'Failed to fetch nearby churches'
        );
    },
};

// Prayers API
export const prayersApi = {
    getAll: async (category?: string, limit?: number) => {
        return withErrorHandling(
            () => getCachedPrayers(category, limit),
            [],
            'Failed to fetch prayers'
        );
    },

    getById: async (id: string) => {
        return withErrorHandling(
            () => getCachedPrayerById(id),
            null,
            `Failed to fetch prayer ${id}`
        );
    },

    getCategories: async () => {
        return withErrorHandling(
            () => getCachedPrayerCategories(),
            [],
            'Failed to fetch prayer categories'
        );
    },

    search: async (query: string) => {
        return withErrorHandling(
            () => db.prayer.findMany({
                where: {
                    title: { contains: query, mode: 'insensitive' },
                },
                take: 20,
            }),
            [],
            'Failed to search prayers'
        );
    },
};

// Readings API
export const readingsApi = {
    getToday: async () => {
        return withErrorHandling(
            () => getCachedDailyReading(),
            null,
            'Failed to fetch daily reading'
        );
    },

    getByDate: async (date: Date) => {
        return withErrorHandling(
            () => getCachedDailyReading(date),
            null,
            'Failed to fetch reading for date'
        );
    },
};

// Stats API
export const statsApi = {
    get: async () => {
        return withErrorHandling(
            () => getCachedStats(),
            { saints: 0, churches: 0, prayers: 0 },
            'Failed to fetch stats'
        );
    },
};

// User API (requires auth)
export const userApi = {
    getProfile: async (userId: string) => {
        return withErrorHandling(
            () => db.user.findUnique({
                where: { id: userId },
            }),
            null,
            'Failed to fetch user profile'
        );
    },

    // Note: updateStreak requires 'streak' and 'lastPrayerAt' fields in User model
    // Uncomment and adjust after confirming schema
    /*
    updateStreak: async (userId: string) => {
        return withErrorHandling(
            () => db.user.update({
                where: { id: userId },
                data: {
                    streak: { increment: 1 },
                    lastPrayerAt: new Date(),
                },
            }),
            null,
            'Failed to update streak'
        );
    },
    */
};

// Export all APIs as a single object
export const api = {
    saints: saintsApi,
    churches: churchesApi,
    prayers: prayersApi,
    readings: readingsApi,
    stats: statsApi,
    user: userApi,
};

export default api;
