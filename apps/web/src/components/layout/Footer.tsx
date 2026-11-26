'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Youtube, Heart, Church, Star, Mail, Home, User, Check, Loader2, Apple, Smartphone, Gift, Flame, Send } from 'lucide-react';
import { TwitterIcon, InstagramIcon, ThreadsIcon, TikTokIcon } from '@/components/common/SocialIcons';
import { UniversalOfferingModal } from '@/components/offerings/UniversalOfferingModal';
import { MobileBottomNav } from './MobileBottomNav';
import { useAppMode } from '@/contexts/AppModeContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { SpamShield } from '@/components/common/SpamShield';

// App Store Button Component
function AppStoreButton({ store }: { store: 'telegram' | 'google' }) {
    if (store === 'google') {
        return (
            <Link
                href="https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app"
                target="_blank"
                onClick={() => {
                    if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'app_download_click', { platform: 'android', event_category: 'acquisition' });
                    }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg group hover:bg-gray-800 transition-all font-medium text-white shadow-lg active:scale-95"
            >
                <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex flex-col items-start leading-none text-left">
                    <span className="text-[10px] text-gray-400 font-normal">GET IT ON</span>
                    <span className="text-sm font-bold tracking-tight">Google Play</span>
                </div>
            </Link>
        );
    }
    return (
        <a 
            href="https://t.me/myprayertower"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'telegram_join_click', { channel: 't.me/myprayertower', event_category: 'social_channel' });
                }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#229ED9] rounded-lg group hover:bg-[#1E8BC1] transition-all font-medium text-white shadow-lg active:scale-95"
        >
            <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                <Send className="w-4 h-4" />
            </div>
            <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[10px] opacity-70 font-normal">JOIN CHANNEL</span>
                <span className="text-sm font-bold tracking-tight">Telegram</span>
            </div>
        </a>
    );
}

// Newsletter Form Component
function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            const formData = new FormData(e.currentTarget);
            const website_url = formData.get('website_url') as string;
            const _f_time = formData.get('_f_time') as string;

            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, website_url, _f_time }),
            });
            setStatus(res.ok ? 'success' : 'error');
            if (res.ok) setEmail('');
        } catch {
            setStatus('error');
        }
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="bg-[#120E0A]/90 p-4 rounded-xl border border-gold-500/25">
            <h4 className="text-[#FAF6EE] font-bold text-sm mb-2">Spiritual Nourishment</h4>
            <form onSubmit={handleSubmit} className="flex gap-2 relative">
                <SpamShield honeypotName="website_url" />
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Receive daily grace..."
                    className="flex-1 px-3 py-2 bg-[#18120D] border border-gold-500/25 rounded-lg text-sm text-[#FAF6EE] placeholder-[#CFC5B4]/50 focus:outline-none focus:border-gold-400"
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-3 py-2 bg-gold-500 hover:bg-gold-400 text-white text-xs font-bold rounded-lg"
                >
                    {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : status === 'success' ? <Check className="w-4 h-4" /> : 'Join'}
                </button>
            </form>
        </div>
    );
}

export function Footer() {
    const [currentYear, setCurrentYear] = useState(2026);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const appModeCtx = useAppMode();

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
        setMounted(true);
    }, []);

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/myprayertower' },
        { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@myprayertower' },
        { icon: TwitterIcon, label: 'X', href: 'https://twitter.com/MyPrayerTower' },
        { icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/myprayertower/' },
        { icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/@myprayertower' },
        { icon: ThreadsIcon, label: 'Threads', href: 'https://www.threads.net/@myprayertower' },
        { icon: Send, label: 'Telegram', href: 'https://t.me/myprayertower' },
    ];

    if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/church-dashboard') || pathname.startsWith('/bot'))) {
        return null;
    }

    return (
        <>
            <footer className={`hidden lg:block bg-[#120E0A] text-[#CFC5B4] border-t border-gold-500/20 pt-16 pb-8 ${appModeCtx.isNativeApp ? 'hidden' : ''}`}>
                <div className="container mx-auto px-6">
                    {/* Desktop Newsletter Bar */}
                    <div className="mb-14 p-8 rounded-3xl bg-gradient-to-r from-[#18120D] via-[#1F1711] to-[#18120D] border border-gold-500/30 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="max-w-xl text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500 mb-2 block">Daily Grace</span>
                            <h3 className="font-serif text-2xl font-bold text-white mb-2">Receive Daily Spiritual Nourishment</h3>
                            <p className="text-sm text-gray-400">Join our global community of faithful receiving daily Mass readings, reflections, and prayers.</p>
                        </div>
                        <div className="w-full lg:w-auto lg:min-w-[420px]">
                            <NewsletterForm />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
                        <div className="col-span-2">
                            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
                                <img src="/icon.png" alt="MyPrayerTower" className="w-10 h-10 rounded-xl border border-gold-500/40 shadow-md group-hover:scale-105 transition-transform" />
                                <div>
                                    <span className="font-display font-bold text-xl text-[#FAF6EE] block leading-none">MyPrayerTower</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-semibold">Catholic Digital Sanctuary</span>
                                </div>
                            </Link>
                            <p className="font-serif text-base leading-relaxed mb-6 max-w-sm italic text-[#CFC5B4]">
                                &ldquo;Where two or three are gathered in my name, there am I among them.&rdquo; — Matthew 18:20
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {socialLinks.map((s) => (
                                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-[#18120D] border border-gold-500/25 rounded-xl hover:border-gold-400 hover:text-gold-300 text-[#CFC5B4] transition-all" aria-label={s.label}>
                                        <s.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-gold-300 mb-5 uppercase text-xs tracking-[0.2em]">Prayer &amp; Word</h4>
                            <ul className="space-y-2.5 text-sm text-[#CFC5B4]">
                                <li><Link href="/readings" className="hover:text-gold-300 transition-colors">Daily Mass Readings</Link></li>
                                <li><Link href="/rosary" className="hover:text-gold-300 transition-colors">Holy Rosary</Link></li>
                                <li><Link href="/novenas" className="hover:text-gold-300 transition-colors">9-Day Novenas</Link></li>
                                <li><Link href="/prayers" className="hover:text-gold-300 transition-colors">Prayer Library</Link></li>
                                <li><Link href="/prayer-wall" className="hover:text-gold-300 transition-colors">Global Prayer Wall</Link></li>
                                <li><Link href="/saints" className="hover:text-gold-300 transition-colors">Saints &amp; Feasts</Link></li>
                                <li><Link href="/churches" className="hover:text-gold-300 transition-colors">Find a Parish</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-gold-300 mb-5 uppercase text-xs tracking-[0.2em]">Sacred Offerings</h4>
                            <ul className="space-y-2.5 text-sm text-[#CFC5B4]">
                                <li><Link href="/candles" className="hover:text-gold-300 transition-colors">Light a Virtual Candle</Link></li>
                                <li><Link href="/mass-offerings" className="hover:text-gold-300 transition-colors">Request a Holy Mass</Link></li>
                                <li><Link href="/events" className="hover:text-gold-300 transition-colors text-gold-300 font-semibold">Sponsor Prayer Events</Link></li>
                                <li><Link href="/memorials" className="hover:text-gold-300 transition-colors">Eternal Memorials</Link></li>
                                <li><Link href="/bouquets" className="hover:text-gold-300 transition-colors">Spiritual Bouquets</Link></li>
                                <li><Link href="/blessings" className="hover:text-gold-300 transition-colors">Occasion Blessings</Link></li>
                                <li><Link href="/donate" className="hover:text-gold-300 transition-colors">Support Ministry</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-gold-300 mb-5 uppercase text-xs tracking-[0.2em]">Carry Grace</h4>
                            <div className="flex flex-col gap-3">
                                <AppStoreButton store="google" />
                                <AppStoreButton store="telegram" />
                            </div>
                            <ul className="mt-5 space-y-2 text-xs text-[#CFC5B4]/80">
                                <li><Link href="/about" className="hover:text-gold-300 transition-colors">About Mission</Link></li>
                                <li><Link href="/contact" className="hover:text-gold-300 transition-colors">Contact Support</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-14 pt-7 border-t border-gold-500/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#CFC5B4]/75">
                        <p>© {currentYear} MyPrayerTower · Catholic Digital Sanctuary. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <LanguageSwitcher id="google_translate_footer" variant="footer" />
                            <div className="flex gap-5 uppercase tracking-wider text-[11px]">
                                <Link href="/privacy" className="hover:text-gold-300 transition-colors">Privacy</Link>
                                <Link href="/terms" className="hover:text-gold-300 transition-colors">Terms</Link>
                                <Link href="/cookies" className="hover:text-gold-300 transition-colors">Cookies</Link>
                                <Link href="/guidelines" className="hover:text-gold-300 transition-colors">Guidelines</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <footer className={`lg:hidden bg-[#120E0A] px-4 py-12 border-t border-gold-500/20 pb-32 ${appModeCtx.isNativeApp ? 'hidden' : ''}`}>
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
                        <img src="/icon.png" alt="MyPrayerTower" className="w-9 h-9 rounded-xl border border-gold-500/40" />
                        <span className="font-display font-bold text-lg text-[#FAF6EE]">MyPrayerTower</span>
                    </Link>
                    <p className="font-serif italic text-[#CFC5B4] text-sm">Your digital Catholic sanctuary for global prayer.</p>
                </div>
                <NewsletterForm />
                <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                    {socialLinks.map((s) => (
                        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-[#18120D] border border-gold-500/25 rounded-xl hover:border-gold-400 text-[#CFC5B4] transition-all" aria-label={s.label}>
                            <s.icon className="w-4 h-4" />
                        </a>
                    ))}
                </div>
                <div className="mt-6 flex flex-col items-center gap-3">
                    <AppStoreButton store="google" />
                    <AppStoreButton store="telegram" />
                    <LanguageSwitcher id="google_translate_mobile_footer" variant="footer" />
                </div>
                <div className="mt-8 flex justify-center gap-4 text-[11px] text-[#CFC5B4]/80 uppercase tracking-wider">
                    <Link href="/privacy" className="hover:text-gold-300">Privacy</Link>
                    <Link href="/terms" className="hover:text-gold-300">Terms</Link>
                    <Link href="/cookies" className="hover:text-gold-300">Cookies</Link>
                </div>
                <div className="mt-8 text-center text-[11px] text-[#CFC5B4]/60 uppercase tracking-widest leading-relaxed">
                    <p>✠ May peace remain with you. ✠</p>
                    <p className="mt-2">© {currentYear} MyPrayerTower</p>
                </div>
            </footer>

            <MobileBottomNav />
        </>
    );
}

export default Footer;
