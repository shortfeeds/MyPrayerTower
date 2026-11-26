'use client';

import { Smartphone, Bell, Flame, WifiOff, Star, QrCode, ExternalLink } from 'lucide-react';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app';

export function AppDownloadSection() {
    const trackDownload = () => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'app_download_click', {
                platform: 'android',
                location: 'homepage_section',
            });
        }
    };

    return (
        <section className="py-16 bg-gradient-to-b from-[#18120D] to-[#120E0A] border-t border-gold-500/20">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="rounded-3xl bg-[#1F1711] border-2 border-gold-500/35 p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.75)] flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Left Copy & Features */}
                    <div className="flex-1 space-y-5 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                            <Smartphone className="w-3.5 h-3.5" />
                            Official Android App · Free
                        </div>

                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF6EE] leading-tight">
                            Take Your Catholic Sanctuary{' '}
                            <span className="text-gold-300">Everywhere</span>
                        </h2>

                        <p className="font-serif italic text-base sm:text-lg text-[#CFC5B4] max-w-xl mx-auto lg:mx-0">
                            Pray the Rosary on your commute, watch your vigil candle burn live, and receive gentle daily Mass &amp; Saint reminders.
                        </p>

                        {/* App-Exclusive Perks */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
                            <div className="p-3 rounded-xl bg-[#120E0A]/70 border border-gold-500/20 flex items-start gap-2.5">
                                <Bell className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs font-bold text-[#FAF6EE]">Daily Reminders</div>
                                    <div className="text-[11px] text-[#CFC5B4]">Never miss your prayer hour</div>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#120E0A]/70 border border-gold-500/20 flex items-start gap-2.5">
                                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs font-bold text-[#FAF6EE]">Live Candle Watch</div>
                                    <div className="text-[11px] text-[#CFC5B4]">Renewal &amp; vigil alerts</div>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#120E0A]/70 border border-gold-500/20 flex items-start gap-2.5">
                                <WifiOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs font-bold text-[#FAF6EE]">Offline Prayers</div>
                                    <div className="text-[11px] text-[#CFC5B4]">Rosary &amp; Novenas anywhere</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                            <a
                                href={PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={trackDownload}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-extrabold text-sm shadow-xl transition-all hover:scale-[1.02]"
                            >
                                <Smartphone className="w-5 h-5" />
                                <div className="text-left leading-tight">
                                    <span className="block text-[10px] font-normal opacity-90">GET IT ON</span>
                                    <span className="text-base">Google Play</span>
                                </div>
                                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                            </a>

                            <div className="flex items-center gap-1.5 text-xs text-gold-300 font-semibold">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                </div>
                                <span>4.8 Rating · 100% Free</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Desktop QR Card */}
                    <div className="shrink-0 bg-[#120E0A] border border-gold-500/30 rounded-2xl p-5 text-center w-full sm:w-56">
                        <div className="w-36 h-36 mx-auto bg-white rounded-xl p-2 flex items-center justify-center">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(PLAY_STORE_URL)}`}
                                alt="Scan to download MyPrayerTower Android App"
                                className="w-full h-full object-contain"
                                width={140}
                                height={140}
                            />
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-gold-300">
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Scan on Phone</span>
                        </div>
                        <p className="text-[11px] text-[#CFC5B4] mt-0.5">Instant Google Play install</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
