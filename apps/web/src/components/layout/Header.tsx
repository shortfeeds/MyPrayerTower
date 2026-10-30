'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
    Menu, X, Heart, BookOpen, User, Search,
    ChevronDown, Sparkles, LogOut, Compass, Send
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { TwitterIcon, InstagramIcon, ThreadsIcon, TikTokIcon } from '@/components/common/SocialIcons';
import { Facebook, Youtube } from 'lucide-react';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { MegaMenu, PRAY_MENU, OFFER_MENU, LEARN_MENU } from './MegaMenu';
import { useAppMode } from '@/contexts/AppModeContext';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [prayOpen, setPrayOpen] = useState(false);
    const [offerOpen, setOfferOpen] = useState(false);
    const [learnOpen, setLearnOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Refs
    const prayRef = useRef<HTMLDivElement>(null);
    const offerRef = useRef<HTMLDivElement>(null);
    const learnRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { isAuthenticated, signOut } = useAuth();
    const appModeCtx = useAppMode();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 8);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (window.innerWidth < 1024) return;

            if (prayRef.current && !prayRef.current.contains(event.target as Node)) {
                setPrayOpen(false);
            }
            if (offerRef.current && !offerRef.current.contains(event.target as Node)) {
                setOfferOpen(false);
            }
            if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
                setLearnOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close menus when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setPrayOpen(false);
        setOfferOpen(false);
        setLearnOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const prayLinks = PRAY_MENU.columns.flatMap(col => col.items);
    const offerLinks = OFFER_MENU.columns.flatMap(col => col.items);
    const learnLinks = LEARN_MENU.columns.flatMap(col => col.items);

    return (
        <>
            {(mounted && appModeCtx.isNativeApp) ? (
                // --- NATIVE APP MODE TOP BAR ---
                <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0612]/95 backdrop-blur-xl border-b border-white/[0.08] text-white shadow-xl pt-safe select-none h-14">
                    <div className="flex items-center justify-between w-full px-4 h-full">
                        {/* Logo */}
                        <Link href={appModeCtx.isNativeApp ? "/app" : "/"} className="flex items-center gap-2.5 focus:outline-none" aria-label="MyPrayerTower Home">
                            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gold-400/40">
                                <img
                                    src="/icon.png"
                                    alt="MyPrayerTower Logo"
                                    className="w-full h-full object-cover"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <span className="font-serif font-bold text-base leading-none text-white">
                                MyPrayerTower
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 text-white/70 hover:text-white transition-colors focus:outline-none"
                                aria-label="Search"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            <LanguageSwitcher id="google_translate_mobile_app" />
                            <button
                                className="p-2 text-white/80 hover:text-gold-400 transition-colors focus:outline-none"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </header>
            ) : (
                // --- CLEAN, TIDY WEB HEADER ---
                <header
                    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${mounted && scrolled
                        ? 'bg-[#0a0612]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/30'
                        : 'bg-[#0a0612]/85 backdrop-blur-md border-b border-white/[0.05]'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* 1. Left: Brand Logo */}
                            <Link
                                href="/"
                                className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-xl"
                                aria-label="MyPrayerTower Home"
                            >
                                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-gold-400/30 group-hover:ring-gold-400/60 shadow-sm transition-all duration-300 group-hover:scale-105">
                                    <img
                                        src="/icon.png"
                                        alt="MyPrayerTower Logo"
                                        className="w-full h-full object-cover"
                                        width={36}
                                        height={36}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-serif font-bold text-base md:text-lg leading-none tracking-tight text-white group-hover:text-gold-200 transition-colors">
                                        MyPrayerTower
                                    </span>
                                    <span className="text-[9px] uppercase tracking-widest font-semibold text-gold-400/70 mt-0.5">
                                        Catholic Services
                                    </span>
                                </div>
                            </Link>

                            {/* 2. Center: Sleek Unified Navigation Bar */}
                            <nav className="hidden lg:flex items-center gap-1 px-1.5 py-1 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-full shadow-inner">
                                {/* Pray Dropdown */}
                                <div className="relative" ref={prayRef}>
                                    <button
                                        onClick={() => { setPrayOpen(!prayOpen); setOfferOpen(false); setLearnOpen(false); }}
                                        aria-expanded={prayOpen}
                                        aria-haspopup="true"
                                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none ${prayOpen
                                            ? 'bg-gold-500/20 text-gold-200 border border-gold-500/40 shadow-sm'
                                            : 'text-white/75 hover:text-white hover:bg-white/[0.06] border border-transparent'
                                            }`}
                                    >
                                        <Sparkles className={`w-3.5 h-3.5 ${prayOpen ? 'text-gold-300' : 'text-gold-400/80'}`} />
                                        <span>Pray</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-60 ${prayOpen ? 'rotate-180 opacity-100 text-gold-300' : ''}`} />
                                    </button>
                                </div>

                                {/* Offer Dropdown */}
                                <div className="relative" ref={offerRef}>
                                    <button
                                        onClick={() => { setOfferOpen(!offerOpen); setPrayOpen(false); setLearnOpen(false); }}
                                        aria-expanded={offerOpen}
                                        aria-haspopup="true"
                                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none ${offerOpen
                                            ? 'bg-gold-500/20 text-gold-200 border border-gold-500/40 shadow-sm'
                                            : 'text-white/75 hover:text-white hover:bg-white/[0.06] border border-transparent'
                                            }`}
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${offerOpen ? 'text-gold-300' : 'text-gold-400/80'}`} />
                                        <span>Offer</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-60 ${offerOpen ? 'rotate-180 opacity-100 text-gold-300' : ''}`} />
                                    </button>
                                </div>

                                {/* Learn Dropdown */}
                                <div className="relative" ref={learnRef}>
                                    <button
                                        onClick={() => { setLearnOpen(!learnOpen); setPrayOpen(false); setOfferOpen(false); }}
                                        aria-expanded={learnOpen}
                                        aria-haspopup="true"
                                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none ${learnOpen
                                            ? 'bg-gold-500/20 text-gold-200 border border-gold-500/40 shadow-sm'
                                            : 'text-white/75 hover:text-white hover:bg-white/[0.06] border border-transparent'
                                            }`}
                                    >
                                        <BookOpen className={`w-3.5 h-3.5 ${learnOpen ? 'text-gold-300' : 'text-gold-400/80'}`} />
                                        <span>Learn</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-60 ${learnOpen ? 'rotate-180 opacity-100 text-gold-300' : ''}`} />
                                    </button>
                                </div>
                            </nav>

                            {/* 3. Right: Tidy Utilities & Actions */}
                            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5">
                                {/* Search trigger */}
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="h-8 px-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 text-xs focus:outline-none border border-transparent hover:border-white/10"
                                    aria-label="Search"
                                    title="Search (⌘K)"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span className="hidden xl:inline text-xs text-white/60">Search</span>
                                    <kbd className="hidden xl:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-white/60 font-mono">⌘K</kbd>
                                </button>

                                {/* Language Switcher */}
                                <LanguageSwitcher id="google_translate_desktop" />

                                {/* Divider */}
                                <div className="h-4 w-px bg-white/10 mx-0.5" />

                                {/* Support / Donate */}
                                <Link
                                    href="/donate"
                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 hover:text-gold-200 border border-gold-500/30 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-sm"
                                >
                                    <Heart className="w-3 h-3 fill-current text-gold-400" />
                                    <span>Support</span>
                                </Link>

                                {isAuthenticated ? (
                                    <div className="flex items-center gap-2">
                                        <NotificationCenter />
                                        <Link
                                            href="/journey"
                                            className="inline-flex items-center gap-1.5 h-8 px-3.5 bg-white/10 hover:bg-white/15 text-white rounded-full text-xs font-medium transition-colors"
                                        >
                                            <User className="w-3.5 h-3.5 text-gold-400" />
                                            <span>My Sanctuary</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="h-8 px-3 inline-flex items-center text-xs font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors focus:outline-none"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="h-8 px-3.5 inline-flex items-center bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-sacred-950 text-xs font-bold rounded-full shadow-sm hover:shadow-gold-500/20 active:scale-95 transition-all focus:outline-none"
                                        >
                                            Join
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Hamburger Button & Quick Actions */}
                            <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
                                <NotificationCenter />
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
                                    aria-label="Search"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    aria-label="Toggle menu"
                                >
                                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Mega Menus */}
                    <div className="hidden lg:block absolute left-0 bottom-0 w-full pointer-events-none">
                        <MegaMenu config={PRAY_MENU} isOpen={prayOpen} onClose={() => setPrayOpen(false)} />
                        <MegaMenu config={OFFER_MENU} isOpen={offerOpen} onClose={() => setOfferOpen(false)} />
                        <MegaMenu config={LEARN_MENU} isOpen={learnOpen} onClose={() => setLearnOpen(false)} />
                    </div>
                </header>
            )}

            {/* Mobile Menu Backdrop */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Slide-Out Panel (Dark Sacred Theme) */}
            <div
                className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#0c0817] text-white z-50 transform transition-transform duration-300 ease-in-out border-l border-white/10 shadow-2xl flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-2.5 focus:outline-none" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gold-400/40">
                            <img src="/icon.png" alt="MyPrayerTower Logo" className="w-full h-full object-cover" width={32} height={32} />
                        </div>
                        <span className="font-serif font-bold text-white text-base">MyPrayerTower</span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Primary CTA */}
                    {!isAuthenticated ? (
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="py-2.5 text-center text-xs font-semibold text-white/90 hover:text-white rounded-xl bg-white/[0.06] border border-white/10 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="py-2.5 text-center text-xs font-bold text-sacred-950 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 shadow-sm"
                            >
                                Join Free
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href="/journey"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-3 bg-gold-500/10 border border-gold-500/20 text-gold-300 rounded-xl font-semibold text-sm"
                        >
                            <div className="flex items-center gap-2.5">
                                <Compass className="w-4 h-4 text-gold-400" />
                                <span>My Sanctuary</span>
                            </div>
                            <span className="text-xs text-gold-400/70">View Corner →</span>
                        </Link>
                    )}

                    {/* Navigation Accordions */}
                    <div className="space-y-1">
                        <p className="px-2 text-[10px] uppercase tracking-widest text-gold-400/70 font-bold mb-2">Explore</p>

                        {/* Pray Accordion */}
                        <div className="rounded-xl overflow-hidden border border-white/[0.05] bg-white/[0.02]">
                            <button
                                onClick={() => setPrayOpen(!prayOpen)}
                                className={`w-full flex items-center justify-between px-3.5 py-3 transition-colors text-sm font-medium ${prayOpen ? 'text-gold-300 bg-white/[0.04]' : 'text-white/80 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Sparkles className="w-4 h-4 text-gold-400" />
                                    <span>Pray</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${prayOpen ? 'rotate-180 text-gold-300' : 'text-white/40'}`} />
                            </button>
                            {prayOpen && (
                                <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.05]">
                                    {prayLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                                        >
                                            <link.icon className="w-3.5 h-3.5 text-gold-400/80" />
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Offer Accordion */}
                        <div className="rounded-xl overflow-hidden border border-white/[0.05] bg-white/[0.02]">
                            <button
                                onClick={() => setOfferOpen(!offerOpen)}
                                className={`w-full flex items-center justify-between px-3.5 py-3 transition-colors text-sm font-medium ${offerOpen ? 'text-gold-300 bg-white/[0.04]' : 'text-white/80 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Heart className="w-4 h-4 text-gold-400" />
                                    <span>Offer</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${offerOpen ? 'rotate-180 text-gold-300' : 'text-white/40'}`} />
                            </button>
                            {offerOpen && (
                                <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.05]">
                                    {offerLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                                        >
                                            <link.icon className="w-3.5 h-3.5 text-gold-400/80" />
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Learn Accordion */}
                        <div className="rounded-xl overflow-hidden border border-white/[0.05] bg-white/[0.02]">
                            <button
                                onClick={() => setLearnOpen(!learnOpen)}
                                className={`w-full flex items-center justify-between px-3.5 py-3 transition-colors text-sm font-medium ${learnOpen ? 'text-gold-300 bg-white/[0.04]' : 'text-white/80 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <BookOpen className="w-4 h-4 text-gold-400" />
                                    <span>Learn</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${learnOpen ? 'rotate-180 text-gold-300' : 'text-white/40'}`} />
                            </button>
                            {learnOpen && (
                                <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.05]">
                                    {learnLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                                        >
                                            <link.icon className="w-3.5 h-3.5 text-gold-400/80" />
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Support Button */}
                    <Link
                        href="/donate"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        <Heart className="w-3.5 h-3.5 fill-current text-gold-400" />
                        <span>Support Our Sanctuary</span>
                    </Link>

                    {/* Language Switcher */}
                    <div>
                        <LanguageSwitcher id="google_translate_mobile" variant="pill" />
                    </div>

                    {/* Authenticated Sign Out */}
                    {isAuthenticated && (
                        <button
                            className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full"
                            onClick={async () => {
                                await signOut();
                                setIsMenuOpen(false);
                            }}
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    )}

                    {/* Social Channels */}
                    <div className="pt-2 border-t border-white/10">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Connect With Us</p>
                        <div className="flex flex-wrap gap-2">
                            <a href="https://t.me/myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors" aria-label="Telegram"><Send className="w-4 h-4" /></a>
                            <a href="https://www.facebook.com/myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
                            <a href="https://www.youtube.com/@myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors" aria-label="YouTube"><Youtube className="w-4 h-4" /></a>
                            <a href="https://twitter.com/MyPrayerTower" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors" aria-label="Twitter"><TwitterIcon className="w-4 h-4" /></a>
                            <a href="https://www.instagram.com/myprayertower/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors" aria-label="Instagram"><InstagramIcon className="w-4 h-4" /></a>
                            <a href="https://www.tiktok.com/@myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors" aria-label="TikTok"><TikTokIcon className="w-4 h-4" /></a>
                            <a href="https://www.threads.net/@myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors" aria-label="Threads"><ThreadsIcon className="w-4 h-4" /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Search Modal */}
            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}

export default Header;
