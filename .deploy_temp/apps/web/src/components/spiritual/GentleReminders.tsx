'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, Cross, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SACRED_COPY } from '@/lib/sacred-copy';

interface ReminderSetting {
    id: string;
    enabled: boolean;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

const REMINDER_SETTINGS: ReminderSetting[] = [
    {
        id: 'feastDays',
        enabled: true,
        label: 'Feast Day Invitations',
        description: 'We\'ll invite you to pray on major Catholic feast days',
        icon: Calendar,
        color: 'purple'
    },
    {
        id: 'memorialAnniversaries',
        enabled: true,
        label: 'Memorial Anniversaries',
        description: 'Gentle reminders to remember loved ones',
        icon: Heart,
        color: 'rose'
    },
    {
        id: 'candleComplete',
        enabled: true,
        label: 'Candle Completions',
        description: 'Let you know when your candle vigil has completed',
        icon: Cross,
        color: 'amber'
    }
];

/**
 * GentleReminders Component
 * 
 * Non-gamified, faith-aligned notification preferences.
 * Follows the principle: "Return when your spirit calls"
 * 
 * NO: Streaks, points, badges, urgency language
 * YES: Optional invitations, gentle reminders, spiritual meaning
 */
export function GentleReminders() {
    const [settings, setSettings] = useState<Record<string, boolean>>({
        feastDays: true,
        memorialAnniversaries: true,
        candleComplete: true
    });
    const [saved, setSaved] = useState(false);

    const toggleSetting = (id: string) => {
        setSettings(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = () => {
        // Save to localStorage (in real app, would save to user profile API)
        if (typeof window !== 'undefined') {
            localStorage.setItem('gentleReminderSettings', JSON.stringify(settings));
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-xl">
                    <Bell className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Gentle Reminders</h2>
                    <p className="text-sm text-slate-500">{SACRED_COPY.journey.return}</p>
                </div>
            </div>

            {/* Reassurance text */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                <p className="text-sm text-slate-600 italic">
                    These are optional invitations, not obligations. You choose when and how to engage with your faith journey.
                </p>
            </div>

            <div className="space-y-4">
                {REMINDER_SETTINGS.map((setting, idx) => (
                    <motion.div
                        key={setting.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${setting.color === 'purple' ? 'bg-purple-50 text-purple-500' :
                                    setting.color === 'rose' ? 'bg-rose-50 text-rose-500' :
                                        'bg-amber-50 text-amber-500'
                                }`}>
                                <setting.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900">{setting.label}</h3>
                                <p className="text-xs text-slate-500">{setting.description}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleSetting(setting.id)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings[setting.id]
                                    ? setting.color === 'purple' ? 'bg-purple-500' :
                                        setting.color === 'rose' ? 'bg-rose-500' : 'bg-amber-500'
                                    : 'bg-slate-200'
                                }`}
                            aria-label={`Toggle ${setting.label}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${settings[setting.id] ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
                {saved ? (
                    <>
                        <CheckCircle2 className="w-5 h-5" />
                        Preferences Saved
                    </>
                ) : (
                    'Save Preferences'
                )}
            </button>

            {/* Bottom note */}
            <p className="text-xs text-center text-slate-400 mt-4">
                You can change these anytime. We respect your sacred time.
            </p>
        </div>
    );
}

export default GentleReminders;
