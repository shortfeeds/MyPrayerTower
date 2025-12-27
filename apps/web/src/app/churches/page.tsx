'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, Filter, ChurchIcon, Clock, Phone, Globe, Star, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming this hook exists or I should implement debouncing logic manually

export default function ChurchesPage() {
    const [churches, setChurches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters & Sorting state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDenomination, setSelectedDenomination] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'distance' | 'popularity' | 'recent'>('name');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const denominations = ['All', 'Catholic', 'Orthodox', 'Other'];

    // Fetch User Location
    const getUserLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setSortBy('distance'); // Auto-switch to distance sort on location find
            }, (err) => {
                console.error("Location error:", err);
            });
        }
    };

    // Data Fetching
    const fetchChurches = async (reset = false) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: reset ? '1' : page.toString(),
                limit: '12',
                sortBy,
                sortOrder: 'asc', // Default asc, could toggle
                ...(searchQuery && { search: searchQuery }),
                ...(selectedDenomination !== 'All' && { denomination: selectedDenomination }),
                ...(userLocation && { userLat: userLocation.lat.toString(), userLng: userLocation.lng.toString() })
            });

            const res = await fetch(`/api/churches?${queryParams}`);
            if (!res.ok) throw new Error('Failed to fetch churches');

            const data = await res.json();

            if (reset) {
                setChurches(data.churches);
            } else {
                setChurches(prev => [...prev, ...data.churches]);
            }

            setHasMore(data.churches.length === 12); // If we got full limit, likely more
            if (reset) setPage(2);
            else setPage(prev => prev + 1);

        } catch (err) {
            console.error(err);
            setError('Could not load churches. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchChurches(true);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedDenomination, sortBy, userLocation]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Header */}
            <div className="bg-primary-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                        ⛪ Find Churches Near You
                    </h1>

                    <div className="max-w-3xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Location Search */}
                            <div className="flex-1 relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter city, zip code, or church name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-300"
                                />
                            </div>

                            {/* Use Location Button */}
                            <button
                                onClick={getUserLocation}
                                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                title="Use my location"
                            >
                                <MapPin className="w-5 h-5" />
                                Near Me
                            </button>

                            {/* Search Button */}
                            <button onClick={() => fetchChurches(true)} className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                                <Search className="w-5 h-5" />
                                Search
                            </button>
                        </div>

                        {/* Filter Toggle */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-primary-200 hover:text-white transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>

                            {userLocation && (
                                <span className="text-sm text-green-300 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Location Found
                                </span>
                            )}
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                <div className="flex flex-wrap gap-2">
                                    {denominations.map((denom) => (
                                        <button
                                            key={denom}
                                            onClick={() => setSelectedDenomination(denom)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedDenomination === denom
                                                ? 'bg-gold-500 text-white'
                                                : 'bg-white/20 text-white hover:bg-white/30'
                                                }`}
                                        >
                                            {denom}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <p className="text-gray-600">
                        {loading && churches.length === 0 ? 'Loading...' :
                            `Showing ${churches.length} results`}
                    </p>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="name">Sort by: Name</option>
                        <option value="distance">Sort by: Distance</option>
                        <option value="popularity">Sort by: Popularity</option>
                        <option value="recent">Sort by: Recently Added</option>
                    </select>
                </div>

                {error && (
                    <div className="text-center py-12 bg-red-50 text-red-600 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Church Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {churches.map((church) => (
                        <Link
                            key={church.id}
                            href={`/churches/${church.id}`}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                        >
                            {/* Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
                                {church.primaryImageUrl ? (
                                    <img src={church.primaryImageUrl} alt={church.name} className="w-full h-full object-cover" />
                                ) : (
                                    <ChurchIcon className="w-20 h-20 text-primary-400" />
                                )}
                                {church.isVerified && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified
                                    </div>
                                )}
                                {church.distance && (
                                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                                        {church.distance < 1 ? '< 1 km' : `${Math.round(church.distance)} km`}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">{church.name}</h3>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                        {church.type || 'Church'}
                                    </span>
                                    <span>•</span>
                                    <span>{church.city}, {church.countryCode}</span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 flex items-start gap-2">
                                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{church.address}</span>
                                </p>

                                {/* Mass Times Preview - if available */}
                                {church.massSchedule?.sunday && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                        <Clock className="w-4 h-4" />
                                        <span>Sun: {Array.isArray(church.massSchedule.sunday) ? church.massSchedule.sunday.slice(0, 2).join(', ') : 'Check details'}</span>
                                    </div>
                                )}

                                {/* Popularity / Views */}
                                <div className="flex items-center justify-between border-t pt-4 mt-auto">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Star className="w-4 h-4 text-gold-500" />
                                        <span>{church.viewCount || 0} views</span>
                                    </div>
                                    <button className="text-primary-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                        View Details
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                )}

                {!loading && churches.length === 0 && !error && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <ChurchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No churches found</h3>
                        <p className="text-gray-500 mb-4">Try a different search term or location</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedDenomination('All');
                            }}
                            className="text-primary-600 hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* Load More */}
                {!loading && hasMore && churches.length > 0 && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => fetchChurches(false)}
                            className="px-8 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-full transition-colors"
                        >
                            Load More Churches
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
