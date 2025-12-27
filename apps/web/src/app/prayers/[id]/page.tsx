'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, Heart, Share2, Volume2, VolumeX, Plus, Minus, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Fallback prayers data when API is unavailable
const fallbackPrayers: Record<string, any> = {
    'our-father': {
        id: '1',
        title: 'Our Father',
        latinTitle: 'Pater Noster',
        category: { name: 'Basic Prayers', slug: 'basic' },
        content: `Our Father, who art in heaven,
hallowed be thy name;
thy kingdom come;
thy will be done on earth as it is in heaven.

Give us this day our daily bread;
and forgive us our trespasses
as we forgive those who trespass against us;
and lead us not into temptation,
but deliver us from evil.

Amen.`,
        source: 'Matthew 6:9-13',
        viewCount: 154234,
    },
    'hail-mary': {
        id: '2',
        title: 'Hail Mary',
        latinTitle: 'Ave Maria',
        category: { name: 'Marian Prayers', slug: 'marian' },
        content: `Hail Mary, full of grace,
the Lord is with thee.
Blessed art thou among women,
and blessed is the fruit of thy womb, Jesus.

Holy Mary, Mother of God,
pray for us sinners,
now and at the hour of our death.

Amen.`,
        source: 'Luke 1:28, 1:42',
        viewCount: 89234,
    },
    'glory-be': {
        id: '3',
        title: 'Glory Be',
        latinTitle: 'Gloria Patri',
        category: { name: 'Basic Prayers', slug: 'basic' },
        content: `Glory be to the Father,
and to the Son,
and to the Holy Spirit.

As it was in the beginning,
is now, and ever shall be,
world without end.

Amen.`,
        source: 'Ancient Christian Doxology',
        viewCount: 67890,
    },
};

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Prayer {
    id: string;
    title: string;
    slug: string;
    latinTitle?: string;
    content: string;
    source?: string;
    author?: string;
    viewCount: number;
    category?: {
        name: string;
        slug: string;
    };
}

export default function PrayerDetailPage({ params }: { params: { id: string } }) {
    const [prayer, setPrayer] = useState<Prayer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        async function fetchPrayer() {
            setLoading(true);
            try {
                // Try to fetch from API first
                const response = await fetch(`${API_BASE_URL}/prayers/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPrayer(data);
                } else {
                    // Fallback to local data
                    const fallback = fallbackPrayers[params.id] || Object.values(fallbackPrayers)[0];
                    if (fallback) {
                        setPrayer(fallback);
                    } else {
                        setError('Prayer not found');
                    }
                }
            } catch (err) {
                // API unavailable, use fallback
                const fallback = fallbackPrayers[params.id] || Object.values(fallbackPrayers)[0];
                if (fallback) {
                    setPrayer(fallback);
                } else {
                    setError('Prayer not found');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchPrayer();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    if (error || !prayer) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Prayer Not Found</h1>
                    <p className="text-gray-500 mb-6">The prayer you're looking for doesn't exist.</p>
                    <Link href="/prayers" className="text-purple-600 hover:underline">
                        ← Back to Prayer Library
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-8 text-white">
                <div className="container mx-auto px-4">
                    <Link href="/prayers" className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Prayer Library
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-purple-200 text-sm mb-1">{prayer.category?.name || 'Prayer'}</p>
                            <h1 className="text-3xl font-bold">{prayer.title}</h1>
                            {prayer.latinTitle && (
                                <p className="text-purple-200 italic mt-1">{prayer.latinTitle}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-3 rounded-xl ${isFavorite ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            >
                                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500' : ''}`} />
                            </button>
                            <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl">
                                <Share2 className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`p-3 rounded-xl ${isPlaying ? 'bg-white text-purple-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            >
                                {isPlaying ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Prayer Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            {/* Font Size Controls */}
                            <div className="flex items-center justify-end gap-2 mb-6">
                                <button
                                    onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm text-gray-500 min-w-[3rem] text-center">{fontSize}px</span>
                                <button
                                    onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Prayer Text */}
                            <div
                                className="text-gray-800 leading-relaxed whitespace-pre-line"
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                {prayer.content}
                            </div>

                            {/* Source */}
                            {prayer.source && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Source:</span> {prayer.source}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Prayer Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Views</span>
                                    <span className="font-medium">{prayer.viewCount?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Category</span>
                                    <Link
                                        href={`/prayers/category/${prayer.category?.slug || 'basic'}`}
                                        className="text-purple-600 hover:underline"
                                    >
                                        {prayer.category?.name || 'General'}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Related Prayers */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Related Prayers</h3>
                            <div className="space-y-3">
                                {Object.entries(fallbackPrayers)
                                    .filter(([slug]) => slug !== params.id)
                                    .slice(0, 3)
                                    .map(([slug, p]) => (
                                        <Link
                                            key={slug}
                                            href={`/prayers/${slug}`}
                                            className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <p className="font-medium text-gray-900">{p.title}</p>
                                            <p className="text-sm text-gray-500">{p.category?.name}</p>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
