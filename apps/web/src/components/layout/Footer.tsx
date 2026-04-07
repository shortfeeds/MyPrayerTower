'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Youtube, Heart, Church, Star, Mail, Home, User, Check, Loader2, Apple, Smartphone, Gift, Flame, Send } from 'lucide-react';
import { TwitterIcon, InstagramIcon, ThreadsIcon, PinterestIcon } from '@/components/common/SocialIcons';
import { UniversalOfferingModal } from '@/components/offerings/UniversalOfferingModal';
import { MobileBottomNav } from './MobileBottomNav';
import { useAppMode } from '@/contexts/AppModeContext';

// App Store Button Component
function AppStoreButton({ store }: { store: 'telegram' | 'google' }) {
    if (store === 'google') {
        return (
            <Link
                href="https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app"
                target="_blank"
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
            href="https://t.me/MyPrayerTowerBot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#229ED9] rounded-lg group hover:bg-[#1E8BC1] transition-all font-medium text-white shadow-lg active:scale-95"
        >
            <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                <Send className="w-4 h-4" />
            </div>
            <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[10px] opacity-70 font-normal">OPEN ON</span>
                <span className="text-sm font-bold tracking-tight">Telegram</span>
            </div>
        </a>
    );
}

// Newsletter Form Component
function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            setStatus(res.ok ? 'success' : 'error');
            if (res.ok) setEmail('');
        } catch {
            setStatus('error');
        }
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <h4 className="text-white font-bold text-sm mb-2">Spiritual Nourishment</h4>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Receive daily grace..."
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500"
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
        { icon: ThreadsIcon, label: 'Threads', href: 'https://www.threads.net/@myprayertower' },
        { icon: PinterestIcon, label: 'Pinterest', href: 'https://www.pinterest.com/myprayertower/' },
        { icon: Send, label: 'Telegram', href: 'https://t.me/MyPrayerTowerBot' },
    ];

    if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/church-dashboard') || pathname.startsWith('/bot'))) {
        return null;
    }

    return (
        <>
            <footer className={`hidden lg:block bg-gray-950 text-gray-400 border-t border-gray-900 pt-16 pb-8 ${appModeCtx.isNativeApp ? 'hidden' : ''}`}>
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                        <div className="col-span-2">
                            <Link href="/" className="inline-flex items-center gap-3 mb-6">
                                <span className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center font-bold text-white text-xl">M</span>
                                <span className="font-bold text-xl text-white">MyPrayerTower</span>
                            </Link>
                            <p className="text-sm leading-relaxed mb-6 max-w-sm italic">
                                "Where two or three are gathered in my name, there am I among them."
                            </p>
                            <div className="flex gap-2">
                                {socialLinks.map((s) => (
                                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-lg hover:border-gold-500 hover:text-gold-400 transition-all">
                                        <s.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Divine</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="/readings" className="hover:text-white transition-colors">Daily Readings</Link></li>
                                <li><Link href="/prayers/rosary" className="hover:text-white transition-colors">Holy Rosary</Link></li>
                                <li><Link href="/prayers" className="hover:text-white transition-colors">Prayer Library</Link></li>
                                <li><Link href="/candles" className="hover:text-white transition-colors">Virtual Candles</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Community</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="/churches" className="hover:text-white transition-colors">Find a Church</Link></li>
                                <li><Link href="/memorials" className="hover:text-white transition-colors text-gold-500">Eternal Memorials</Link></li>
                                <li><Link href="/about" className="hover:text-white transition-colors">About Mission</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Carry Grace</h4>
                            <div className="flex flex-col gap-3">
                                <AppStoreButton store="google" />
                                <AppStoreButton store="telegram" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 pt-8 border-t border-gray-900 flex justify-between items-center text-xs text-gray-600">
                        <p>© {currentYear} MyPrayerTower. All rights reserved.</p>
                        <div className="flex gap-6 uppercase tracking-tighter">
                            <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
                            <Link href="/terms" className="hover:text-gray-400">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <footer className={`lg:hidden bg-gray-950 px-4 py-12 border-t border-gray-900 pb-32 ${appModeCtx.isNativeApp ? 'hidden' : ''}`}>
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center font-bold text-white">M</span>
                        <span className="font-bold text-white">MyPrayerTower</span>
                    </Link>
                    <p className="text-gray-500 text-sm">Your digital sanctuary for global prayer.</p>
                </div>
                <NewsletterForm />
                <div className="mt-12 text-center text-[10px] text-gray-600 uppercase tracking-widest leading-relaxed">
                    <p>May peace remain with you.</p>
                    <p className="mt-2">© {currentYear} MyPrayerTower</p>
                </div>
            </footer>

            <MobileBottomNav />
        </>
    );
}

export default Footer;
