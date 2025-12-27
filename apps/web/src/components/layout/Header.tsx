'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Church, Heart, BookOpen, User, Star, Search, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/churches', label: 'Find Churches', icon: Church },
        { href: '/prayer-wall', label: 'Prayer Wall', icon: Heart },
        { href: '/prayers', label: 'Prayers', icon: BookOpen },
        { href: '/saints', label: 'Saints', icon: Star },
        { href: '/readings', label: 'Readings', icon: BookOpen },
    ];

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark py-2 shadow-lg' : 'bg-transparent py-4'
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
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.href)
                                        ? 'bg-white text-primary-900 shadow-md'
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
                        className="lg:hidden p-2 text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 p-4 glass rounded-2xl border border-white/20 animate-fade-in-up">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(link.href)
                                            ? 'bg-primary-50 text-primary-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className={`p-2 rounded-lg ${isActive(link.href) ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <link.icon className="w-5 h-5" />
                                    </div>
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="my-2 border-gray-200" />
                            <div className="flex flex-col gap-3 mt-2">
                                <Link
                                    href="/login"
                                    className="w-full py-3 text-center text-gray-700 hover:bg-gray-50 rounded-xl font-medium border border-gray-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-center font-bold rounded-xl shadow-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
