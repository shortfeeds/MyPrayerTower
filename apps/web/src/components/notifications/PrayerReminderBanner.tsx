'use client';

import { useState, useEffect } from 'react';
import { Bell, BellRing, Send, X, Clock, Sparkles, Check } from 'lucide-react';
import { subscribeToPush } from '@/lib/push';

const STORAGE_KEY = 'mpt_prayer_reminder_dismissed';

export function PrayerReminderBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [notifGranted, setNotifGranted] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!dismissed) {
            setIsVisible(true);
        }
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setNotifGranted(Notification.permission === 'granted');
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, 'true');
    };

    const handleRequestNotification = async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            try {
                const sub = await subscribeToPush();
                setNotifGranted(true);
                if (sub) {
                    new Notification('MyPrayerTower Daily Reminders Active', {
                        body: 'You will receive gentle reminders for 12 PM Angelus & 3 PM Divine Mercy.',
                        icon: '/favicon.ico',
                    });
                }
            } catch (err) {
                console.error('Notification permission error:', err);
            }
        }
    };

    if (!isVisible) return null;

    return (
        <aside
            aria-label="Daily Catholic prayer reminders"
            className="my-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-xl"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 max-w-xl">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
                        <BellRing className="w-6 h-6 text-amber-200" />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 tracking-wider uppercase mb-1">
                            <Sparkles className="w-3 h-3 text-amber-200" />
                            Daily Liturgical Rhythm
                        </div>
                        <h3 className="text-xl font-serif font-bold tracking-tight">
                            Daily Prayer Reminders &amp; Fellowship
                        </h3>
                        <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed mt-1">
                            Pause for the <strong>12 PM Angelus</strong> and <strong>3 PM Divine Mercy Hour</strong>. Join our Catholic prayer community on Telegram for daily Scripture, feast day novenas, and intentions.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <a
                        href="https://t.me/myprayertower"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-amber-900 font-semibold text-xs hover:bg-amber-50 active:scale-95 transition-all shadow-md"
                    >
                        <Send className="w-4 h-4 text-blue-500" />
                        Join Telegram Channel
                    </a>

                    {!notifGranted ? (
                        <button
                            type="button"
                            onClick={handleRequestNotification}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs backdrop-blur transition-all"
                        >
                            <Bell className="w-4 h-4 text-amber-200" />
                            Enable Daily Bell
                        </button>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 text-xs font-medium">
                            <Check className="w-4 h-4 text-emerald-300" />
                            Reminders Active
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={handleDismiss}
                        aria-label="Dismiss banner"
                        className="p-2 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white ml-auto md:ml-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
