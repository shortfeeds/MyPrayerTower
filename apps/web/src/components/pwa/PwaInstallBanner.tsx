'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share2, Sparkles, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIos, setIsIos] = useState(false);
    const [showIosSteps, setShowIosSteps] = useState(false);

    useEffect(() => {
        // Check if already in standalone/installed mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        if (isStandalone) return;

        // Check if recently dismissed
        const dismissed = localStorage.getItem('mpt-pwa-dismissed');
        if (dismissed) {
            const dismissedTime = new Date(dismissed).getTime();
            if (Date.now() - dismissedTime < 1000 * 60 * 60 * 24 * 7) {
                return; // Suppress for 7 days
            }
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIos(isIosDevice);

        if (isIosDevice) {
            // For iOS, show banner after 6 seconds
            const timer = setTimeout(() => setShowBanner(true), 6000);
            return () => clearTimeout(timer);
        }

        // For Android / Chrome / Edge
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }, []);

    const handleInstallClick = async () => {
        if (isIos) {
            setShowIosSteps(true);
            return;
        }

        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
            setShowBanner(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        setShowIosSteps(false);
        localStorage.setItem('mpt-pwa-dismissed', new Date().toISOString());
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-in-up">
            <div className="bg-gradient-to-r from-sacred-950 via-gray-900 to-sacred-950 text-white rounded-3xl p-5 shadow-2xl border border-gold-500/30 backdrop-blur-xl relative overflow-hidden">
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white rounded-full transition-colors"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-gold-500/40 flex-shrink-0 bg-black">
                        <img src="/icon.png" alt="MyPrayerTower" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 text-gold-400 text-[10px] font-black uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            <span>Instant App</span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-white leading-tight">MyPrayerTower</h4>
                        <p className="text-xs text-gray-300">Daily Rosary, Readings & Prayer Sanctuary</p>
                    </div>
                </div>

                {showIosSteps ? (
                    <div className="mt-3 p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-300 space-y-2 animate-fade-in">
                        <p className="font-bold text-white flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5 text-gold-400" />
                            How to install on iOS Safari:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-300 text-[11px]">
                            <li>Tap the <span className="font-bold text-white">Share</span> button in Safari at the bottom</li>
                            <li>Scroll down and tap <span className="font-bold text-gold-300">"Add to Home Screen"</span></li>
                        </ol>
                        <button
                            onClick={handleDismiss}
                            className="w-full mt-2 py-1.5 bg-gold-500 text-white font-bold text-[11px] rounded-xl hover:bg-gold-400"
                        >
                            Got It
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 mt-4">
                        <button
                            onClick={handleInstallClick}
                            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            <span>Add to Home Screen</span>
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="py-2.5 px-4 text-xs font-medium text-gray-400 hover:text-white"
                        >
                            Later
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
