'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Youtube, Heart, Church, Star, Mail, Home, User, Check, Loader2, Apple, Smartphone, Gift } from 'lucide-react';
import { TwitterIcon, InstagramIcon, ThreadsIcon, PinterestIcon } from '@/components/common/SocialIcons';

// App Store Button Component
function AppStoreButton({ store }: { store: 'apple' | 'google' }) {
    return (
        <a href="#" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-2 rounded-lg group">
            {store === 'apple' ? (
                <Apple className="w-6 h-6 text-white fill-current" />
            ) : (
                <Smartphone className="w-6 h-6 text-white" />
            )}
            <span className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-gray-400 uppercase">Get on</span>
                <span className="text-xs font-bold text-white">
                    {store === 'apple' ? 'App Store' : 'Google Play'}
                </span>
            </span>
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
            <h4 className="text-white font-bold text-sm mb-2">Newsletter</h4>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
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
    const [currentYear, setCurrentYear] = React.useState(2026);
    const pathname = usePathname();

    React.useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/MyPrayerTower2' },
        { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/c/MyPrayerTower' },
        { icon: TwitterIcon, label: 'X', href: 'https://twitter.com/MyPrayerTower' },
        { icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/myprayertower/' },
        { icon: ThreadsIcon, label: 'Threads', href: 'https://www.threads.net/@myprayertower' },
        { icon: PinterestIcon, label: 'Pinterest', href: 'https://www.pinterest.com/myprayertower/' },
    ];

    const mobileNavItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/churches', label: 'Churches', icon: Church },
        { href: '/prayer-wall', label: 'Prayers', icon: Heart },
        { href: '/saints', label: 'Saints', icon: Star },
        { href: '/mass-offerings', label: 'Mass Offering', icon: Gift },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Desktop Footer - Compact Single Row */}
            <footer className="hidden lg:block bg-gradient-to-b from-gray-900 to-black text-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-30" />
                </div>

                <div className="container mx-auto px-4 py-10 relative z-10">
                    <div className="flex flex-wrap items-start justify-between gap-8">
                        {/* Brand */}
                        <div className="w-56">
                            <Link href="/" className="inline-flex items-center gap-2 mb-3">
                                <span className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-serif font-bold">M</span>
                                </span>
                                <span className="font-serif font-bold text-white">MyPrayerTower</span>
                            </Link>
                            <p className="text-gray-400 text-xs mb-3">Your digital sanctuary for prayer and faith.</p>
                            <div className="flex gap-1.5">
                                {socialLinks.map((s) => (
                                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gold-500 rounded-full transition-colors" title={s.label}>
                                        <s.icon className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link Columns - All in one row */}
                        {/* Link Columns - All in one row */}
                        <div className="flex gap-8 text-xs">
                            <div>
                                <h4 className="font-semibold text-white mb-2">Spiritual Growth</h4>
                                <ul className="space-y-1 text-gray-400">
                                    <li><Link href="/journey" className="hover:text-gold-400 text-gold-200">My Journey</Link></li>
                                    <li><Link href="/challenges" className="hover:text-gold-400">Challenges</Link></li>
                                    <li><Link href="/readings" className="hover:text-gold-400">Bible Readings</Link></li>
                                    <li><Link href="/examen" className="hover:text-gold-400">Daily Examen</Link></li>
                                    <li><Link href="/saints" className="hover:text-gold-400">Saints</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Community</h4>
                                <ul className="space-y-1 text-gray-400">
                                    <li><Link href="/sessions" className="hover:text-gold-400 text-gold-200">Live Sessions</Link></li>
                                    <li><Link href="/prayer-wall" className="hover:text-gold-400">Prayer Wall</Link></li>
                                    <li><Link href="/partners" className="hover:text-gold-400">Partners</Link></li>
                                    <li><Link href="/candles" className="hover:text-gold-400">Candles</Link></li>
                                    <li><Link href="/leaderboard" className="hover:text-gold-400">Leaderboard</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Resources</h4>
                                <ul className="space-y-1 text-gray-400">
                                    <li><Link href="/churches" className="hover:text-gold-400">Find Churches</Link></li>
                                    <li><Link href="/prayers" className="hover:text-gold-400">Common Prayers</Link></li>
                                    <li><Link href="/wallpapers" className="hover:text-gold-400">Wallpapers</Link></li>
                                    <li><Link href="/bouquets" className="hover:text-gold-400">Spiritual Bouquets</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Support</h4>
                                <ul className="space-y-1 text-gray-400">
                                    <li><Link href="/mass-offerings" className="hover:text-gold-400">Mass Offerings</Link></li>
                                    <li><Link href="/donate" className="hover:text-gold-400">Donate</Link></li>
                                    <li><Link href="/about" className="hover:text-gold-400">About Us</Link></li>
                                    <li><Link href="/contact" className="hover:text-gold-400">Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-2">Legal</h4>
                                <ul className="space-y-1 text-gray-400">
                                    <li><Link href="/privacy" className="hover:text-gold-400">Privacy</Link></li>
                                    <li><Link href="/terms" className="hover:text-gold-400">Terms</Link></li>
                                    <li><Link href="/refunds" className="hover:text-gold-400">Refunds</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* Newsletter & Apps */}
                        <div className="w-64">
                            <NewsletterForm />
                            <div className="mt-3 flex gap-2">
                                <AppStoreButton store="apple" />
                                <AppStoreButton store="google" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 bg-black/30">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center text-xs text-gray-500">
                        <p>© {currentYear} MyPrayerTower. All rights reserved. <span className="text-gray-600 ml-2">AMDG</span></p>
                        <div className="flex gap-3">
                            <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
                            <Link href="/terms" className="hover:text-gray-400">Terms</Link>
                            <Link href="/refunds" className="hover:text-gray-400">Refunds</Link>
                            <Link href="/sitemap" className="hover:text-gray-400">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Mobile Footer */}
            <footer className="lg:hidden bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-2 mb-3">
                            <span className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-serif font-bold">M</span>
                            </span>
                            <span className="text-white font-serif font-bold">MyPrayerTower</span>
                        </Link>
                        <p className="text-gray-500 text-sm">Your digital sanctuary for prayer.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <h4 className="font-semibold text-white mb-2">Features</h4>
                            <ul className="space-y-1 text-gray-400">
                                <li><Link href="/churches" className="hover:text-gold-400">Churches</Link></li>
                                <li><Link href="/prayer-wall" className="hover:text-gold-400">Prayer Wall</Link></li>
                                <li><Link href="/candles" className="hover:text-gold-400">Candles</Link></li>
                                <li><Link href="/challenges" className="hover:text-gold-400">Challenges</Link></li>
                                <li><Link href="/examen" className="hover:text-gold-400">Examen</Link></li>
                                <li><Link href="/partners" className="hover:text-gold-400">Partners</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-2">More</h4>
                            <ul className="space-y-1 text-gray-400">
                                <li><Link href="/saints" className="hover:text-gold-400">Saints</Link></li>
                                <li><Link href="/readings" className="hover:text-gold-400">Readings</Link></li>
                                <li><Link href="/leaderboard" className="hover:text-gold-400">Leaderboard</Link></li>
                                <li><Link href="/mass-offerings" className="hover:text-gold-400">Mass Offerings</Link></li>
                                <li><Link href="/about" className="hover:text-gold-400">About</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-6">
                        <NewsletterForm />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-6 border-t border-gray-800 pt-6">
                        {socialLinks.map((s) => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full text-gray-400 hover:text-white">
                                <s.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-4">© {currentYear} MyPrayerTower</p>
                </div>
            </footer>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-xl pb-safe">
                <div className="flex items-center justify-around py-3">
                    {mobileNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-colors ${isActive(item.href) ? 'text-blue-600 dark:text-gold-400' : 'text-gray-400'}`}
                        >
                            <item.icon className="w-5 h-5" strokeWidth={isActive(item.href) ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}
