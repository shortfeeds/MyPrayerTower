'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, Search, Navigation, ChevronRight } from 'lucide-react';

export function ChurchSearchWidget() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/churches?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleUseLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    window.location.href = `/churches?lat=${position.coords.latitude}&lng=${position.coords.longitude}`;
                },
                () => {
                    alert('Unable to access your location. Please enter a location manually.');
                }
            );
        }
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-sacred-600 to-sacred-800 rounded-3xl p-8 text-white shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute w-full h-full bg-hero-pattern"></div>
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-400 rounded-full blur-3xl opacity-20"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <MapPin className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                        <h3 className="font-display text-2xl font-bold">Find Mass Near You</h3>
                        <p className="text-sm text-blue-100/80">10,000+ Catholic churches worldwide</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Enter city, zip code, or parish name..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Search
                    </button>
                </form>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleUseLocation}
                        className="flex items-center gap-2 text-sm font-medium text-gold-300 hover:text-gold-200 transition-colors"
                    >
                        <Navigation className="w-4 h-4" />
                        Use My Location
                    </button>

                    <span className="text-white/30">•</span>

                    <Link href="/churches" className="flex items-center gap-1 text-sm font-medium text-blue-200 hover:text-white transition-colors">
                        Browse All Churches
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

