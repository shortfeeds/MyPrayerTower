
'use client';

import { useState, useEffect } from 'react';
import { loadReminderSettings, saveReminderSettings, type ReminderSettings, supportsNotifications, requestNotificationPermission } from '@/lib/notifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, Clock, Check, Moon, Sun, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationSettings() {
    const [settings, setSettings] = useState<ReminderSettings | null>(null);
    const { requestPermission: requestPushPermission, permission: pushPermission } = usePushNotifications();

    useEffect(() => {
        setSettings(loadReminderSettings());
    }, []);

    const handleToggle = (key: keyof ReminderSettings) => {
        if (!settings) return;
        const newSettings = { ...settings };
        newSettings[key].enabled = !newSettings[key].enabled;
        setSettings(newSettings);
        saveReminderSettings(newSettings);
        toast.success('Settings saved');
    };

    const handleTimeChange = (key: keyof ReminderSettings, hour: number, minute: number) => {
        if (!settings) return;
        // @ts-ignore - Dynamic key access with specific shape
        const newSettings = { ...settings };
        // @ts-ignore
        newSettings[key] = { ...newSettings[key], hour, minute };
        setSettings(newSettings);
        saveReminderSettings(newSettings);
    };

    const enableNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            await requestPushPermission(); // Also try OneSignal
            toast.success("Notifications enabled!");
        } else {
            toast.error("Permission denied. Please enable in browser settings.");
        }
    };

    if (!settings) return null;

    const isSupported = supportsNotifications();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        <p className="text-sm text-slate-500">Manage your daily prayer reminders</p>
                    </div>
                </div>
                {!isSupported && (
                    <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded">
                        Not Supported
                    </span>
                )}
            </div>

            <div className="p-6 space-y-6">
                {!isSupported ? (
                    <div className="text-center py-4 text-slate-500 text-sm">
                        Your browser does not support notifications. Please try Chrome or Firefox.
                    </div>
                ) : pushPermission !== 'granted' ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Enable Notifications</p>
                            <p className="opacity-80">Get daily reminders and updates.</p>
                        </div>
                        <button
                            onClick={enableNotifications}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Enable
                        </button>
                    </div>
                ) : null}

                {/* Morning Prayer */}
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <Sun className="w-5 h-5 text-amber-500 mt-1" />
                        <div>
                            <div className="flex items-center gap-2">
                                <label className="font-medium text-slate-700 toggle-label cursor-pointer">
                                    Morning Prayer
                                </label>
                                <input
                                    type="checkbox"
                                    checked={settings.morningPrayer.enabled}
                                    onChange={() => handleToggle('morningPrayer')}
                                    className="accent-blue-600"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Start your day with God.</p>

                            {settings.morningPrayer.enabled && (
                                <div className="mt-2 flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <select
                                        value={settings.morningPrayer.hour}
                                        onChange={(e) => handleTimeChange('morningPrayer', parseInt(e.target.value), settings.morningPrayer.minute)}
                                        className="text-sm bg-slate-50 border border-slate-200 rounded px-1 py-0.5"
                                    >
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                    <span className="text-slate-400">:</span>
                                    <select
                                        value={settings.morningPrayer.minute}
                                        onChange={(e) => handleTimeChange('morningPrayer', settings.morningPrayer.hour, parseInt(e.target.value))}
                                        className="text-sm bg-slate-50 border border-slate-200 rounded px-1 py-0.5"
                                    >
                                        <option value="0">00</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Evening Prayer */}
                <div className="flex items-start justify-between pt-4 border-t border-slate-50">
                    <div className="flex gap-3">
                        <Moon className="w-5 h-5 text-indigo-500 mt-1" />
                        <div>
                            <div className="flex items-center gap-2">
                                <label className="font-medium text-slate-700 cursor-pointer">
                                    Evening Prayer
                                </label>
                                <input
                                    type="checkbox"
                                    checked={settings.eveningPrayer.enabled}
                                    onChange={() => handleToggle('eveningPrayer')}
                                    className="accent-blue-600"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Reflect before rest.</p>

                            {settings.eveningPrayer.enabled && (
                                <div className="mt-2 flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <select
                                        value={settings.eveningPrayer.hour}
                                        onChange={(e) => handleTimeChange('eveningPrayer', parseInt(e.target.value), settings.eveningPrayer.minute)}
                                        className="text-sm bg-slate-50 border border-slate-200 rounded px-1 py-0.5"
                                    >
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                    <span className="text-slate-400">:</span>
                                    <select
                                        value={settings.eveningPrayer.minute}
                                        onChange={(e) => handleTimeChange('eveningPrayer', settings.eveningPrayer.hour, parseInt(e.target.value))}
                                        className="text-sm bg-slate-50 border border-slate-200 rounded px-1 py-0.5"
                                    >
                                        <option value="0">00</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Angelus */}
                {/* Saint of Day */}
                <div className="flex items-start justify-between pt-4 border-t border-slate-50">
                    <div className="flex gap-3">
                        <BookOpen className="w-5 h-5 text-emerald-500 mt-1" />
                        <div>
                            <div className="flex items-center gap-2">
                                <label className="font-medium text-slate-700 cursor-pointer">
                                    Saint of the Day
                                </label>
                                <input
                                    type="checkbox"
                                    checked={settings.saintOfDay.enabled}
                                    onChange={() => handleToggle('saintOfDay')}
                                    className="accent-blue-600"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Daily inspiration from a Saint.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Ensure global type declaration if not present elsewhere
declare global {
    interface Window {
        Notification: any;
    }
}
