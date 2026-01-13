'use client';

import { useState } from 'react';
import { Bell, Calendar, Mail, Clock, CheckCircle2 } from 'lucide-react';

export function ReminderPreferences() {
    const [preferences, setPreferences] = useState({
        dailyPrayer: true,
        dailyTime: '08:00',
        feastDays: true,
        memorials: true,
        weeklySummary: true
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // Simulate API call
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mt-6">
            <h2 className="text-white/80 font-semibold text-lg mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-gold-400" /> Notifications & Reminders
            </h2>

            <div className="space-y-6">
                {/* Daily Prayer Nudge */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-white font-medium">Daily Prayer Nudge</div>
                            <div className="text-white/40 text-xs">A gentle reminder to pause and pray</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="time"
                            value={preferences.dailyTime}
                            onChange={(e) => setPreferences({ ...preferences, dailyTime: e.target.value })}
                            className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-400"
                        />
                        <button
                            onClick={() => setPreferences({ ...preferences, dailyPrayer: !preferences.dailyPrayer })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${preferences.dailyPrayer ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.dailyPrayer ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* Feast Days */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-white font-medium">Feast Day Alerts</div>
                            <div className="text-white/40 text-xs">Notify me on major Catholic feast days</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setPreferences({ ...preferences, feastDays: !preferences.feastDays })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${preferences.feastDays ? 'bg-purple-500' : 'bg-white/10'}`}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.feastDays ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* Memorial Anniversaries */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-white font-medium">Memorial Anniversaries</div>
                            <div className="text-white/40 text-xs">Remember loved ones on their special dates</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setPreferences({ ...preferences, memorials: !preferences.memorials })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${preferences.memorials ? 'bg-rose-500' : 'bg-white/10'}`}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.memorials ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* Weekly Summary */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-white font-medium">Weekly Faith Summary</div>
                            <div className="text-white/40 text-xs">A Sunday email digest of your prayer journey</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setPreferences({ ...preferences, weeklySummary: !preferences.weeklySummary })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${preferences.weeklySummary ? 'bg-emerald-500' : 'bg-white/10'}`}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.weeklySummary ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <button
                onClick={handleSave}
                className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
                {saved ? (
                    <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Preferences Saved
                    </>
                ) : (
                    'Save Preferences'
                )}
            </button>
        </div>
    );
}
