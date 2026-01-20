'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';

interface PushNotificationPromptProps {
    /** Delay before showing prompt (ms) */
    delay?: number;
    /** Only show after N visits */
    minVisits?: number;
}

/**
 * Push notification permission prompt
 * Respectfully asks users to enable notifications
 */
export function PushNotificationPrompt({
    delay = 10000,
    minVisits = 2,
}: PushNotificationPromptProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

    useEffect(() => {
        // Check if notifications are supported
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            setPermission('unsupported');
            return;
        }

        setPermission(Notification.permission);

        // Don't show if already granted or denied
        if (Notification.permission !== 'default') return;

        // Check visit count
        const visitCount = parseInt(localStorage.getItem('mpt-visits') || '0', 10);
        if (visitCount < minVisits) return;

        // Check if user has dismissed before
        const dismissed = localStorage.getItem('mpt-push-dismissed');
        if (dismissed) {
            const dismissedDate = new Date(dismissed);
            const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) return; // Don't ask again for 7 days
        }

        // Show prompt after delay
        const timeout = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timeout);
    }, [delay, minVisits]);

    const handleClose = () => {
        setIsClosing(true);
        localStorage.setItem('mpt-push-dismissed', new Date().toISOString());
        setTimeout(() => setIsVisible(false), 300);
    };

    const handleEnable = async () => {
        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                // Register for push notifications
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    // Here you would subscribe to push notifications
                    console.log('Push notification enabled', registration);
                }
            }

            handleClose();
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            handleClose();
        }
    };

    if (!isVisible || permission === 'unsupported' || permission !== 'default') {
        return null;
    }

    return (
        <div
            className={`
                fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50
                ${isClosing ? 'toast-exit' : 'toast-enter'}
            `}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-5">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sacred-500 to-sacred-600 flex items-center justify-center">
                            <Bell size={24} className="text-white" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            Stay Connected in Prayer
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Get daily readings, saint of the day, and prayer reminders delivered to you.
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleEnable}
                                className="
                                    flex items-center gap-2 px-4 py-2
                                    bg-gradient-to-r from-sacred-600 to-sacred-700
                                    text-white font-semibold rounded-lg
                                    hover:from-sacred-500 hover:to-sacred-600
                                    transition-all btn-hover-lift
                                "
                            >
                                <Check size={16} />
                                Enable Notifications
                            </button>
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Notification settings toggle for user preferences
 */
export function NotificationSettings() {
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
    const [preferences, setPreferences] = useState({
        dailyReadings: true,
        saintOfTheDay: true,
        prayerReminders: true,
        communityActivity: false,
    });

    useEffect(() => {
        if (!('Notification' in window)) {
            setPermission('unsupported');
            return;
        }
        setPermission(Notification.permission);

        // Load saved preferences
        const saved = localStorage.getItem('mpt-notification-prefs');
        if (saved) {
            setPreferences(JSON.parse(saved));
        }
    }, []);

    const handleToggle = (key: keyof typeof preferences) => {
        const newPrefs = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPrefs);
        localStorage.setItem('mpt-notification-prefs', JSON.stringify(newPrefs));
    };

    if (permission === 'unsupported') {
        return (
            <p className="text-sm text-gray-500">
                Notifications are not supported in this browser.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {permission !== 'granted' && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        Notifications are currently disabled. Enable them in your browser settings to receive updates.
                    </p>
                </div>
            )}

            <div className="space-y-3">
                {Object.entries(preferences).map(([key, enabled]) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() => handleToggle(key as keyof typeof preferences)}
                            disabled={permission !== 'granted'}
                            className="rounded border-gray-300 text-sacred-600 focus:ring-sacred-500"
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
