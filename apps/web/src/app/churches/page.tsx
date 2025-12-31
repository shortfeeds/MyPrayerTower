'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, Church, ChevronRight, Loader2, Globe, X, CheckCircle, Sparkles, Building2, Phone } from 'lucide-react';
import Link from 'next/link';

interface ChurchData {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
    countryCode: string | null;
    type: string | null;
    denomination: string | null;
    isVerified: boolean;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    primaryImageUrl: string | null;
    viewCount: number;
    followerCount: number;
}

interface AdBanner {
    id: string;
    imageUrl: string;
    linkUrl: string;
    altText: string;
    position: string;
}

// Ad Placeholder Component
function AdPlaceholder({ position, className = '' }: { position: string; className?: string }) {
    return (
        <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-blue-200/50 relative overflow-hidden group hover:border-blue-300 transition-all ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center relative z-10 p-6">
                <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500 font-medium">Sponsored</p>
                <Link href="/advertise" className="text-[10px] text-blue-500 hover:underline">Advertise here</Link>
            </div>
        </div>
    );
}

export default function ChurchesPage() {
    const [churches, setChurches] = useState<ChurchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [ads, setAds] = useState<{ top?: AdBanner; sidebar?: AdBanner; inline?: AdBanner }>({});

    useEffect(() => {
        fetch('/api/sponsored?page=churches')
            .then(res => res.json())
            .then(data => {
                if (data.ads) {
                    const adsMap: any = {};
                    data.ads.forEach((ad: AdBanner) => {
                        adsMap[ad.position] = ad;
                    });
                    setAds(adsMap);
                }
            })
            .catch(err => console.log('No ads available'));
    }, []);

    const fetchChurches = async (reset = false) => {
        try {
            setLoading(true);
            const currentPage = reset ? 1 : page;
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '20',
                ...(searchQuery && { search: searchQuery })
            });

            const res = await fetch(`/api/churches?${params}`);
            const data = await res.json();

            if (reset) {
                setChurches(data.churches || []);
                setPage(2);
            } else {
                setChurches(prev => [...prev, ...(data.churches || [])]);
                setPage(prev => prev + 1);
            }

            setTotal(data.total || 0);
            setHasMore((data.churches?.length || 0) === 20);
        } catch (err) {
            console.error('Failed to fetch churches:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchChurches(true), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const trackAdClick = (adId: string) => {
        fetch(`/api/sponsored/${adId}/click`, { method: 'POST' }).catch(() => { });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400 rounded-full blur-3xl animate-pulse delay-700" />
                </div>

                <div className="relative z-10 pt-28 pb-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
                            <Globe className="w-4 h-4 text-blue-200" />
                            <span>{total.toLocaleString()}+ Churches Worldwide</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                            Find Catholic
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                Churches
                            </span>
                        </h1>
                        <p className="text-xl text-blue-100/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Discover parishes, view Mass times, get directions, and connect with your local faith community.
                        </p>

                        {/* Glassmorphism Search */}
                        <div className="relative max-w-2xl mx-auto group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center">
                                <Search className="absolute left-6 w-6 h-6 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by church name, city, or country..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-16 pr-12 py-5 bg-transparent text-gray-900 rounded-2xl placeholder-gray-400 focus:outline-none text-lg"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-5 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Ad Banner */}
            {ads.top ? (
                <div className="container mx-auto px-4 py-4">
                    <a
                        href={ads.top.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() => trackAdClick(ads.top!.id)}
                        className="block"
                    >
                        <img src={ads.top.imageUrl} alt={ads.top.altText} className="max-h-24 mx-auto rounded-xl" />
                    </a>
                    <p className="text-center text-[10px] text-gray-400 mt-1">Sponsored</p>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-6">
                    <AdPlaceholder position="top" className="h-24" />
                </div>
            )}

            {/* Results Section */}
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900">
                                    {searchQuery ? `Results for "${searchQuery}"` : 'Browse Churches'}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    {loading && churches.length === 0 ? 'Searching...' : `Showing ${churches.length} of ${total.toLocaleString()} churches`}
                                </p>
                            </div>
                        </div>

                        {loading && churches.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                <p className="text-gray-500">Loading churches...</p>
                            </div>
                        ) : churches.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Church className="w-10 h-10 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Churches Found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your search terms</p>
                                <button onClick={() => setSearchQuery('')} className="text-blue-600 font-semibold hover:underline">
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {churches.map((church, index) => (
                                    <div key={church.id}>
                                        {/* Inline Ad - Show after every 5th listing */}
                                        {ads.inline && index > 0 && index % 5 === 0 && (
                                            <a
                                                href={ads.inline.linkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer sponsored"
                                                onClick={() => trackAdClick(ads.inline!.id)}
                                                className="block bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 mb-4"
                                            >
                                                <img src={ads.inline.imageUrl} alt={ads.inline.altText} className="max-h-20 mx-auto" />
                                                <p className="text-center text-[10px] text-gray-400 mt-1">Sponsored</p>
                                            </a>
                                        )}
                                        {!ads.inline && index > 0 && index % 5 === 0 && (
                                            <div className="mb-4">
                                                <AdPlaceholder position="inline" className="h-28" />
                                            </div>
                                        )}

                                        {/* Church Card */}
                                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                                            <div className="p-5 md:p-6">
                                                <div className="flex flex-col md:flex-row md:items-start gap-5">
                                                    {/* Church Icon/Image Placeholder */}
                                                    <div className="w-full md:w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden relative">
                                                        {church.primaryImageUrl ? (
                                                            <img src={church.primaryImageUrl} alt={church.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Church className="w-8 h-8 text-white" />
                                                        )}
                                                    </div>

                                                    {/* Church Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                                                            <Link href={`/churches/${church.id}`} className="block flex-1">
                                                                <h3 className="font-bold text-gray-900 text-xl font-serif group-hover:text-blue-600 transition-colors">
                                                                    {church.name}
                                                                </h3>
                                                            </Link>
                                                            <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                                                                {church.isVerified && (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                                                                        <CheckCircle className="w-3 h-3" /> Verified
                                                                    </span>
                                                                )}
                                                                {church.denomination && (
                                                                    <span className="inline-flex px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
                                                                        {church.denomination}
                                                                    </span>
                                                                )}
                                                                {church.type && (
                                                                    <span className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                                                        {church.type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 flex-wrap">
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span className="line-clamp-1">
                                                                    {church.address || [church.city, church.country].filter(Boolean).join(', ') || 'Location details available'}
                                                                </span>
                                                            </div>
                                                            {church.phone && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                                    <span>{church.phone}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Stats & Actions */}
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                                {(church.viewCount || 0) > 0 && <span>{church.viewCount?.toLocaleString()} views</span>}
                                                                {(church.followerCount || 0) > 0 && <span>• {church.followerCount?.toLocaleString()} followers</span>}
                                                            </div>

                                                            <div className="flex gap-3">
                                                                <Link
                                                                    href={`/churches/${church.id}`}
                                                                    className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1"
                                                                >
                                                                    View Details <ChevronRight className="w-4 h-4" />
                                                                </Link>

                                                                {church.latitude && church.longitude && (
                                                                    <a
                                                                        href={`https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 transition-colors"
                                                                    >
                                                                        <MapPin className="w-3.5 h-3.5" />
                                                                        Directions
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Load More */}
                        {!loading && hasMore && churches.length > 0 && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => fetchChurches(false)}
                                    className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                                >
                                    Load More Churches
                                </button>
                            </div>
                        )}

                        {loading && churches.length > 0 && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-28 space-y-6">
                            {ads.sidebar ? (
                                <a
                                    href={ads.sidebar.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    onClick={() => trackAdClick(ads.sidebar!.id)}
                                    className="block bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                                >
                                    <img src={ads.sidebar.imageUrl} alt={ads.sidebar.altText} className="w-full rounded-xl" />
                                    <p className="text-center text-[10px] text-gray-400 mt-2">Sponsored</p>
                                </a>
                            ) : (
                                <AdPlaceholder position="sidebar" className="aspect-[4/5]" />
                            )}

                            {/* For Churches CTA */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                                <h4 className="font-bold text-lg mb-2">Are you a Parish?</h4>
                                <p className="text-indigo-100 text-sm mb-4">Claim your church listing to manage your information and connect with parishioners.</p>
                                <Link href="/for-churches" className="block w-full text-center py-2.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
