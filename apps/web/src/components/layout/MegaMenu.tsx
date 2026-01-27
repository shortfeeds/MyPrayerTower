'use client';

import {
    Calendar, Heart, Book, Users, Sparkles, MapPin, BookOpen,
    Flame, Gift, Star, User, Search, Sun, Moon, Building, Clock, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// === CONFIGURATION ===

export const PRAY_MENU = {
    title: 'Pray',
    icon: Sparkles,
    color: 'sacred',
    featured: {
        label: 'Daily Devotion',
        title: 'Morning Offering',
        href: '/prayers/morning-offering',
        desc: 'Dedicate your day to the Sacred Heart.'
    },
    columns: [
        {
            title: 'Liturgy & Word',
            items: [
                { label: 'Daily Readings', href: '/readings', icon: Calendar, desc: 'Mass readings & Gospel' },
                { label: 'Saints & Feasts', href: '/saints', icon: User, desc: 'Lives of the Holy Ones' },
                { label: 'Liturgical Calendar', href: '/calendar', icon: Calendar, desc: 'Feasts & seasons' },
                { label: 'Liturgy of the Hours', href: '/prayers/liturgy-hours', icon: Clock, desc: 'Divine Office' },
            ]
        },
        {
            title: 'Devotions',
            items: [
                { label: 'Holy Rosary', href: '/prayers/rosary', icon: Heart, desc: 'Interactive mysteries' },
                { label: 'Divine Mercy', href: '/prayers/divine-mercy', icon: Sparkles, desc: 'Chaplet devotion' },
                { label: 'Novenas', href: '/novenas', icon: Flame, desc: '9-Day prayer series' },
                { label: 'Stations of the Cross', href: '/stations', icon: MapPin, desc: 'Way of the Cross' },
                { label: 'Examen', href: '/examen', icon: Moon, desc: 'Evening reflection' },
            ]
        },
        {
            title: 'Prayer Library',
            items: [
                { label: 'Prayer Wall', href: '/prayer-wall', icon: Users, desc: 'Community intentions' },
                { label: 'Common Prayers', href: '/prayers', icon: Book, desc: 'Treasury of prayers' },
                { label: 'Chant & Music', href: '/chant', icon: BookOpen, desc: 'Sacred Gregorian chant' },
                { label: 'Sacred Art', href: '/art', icon: Star, desc: 'Visual meditation' },
            ]
        }
    ]
};

export const OFFER_MENU = {
    title: 'Offer',
    icon: Heart,
    color: 'amber',
    featured: {
        label: 'Active Charity',
        title: 'Light a Candle',
        href: '/candles',
        desc: 'Place your intention before the Altar.'
    },
    columns: [
        {
            title: 'Devotional Gifts',
            items: [
                { label: 'Light a Candle', href: '/candles', icon: Flame, desc: 'Virtual flickering intent' },
                { label: 'Request a Mass', href: '/mass-offerings', icon: Gift, desc: 'Holy Sacrifice of the Mass' },
                { label: 'Spiritual Bouquets', href: '/bouquets', icon: BookOpen, desc: 'Send spiritual gifts' },
            ]
        },
        {
            title: 'Remembrance',
            items: [
                { label: 'Eternal Memorials', href: '/memorials', icon: Star, desc: 'Honor departed loved ones' },
                { label: 'Anniversaries', href: '/anniversaries', icon: Calendar, desc: 'Remembering sacred dates' },
                { label: 'Obituaries', href: '/news/obituaries', icon: Book, desc: 'Community remembrance' },
            ]
        },
        {
            title: 'Charity & Giving',
            items: [
                { label: 'Support Missions', href: '/contributions', icon: Heart, desc: 'Tithing & global giving' },
                { label: 'Local Parish', href: '/churches', icon: Building, desc: 'Giving to your community' },
                { label: 'Campaigns', href: '/campaigns', icon: Users, desc: 'Urgent Catholic causes' },
                { label: 'Pilgrimages', href: '/pilgrimages', icon: MapPin, desc: 'Spiritual journeys' },
            ]
        }
    ]
};

export const LEARN_MENU = {
    title: 'Learn',
    icon: BookOpen,
    color: 'blue',
    featured: {
        label: 'Knowledge',
        title: 'Catholic Catechism',
        href: '/catechism',
        desc: 'Explore the foundations of Faith.'
    },
    columns: [
        {
            title: 'Foundations',
            items: [
                { label: 'Holy Bible', href: '/bible', icon: Book, desc: 'Sacred Word of God' },
                { label: 'Catechism', href: '/catechism', icon: BookOpen, desc: 'Church teachings' },
                { label: 'Glossary', href: '/glossary', icon: Search, desc: 'Catholic terms' },
                { label: 'Apologetics', href: '/guidelines', icon: Search, desc: 'Defending the Truth' },
            ]
        },
        {
            title: 'Deep Faith',
            items: [
                { label: 'Summa Theologica', href: '/summa', icon: Book, desc: 'St. Thomas Aquinas' },
                { label: 'Encyclicals', href: '/encyclicals', icon: BookOpen, desc: 'Papal encyclicals' },
                { label: 'Canon Law', href: '/canon-law', icon: Sparkles, desc: 'Ecclesiastical law' },
                { label: 'Vatican II', href: '/vatican-ii', icon: Building, desc: 'Conciliar documents' },
            ]
        },
        {
            title: 'Community',
            items: [
                { label: 'Find a Church', href: '/churches', icon: MapPin, desc: 'Mass times & finder' },
                { label: 'Dioceses', href: '/dioceses', icon: MapPin, desc: 'Local jurisdictions' },
                { label: 'Hierarchy', href: '/hierarchy', icon: Building, desc: 'Church structure' },
                { label: 'History', href: '/history', icon: Book, desc: '2000 years of faith' },
            ]
        }
    ]
};

// === COMPONENTS ===

import { motion, AnimatePresence } from 'framer-motion';

interface MegaMenuProps {
    config: typeof PRAY_MENU;
    isOpen: boolean;
    onClose: () => void;
}

export function MegaMenu({ config, isOpen, onClose }: MegaMenuProps) {
    // Color mapping for visuals
    const themeColors = {
        sacred: {
            bg: 'bg-sacred-500/10',
            icon: 'text-sacred-400',
            hover: 'hover:bg-sacred-500/20',
            border: 'border-sacred-500/20',
            accent: 'text-sacred-300'
        },
        amber: {
            bg: 'bg-amber-500/10',
            icon: 'text-amber-400',
            hover: 'hover:bg-amber-500/20',
            border: 'border-amber-500/20',
            accent: 'text-amber-300'
        },
        blue: {
            bg: 'bg-blue-500/10',
            icon: 'text-blue-400',
            hover: 'hover:bg-blue-500/20',
            border: 'border-blue-500/20',
            accent: 'text-blue-300'
        }
    };

    const theme = themeColors[config.color as keyof typeof themeColors];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop for closing */}
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[95vw] max-w-[1100px] bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden z-50 flex isolate ring-1 ring-white/10"
                    >
                        {/* Noise Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[-1]" style={{ backgroundImage: 'url("/noise.png")' }}></div>

                        {/* Featured Sidebar */}
                        <div className={`w-1/4 p-8 border-r border-white/5 bg-gradient-to-b ${theme.bg.replace('/10', '/5')} to-transparent relative overflow-hidden group`}>
                            {/* Subtle Glow Behind */}
                            <div className={`absolute -top-20 -left-20 w-64 h-64 ${theme.bg.replace('/10', '/20')} rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-700`}></div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${theme.accent} opacity-80 flex items-center gap-2`}>
                                        <span className="w-1 h-1 rounded-full bg-current"></span>
                                        {config.featured.label}
                                    </span>
                                    <h2 className="text-2xl font-serif font-bold text-white mt-3 leading-tight">
                                        {config.featured.title}
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-3 leading-relaxed border-l-2 border-white/10 pl-3">
                                        {config.featured.desc}
                                    </p>
                                </div>

                                <Link
                                    href={config.featured.href}
                                    onClick={onClose}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl ${theme.bg.replace('/10', '/20')} hover:bg-white/10 text-white border ${theme.border} hover:border-white/20 group/btn`}
                                >
                                    Explore Now
                                    <config.icon className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                                </Link>

                                <div className="pt-8 mt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-gray-500 text-xs italic opacity-70">
                                        <Sparkles className="w-3 h-3" />
                                        <span>"Where two or three are gathered in my name..."</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Areas */}
                        <div className="flex-1 p-8 bg-gradient-to-br from-white/[0.02] to-transparent">
                            <div className="grid grid-cols-3 gap-8">
                                {config.columns.map((col, idx) => (
                                    <div key={idx} className="space-y-6">
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 border-b border-white/5 pb-3 flex items-center justify-between">
                                            {col.title}
                                            {idx === 0 && <span className="text-[10px] text-gray-700 bg-gray-900 px-1.5 py-0.5 rounded">FEATURED</span>}
                                        </h3>
                                        <div className="space-y-2">
                                            {col.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={onClose}
                                                    className="flex items-start gap-3 p-2 rounded-xl transition-all duration-300 group hover:bg-white/5 border border-transparent hover:border-white/5"
                                                >
                                                    <div className={`mt-0.5 p-2 rounded-lg transition-all duration-500 ${theme.bg} group-hover:bg-white/10 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                                                        <item.icon className={`w-4 h-4 ${theme.icon} group-hover:text-white transition-colors`} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-200 text-sm group-hover:text-white transition-colors">
                                                            {item.label}
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 leading-snug mt-0.5 group-hover:text-gray-400 transition-colors line-clamp-1">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer CTA Area */}
                            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3 isolate">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-7 h-7 rounded-full border-2 border-[#0A0A0A] bg-gray-${800 + i * 10} flex items-center justify-center text-[8px] text-white font-medium`} style={{ zIndex: 4 - i }}>
                                                {i === 1 ? 'JP' : i === 2 ? 'M' : 'T'}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-300 font-medium">Join 12,400+ faithful</span>
                                        <span className="text-[10px] text-gray-600">Praying together right now</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <Link href="/about" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 hover:underline decoration-white/20 underline-offset-4">
                                        Our Mission
                                    </Link>
                                    <Link href="/contact" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 hover:underline decoration-white/20 underline-offset-4">
                                        Help Center
                                    </Link>
                                    <Link
                                        href={config.columns[0].items[0].href}
                                        className={`text-xs font-bold ${theme.accent} hover:text-white transition-colors flex items-center gap-1 group`}
                                    >
                                        View Dashboard
                                        <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
