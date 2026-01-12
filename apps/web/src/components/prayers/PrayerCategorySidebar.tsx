'use client';

import Link from 'next/link';
import { Filter, ChevronRight, BookOpen, Heart, Flame, Sparkles, Play, Scroll, Music, Church, Star } from 'lucide-react';

interface Category {
    slug: string;
    label: string;
    count: number;
}

interface Props {
    categories: Category[];
    activeCategory?: string;
    totalPrayers: number;
}

function getIconForCategory(label: string) {
    const l = label.toLowerCase();
    if (l.includes('marian')) return Heart;
    if (l.includes('saint')) return Sparkles;
    if (l.includes('novena')) return Flame;
    if (l.includes('healing')) return Play;
    if (l.includes('litany')) return Scroll;
    if (l.includes('hymn') || l.includes('music')) return Music;
    if (l.includes('church') || l.includes('mass')) return Church;
    return Star; // Default
}

export function PrayerCategorySidebar({ categories, activeCategory, totalPrayers }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span>Prayer Categories</span>
                </div>
            </div>

            <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                <Link
                    href="/prayers"
                    className={`group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all mb-1
                        ${!activeCategory
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                             ${!activeCategory ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-blue-600'}`}>
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <span>All Prayers</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${!activeCategory ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'}`}>
                        {totalPrayers}
                    </span>
                </Link>

                <div className="space-y-1">
                    {categories.map((cat) => {
                        const Icon = getIconForCategory(cat.label);
                        const isActive = activeCategory === cat.slug;

                        return (
                            <Link
                                key={cat.slug}
                                href={`/prayers?category=${cat.slug}`}
                                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                                         ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-amber-500'}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="truncate">{cat.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isActive && <ChevronRight className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'}`}>
                                        {cat.count}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
