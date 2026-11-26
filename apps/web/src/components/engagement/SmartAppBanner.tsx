'use client';

import { useState, useEffect } from 'react';
import { X, Star, Smartphone } from 'lucide-react';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app';
const DISMISS_KEY = 'mpt_smart_app_banner_dismissed_at';

export function SmartAppBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            const dismissedAt = localStorage.getItem(DISMISS_KEY);
            if (dismissedAt) {
                const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
                if (daysSince < 7) return;
            }
            setVisible(true);
        } catch {
            setVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        try {
            localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch {
            // ignore
        }
    };

    if (!visible) return null;

    return (
        <div className="md:hidden bg-[#18120D] border-b border-gold-500/30 text-[#FAF6EE] px-3 py-2 flex items-center justify-between gap-2 z-[60] relative">
            <div className="flex items-center gap-2.5 min-w-0">
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="p-1 text-[#CFC5B4]/70 hover:text-white shrink-0"
                    aria-label="Dismiss app banner"
                >
                    <X className="w-4 h-4" />
                </button>
                <img src="/icon.png" alt="MyPrayerTower" className="w-8 h-8 rounded-lg border border-gold-500/40 shrink-0" />
                <div className="min-w-0">
                    <div className="text-xs font-bold text-[#FAF6EE] truncate flex items-center gap-1">
                        <span>MyPrayerTower</span>
                        <span className="inline-flex items-center text-amber-400">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span className="text-[10px] ml-0.5">4.8</span>
                        </span>
                    </div>
                    <div className="text-[10px] text-[#CFC5B4] truncate">Pray anytime · Free on Google Play</div>
                </div>
            </div>

            <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'app_download_click', { platform: 'android', location: 'smart_banner' });
                    }
                }}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] font-extrabold text-[11px] shadow"
            >
                <Smartphone className="w-3 h-3" />
                <span>GET APP</span>
            </a>
        </div>
    );
}
