'use client';

import Link from 'next/link';
import { BookOpen, Heart, Star, Clock, Cross, Sparkles, Shield, Moon, Sun, Search, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

// Categories that match the seed data
const categories = [
    { slug: 'basic', name: 'Basic Prayers', count: 4, icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { slug: 'marian', name: 'Marian Prayers', count: 4, icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { slug: 'saints', name: 'Prayers to Saints', count: 4, icon: Sparkles, color: 'bg-amber-100 text-amber-600' },
    { slug: 'rosary', name: 'Holy Rosary', count: 5, icon: Cross, color: 'bg-purple-100 text-purple-600' },
    { slug: 'morning', name: 'Morning Prayers', count: 2, icon: Sun, color: 'bg-orange-100 text-orange-600' },
    { slug: 'evening', name: 'Evening Prayers', count: 1, icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
    { slug: 'healing', name: 'Prayers for Healing', count: 3, icon: Heart, color: 'bg-teal-100 text-teal-600' },
    { slug: 'protection', name: 'Prayers for Protection', count: 2, icon: Shield, color: 'bg-red-100 text-red-600' },
    { slug: 'eucharist', name: 'Eucharistic Prayers', count: 3, icon: Star, color: 'bg-yellow-100 text-yellow-600' },
    { slug: 'confession', name: 'Confession Prayers', count: 1, icon: BookOpen, color: 'bg-green-100 text-green-600' },
];

// Popular prayers with correct IDs matching the prayer database
const initialPrayers = [
    { id: '1', title: 'Our Father', category: 'Basic Prayers', views: 154234 },
    { id: '2', title: 'Hail Mary', category: 'Marian Prayers', views: 89234 },
    { id: '3', title: 'Glory Be', category: 'Basic Prayers', views: 67890 },
    { id: '5', title: 'Act of Contrition', category: 'Confession Prayers', views: 34567 },
    { id: '6', title: 'Memorare', category: 'Marian Prayers', views: 56789 },
    { id: '10', title: 'Prayer to St. Michael', category: 'Prayers to Saints', views: 78901 },
    { id: '4', title: "Apostles' Creed", category: 'Basic Prayers', views: 45678 },
    { id: '7', title: 'Hail Holy Queen', category: 'Marian Prayers', views: 45678 },
    { id: '15', title: 'Guardian Angel Prayer', category: 'Morning Prayers', views: 67890 },
];

export default function PrayersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'views' | 'title'>('views');

    const filteredPrayers = initialPrayers
        .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'views') return b.views - a.views;
            return a.title.localeCompare(b.title);
        });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        📖 Catholic Prayer Library
                    </h1>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto">
                        Access traditional Catholic prayers for every occasion.
                        From basic prayers to Marian devotions and prayers to the saints.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="container mx-auto px-4 -mt-6 relative z-10">
                <div className="max-w-xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search prayers..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-green-200 text-gray-800"
                        />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Prayer Categories</h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/prayers/category/${cat.slug}`}
                            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                            <p className="text-sm text-gray-500">{cat.count} prayers</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Popular Prayers */}
            <div className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Most Popular Prayers</h2>
                        <button
                            onClick={() => setSortBy(prev => prev === 'views' ? 'title' : 'views')}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            Sort by {sortBy === 'views' ? 'Popularity' : 'Name'}
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPrayers.length > 0 ? filteredPrayers.map((prayer) => (
                            <Link
                                key={prayer.id}
                                href={`/prayers/${prayer.id}`}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
                                    <BookOpen className="w-6 h-6 text-green-600 group-hover:text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700">{prayer.title}</h3>
                                    <p className="text-sm text-gray-500">{prayer.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{prayer.views.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">views</p>
                                </div>
                            </Link>
                        )) : (
                            <p className="col-span-full text-center text-gray-500 py-8">No prayers found matching your search.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-12 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">🙏 Quick Prayer Access</h2>
                    <p className="text-purple-200 mb-6">Jump to the most commonly used prayers</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/prayers/1" className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-medium">
                            Our Father
                        </Link>
                        <Link href="/prayers/2" className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-medium">
                            Hail Mary
                        </Link>
                        <Link href="/prayers/3" className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-medium">
                            Glory Be
                        </Link>
                        <Link href="/prayers/4" className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-medium">
                            Apostles' Creed
                        </Link>
                        <Link href="/prayers/10" className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-medium">
                            St. Michael Prayer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
