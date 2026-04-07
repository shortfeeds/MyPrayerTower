'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
    Menu, X, Building, Heart, BookOpen, User, Star, Search,
    ChevronDown, Sparkles, Book, Calendar, Facebook, Youtube,
    Moon, Sun, Compass, MapPin, Users, Home, LogOut, Settings,
    Flame, Gift, CreditCard
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { TwitterIcon, InstagramIcon, ThreadsIcon, PinterestIcon } from '@/components/common/SocialIcons';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { MegaMenu, PRAY_MENU, OFFER_MENU, LEARN_MENU } from './MegaMenu';
import { useAppMode } from '@/contexts/AppModeContext';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [prayOpen, setPrayOpen] = useState(false);
    const [offerOpen, setOfferOpen] = useState(false);
    const [learnOpen, setLearnOpen] = useState(false);
    const [locateOpen, setLocateOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Refs
    const prayRef = useRef<HTMLDivElement>(null);
    const offerRef = useRef<HTMLDivElement>(null);
    const learnRef = useRef<HTMLDivElement>(null);
    const locateRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { isAuthenticated, user, signOut } = useAuth();
    const appModeCtx = useAppMode();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only handle click-outside for desktop megamenus
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
            if (locateRef.current && !locateRef.current.contains(event.target as Node)) {
                setLocateOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
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

    // ===== MASTER PLAN NAVIGATION =====

    // 1. PRAY (Core Action)
    const prayLinks = PRAY_MENU.columns.flatMap(col => col.items);
    const offerLinks = OFFER_MENU.columns.flatMap(col => col.items);
    const learnLinks = LEARN_MENU.columns.flatMap(col => col.items);

    // 5. MY PRAYER CORNER (User) - Handled separately via auth check

    const isActive = (path: string) => pathname?.startsWith(path);
    return (
        <>
            {(mounted && appModeCtx.isNativeApp) ? (
                // --- NATIVE APP MODE TOP BAR ---
                <header className="fixed top-0 left-0 right-0 z-50 bg-sacred-950 text-white shadow-xl pt-safe select-none">
                    {/* Global Google Translate Element (Hidden) */}
                    <div id="google_translate_element" className="hidden absolute" />

                    <div className="flex items-center justify-between w-full px-4 h-full">
                        {/* Logo */}
                        <Link href={appModeCtx.isNativeApp ? "/app" : "/"} className="flex items-center gap-2 group focus:outline-none" aria-label="MyPrayerTower Home">
                            <div className="w-8 h-8 rounded-lg overflow-hidden relative">
                                <Image
                                    src="/icon.png"
                                    alt="MyPrayerTower Logo"
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                />
                            </div>
                            <span className="font-serif font-bold text-lg leading-tight text-white">
                                MyPrayerTower
                            </span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <LanguageSwitcher id="google_translate_mobile_app" />
                            <button
                                className="text-white hover:text-gold-400 transition-colors focus:outline-none"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </header>
            ) : (
                // --- STANDARD WEB HEADER ---
                <header
                    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${mounted && scrolled
                        ? 'bg-sacred-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 py-2'
                        : 'bg-sacred-900/95 backdrop-blur-xl shadow-xl shadow-black/10 py-3'
                        }`}
                >
                    {/* Global Google Translate Element (Hidden) */}
                    <div id="google_translate_element" className="hidden absolute" />

                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-xl" aria-label="MyPrayerTower Home">
                                <div className="w-10 h-10 rounded-xl overflow-hidden transition-all duration-500 transform group-hover:scale-110 relative">
                                    <Image
                                        src="/icon.png"
                                        alt="MyPrayerTower Logo"
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-serif font-bold text-lg leading-tight text-white">
                                        MyPrayerTower
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider font-medium text-gray-300">
                                        Catholic Services
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Nav - Clean & Professional */}
                            <nav className="hidden lg:flex items-center gap-1 p-1.5 bg-black/40 backdrop-blur-md rounded-full">
                                {/* 1. PRAY */}
                                <div className="relative" ref={prayRef}>
                                    <button
                                        onClick={() => { setPrayOpen(!prayOpen); setOfferOpen(false); setLearnOpen(false); }}
                                        aria-expanded={prayOpen}
                                        aria-haspopup="true"
                                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none ${prayOpen
                                            ? 'bg-liturgy text-white shadow-lg glow-liturgy'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-liturgy'
                                            }`}
                                    >
                                        <Sparkles className={`w-3.5 h-3.5 ${prayOpen ? 'text-white' : 'text-gray-400 group-hover:text-liturgy'}`} />
                                        Pray
                                        <ChevronDown className={`w-3 h-3 transition-transform opacity-50 ${prayOpen ? 'rotate-180 opacity-100' : ''}`} />
                                    </button>
                                </div>

                                {/* 2. OFFER */}
                                <div className="relative" ref={offerRef}>
                                    <button
                                        onClick={() => { setOfferOpen(!offerOpen); setPrayOpen(false); setLearnOpen(false); }}
                                        aria-expanded={offerOpen}
                                        aria-haspopup="true"
                                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none ${offerOpen
                                            ? 'bg-amber-600 text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${offerOpen ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                        Offer
                                        <ChevronDown className={`w-3 h-3 transition-transform opacity-50 ${offerOpen ? 'rotate-180 opacity-100' : ''}`} />
                                    </button>
                                </div>

                                {/* 3. LEARN */}
                                <div className="relative" ref={learnRef}>
                                    <button
                                        onClick={() => { setLearnOpen(!learnOpen); setPrayOpen(false); setOfferOpen(false); }}
                                        aria-expanded={learnOpen}
                                        aria-haspopup="true"
                                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none ${learnOpen
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <BookOpen className={`w-3.5 h-3.5 ${learnOpen ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                        Learn
                                        <ChevronDown className={`w-3 h-3 transition-transform opacity-50 ${learnOpen ? 'rotate-180 opacity-100' : ''}`} />
                                    </button>
                                </div>
                            </nav>

                            {isAuthenticated && (
                                <Link
                                    href="/journey"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none ${isActive('/journey')
                                        ? 'bg-white text-sacred-900 shadow-md'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <Compass className={`w-4 h-4 ${isActive('/journey') ? 'text-gold-600' : ''}`} />
                                    My Prayer Corner
                                </Link>
                            )}

                            {/* Right Actions */}
                            <div className="hidden lg:flex items-center gap-3">
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 focus:outline-none"
                                    aria-label="Search"
                                >
                                    <Search className="w-5 h-5" />
                                    <span className="hidden xl:inline text-xs bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-gray-400">⌘K</span>
                                </button>

                                {/* Language Switcher */}
                                <LanguageSwitcher id="google_translate_desktop" />

                                {isAuthenticated ? (
                                    /* Authenticated User Menu */
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/journey"
                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span className="text-sm font-medium">My Sanctuary</span>
                                        </Link>
                                    </div>
                                ) : (
                                    /* Guest Actions */
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href="/login"
                                            className="px-5 py-2 text-sm font-medium text-white border border-white/30 hover:bg-white/10 hover:border-white/50 rounded-full transition-all focus:outline-none"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="px-5 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white text-sm font-bold rounded-full shadow-lg hover:shadow-gold-500/30 transition-all transform hover:-translate-y-0.5 focus:outline-none"
                                        >
                                            Join
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden p-2 text-white rounded-xl hover:bg-white/10 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Desktop Mega Menus - Positioned relative to the whole header for perfect centering */}
                    <div className="hidden lg:block absolute left-0 bottom-0 w-full">
                        <MegaMenu config={PRAY_MENU} isOpen={prayOpen} onClose={() => setPrayOpen(false)} />
                        <MegaMenu config={OFFER_MENU} isOpen={offerOpen} onClose={() => setOfferOpen(false)} />
                        <MegaMenu config={LEARN_MENU} isOpen={learnOpen} onClose={() => setLearnOpen(false)} />
                    </div>
                </header >
            )}

            {/* Mobile Menu Overlay */}
            {
                isMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                )
            }

            {/* Mobile Menu Panel */}
            <div className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
                    <Link href="/" className="flex items-center gap-2 focus:outline-none" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-serif font-bold">M</span>
                        </div>
                        <span className="font-serif font-bold text-gray-900 dark:text-white">MyPrayerTower</span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="overflow-y-auto h-[calc(100vh-80px)] pb-safe p-4">
                    <nav className="flex flex-col gap-1">
                        {/* Primary CTA for Guests */}
                        {!isAuthenticated && (
                            <Link
                                href="/register"
                                className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-center font-bold rounded-xl shadow-lg mb-4"
                            >
                                Begin Your Journey
                            </Link>
                        )}

                        {/* Authenticated User Dashboard Link */}
                        {isAuthenticated && (
                            <Link
                                href="/journey"
                                className="flex items-center gap-3 px-4 py-3.5 bg-sacred-50 dark:bg-sacred-900/20 text-sacred-700 dark:text-sacred-300 rounded-xl font-semibold mb-2 focus:outline-none"
                            >
                                <div className="p-2 rounded-lg bg-sacred-100 dark:bg-sacred-800 text-sacred-600">
                                    <Home className="w-5 h-5" />
                                </div>
                                </Link>
                        )}

                        <p className="px-4 text-xs uppercase tracking-wider text-gray-400 mb-2 mt-4 text-balance">Explore Series</p>


                        {/* 1. PRAY */}
                        <div className="rounded-xl overflow-hidden">
                            <button
                                onClick={() => setPrayOpen(!prayOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${prayOpen
                                    ? 'bg-sacred-50 dark:bg-sacred-900/20 text-sacred-700 dark:text-sacred-300 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${prayOpen ? 'bg-sacred-100 text-sacred-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    Pray
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform ${prayOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {prayOpen && (
                                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
                                    {prayLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <div>{link.label}</div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. OFFER */}
                        <div className="rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOfferOpen(!offerOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${offerOpen
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${offerOpen ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    Offer
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform ${offerOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {offerOpen && (
                                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
                                    {offerLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <div>{link.label}</div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. LEARN */}
                        <div className="rounded-xl overflow-hidden">
                            <button
                                onClick={() => setLearnOpen(!learnOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${learnOpen
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${learnOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    Learn
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform ${learnOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {learnOpen && (
                                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
                                    {learnLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <div>{link.label}</div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

                        {/* Auth Buttons */}
                        {!isAuthenticated ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-center mb-2">
                                    <LanguageSwitcher id="google_translate_mobile" />
                                </div>
                                <Link
                                    href="/login"
                                    className="w-full py-3.5 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium border border-gray-200 dark:border-gray-700"
                                >
                                    Sign In
                                </Link>
                            </div>
                        ) : (
                            <button
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                                onClick={async () => {
                                    await signOut();
                                    setIsMenuOpen(false);
                                }}
                            >
                                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                Sign Out
                            </button>
                        )}

                        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

                        {/* Social Links */}
                        <div className="px-2 pb-6">
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Follow Us</p>
                            <div className="flex flex-wrap gap-2">
                                <a href="https://www.facebook.com/myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1877f2] text-white rounded-lg hover:opacity-90 transition-opacity"><Facebook className="w-5 h-5" /></a>
                                <a href="https://www.youtube.com/@myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#ff0000] text-white rounded-lg hover:opacity-90 transition-opacity"><Youtube className="w-5 h-5" /></a>
                                <a href="https://twitter.com/MyPrayerTower" target="_blank" rel="noopener noreferrer" className="p-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"><TwitterIcon className="w-5 h-5" /></a>
                                <a href="https://www.instagram.com/myprayertower/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition-opacity"><InstagramIcon className="w-5 h-5" /></a>
                                <a href="https://www.threads.net/@myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"><ThreadsIcon className="w-5 h-5" /></a>
                                <a href="https://www.pinterest.com/myprayertower/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#E60023] text-white rounded-lg hover:opacity-90 transition-opacity"><PinterestIcon className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </nav>
                </div>
            </div >

            {/* Global Search Modal */}
            < GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)
            } />
        </>
    );
}
