'use client';

/**
 * Auto Notification & Reminder System
 * 
 * This module provides scheduled notifications and reminders for:
 * - Daily prayer reminders
 * - Mass time notifications
 * - Saint of the day
 * - Feast day reminders
 * - Prayer streak motivation
 */

import { useEffect, useCallback } from 'react';

// Notification types
export type NotificationType =
    | 'prayer_reminder'
    | 'mass_reminder'
    | 'saint_of_day'
    | 'feast_day'
    | 'streak_motivation'
    | 'weekly_digest';

export interface ScheduledNotification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    scheduledTime: Date;
    enabled: boolean;
}

// Default reminder times (user can customize)
export const DEFAULT_REMINDERS = {
    morningPrayer: { hour: 7, minute: 0 },
    eveningPrayer: { hour: 20, minute: 0 },
    angelus: { hour: 12, minute: 0 },
    massReminder: { minutesBefore: 30 },
};

// Check if browser supports notifications
export function supportsNotifications(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
    if (!supportsNotifications()) return false;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

// Get notification permission status
export function getNotificationPermission(): NotificationPermission | null {
    if (!supportsNotifications()) return null;
    return Notification.permission;
}

// Show a browser notification
export function showNotification(title: string, options?: NotificationOptions): void {
    if (!supportsNotifications() || Notification.permission !== 'granted') return;

    new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
    });
}

// Schedule a notification using the browser's setTimeout
export function scheduleNotification(
    notification: ScheduledNotification,
    onShow?: () => void
): NodeJS.Timeout | null {
    if (!supportsNotifications() || !notification.enabled) return null;

    const now = new Date();
    const delay = notification.scheduledTime.getTime() - now.getTime();

    if (delay <= 0) return null;

    return setTimeout(() => {
        showNotification(notification.title, { body: notification.body });
        onShow?.();
    }, delay);
}

// Get next occurrence of a daily time
export function getNextDailyTime(hour: number, minute: number): Date {
    const now = new Date();
    const target = new Date(now);
    target.setHours(hour, minute, 0, 0);

    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    return target;
}

// User reminder settings (stored in localStorage)
export interface ReminderSettings {
    morningPrayer: { enabled: boolean; hour: number; minute: number };
    eveningPrayer: { enabled: boolean; hour: number; minute: number };
    angelus: { enabled: boolean };
    saintOfDay: { enabled: boolean; hour: number; minute: number };
    massReminder: { enabled: boolean; minutesBefore: number };
    streakReminder: { enabled: boolean };
}

const DEFAULT_SETTINGS: ReminderSettings = {
    morningPrayer: { enabled: true, hour: 7, minute: 0 },
    eveningPrayer: { enabled: true, hour: 20, minute: 0 },
    angelus: { enabled: false },
    saintOfDay: { enabled: true, hour: 8, minute: 0 },
    massReminder: { enabled: false, minutesBefore: 30 },
    streakReminder: { enabled: true },
};

// Save reminder settings
export function saveReminderSettings(settings: ReminderSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('reminderSettings', JSON.stringify(settings));
}

// Load reminder settings
export function loadReminderSettings(): ReminderSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;

    const saved = localStorage.getItem('reminderSettings');
    if (!saved) return DEFAULT_SETTINGS;

    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

// React hook for managing reminders
export function useNotificationReminders() {
    const scheduleReminders = useCallback(() => {
        const settings = loadReminderSettings();
        const timers: NodeJS.Timeout[] = [];

        if (settings.morningPrayer.enabled) {
            const time = getNextDailyTime(settings.morningPrayer.hour, settings.morningPrayer.minute);
            const timer = scheduleNotification({
                id: 'morning-prayer',
                type: 'prayer_reminder',
                title: '🙏 Morning Prayer',
                body: 'Start your day with prayer. God bless you!',
                scheduledTime: time,
                enabled: true,
            });
            if (timer) timers.push(timer);
        }

        if (settings.eveningPrayer.enabled) {
            const time = getNextDailyTime(settings.eveningPrayer.hour, settings.eveningPrayer.minute);
            const timer = scheduleNotification({
                id: 'evening-prayer',
                type: 'prayer_reminder',
                title: '🌙 Evening Prayer',
                body: 'End your day in gratitude. Time for evening prayers.',
                scheduledTime: time,
                enabled: true,
            });
            if (timer) timers.push(timer);
        }

        if (settings.saintOfDay.enabled) {
            const time = getNextDailyTime(settings.saintOfDay.hour, settings.saintOfDay.minute);
            const timer = scheduleNotification({
                id: 'saint-of-day',
                type: 'saint_of_day',
                title: '⛪ Saint of the Day',
                body: 'Discover today\'s saint and be inspired!',
                scheduledTime: time,
                enabled: true,
            });
            if (timer) timers.push(timer);
        }

        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        if (getNotificationPermission() !== 'granted') return;

        const cleanup = scheduleReminders();

        // Reschedule every day at midnight
        const now = new Date();
        const midnight = new Date(now);
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);
        const msUntilMidnight = midnight.getTime() - now.getTime();

        const dailyReschedule = setTimeout(() => {
            cleanup();
            scheduleReminders();
        }, msUntilMidnight);

        return () => {
            cleanup();
            clearTimeout(dailyReschedule);
        };
    }, [scheduleReminders]);
}

// Reset all user data for first use
export function resetUserData(): void {
    if (typeof window === 'undefined') return;

    // Clear all stored user data
    const keysToRemove = [
        'reminderSettings',
        'userStreak',
        'prayerHistory',
        'favorites',
        'prayerLists',
        'badges',
        'theme',
        'accessibilitySettings',
        'lastPrayerDate',
        'totalPrayers',
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Reset to defaults
    saveReminderSettings(DEFAULT_SETTINGS);
}

// Initialize user data with defaults
export function initializeUserData(): {
    streak: number;
    totalPrayers: number;
    lastPrayerDate: string | null;
} {
    if (typeof window === 'undefined') {
        return { streak: 0, totalPrayers: 0, lastPrayerDate: null };
    }

    // Check if first time user
    const isFirstUse = !localStorage.getItem('userInitialized');

    if (isFirstUse) {
        // Reset everything for first use
        resetUserData();
        localStorage.setItem('userInitialized', 'true');
        localStorage.setItem('userStreak', '0');
        localStorage.setItem('totalPrayers', '0');
    }

    return {
        streak: parseInt(localStorage.getItem('userStreak') || '0', 10),
        totalPrayers: parseInt(localStorage.getItem('totalPrayers') || '0', 10),
        lastPrayerDate: localStorage.getItem('lastPrayerDate'),
    };
}

// Increment prayer streak
export function incrementPrayerStreak(): number {
    if (typeof window === 'undefined') return 0;

    const today = new Date().toDateString();
    const lastPrayerDate = localStorage.getItem('lastPrayerDate');
    let currentStreak = parseInt(localStorage.getItem('userStreak') || '0', 10);
    let totalPrayers = parseInt(localStorage.getItem('totalPrayers') || '0', 10);

    if (lastPrayerDate === today) {
        // Already prayed today, just increment total
        totalPrayers++;
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastPrayerDate === yesterday.toDateString()) {
            // Continued streak
            currentStreak++;
        } else {
            // Streak broken, start over
            currentStreak = 1;
        }

        totalPrayers++;
        localStorage.setItem('lastPrayerDate', today);
    }

    localStorage.setItem('userStreak', currentStreak.toString());
    localStorage.setItem('totalPrayers', totalPrayers.toString());

    return currentStreak;
}
