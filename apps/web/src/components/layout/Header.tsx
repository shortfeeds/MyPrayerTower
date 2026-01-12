'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
    Menu, X, Building2, Heart, BookOpen, User, Star, Search,
    ChevronDown, Sparkles, Book, Calendar, Facebook, Youtube,
    Moon, Sun, Compass, MapPin, Users, Home, LogOut, Settings,
    Flame, Gift, CreditCard
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { TwitterIcon, InstagramIcon, ThreadsIcon, PinterestIcon } from '@/components/common/SocialIcons';
import { GlobalSearch } from '@/components/search/GlobalSearch';



// Simulated auth hook - replace with your actual auth implementation
const useAuth = () => {
    // TODO: Replace with actual auth context/hook
    return { isAuthenticated: false, user: null };
};


export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [prayersOpen, setPrayersOpen] = useState(false);
    const [readingsOpen, setReadingsOpen] = useState(false);
    const [mobilePrayersOpen, setMobilePrayersOpen] = useState(false);
    const [mobileReadingsOpen, setMobileReadingsOpen] = useState(false);
    const [offeringsOpen, setOfferingsOpen] = useState(false);
    const [mobileOfferingsOpen, setMobileOfferingsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const prayersRef = useRef<HTMLDivElement>(null);
    const readingsRef = useRef<HTMLDivElement>(null);
    const offeringsRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { actualTheme, setTheme } = useTheme();
    const { isAuthenticated, user } = useAuth();

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
            if (prayersRef.current && !prayersRef.current.contains(event.target as Node)) {
                setPrayersOpen(false);
            }
            if (readingsRef.current && !readingsRef.current.contains(event.target as Node)) {
                setReadingsOpen(false);
            }
            if (offeringsRef.current && !offeringsRef.current.contains(event.target as Node)) {
                setOfferingsOpen(false);
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

    // ===== PUBLIC NAVIGATION (Available to all) =====
    const prayerLinks = [
        { href: '/prayers', label: 'Browse All Prayers', icon: Sparkles, description: 'Explore our prayer library' },
        { href: '/prayers/rosary', label: 'Pray the Rosary', icon: Heart, description: 'Guided rosary prayer' },
        { href: '/saints', label: 'Saints', icon: Star, description: 'Learn about the saints' },
    ];

    const readingsLinks = [
        { href: '/readings', label: "Today's Readings", icon: Calendar, description: 'Daily Mass readings' },
        { href: '/bible', label: 'Bible (DuoBiblia)', icon: Book, description: 'Latin-English parallel' },
        { href: '/bible/year', label: 'Bible Year Plan', icon: BookOpen, description: 'Read in a year' },
    ];

    const offeringsLinks = [
        { href: '/candles', label: 'Light a Candle', icon: Flame, description: 'Virtual prayer candles' },
        { href: '/mass-offerings', label: 'Mass Offerings', icon: Gift, description: 'Request a Holy Mass' },
        { href: '/bouquets', label: 'Spiritual Bouquet', icon: Heart, description: 'Send prayers as gifts' },
        { href: '/donate', label: 'Support Us', icon: CreditCard, description: 'Make a donation' },
    ];

    // ===== AUTHENTICATED NAVIGATION (Only for logged-in users) =====
    const authenticatedLinks = [
        { href: '/journey', label: 'My Journey', icon: Compass, description: 'Your spiritual dashboard' },
        { href: '/sessions', label: 'Live Sessions', icon: Users, description: 'Pray with community' },
    ];

    const isActive = (path: string) => pathname?.startsWith(path);
    const isPrayersActive = prayerLinks.some(link => pathname?.startsWith(link.href));
    const isReadingsActive = readingsLinks.some(link => pathname?.startsWith(link.href));
    const isOfferingsActive = offeringsLinks.some(link => pathname?.startsWith(link.href));
    const isHome = pathname === '/';

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${mounted && (scrolled || !isHome)
                    ? 'bg-sacred-800 dark:bg-gray-900 py-2 shadow-lg'
                    : 'bg-sacred-800/90 backdrop-blur-md py-4'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-gold-500/50 transition-all duration-300 transform group-hover:scale-105">
                                <img
                                    src="/icon.png"
                                    alt="MyPrayerTower"
                                    className="w-full h-full object-cover"
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

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            {/* Prayers Dropdown */}
                            <div className="relative" ref={prayersRef}>
                                <button
                                    onClick={() => { setPrayersOpen(!prayersOpen); setReadingsOpen(false); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isPrayersActive
                                        ? 'bg-white text-sacred-900 shadow-md'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <Sparkles className={`w-4 h-4 ${isPrayersActive ? 'text-gold-600' : ''}`} />
                                    Prayers
                                    <ChevronDown className={`w-3 h-3 transition-transform ${prayersOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {prayersOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up z-50">
                                        {prayerLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setPrayersOpen(false)}
                                                className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${isActive(link.href) ? 'bg-sacred-50' : ''
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${isActive(link.href) ? 'bg-sacred-100 text-sacred-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <link.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${isActive(link.href) ? 'text-sacred-700' : 'text-gray-900'}`}>
                                                        {link.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{link.description}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Readings Dropdown */}
                            <div className="relative" ref={readingsRef}>
                                <button
                                    onClick={() => { setReadingsOpen(!readingsOpen); setPrayersOpen(false); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isReadingsActive
                                        ? 'bg-white text-sacred-900 shadow-md'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <BookOpen className={`w-4 h-4 ${isReadingsActive ? 'text-gold-600' : ''}`} />
                                    Readings
                                    <ChevronDown className={`w-3 h-3 transition-transform ${readingsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {readingsOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up z-50">
                                        {readingsLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setReadingsOpen(false)}
                                                className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${isActive(link.href) ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${isActive(link.href) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <link.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${isActive(link.href) ? 'text-blue-700' : 'text-gray-900'}`}>
                                                        {link.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{link.description}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Churches - Direct Link */}
                            <Link
                                href="/churches"
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/churches')
                                    ? 'bg-white text-sacred-900 shadow-md'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                <Building2 className={`w-4 h-4 ${isActive('/churches') ? 'text-gold-600' : ''}`} />
                                Churches
                            </Link>

                            {/* Memorials - New Primary Feature */}
                            <Link
                                href="/memorials"
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/memorials')
                                    ? 'bg-white text-sacred-900 shadow-md'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${isActive('/memorials') ? 'text-gold-600' : ''}`} />
                                Memorials
                            </Link>

                            {/* My Journey - Only for authenticated users */}
                            {/* Offerings Dropdown */}
                            <div className="relative" ref={offeringsRef}>
                                <button
                                    onClick={() => { setOfferingsOpen(!offeringsOpen); setPrayersOpen(false); setReadingsOpen(false); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isOfferingsActive
                                        ? 'bg-white text-sacred-900 shadow-md'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${isOfferingsActive ? 'text-gold-600' : ''}`} />
                                    Offerings
                                    <ChevronDown className={`w-3 h-3 transition-transform ${offeringsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {offeringsOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up z-50">
                                        {offeringsLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setOfferingsOpen(false)}
                                                className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${isActive(link.href) ? 'bg-amber-50' : ''
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${isActive(link.href) ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <link.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${isActive(link.href) ? 'text-amber-700' : 'text-gray-900'}`}>
                                                        {link.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{link.description}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isAuthenticated && (
                                <Link
                                    href="/journey"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/journey')
                                        ? 'bg-white text-sacred-900 shadow-md'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <Compass className={`w-4 h-4 ${isActive('/journey') ? 'text-gold-600' : ''}`} />
                                    My Journey
                                </Link>
                            )}
                        </nav>



                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                                <span className="hidden xl:inline text-xs bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-gray-400">⌘K</span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {mounted && (actualTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
                            </button>

                            {isAuthenticated ? (
                                /* Authenticated User Menu */
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/journey"
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="text-sm font-medium">Dashboard</span>
                                    </Link>
                                </div>
                            ) : (
                                /* Guest Actions */
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="px-5 py-2 text-sm font-medium text-white border border-white/30 hover:bg-white/10 rounded-full transition-all"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white text-sm font-bold rounded-full shadow-lg hover:shadow-gold-500/30 transition-all transform hover:-translate-y-0.5"
                                    >
                                        Join Now
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
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            )}

            {/* Mobile Menu Panel */}
            <div className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
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
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Start Praying Free
                            </Link>
                        )}

                        {/* Authenticated User Dashboard Link */}
                        {isAuthenticated && (
                            <Link
                                href="/journey"
                                className="flex items-center gap-3 px-4 py-3.5 bg-sacred-50 dark:bg-sacred-900/20 text-sacred-700 dark:text-sacred-300 rounded-xl font-semibold mb-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="p-2 rounded-lg bg-sacred-100 dark:bg-sacred-800 text-sacred-600">
                                    <Home className="w-5 h-5" />
                                </div>
                                My Dashboard
                            </Link>
                        )}

                        {/* I'm New Here - Prominent for guests */}
                        {!isAuthenticated && (
                            <Link
                                href="/welcome"
                                className="flex items-center gap-3 px-4 py-3.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl font-semibold mb-4"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-800 text-emerald-600">
                                    <Compass className="w-5 h-5" />
                                </div>
                                I'm New Here →
                            </Link>
                        )}

                        <p className="px-4 text-xs uppercase tracking-wider text-gray-400 mb-2 mt-2">Explore</p>

                        {/* Prayers Expandable */}
                        <div className="rounded-xl overflow-hidden">
                            <button
                                onClick={() => setMobilePrayersOpen(!mobilePrayersOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${isPrayersActive
                                    ? 'bg-sacred-50 dark:bg-sacred-900/20 text-sacred-700 dark:text-sacred-300 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isPrayersActive ? 'bg-sacred-100 text-sacred-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    Prayers
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform ${mobilePrayersOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobilePrayersOpen && (
                                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
                                    {prayerLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(link.href)
                                                ? 'bg-sacred-50 dark:bg-sacred-900/20 text-sacred-700 dark:text-sacred-300 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <div>
                                                <div>{link.label}</div>
                                                <div className="text-xs text-gray-400">{link.description}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Readings Expandable */}
                        <div className="rounded-xl overflow-hidden">
                            <button
                                onClick={() => setMobileReadingsOpen(!mobileReadingsOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${isReadingsActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isReadingsActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    Readings
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform ${mobileReadingsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileReadingsOpen && (
                                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
                                    {readingsLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(link.href)
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <div>
                                                <div>{link.label}</div>
                                                <div className="text-xs text-gray-400">{link.description}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Offerings Expandable */}
                        <div className="rounded-xl overflow-hidden">
                            <button
                                onClick={() => setMobileOfferingsOpen(!mobileOfferingsOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${isOfferingsActive
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isOfferingsActive ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    Offerings
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform ${mobileOfferingsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileOfferingsOpen && (
                                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
                                    {offeringsLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(link.href)
                                                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <div>
                                                <div>{link.label}</div>
                                                <div className="text-xs text-gray-400">{link.description}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Churches */}
                        <Link
                            href="/churches"
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${isActive('/churches')
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className={`p-2 rounded-lg ${isActive('/churches') ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                <Building2 className="w-5 h-5" />
                            </div>
                            Find Churches
                        </Link>

                        {/* Live Sessions */}
                        <Link
                            href="/sessions"
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${isActive('/sessions')
                                ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className={`p-2 rounded-lg ${isActive('/sessions') ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                <Users className="w-5 h-5" />
                            </div>
                            Live Sessions
                        </Link>

                        {/* Authenticated-only features */}
                        {isAuthenticated && (
                            <>
                                <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
                                <p className="px-4 text-xs uppercase tracking-wider text-gray-400 mb-2">My Account</p>

                                <Link
                                    href="/candles"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/candles')
                                        ? 'bg-amber-50 text-amber-700 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className={`p-2 rounded-lg ${isActive('/candles') ? 'bg-amber-100 text-amber-600' : 'bg-amber-50 text-amber-500'}`}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    My Candles
                                </Link>

                                <Link
                                    href="/challenges"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/challenges')
                                        ? 'bg-purple-50 text-purple-700 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className={`p-2 rounded-lg ${isActive('/challenges') ? 'bg-purple-100 text-purple-600' : 'bg-purple-50 text-purple-500'}`}>
                                        <Star className="w-5 h-5" />
                                    </div>
                                    Challenges
                                </Link>

                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    Settings
                                </Link>
                            </>
                        )}

                        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

                        {/* Auth Buttons */}
                        {!isAuthenticated ? (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    className="w-full py-3.5 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium border border-gray-200 dark:border-gray-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                            </div>
                        ) : (
                            <button
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                                onClick={() => {
                                    // TODO: Implement logout
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
                                <a href="https://www.facebook.com/MyPrayerTower2" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1877f2] text-white rounded-lg hover:opacity-90 transition-opacity"><Facebook className="w-5 h-5" /></a>
                                <a href="https://www.youtube.com/c/MyPrayerTower" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#ff0000] text-white rounded-lg hover:opacity-90 transition-opacity"><Youtube className="w-5 h-5" /></a>
                                <a href="https://twitter.com/MyPrayerTower" target="_blank" rel="noopener noreferrer" className="p-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"><TwitterIcon className="w-5 h-5" /></a>
                                <a href="https://www.instagram.com/myprayertower/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition-opacity"><InstagramIcon className="w-5 h-5" /></a>
                                <a href="https://www.threads.net/@myprayertower" target="_blank" rel="noopener noreferrer" className="p-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"><ThreadsIcon className="w-5 h-5" /></a>
                                <a href="https://www.pinterest.com/myprayertower/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#E60023] text-white rounded-lg hover:opacity-90 transition-opacity"><PinterestIcon className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Global Search Modal */}
            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
