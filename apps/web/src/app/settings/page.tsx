"use client";

import { useState, useEffect } from 'react';
import { Bell, Mail, Moon, Volume2, Shield, LogOut, ChevronRight } from 'lucide-react';

type NotificationSetting = {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
};

const DEFAULT_SETTINGS: NotificationSetting[] = [
    { id: 'daily_prayer', label: 'Daily Prayer Reminders', description: 'Receive a notification to pray every morning.', enabled: true },
    { id: 'novena_updates', label: 'Novena Updates', description: 'Reminders for your active novenas.', enabled: true },
    { id: 'new_content', label: 'New Content', description: 'Updates when new prayers or readings are added.', enabled: false },
    { id: 'marketing', label: 'News & Offers', description: 'Occasional updates about MyPrayerTower.', enabled: false },
];

export default function SettingsPage() {
    const [notifications, setNotifications] = useState<NotificationSetting[]>(DEFAULT_SETTINGS);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(true); // Assuming dark mode by default for now

    useEffect(() => {
        const saved = localStorage.getItem('mpt_notification_settings');
        if (saved) {
            setNotifications(JSON.parse(saved));
        }
    }, []);

    const toggleNotification = (id: string) => {
        const updated = notifications.map(n =>
            n.id === id ? { ...n, enabled: !n.enabled } : n
        );
        setNotifications(updated);
        localStorage.setItem('mpt_notification_settings', JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Settings</h1>

                {/* Notifications Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-900">
                        <Bell size={24} className="text-blue-500" />
                        Notifications
                    </h2>

                    <div className="space-y-6">
                        {notifications.map((setting) => (
                            <div key={setting.id} className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-slate-900">{setting.label}</div>
                                    <div className="text-sm text-slate-500 max-w-sm">{setting.description}</div>
                                </div>
                                <button
                                    onClick={() => toggleNotification(setting.id)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${setting.enabled ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-900">
                        <Shield size={24} className="text-slate-500" />
                        Preferences
                    </h2>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Moon size={20} className="text-slate-400" />
                                <span className="font-medium text-slate-900">Dark Mode</span>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-slate-800' : 'bg-slate-200'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Volume2 size={20} className="text-slate-400" />
                                <span className="font-medium text-slate-900">App Sounds</span>
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-blue-600' : 'bg-slate-200'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        <a href="/faq" className="flex justify-between items-center group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-slate-400" />
                                <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">Privacy Policy & Terms</span>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500" />
                        </a>
                    </div>
                </div>

                {/* Account Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <button className="w-full text-left flex items-center gap-3 text-red-500 hover:text-red-600 font-medium">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>

                <div className="mt-8 text-center text-xs text-slate-400">
                    MyPrayerTower v2.0.0 (Web)
                </div>

            </div>
        </div>
    );
}
