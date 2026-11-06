'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Sparkles, Check } from 'lucide-react';
import { isPushSupported, getNotificationPermission, subscribeToPush } from '@/lib/push';

export function DailyPrayerCompanionPrompt() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Only run in client browser
        if (typeof window === 'undefined') return;

        // Check if browser supports push
        if (!isPushSupported()) return;

        // Check if dismissed recently (within 10 days)
        const dismissedAt = localStorage.getItem('mpt_prayer_companion_dismissed');
        if (dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 10 * 24 * 60 * 60 * 1000) {
            return;
        }

        // Check current permission
        getNotificationPermission().then(permission => {
            if (permission === 'default') {
                // Wait 4 seconds after page load before gently sliding in
                const timer = setTimeout(() => setIsVisible(true), 4000);
                return () => clearTimeout(timer);
            }
        });
    }, []);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const sub = await subscribeToPush();
            if (sub) {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsVisible(false);
                }, 2500);
            } else {
                setIsVisible(false);
            }
        } catch (error) {
            console.error('Error enabling prayer notifications:', error);
            setIsVisible(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        try {
            localStorage.setItem('mpt_prayer_companion_dismissed', Date.now().toString());
        } catch {
            // ignore
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 md:bottom-8 right-4 z-50 max-w-sm w-[calc(100vw-32px)] md:w-96 bg-[#0e0915]/95 backdrop-blur-xl border border-gold-500/30 rounded-2xl p-4 shadow-2xl text-white animate-slide-up">
            <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-white/40 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
                <div className="flex items-center gap-3 py-2">
                    <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <Check className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-sm text-gold-300">God Bless Your Prayer Journey</h4>
                        <p className="text-xs text-white/70 mt-0.5">You will receive daily liturgical devotions &amp; reminders.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/25 shrink-0 mt-0.5">
                            <Bell className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="pr-4">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gold-400 tracking-wider uppercase mb-1">
                                <Sparkles className="w-3 h-3 text-gold-400" />
                                <span>Daily Prayer Companion</span>
                            </div>
                            <h4 className="font-serif font-bold text-sm text-white leading-snug">
                                Receive Daily Devotional Reminders
                            </h4>
                            <p className="text-xs text-white/60 mt-1 leading-relaxed">
                                Get quiet notifications for Morning Offering, 12 PM Angelus, and 3 PM Divine Mercy. No app download needed.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <button
                            onClick={handleSubscribe}
                            disabled={isLoading}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0a0612] font-semibold text-xs tracking-wide transition-all shadow-md active:scale-95 text-center disabled:opacity-50"
                        >
                            {isLoading ? 'Connecting...' : 'Turn On Reminders'}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors"
                        >
                            Later
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
