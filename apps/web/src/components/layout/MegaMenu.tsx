'use client';

import {
    Calendar, Heart, Book, Users, Sparkles, MapPin, BookOpen,
    Flame, Gift, Star, User, Search, Sun, Moon, Building
} from 'lucide-react';
import Link from 'next/link';

// === CONFIGURATION ===

export const PRAY_MENU = {
    title: 'Pray',
    icon: Sparkles,
    color: 'sacred', // sacred-600
    columns: [
        {
            title: 'Daily Devotion',
            items: [
                { label: 'Daily Readings', href: '/readings', icon: Calendar, desc: 'Scripture for today' },
                { label: 'Morning Offering', href: '/prayers/morning-offering', icon: Sun, desc: 'Start your day' },
                { label: 'Evening Examen', href: '/examen', icon: Moon, desc: 'Review with gratitude' },
            ]
        },
        {
            title: 'The Treasury',
            items: [
                { label: 'Holy Rosary', href: '/prayers/rosary', icon: Heart, desc: 'Interactive mysteries' },
                { label: 'Divine Mercy', href: '/prayers/divine-mercy', icon: Sparkles, desc: 'Chaplet devotion' },
                { label: 'Stations of the Cross', href: '/stations', icon: MapPin, desc: 'Way of the Cross' },
                { label: 'Novenas', href: '/novenas', icon: Flame, desc: '9-Day prayers' },
                { label: 'Chaplets', href: '/chaplets', icon: Book, desc: 'Traditional prayers' },
            ]
        },
        {
            title: 'Community & Arts',
            items: [
                { label: 'Prayer Wall', href: '/prayer-wall', icon: Users, desc: 'Share intentions' },
                { label: 'Gregorian Chant', href: '/chant', icon: BookOpen, desc: 'Sacred Music' },
                { label: 'Sacred Art', href: '/art', icon: Star, desc: 'Visual meditation' },
                { label: 'Hymnals', href: '/hymns', icon: Book, desc: 'Songs of praise' },
            ]
        }
    ]
};

export const OFFER_MENU = {
    title: 'Offer',
    icon: Heart,
    color: 'amber', // amber-600
    columns: [
        {
            title: 'Active Charity',
            items: [
                { label: 'Light a Candle', href: '/candles', icon: Flame, desc: 'Virtual intentions' },
                { label: 'Request a Mass', href: '/mass-offerings', icon: Gift, desc: 'Holy Sacrifice' },
                { label: 'Support Church', href: '/contributions', icon: Heart, desc: 'Tithing & Giving' },
            ]
        },
        {
            title: 'Remembrance',
            items: [
                { label: 'Eternal Memorials', href: '/memorials', icon: Star, desc: 'Honor loved ones' },
                { label: 'Spiritual Bouquets', href: '/bouquets', icon: BookOpen, desc: 'Send spiritual gifts' },
                { label: 'Anniversaries', href: '/anniversaries', icon: Calendar, desc: 'Remembering dates' },
            ]
        },
        {
            title: 'Special Intentions',
            items: [
                { label: 'Campaigns', href: '/campaigns', icon: Users, desc: 'Global causes' },
                { label: 'Pilgrimages', href: '/pilgrimages', icon: MapPin, desc: 'Holy journeys' },
            ]
        }
    ]
};

export const LEARN_MENU = {
    title: 'Learn',
    icon: BookOpen,
    color: 'blue', // blue-600
    columns: [
        {
            title: 'Faith Foundations',
            items: [
                { label: 'Holy Bible', href: '/bible', icon: Book, desc: 'Sacred Scripture' },
                { label: 'Catechism', href: '/catechism', icon: BookOpen, desc: 'Church Teachings' },
                { label: 'Saints', href: '/saints', icon: User, desc: 'Lives of Holiness' },
                { label: 'Apologetics', href: '/guidelines', icon: Search, desc: 'Defending the faith' },
            ]
        },
        {
            title: 'Deep Theology',
            items: [
                { label: 'Summa Theologica', href: '/summa', icon: Book, desc: 'Aquinas' },
                { label: 'Encyclicals', href: '/encyclicals', icon: BookOpen, desc: 'Papal writings' },
                { label: 'Canon Law', href: '/canon-law', icon: Sparkles, desc: 'Church law' },
                { label: 'Vatican II', href: '/vatican-ii', icon: Building, desc: 'Council documents' },
            ]
        },
        {
            title: 'Parish Life',
            items: [
                { label: 'Church Directory', href: '/churches', icon: MapPin, desc: 'Mass Near You' },
                { label: 'Liturgical Calendar', href: '/calendar', icon: Calendar, desc: 'Feasts & seasons' },
                { label: 'Glossary', href: '/glossary', icon: Search, desc: 'Catholic Terms' },
                { label: 'Dioceses', href: '/dioceses', icon: MapPin, desc: 'Local shepherds' },
            ]
        }
    ]
};

// === COMPONENTS ===

interface MegaMenuProps {
    config: typeof PRAY_MENU;
    isOpen: boolean;
    onClose: () => void;
}

export function MegaMenu({ config, isOpen, onClose }: MegaMenuProps) {
    if (!isOpen) return null;

    // Color mapping
    const bgColors = {
        sacred: 'bg-sacred-50 text-sacred-600',
        amber: 'bg-amber-50 text-amber-600',
        blue: 'bg-blue-50 text-blue-600',
    };

    const iconColors = {
        sacred: 'text-sacred-600',
        amber: 'text-amber-600',
        blue: 'text-blue-600',
    };

    const hoverColors = {
        sacred: 'hover:bg-sacred-50',
        amber: 'hover:bg-amber-50',
        blue: 'hover:bg-blue-50',
    };

    const themeColor = config.color as keyof typeof bgColors;

    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden animate-fade-in-up z-50 p-6">
            <div className="grid grid-cols-3 gap-8">
                {config.columns.map((col, idx) => (
                    <div key={idx} className="space-y-4">
                        <h3 className="font-serif font-bold text-white border-b border-white/5 pb-2">
                            {col.title}
                        </h3>
                        <div className="space-y-2">
                            {col.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-start gap-3 p-2 rounded-xl transition-all duration-300 focus:outline-none hover:bg-white/5 group`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${bgColors[themeColor].replace('bg-', 'bg-').replace('-50', '/10')}`}>
                                        <item.icon className={`w-5 h-5 ${iconColors[themeColor]}`} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-200 text-sm group-hover:text-white transition-colors">
                                            {item.label}
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-400 transition-colors">
                                            {item.desc}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / CTA Area */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                <span>MyPrayerTower Catholic Services</span>
                <Link href={config.columns[0].items[0].href} className="font-medium hover:text-white transition-colors focus:outline-none">
                    View All &rarr;
                </Link>
            </div>
        </div>
    );
}
