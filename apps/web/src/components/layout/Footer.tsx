'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Youtube, Heart, Church, Star, Mail, Home, User, Check, Loader2, Apple, Smartphone, Gift, Flame } from 'lucide-react';
import { TwitterIcon, InstagramIcon, ThreadsIcon, PinterestIcon } from '@/components/common/SocialIcons';
import { UniversalOfferingModal } from '@/components/offerings/UniversalOfferingModal';

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
    const [showOfferings, setShowOfferings] = useState(false);

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
        { href: '/memorials', label: 'Chapels', icon: Heart },
        { href: '/churches', label: 'Sacred Spaces', icon: Church },
        { href: '/prayers', label: 'Prayers', icon: Star },
        { href: '#offerings', label: 'Offerings', icon: Gift, isAction: true },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Desktop Footer - Professional Grid Layout */}
            <footer className="hidden lg:block bg-gradient-to-b from-gray-950 to-black text-gray-300 relative overflow-hidden font-sans border-t border-gray-900">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-30" />
                </div>

                <div className="container mx-auto px-6 py-16 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {/* 1. Brand Identity */}
                        <div className="col-span-2 md:col-span-4 lg:col-span-2 pr-4">
                            <Link href="/" className="inline-flex items-center gap-3 mb-6">
                                <span className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                                    <span className="text-white font-serif font-bold text-lg">M</span>
                                </span>
                                <span className="font-serif font-bold text-xl text-white tracking-tight">MyPrayerTower</span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                                Your digital sanctuary for prayer, community, and spiritual growth. Join us in building a global network of faith.
                            </p>
                            <div className="flex gap-2">
                                {socialLinks.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-lg hover:border-gold-500 hover:text-gold-400 transition-all duration-300"
                                        title={s.label}
                                    >
                                        <s.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* 2. PRAY */}
                        <div className="col-span-1">
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-b border-gray-800/50 pb-2 inline-block">Pray</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/readings" className="hover:text-gold-400 transition-colors">Daily Readings</Link></li>
                                <li><Link href="/prayers/rosary" className="hover:text-gold-400 transition-colors">Holy Rosary</Link></li>
                                <li><Link href="/prayers" className="hover:text-gold-400 transition-colors">Prayer Library</Link></li>
                                <li><Link href="/prayer-wall" className="hover:text-gold-400 transition-colors">Prayer Wall</Link></li>
                                <li><Link href="/sessions" className="hover:text-gold-400 transition-colors">Live Sessions</Link></li>
                            </ul>
                        </div>

                        {/* 3. OFFER */}
                        <div className="col-span-1">
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-b border-gray-800/50 pb-2 inline-block">Offer</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/candles" className="hover:text-gold-400 transition-colors">Light a Candle</Link></li>
                                <li><Link href="/mass-offerings" className="hover:text-gold-400 transition-colors">Request Mass</Link></li>
                                <li><Link href="/memorials" className="hover:text-gold-400 transition-colors">Digital Chapels</Link></li>
                                <li><Link href="/bouquets" className="hover:text-gold-400 transition-colors">Spiritual Bouquets</Link></li>
                                <li><Link href="/donate" className="hover:text-gold-400 transition-colors">Donate</Link></li>
                            </ul>
                        </div>

                        {/* 4. DISCOVER (Learn & Locate Combined) */}
                        <div className="col-span-1">
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-b border-gray-800/50 pb-2 inline-block">Discover</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/bible" className="hover:text-gold-400 transition-colors">Bible (DuoBiblia)</Link></li>
                                <li><Link href="/saints" className="hover:text-gold-400 transition-colors">Saints</Link></li>
                                <li><Link href="/catechism" className="hover:text-gold-400 transition-colors">Catechism</Link></li>
                                <li className="pt-2"><Link href="/churches" className="hover:text-gold-400 transition-colors flex items-center gap-1"><Church className="w-3 h-3" /> Sacred Spaces</Link></li>
                                <li><Link href="/confession" className="hover:text-gold-400 transition-colors">Confession Finder</Link></li>
                            </ul>
                        </div>

                        {/* 5. COMPANY */}
                        <div className="col-span-1">
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-b border-gray-800/50 pb-2 inline-block">Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/about" className="hover:text-gold-400 transition-colors">About Mission</Link></li>
                                <li><Link href="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
                                <li><Link href="/partners" className="hover:text-gold-400 transition-colors">Partners</Link></li>
                                <li><Link href="/privacy" className="hover:text-gold-400 transition-colors text-gray-500">Privacy Policy</Link></li>
                            </ul>

                            <div className="mt-8 pt-4 border-t border-gray-800/50">
                                <h5 className="font-bold text-gray-500 mb-3 uppercase text-[10px] tracking-wider">Get the App</h5>
                                <div className="flex flex-col gap-2">
                                    <AppStoreButton store="apple" />
                                    <AppStoreButton store="google" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-900 bg-black">
                    <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-gold-500/70 italic text-[11px]">May peace remain with you.</p>
                            <p>© {currentYear} MyPrayerTower. All rights reserved.</p>
                        </div>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
                            <Link href="/sitemap" className="hover:text-gray-400 transition-colors">Sitemap</Link>
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
                                <li><Link href="/memorials" className="hover:text-gold-400">Memorials</Link></li>
                                <li><Link href="/challenges" className="hover:text-gold-400">Challenges</Link></li>
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

                    {/* Sacred UX: Closing Emotional Anchor */}
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 italic mt-8 mb-4 font-light">
                        May peace remain with you.
                    </p>

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
                            onClick={(e) => {
                                if ((item as any).isAction) {
                                    e.preventDefault();
                                    setShowOfferings(true);
                                }
                            }}
                            className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-colors ${isActive(item.href) ? 'text-blue-600 dark:text-gold-400' : 'text-gray-400'}`}
                        >
                            <item.icon className="w-5 h-5" strokeWidth={isActive(item.href) ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
            <UniversalOfferingModal isOpen={showOfferings} onClose={() => setShowOfferings(false)} />
        </>
    );
}
