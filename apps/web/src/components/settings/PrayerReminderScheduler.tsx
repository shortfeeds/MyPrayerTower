'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Check, Sun, Moon, Star, Save } from 'lucide-react';

interface ReminderSetting {
    id: string;
    type: 'morning' | 'angelus' | 'evening' | 'divine_mercy' | 'rosary' | 'examen' | 'custom';
    label: string;
    time: string;
    enabled: boolean;
    days: string[];
}

const DEFAULT_REMINDERS: ReminderSetting[] = [
    { id: 'morning', type: 'morning', label: 'Morning Offering', time: '07:00', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: 'angelus', type: 'angelus', label: 'Angelus', time: '12:00', enabled: false, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: 'divine_mercy', type: 'divine_mercy', label: 'Divine Mercy (3pm)', time: '15:00', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: 'rosary', type: 'rosary', label: 'Rosary', time: '19:00', enabled: false, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: 'examen', type: 'examen', label: 'Daily Examen', time: '21:00', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TIME_ICONS = {
    morning: Sun,
    angelus: Star,
    evening: Moon,
    divine_mercy: Star,
    rosary: Star,
    examen: Moon,
    custom: Clock,
};

/**
 * Prayer reminder scheduler component
 */
export function PrayerReminderScheduler() {
    const [reminders, setReminders] = useState<ReminderSetting[]>(DEFAULT_REMINDERS);
    const [hasChanges, setHasChanges] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('mpt-prayer-reminders');
        if (stored) {
            try {
                setReminders(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse reminders:', e);
            }
        }
    }, []);

    const toggleReminder = (id: string) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
        ));
        setHasChanges(true);
        setSaved(false);
    };

    const updateTime = (id: string, time: string) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, time } : r
        ));
        setHasChanges(true);
        setSaved(false);
    };

    const toggleDay = (id: string, day: string) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? {
                ...r,
                days: r.days.includes(day)
                    ? r.days.filter(d => d !== day)
                    : [...r.days, day]
            } : r
        ));
        setHasChanges(true);
        setSaved(false);
    };

    const saveReminders = () => {
        localStorage.setItem('mpt-prayer-reminders', JSON.stringify(reminders));
        setHasChanges(false);
        setSaved(true);

        // Request notification permission if needed
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        setTimeout(() => setSaved(false), 2000);
    };

    const enabledCount = reminders.filter(r => r.enabled).length;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sacred-100 dark:bg-sacred-900/30 rounded-xl">
                        <Bell size={20} className="text-sacred-600 dark:text-sacred-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Prayer Reminders</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {enabledCount} reminder{enabledCount !== 1 ? 's' : ''} active
                        </p>
                    </div>
                </div>

                <button
                    onClick={saveReminders}
                    disabled={!hasChanges}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                        ${hasChanges
                            ? 'bg-sacred-600 text-white hover:bg-sacred-700'
                            : saved
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {saved ? (
                        <>
                            <Check size={16} />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Save
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-4">
                {reminders.map(reminder => {
                    const Icon = TIME_ICONS[reminder.type];

                    return (
                        <div
                            key={reminder.id}
                            className={`
                                p-4 rounded-xl border transition-all
                                ${reminder.enabled
                                    ? 'border-sacred-200 dark:border-sacred-800 bg-sacred-50/50 dark:bg-sacred-900/10'
                                    : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                {/* Toggle */}
                                <button
                                    onClick={() => toggleReminder(reminder.id)}
                                    className={`
                                        relative w-12 h-6 rounded-full transition-colors
                                        ${reminder.enabled
                                            ? 'bg-sacred-600'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm
                                            ${reminder.enabled ? 'translate-x-7' : 'translate-x-1'}
                                        `}
                                    />
                                </button>

                                {/* Icon & Label */}
                                <div className="flex items-center gap-2 flex-1">
                                    <Icon size={18} className={reminder.enabled ? 'text-sacred-600' : 'text-gray-400'} />
                                    <span className={`font-medium ${reminder.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                        {reminder.label}
                                    </span>
                                </div>

                                {/* Time Picker */}
                                <input
                                    type="time"
                                    value={reminder.time}
                                    onChange={(e) => updateTime(reminder.id, e.target.value)}
                                    disabled={!reminder.enabled}
                                    className={`
                                        px-3 py-1.5 rounded-lg border text-sm
                                        ${reminder.enabled
                                            ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                            : 'border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                        }
                                    `}
                                />
                            </div>

                            {/* Day Selector */}
                            {reminder.enabled && (
                                <div className="flex gap-1.5 mt-2 ml-16">
                                    {DAYS.map(day => (
                                        <button
                                            key={day}
                                            onClick={() => toggleDay(reminder.id, day)}
                                            className={`
                                                w-8 h-8 rounded-full text-xs font-medium transition-colors
                                                ${reminder.days.includes(day)
                                                    ? 'bg-sacred-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }
                                            `}
                                        >
                                            {day.charAt(0)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Notification permission notice */}
            {'Notification' in (typeof window !== 'undefined' ? window : {}) &&
                typeof Notification !== 'undefined' &&
                Notification.permission !== 'granted' && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
                        📱 Enable browser notifications to receive reminders even when you&apos;re away.
                    </div>
                )}
        </div>
    );
}

/**
 * Compact reminder toggle for quick settings
 */
export function QuickReminderToggle({ reminderType, className = '' }: { reminderType: string; className?: string }) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('mpt-prayer-reminders');
        if (stored) {
            const reminders: ReminderSetting[] = JSON.parse(stored);
            const reminder = reminders.find(r => r.type === reminderType);
            if (reminder) {
                setEnabled(reminder.enabled);
            }
        }
    }, [reminderType]);

    return (
        <button
            className={`p-2 rounded-lg transition-colors ${enabled
                    ? 'bg-sacred-100 dark:bg-sacred-900/30 text-sacred-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700'
                } ${className}`}
            title={enabled ? 'Reminder enabled' : 'No reminder set'}
        >
            {enabled ? <Bell size={18} className="fill-current" /> : <BellOff size={18} />}
        </button>
    );
}
