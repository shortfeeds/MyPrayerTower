'use client';

import {
    Calendar, Heart, Book, Users, Sparkles, MapPin, BookOpen,
    Flame, Gift, Star, User, Search, Sun, Moon, Building, Clock, ChevronRight, ShieldCheck, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
                { label: 'Liturgical Calendar', href: '/calendar', icon: Calendar, desc: 'Feasts & sacred seasons' },
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
                { label: 'Occasion Blessings', href: '/blessings', icon: ShieldCheck, desc: 'Home, travel & healing rituals' },
                { label: 'My Sacred Vigils', href: '/my-vigils', icon: Sparkles, desc: 'Your active flames & certificates' },
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
                { label: 'Find a Church', href: '/churches', icon: MapPin, desc: 'Mass times & parish finder' },
                { label: 'Dioceses', href: '/dioceses', icon: MapPin, desc: 'Local jurisdictions' },
                { label: 'Hierarchy', href: '/hierarchy', icon: Building, desc: 'Church structure' },
                { label: 'History', href: '/history', icon: Book, desc: '2000 years of faith' },
            ]
        }
    ]
};

interface MegaMenuProps {
    config: typeof PRAY_MENU;
    isOpen: boolean;
    onClose: () => void;
}

export function MegaMenu({ config, isOpen, onClose }: MegaMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Subtle backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
                        onClick={onClose}
                    />

                    {/* Centered Menu Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.99 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-full left-0 w-full flex justify-center z-50 pt-2 pointer-events-none"
                    >
                        {/* Compact, Clean Card */}
                        <div className="bg-[#0c0817]/98 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.12] overflow-hidden pointer-events-auto w-[94%] max-w-4xl relative">
                            {/* Subtle gold top border glow */}
                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

                            {/* 3 Balanced Columns */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {config.columns.map((col, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gold-400/90 pb-2 border-b border-white/[0.08] flex items-center justify-between">
                                            <span>{col.title}</span>
                                            <span className="text-[9px] text-white/30 font-medium">{col.items.length} items</span>
                                        </h3>
                                        <div className="space-y-1">
                                            {col.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06] transition-all group"
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-gold-500/20 text-gold-400/80 group-hover:text-gold-300 flex items-center justify-center shrink-0 transition-colors">
                                                        <item.icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-xs font-semibold text-white/90 group-hover:text-gold-200 transition-colors truncate">
                                                            {item.label}
                                                        </div>
                                                        <p className="text-[10px] text-white/50 leading-tight truncate">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tidy Bottom Status Bar */}
                            <div className="px-6 py-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-white/60">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400/90">
                                        {config.featured.label}:
                                    </span>
                                    <Link
                                        href={config.featured.href}
                                        onClick={onClose}
                                        className="font-medium text-white hover:text-gold-300 transition-colors flex items-center gap-1 group"
                                    >
                                        <span>{config.featured.title}</span>
                                        <ArrowRight className="w-3 h-3 text-gold-400 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                    <span className="text-white/30 hidden sm:inline">•</span>
                                    <span className="text-white/40 hidden sm:inline text-[11px]">{config.featured.desc}</span>
                                </div>

                                <div className="hidden md:flex items-center gap-4 text-white/50 text-[11px]">
                                    <Link href="/prayer-wall" onClick={onClose} className="hover:text-white transition-colors">
                                        Prayer Wall
                                    </Link>
                                    <span className="text-white/20">•</span>
                                    <Link href="/about" onClick={onClose} className="hover:text-white transition-colors">
                                        About
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

export default MegaMenu;
