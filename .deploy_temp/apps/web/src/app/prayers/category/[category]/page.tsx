'use client';

import { useState } from 'react';
import { ChevronLeft, BookOpen, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Prayer database organized by category - matches the prayer detail page data
const prayersByCategory: Record<string, { name: string; description: string; prayers: any[] }> = {
    'basic': {
        name: 'Basic Prayers',
        description: 'Essential prayers every Catholic should know',
        prayers: [
            { id: '1', title: 'Our Father', latinTitle: 'Pater Noster', views: 154234 },
            { id: '2', title: 'Hail Mary', latinTitle: 'Ave Maria', views: 89234 },
            { id: '3', title: 'Glory Be', latinTitle: 'Gloria Patri', views: 67890 },
            { id: '4', title: "Apostles' Creed", latinTitle: 'Symbolum Apostolorum', views: 45678 },
        ],
    },
    'marian': {
        name: 'Marian Prayers',
        description: 'Prayers to the Blessed Virgin Mary, Mother of God',
        prayers: [
            { id: '6', title: 'Memorare', latinTitle: 'Memorare', views: 56789 },
            { id: '7', title: 'Hail Holy Queen', latinTitle: 'Salve Regina', views: 45678 },
            { id: '8', title: 'The Angelus', latinTitle: 'Angelus Domini', views: 34567 },
            { id: '9', title: 'Regina Caeli', latinTitle: 'Regina Caeli', views: 23456 },
        ],
    },
    'saints': {
        name: 'Prayers to Saints',
        description: 'Intercession prayers to the saints',
        prayers: [
            { id: '10', title: 'Prayer to St. Michael the Archangel', latinTitle: 'Oratio ad Sanctum Michaelem', views: 78901 },
            { id: '11', title: 'Prayer to St. Joseph', latinTitle: 'Oratio ad Sanctum Ioseph', views: 56789 },
            { id: '12', title: 'Prayer to St. Anthony of Padua', latinTitle: 'Responsory of St. Anthony', views: 34567 },
            { id: '13', title: 'Prayer to St. Jude', latinTitle: 'Oratio ad Sanctum Iudam', views: 23456 },
        ],
    },
    'morning': {
        name: 'Morning Prayers',
        description: 'Prayers to start your day with God',
        prayers: [
            { id: '14', title: 'Morning Offering', latinTitle: 'Oblatio Matutina', views: 45678 },
            { id: '15', title: 'Guardian Angel Prayer', latinTitle: 'Angele Dei', views: 67890 },
        ],
    },
    'evening': {
        name: 'Evening Prayers',
        description: 'Prayers for the end of the day',
        prayers: [
            { id: '16', title: 'Night Prayer (Compline)', latinTitle: 'Completorium', views: 34567 },
        ],
    },
    'confession': {
        name: 'Confession Prayers',
        description: 'Prayers for the Sacrament of Reconciliation',
        prayers: [
            { id: '5', title: 'Act of Contrition', latinTitle: 'Actus Contritionis', views: 34567 },
        ],
    },
    'rosary': {
        name: 'Holy Rosary',
        description: 'Prayers and meditations for the Rosary',
        prayers: [
            { id: '1', title: 'Our Father', latinTitle: 'Pater Noster', views: 154234 },
            { id: '2', title: 'Hail Mary', latinTitle: 'Ave Maria', views: 89234 },
            { id: '3', title: 'Glory Be', latinTitle: 'Gloria Patri', views: 67890 },
            { id: '7', title: 'Hail Holy Queen', latinTitle: 'Salve Regina', views: 45678 },
            { id: '4', title: "Apostles' Creed", latinTitle: 'Symbolum Apostolorum', views: 45678 },
        ],
    },
    'healing': {
        name: 'Prayers for Healing',
        description: 'Prayers for health and recovery',
        prayers: [
            { id: '13', title: 'Prayer to St. Jude', latinTitle: 'For desperate situations', views: 23456 },
        ],
    },
    'protection': {
        name: 'Prayers for Protection',
        description: 'Prayers for safety and protection from evil',
        prayers: [
            { id: '10', title: 'Prayer to St. Michael', latinTitle: 'Defense against evil', views: 78901 },
            { id: '15', title: 'Guardian Angel Prayer', latinTitle: 'Daily protection', views: 67890 },
        ],
    },
    'eucharist': {
        name: 'Eucharistic Prayers',
        description: 'Prayers related to Holy Communion',
        prayers: [
            { id: '14', title: 'Morning Offering', latinTitle: 'Offer your day to God', views: 45678 },
        ],
    }
};

export default function PrayerCategoryPage({ params }: { params: { category: string } }) {
    const [search, setSearch] = useState('');
    const categoryData = prayersByCategory[params.category];

    // If category not found, show basic as default
    const category = categoryData || prayersByCategory['basic'];
    const categoryName = categoryData ? category.name : `Category: ${params.category}`;

    const filteredPrayers = category.prayers.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.latinTitle?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-12 text-white">
                <div className="container mx-auto px-4">
                    <Link href="/prayers" className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Prayer Library
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-purple-200 text-sm">Category</p>
                            <h1 className="text-3xl font-bold">{categoryName}</h1>
                        </div>
                    </div>
                    <p className="text-purple-100 max-w-2xl">{category.description}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search */}
                <div className="relative mb-8 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search prayers in this category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                </div>

                {/* Results Count */}
                <p className="text-gray-500 mb-6">{filteredPrayers.length} {filteredPrayers.length === 1 ? 'prayer' : 'prayers'} found</p>

                {/* Prayer List */}
                <div className="space-y-4">
                    {filteredPrayers.map((prayer) => (
                        <Link
                            key={`${prayer.id}-${prayer.title}`}
                            href={`/prayers/${prayer.id}`}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group"
                        >
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors flex-shrink-0">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">{prayer.title}</h3>
                                {prayer.latinTitle && (
                                    <p className="text-gray-500 text-sm italic">{prayer.latinTitle}</p>
                                )}
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-medium text-gray-900">{prayer.views.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">views</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                        </Link>
                    ))}
                </div>

                {filteredPrayers.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No prayers found matching "{search}"</p>
                        <button
                            onClick={() => setSearch('')}
                            className="text-purple-600 hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* All Categories Quick Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Browse Other Categories</h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(prayersByCategory).map(([slug, cat]) => (
                            <Link
                                key={slug}
                                href={`/prayers/category/${slug}`}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${slug === params.category
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
