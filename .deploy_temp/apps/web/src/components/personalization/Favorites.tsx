'use client';

import { useState } from 'react';
import { Heart, Star, Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface FavoriteItem {
    id: string;
    type: 'saint' | 'prayer' | 'church' | 'reading';
    title: string;
    subtitle?: string;
    imageUrl?: string;
    addedAt: Date;
}

interface FavoritesListProps {
    items: FavoriteItem[];
    onRemove?: (id: string) => void;
}

const TYPE_ICONS = {
    saint: Star,
    prayer: Heart,
    church: Bookmark,
    reading: BookmarkCheck,
};

const TYPE_COLORS = {
    saint: 'from-purple-500 to-purple-600',
    prayer: 'from-rose-500 to-rose-600',
    church: 'from-sacred-500 to-sacred-600',
    reading: 'from-emerald-500 to-emerald-600',
};

const TYPE_LINKS = {
    saint: '/saints',
    prayer: '/prayers',
    church: '/churches',
    reading: '/readings',
};

export function FavoritesList({ items, onRemove }: FavoritesListProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <Bookmark className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No favorites yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Start adding saints, prayers, and churches to your favorites.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {items.map((item) => {
                const Icon = TYPE_ICONS[item.type];
                const colorClass = TYPE_COLORS[item.type];
                const linkBase = TYPE_LINKS[item.type];

                return (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shrink-0`}>
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <Icon className="w-6 h-6" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <Link href={`${linkBase}/${item.id}`} className="hover:underline">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h4>
                            </Link>
                            {item.subtitle && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.subtitle}</p>
                            )}
                        </div>

                        <button
                            onClick={() => onRemove?.(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            aria-label="Remove from favorites"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

// Favorite Button Component
interface FavoriteButtonProps {
    isFavorited: boolean;
    onToggle: () => void;
    size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ isFavorited, onToggle, size = 'md' }: FavoriteButtonProps) {
    const sizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <button
            onClick={onToggle}
            className={`${sizeClasses[size]} rounded-full transition-all ${isFavorited
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                }`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart className={`${iconSizes[size]} ${isFavorited ? 'fill-current' : ''}`} />
        </button>
    );
}

// Custom Prayer Lists
interface PrayerList {
    id: string;
    name: string;
    prayerCount: number;
    isDefault?: boolean;
}

export function PrayerListsManager({ lists, onCreateList }: { lists: PrayerList[]; onCreateList?: () => void }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">My Prayer Lists</h3>
                <button
                    onClick={onCreateList}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    + New List
                </button>
            </div>

            {lists.map((list) => (
                <div
                    key={list.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        <Bookmark className="w-5 h-5 text-sacred-600" />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{list.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {list.prayerCount} {list.prayerCount === 1 ? 'prayer' : 'prayers'}
                            </p>
                        </div>
                    </div>
                    {list.isDefault && (
                        <span className="text-xs bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 px-2 py-1 rounded-full">
                            Default
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
