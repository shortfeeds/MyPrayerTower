'use client';

import Link from 'next/link';
import { Sun, Moon, BookHeart, Cross, Heart, Scroll } from 'lucide-react';

const QUICK_PRAYERS = [
    {
        id: 'morning',
        label: 'Morning',
        icon: Sun,
        href: '/prayers?category=morning',
        color: 'from-amber-400 to-orange-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
    },
    {
        id: 'rosary',
        label: 'Rosary',
        icon: BookHeart,
        href: '/rosary',
        color: 'from-blue-400 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
    },
    {
        id: 'evening',
        label: 'Evening',
        icon: Moon,
        href: '/prayers?category=evening',
        color: 'from-purple-400 to-purple-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
    },
    {
        id: 'divine-mercy',
        label: 'Divine Mercy',
        icon: Cross,
        href: '/chaplets?id=divine-mercy',
        color: 'from-red-400 to-rose-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
    },
    {
        id: 'confession',
        label: 'Confession',
        icon: Heart,
        href: '/confession/examine',
        color: 'from-green-400 to-emerald-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
    },
    {
        id: 'liturgy',
        label: 'Liturgy',
        icon: Scroll,
        href: '/liturgy-hours',
        color: 'from-gold-400 to-gold-600',
        bgColor: 'bg-gold-50',
        textColor: 'text-gold-700',
    },
];

export function QuickPrayerButtons() {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-gray-900">Quick Prayers</h3>
                <Link href="/prayers" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    See All →
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {QUICK_PRAYERS.map((prayer) => (
                    <Link key={prayer.id} href={prayer.href} className="group flex-shrink-0">
                        <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${prayer.bgColor} hover:shadow-md transition-all duration-300 hover:-translate-y-1 min-w-[80px]`}>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${prayer.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                                <prayer.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-xs font-semibold ${prayer.textColor}`}>
                                {prayer.label}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
