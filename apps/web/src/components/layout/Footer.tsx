'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Youtube, Heart, Church, Star, Mail, Home, User, Check, Loader2, Apple, PlayCircle, Smartphone, Gift } from 'lucide-react';

import { TwitterIcon, InstagramIcon, ThreadsIcon, PinterestIcon } from '@/components/common/SocialIcons';

// App Store Button Component
function AppStoreButton({ store }: { store: 'apple' | 'google' }) {
    return (
        <a href="#" className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all px-4 py-2.5 rounded-xl group w-full sm:w-auto">
            {store === 'apple' ? (
                <Apple className="w-8 h-8 text-white fill-current" />
            ) : (
                <Smartphone className="w-8 h-8 text-white" />
            )}
            <span className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Download on the</span>
                <span className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">
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
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
            <h4 className="text-white font-serif font-bold mb-2">Join our Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Daily readings, prayer updates, and community news.</p>
            <form onSubmit={handleSubmit} className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-medium text-xs rounded-lg transition-all disabled:opacity-70 flex items-center gap-2"
                >
                    {status === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : status === 'success' ? <Check className="w-3 h-3" /> : 'Subscribe'}
                </button>
            </form>
            {status === 'success' && <p className="text-green-400 text-xs mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> Subscribed successfully!</p>}
            {status === 'error' && <p className="text-red-400 text-xs mt-2">Failed to subscribe. Please try again.</p>}
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

    const isActive = (path: string) => path === '/' ? pathname === '/' : pathname?.startsWith(path);

    return (
        <>
            <footer className="bg-[#0B1120] text-gray-300 pb-24 md:pb-0 font-sans border-t border-gray-800 relative overflow-hidden" suppressHydrationWarning>
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-50"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

                {/* Desktop Footer Content */}
                <div className="hidden lg:block">
                    <div className="container mx-auto px-4 py-16 relative z-10">
                        <div className="grid grid-cols-12 gap-12">
                            {/* Brand Column (4 cols) */}
                            <div className="col-span-4 space-y-8">
                                <Link href="/" className="inline-flex items-center gap-3 group">
                                    <span className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-900/20 group-hover:scale-105 transition-transform">
                                        <span className="text-white font-serif font-bold text-xl">M</span>
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="text-xl font-serif font-bold text-white block leading-none mb-1 group-hover:text-gold-400 transition-colors">MyPrayerTower</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Catholic Services</span>
                                    </span>
                                </Link>

                                <p className="text-gray-400 leading-relaxed">
                                    Your digital sanctuary for prayer, community, and finding local Catholic parishes. Join thousands of faithful members worldwide.
                                </p>

                                <div className="flex gap-3">
                                    {socialLinks.map((s) => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 flex items-center justify-center bg-gray-800/50 hover:bg-gold-500 hover:text-white rounded-full transition-all border border-gray-800 hover:border-gold-500 group"
                                            title={s.label}
                                        >
                                            <s.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Links Column (2 cols) */}
                            <div className="col-span-2">
                                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                    Platform
                                </h3>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li><Link href="/churches" className="hover:text-gold-400 transition-colors flex items-center gap-2">Church Finder</Link></li>
                                    <li><Link href="/prayer-wall" className="hover:text-gold-400 transition-colors flex items-center gap-2">Prayer Wall</Link></li>
                                    <li><Link href="/prayers" className="hover:text-gold-400 transition-colors flex items-center gap-2">Prayer Library</Link></li>
                                    <li><Link href="/saints" className="hover:text-gold-400 transition-colors flex items-center gap-2">Daily Saints</Link></li>
                                    <li><Link href="/readings" className="hover:text-gold-400 transition-colors flex items-center gap-2">Readings</Link></li>
                                </ul>
                            </div>

                            {/* Links Column (2 cols) */}
                            <div className="col-span-2">
                                <h3 className="font-bold text-white mb-6">Company</h3>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li><Link href="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
                                    <li><Link href="/contact" className="hover:text-gold-400 transition-colors">Contact</Link></li>
                                    <li><Link href="/donate" className="hover:text-gold-400 transition-colors">Donate</Link></li>
                                    <li><Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link></li>
                                </ul>
                            </div>

                            {/* Newsletter & App Column (4 cols) */}
                            <div className="col-span-4 space-y-8">
                                <NewsletterForm />

                                <div>
                                    <h5 className="text-white text-sm font-semibold mb-4">Get the App</h5>
                                    <div className="flex gap-3 flex-wrap">
                                        <AppStoreButton store="apple" />
                                        <AppStoreButton store="google" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800/50 bg-black/20">
                        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-xs text-gray-500">
                                © {currentYear} MyPrayerTower. All rights reserved. •
                                <span className="mx-2 text-gray-700">Ad Majorem Dei Gloriam</span>
                            </p>
                            <div className="flex gap-6 text-xs text-gray-600 font-medium">
                                <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
                                <span className="text-gray-800">•</span>
                                <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
                                <span className="text-gray-800">•</span>
                                <Link href="/sitemap" className="hover:text-gray-400 transition-colors">Sitemap</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Footer */}
                <div className="lg:hidden">
                    <div className="container mx-auto px-4 py-10 relative z-10">
                        <div className="text-center mb-8">
                            <Link href="/" className="inline-flex items-center gap-2 mb-4">
                                <span className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-serif font-bold">M</span>
                                </span>
                                <span className="text-white font-serif font-bold text-xl">MyPrayerTower</span>
                            </Link>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                Join our community of prayer and faith.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10 border-t border-gray-800/50 pt-8">
                            <div>
                                <h3 className="font-bold text-white mb-4 text-sm">Features</h3>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    <li><Link href="/churches">Church Finder</Link></li>
                                    <li><Link href="/prayer-wall">Prayer Wall</Link></li>
                                    <li><Link href="/saints">Daily Saints</Link></li>
                                    <li><Link href="/readings">Readings</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-4 text-sm">Support</h3>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    <li><Link href="/about">About Us</Link></li>
                                    <li><Link href="/contact">Contact</Link></li>
                                    <li><Link href="/privacy">Privacy</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mb-10">
                            <NewsletterForm />
                        </div>

                        <div className="flex flex-col items-center gap-6 border-t border-gray-800 pt-8">
                            <div className="flex flex-wrap justify-center gap-3">
                                {socialLinks.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full text-gray-400 hover:text-white"
                                    >
                                        <s.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                            <p className="text-xs text-gray-600">© {currentYear} MyPrayerTower</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-xl pb-safe">
                <div className="flex items-center justify-around py-3">
                    {mobileNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-colors ${isActive(item.href) ? 'text-blue-600 dark:text-gold-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <item.icon className="w-5 h-5" strokeWidth={isActive(item.href) ? 2.5 : 2} />
                            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}
