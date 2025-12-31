'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Church, Heart, BookOpen, User, Star, Search, ChevronDown, Sparkles, Book, Calendar, Facebook, Youtube, ExternalLink, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { TwitterIcon, InstagramIcon, ThreadsIcon, PinterestIcon } from '@/components/common/SocialIcons';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scriptureOpen, setScriptureOpen] = useState(false);
    const [mobileScriptureOpen, setMobileScriptureOpen] = useState(false);
    const scriptureRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { actualTheme, setTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (scriptureRef.current && !scriptureRef.current.contains(event.target as Node)) {
                setScriptureOpen(false);
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

    const mainNavLinks = [
        { href: '/churches', label: 'Find Churches', icon: Church },
        { href: '/prayer-wall', label: 'Prayer Wall', icon: Heart },
    ];

    const scriptureLinks = [
        { href: '/bible', label: 'Bible (DuoBiblia)', icon: Book, description: 'Latin-English parallel Bible' },
        { href: '/readings', label: 'Daily Readings', icon: Calendar, description: 'Mass readings for today' },
        { href: '/bible/year', label: 'Bible Year Plan', icon: BookOpen, description: 'Read the Bible in a year' },
    ];

    const afterScriptureLinks = [
        { href: '/prayers', label: 'Prayers', icon: Sparkles },
        { href: '/saints', label: 'Saints', icon: Star },
    ];

    const isActive = (path: string) => pathname?.startsWith(path);
    const isScriptureActive = scriptureLinks.some(link => pathname?.startsWith(link.href));

    const isHome = pathname === '/';

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome
                    ? 'bg-sacred-800 dark:bg-gray-900 py-2 shadow-lg'
                    : 'bg-gradient-to-b from-black/50 to-transparent py-4'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-gold-500/50 transition-all duration-300 transform group-hover:scale-105">
                                <span className="text-white font-serif font-bold text-xl">M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-serif font-bold text-lg leading-tight transition-colors ${scrolled ? 'text-white' : 'text-white'}`}>
                                    MyPrayerTower
                                </span>
                                <span className={`text-[10px] uppercase tracking-wider font-medium ${scrolled ? 'text-gray-300' : 'text-gray-200'}`}>
                                    Catholic Services
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            {/* Main nav links */}
                            {mainNavLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.href)
                                        ? 'bg-white text-sacred-900 shadow-md'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <link.icon className={`w-4 h-4 ${isActive(link.href) ? 'text-gold-600' : ''}`} />
                                    {link.label}
                                </Link>
                            ))}

                            {/* Scripture Dropdown */}
                            <div className="relative" ref={scriptureRef}>
                                <button
                                    onClick={() => setScriptureOpen(!scriptureOpen)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isScriptureActive
                                        ? 'bg-white text-sacred-900 shadow-md'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <BookOpen className={`w-4 h-4 ${isScriptureActive ? 'text-gold-600' : ''}`} />
                                    Scripture
                                    <ChevronDown className={`w-3 h-3 transition-transform ${scriptureOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {scriptureOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up z-50">
                                        {scriptureLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setScriptureOpen(false)}
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

                            {/* After Scripture links (Prayers, Saints) */}
                            {afterScriptureLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.href)
                                        ? 'bg-white text-sacred-900 shadow-md'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <link.icon className={`w-4 h-4 ${isActive(link.href) ? 'text-gold-600' : ''}`} />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button className={`p-2 rounded-full transition-colors ${scrolled ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-white hover:bg-white/10'}`}>
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
                                className={`p-2 rounded-full transition-colors ${scrolled ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-white hover:bg-white/10'}`}
                                aria-label="Toggle theme"
                            >
                                {actualTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className={`px-5 py-2 text-sm font-medium rounded-full transition-all border ${scrolled
                                        ? 'text-white border-white/30 hover:bg-white/10'
                                        : 'text-white border-white/30 hover:bg-white/10'
                                        }`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white text-sm font-bold rounded-full shadow-lg hover:shadow-gold-500/30 transition-all transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
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
                <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
            )}

            {/* Mobile Menu Panel */}
            <div className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-serif font-bold">M</span>
                        </div>
                        <span className="font-serif font-bold text-gray-900">MyPrayerTower</span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="overflow-y-auto h-[calc(100%-80px)] p-4">
                    <nav className="flex flex-col gap-1">
                        {/* Main links */}
                        {mainNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${isActive(link.href)
                                    ? 'bg-sacred-50 text-sacred-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className={`p-2 rounded-lg ${isActive(link.href) ? 'bg-sacred-100 text-sacred-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <link.icon className="w-5 h-5" />
                                </div>
                                {link.label}
                            </Link>
                        ))}

                        {/* Scripture Expandable Section */}
                        <div className="rounded-xl overflow-hidden">
                            <button
                                onClick={() => setMobileScriptureOpen(!mobileScriptureOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${isScriptureActive
                                    ? 'bg-sacred-50 text-sacred-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isScriptureActive ? 'bg-sacred-100 text-sacred-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    Scripture
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform ${mobileScriptureOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileScriptureOpen && (
                                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-4 py-2">
                                    {scriptureLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(link.href)
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
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

                        {/* After Scripture links */}
                        {afterScriptureLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${isActive(link.href)
                                    ? 'bg-sacred-50 text-sacred-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className={`p-2 rounded-lg ${isActive(link.href) ? 'bg-sacred-100 text-sacred-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <link.icon className="w-5 h-5" />
                                </div>
                                {link.label}
                            </Link>
                        ))}

                        <hr className="my-4 border-gray-200" />

                        {/* Auth Buttons */}
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                className="w-full py-3.5 text-center text-gray-700 hover:bg-gray-50 rounded-xl font-medium border border-gray-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-center font-bold rounded-xl shadow-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Get Started Free
                            </Link>
                        </div>

                        <hr className="my-4 border-gray-200" />

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
        </>
    );
}
