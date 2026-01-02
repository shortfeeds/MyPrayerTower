'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Bell, Sun, Clock, Moon, BookOpen, Star, Check, Plus, Trash2 } from 'lucide-react';

const defaultReminders = [
    { id: '1', type: 'MORNING_PRAYER', label: 'Morning Prayer', time: '07:00', enabled: true, icon: Sun },
    { id: '2', type: 'ANGELUS', label: 'Angelus', time: '12:00', enabled: false, icon: Bell },
    { id: '3', type: 'EVENING_PRAYER', label: 'Evening Prayer', time: '21:00', enabled: true, icon: Moon },
    { id: '4', type: 'ROSARY', label: 'Rosary', time: '18:00', enabled: false, icon: Star },
    { id: '5', type: 'EXAMEN', label: 'Daily Examen', time: '22:00', enabled: true, icon: BookOpen },
];

export default function RemindersPage() {
    const [reminders, setReminders] = useState(defaultReminders);
    const [pendingChanges, setPendingChanges] = useState(false);

    const toggleReminder = (id: string) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
        ));
        setPendingChanges(true);
    };

    const updateTime = (id: string, time: string) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, time } : r
        ));
        setPendingChanges(true);
    };

    const saveChanges = () => {
        // In production, call API to save
        console.log('Saving reminders:', reminders);
        setPendingChanges(false);
    };

    return (
        <div className="min-h-screen bg-cream-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        {pendingChanges && (
                            <button
                                onClick={saveChanges}
                                className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-primary-600" />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-gray-900">
                            Prayer Reminders
                        </h1>
                    </div>
                    <p className="text-gray-600 mb-8 ml-13">
                        Set up daily reminders to help you maintain a consistent prayer life.
                    </p>

                    {/* Reminders List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {reminders.map((reminder) => {
                            const Icon = reminder.icon;
                            return (
                                <div key={reminder.id} className="p-4 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reminder.enabled ? 'bg-primary-100' : 'bg-gray-100'
                                        }`}>
                                        <Icon className={`w-5 h-5 ${reminder.enabled ? 'text-primary-600' : 'text-gray-400'
                                            }`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold ${reminder.enabled ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {reminder.label}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <input
                                                type="time"
                                                value={reminder.time}
                                                onChange={(e) => updateTime(reminder.id, e.target.value)}
                                                disabled={!reminder.enabled}
                                                className="text-sm text-gray-600 bg-transparent border-none p-0 focus:outline-none disabled:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Toggle */}
                                    <button
                                        onClick={() => toggleReminder(reminder.id)}
                                        className={`relative w-12 h-7 rounded-full transition-colors ${reminder.enabled ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${reminder.enabled ? 'left-6' : 'left-1'
                                            }`} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add Custom */}
                    <button className="w-full mt-4 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Custom Reminder
                    </button>

                    {/* Info */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-700">
                            <strong>Note:</strong> Reminders require push notifications to be enabled in your browser or device settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
