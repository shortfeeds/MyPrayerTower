
'use client';

import { useState, useEffect } from 'react';
import { Compass, Search, ChevronLeft, ChevronRight, Share2, Quote, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface DevotionalPoint {
    number: number;
    content: string;
    chapter?: string;
}

export default function TheWayPage() {
    const [points, setPoints] = useState<DevotionalPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pointsPerPage = 20;

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            setLoading(true);
            // In a real app, you'd have an endpoint that supports pagination and search
            // For now, we'll fetch all points (since it's only 50) and filter client-side
            const res = await fetch('/api/devotionals?book=The%20Way&all=true');
            // Wait, I need to update the API to support 'all=true'
            const data = await res.json();
            if (Array.isArray(data)) {
                setPoints(data);
            } else {
                // Fallback: fetch one by one if 'all' is not supported yet
                const demoPoints = [];
                for (let i = 1; i <= 50; i++) {
                    const r = await fetch(`/api/devotionals?book=The%20Way&number=${i}`);
                    const d = await r.json();
                    if (d && d.content) demoPoints.push(d);
                }
                setPoints(demoPoints);
            }
        } catch (err) {
            console.error('Failed to fetch points:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPoints = points.filter(p =>
        p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.number.toString().includes(searchTerm) ||
        (p.chapter && p.chapter.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastPoint = currentPage * pointsPerPage;
    const indexOfFirstPoint = indexOfLastPoint - pointsPerPage;
    const currentPoints = filteredPoints.slice(indexOfFirstPoint, indexOfLastPoint);
    const totalPages = Math.ceil(filteredPoints.length / pointsPerPage);

    const sharePoint = (point: DevotionalPoint) => {
        const text = `The Way, Point ${point.number}:\n\n"${point.content}"\n\n— St. Josemaria Escriva\n\nvia MyPrayerTower`;
        if (navigator.share) {
            navigator.share({ text }).catch(() => navigator.clipboard.writeText(text));
        } else {
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Compass className="w-4 h-4 text-blue-300" />
                        <span>St. Josemaria Escriva</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">The Way</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
                        999 points for meditation, intended to help you live as a child of God in the middle of the world.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by keyword or point number..."
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading meditation points...</p>
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {searchTerm ? `Search Results (${filteredPoints.length})` : "Browse All Points"}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <BookOpen className="w-4 h-4" />
                                <span>{points.length} points loaded</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {currentPoints.map((point) => (
                                <div key={point.number} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-110" />

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                {point.number}
                                            </div>
                                            {point.chapter && (
                                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50/50 rounded-md">
                                                    {point.chapter}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => sharePoint(point)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-gray-800 text-lg font-serif leading-relaxed italic">
                                        "{point.content}"
                                    </p>
                                </div>
                            ))}
                        </div>

                        {filteredPoints.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No points found</h3>
                                <p className="text-gray-500">Try searching for a different keyword or point number.</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-6 px-6 py-2 text-blue-600 font-bold hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-4 bg-white border border-gray-200 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-bold text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-4 bg-white border border-gray-200 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer CTA */}
            <div className="bg-white border-t border-gray-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Quote className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">The Secret of Perseverance</h3>
                    <p className="text-gray-600 max-w-xl mx-auto mb-8 font-serif italic text-lg">
                        "And what is the secret of perseverance? Love. Fall in Love, and you will not leave him."
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/devotional"
                            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Back to Daily Devotionals
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
