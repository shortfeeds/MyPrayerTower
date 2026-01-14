'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Church, ChevronRight, ChevronDown, Loader2, Globe, X, CheckCircle, Phone, Mail, ExternalLink, Clock, Calendar, Heart, ShieldCheck, Flame, UserPlus, UserCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SmartAdSlot } from '@/components/ads';
import { Pagination } from '@/components/ui/Pagination';
import { SACRED_COPY } from '@/lib/sacred-copy';

interface ChurchData {
    id: string;
    name: string;
    slug: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    countryCode: string | null;
    postalCode: string | null;
    type: string | null;
    denomination: string | null;
    isVerified: boolean;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    description: string | null;
    shortDescription: string | null;
    massSchedule: any;
    confessionSchedule: any;
    adorationSchedule: any;
    primaryImageUrl: string | null;
    viewCount: number;
    followerCount: number;
    isFollowed?: boolean;
    Diocese: { id: string; name: string; type: string } | null;
}

interface Filters {
    countries: { code: string; name: string; count: number }[];
    types: { type: string; count: number }[];
    denominations: { denomination: string; count: number }[];
}

const CHURCH_TYPE_LABELS: Record<string, string> = {
    PARISH: '⛪ Parish',
    CATHEDRAL: '🏛️ Cathedral',
    BASILICA: '🕌 Basilica',
    CHAPEL: '🕯️ Chapel',
    SHRINE: '✨ Shrine',
    MONASTERY: '🏔️ Monastery',
    ABBEY: '📿 Abbey',
    MISSION: '🌍 Mission',
    OTHER: 'Other'
};

function formatSchedule(schedule: any): string | null {
    if (!schedule) return null;
    if (typeof schedule === 'string') return schedule;
    if (Array.isArray(schedule)) return schedule.join(', ');
    if (typeof schedule === 'object') {
        const entries = Object.entries(schedule);
        if (entries.length === 0) return null;
        return entries.slice(0, 2).map(([day, time]) => `${day}: ${time}`).join(' • ');
    }
    return null;
}

export default function ChurchesClient() {
    const [churches, setChurches] = useState<ChurchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState<Filters | null>(null);

    // Active filters - Default denomination REMOVED
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const [selectedDenomination, setSelectedDenomination] = useState('Catholic'); // Default to Catholic

    // Claim mode logic
    const searchParams = useSearchParams();
    const isClaimMode = searchParams.get('claim') === 'true';

    const fetchChurches = async (targetPage = 1) => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                page: targetPage.toString(),
                limit: '15',
                ...(searchQuery && { search: searchQuery }),
                ...(selectedCountry && { country: selectedCountry }),
                ...(selectedType && { type: selectedType }),
                ...(selectedDenomination && { denomination: selectedDenomination })
            });

            const res = await fetch(`/api/churches?${params}`);
            const data = await res.json();

            setChurches(data.churches || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 0);
            setPage(targetPage);

            if (data.filters) setFilters(data.filters);

            // Scroll to top
            if (targetPage > 1) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error('Failed to fetch churches:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchChurches(1), 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCountry, selectedType, selectedDenomination]);

    const handlePageChange = (newPage: number) => {
        fetchChurches(newPage);
    };

    const handleFollow = async (e: React.MouseEvent, church: ChurchData) => {
        e.preventDefault();
        e.stopPropagation();

        const action = church.isFollowed ? 'unfollow' : 'follow';

        // Optimistic update
        setChurches(prev => prev.map(c => {
            if (c.id === church.id) {
                return {
                    ...c,
                    isFollowed: !c.isFollowed,
                    followerCount: c.isFollowed ? c.followerCount - 1 : c.followerCount + 1
                };
            }
            return c;
        }));

        try {
            const res = await fetch('/api/churches/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ churchId: church.id, action })
            });

            if (!res.ok) {
                if (res.status === 401) {
                    alert('Please sign in to follow churches');
                }
                throw new Error('Failed to update follow status');
            }
        } catch (err) {
            // Revert on error
            setChurches(prev => prev.map(c => {
                if (c.id === church.id) {
                    return {
                        ...c,
                        isFollowed: !c.isFollowed,
                        followerCount: c.isFollowed ? c.followerCount + 1 : c.followerCount - 1
                    };
                }
                return c;
            }));
            console.error('Follow error:', err);
        }
    };

    const handleShare = async (church: ChurchData) => {
        const url = `${window.location.origin}/churches/${church.slug || church.id}`;
        const shareData = {
            title: church.name,
            text: `Check out ${church.name} on MyPrayerTower`,
            url: url
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                throw new Error('Web Share not supported');
            }
        } catch (err) {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url);
                // Simple feedback (could be replaced with a toast if available)
                const button = document.activeElement as HTMLElement;
                if (button) {
                    const originalTitle = button.title;
                    button.title = "Copied!";
                    setTimeout(() => button.title = originalTitle, 2000);
                }
                alert('Link copied to your clipboard!');
            } catch (clipboardErr) {
                console.error('Share failed:', err);
            }
        }
    };

    const clearFilters = () => {
        setSelectedCountry('');
        setSelectedType('');
        setSelectedDenomination('Catholic'); // Reset to Catholic default
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 pt-24 pb-8 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-4 border border-white/10">
                            <Globe className="w-4 h-4" />
                            <span>{Math.max(total, 8500).toLocaleString()}+ Catholic Churches</span>
                        </div>

                        {/* Claim Mode Banner Removed */}
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
                                <Church className="w-4 h-4" />
                                Catholic Directory
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                                {SACRED_COPY.churches.heroTitle}
                            </h1>
                            <p className="text-xl text-gray-600 font-light leading-relaxed">
                                {SACRED_COPY.churches.heroSubtitle}
                            </p>
                        </div>          {/* Search */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="relative bg-white rounded-xl shadow-2xl flex items-center">
                                <Search className="absolute left-5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, city, state, or address..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-10 py-4 bg-transparent text-slate-900 rounded-xl placeholder-slate-400 focus:outline-none text-base"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-4 p-1.5 hover:bg-slate-100 rounded-full">
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-4">
                <SmartAdSlot page="churches" position="top" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Listings */}
                    <div className="flex-1">
                        {/* Active Filters Display (Mobile) */}
                        <div className="lg:hidden mb-4 overflow-x-auto pb-2">
                            {(selectedCountry || selectedType || selectedDenomination) && (
                                <div className="flex gap-2">
                                    <button onClick={clearFilters} className="text-xs text-blue-600 font-medium whitespace-nowrap">Clear All</button>
                                    {selectedCountry && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">{selectedCountry}</span>}
                                    {selectedType && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full whitespace-nowrap">{selectedType}</span>}
                                    {selectedDenomination && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full whitespace-nowrap">{selectedDenomination}</span>}
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                                <p className="text-slate-500 text-sm">Searching churches...</p>
                            </div>
                        ) : churches.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                                <Church className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Churches Found</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                    We couldn't find any churches matching your search. Try adjusting your filters or search terms.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={clearFilters} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                                        Clear Filters
                                    </button>
                                    <Link href="/contact" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                        Submit a Church
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {churches.map((church, index) => {
                                    const massInfo = formatSchedule(church.massSchedule);
                                    const confessionInfo = formatSchedule(church.confessionSchedule);
                                    const adorationInfo = formatSchedule(church.adorationSchedule);
                                    const detailHref = `/churches/${church.slug || church.id}${isClaimMode ? '?claim=true' : ''}`;

                                    return (
                                        <React.Fragment key={church.id}>
                                            <div
                                                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all group"
                                            >
                                                <div className="p-5">
                                                    <div className="flex gap-4">
                                                        {/* Image/Icon */}
                                                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                                            {church.primaryImageUrl ? (
                                                                <img src={church.primaryImageUrl} alt={church.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Church className="w-8 h-8 text-white relative z-10" />
                                                            )}
                                                        </div>

                                                        {/* Main Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                                <div>
                                                                    <Link href={detailHref} className="block">
                                                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                                                                            {church.name}
                                                                        </h3>
                                                                    </Link>
                                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                                        {church.Diocese && (
                                                                            <span>{church.Diocese.name}</span>
                                                                        )}
                                                                        {church.followerCount > 0 && (
                                                                            <span className="flex items-center gap-1 text-slate-400 px-2 py-0.5 bg-slate-50 rounded-full text-xs">
                                                                                <Users className="w-3 h-3" />
                                                                                {church.followerCount}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Badges & Actions */}
                                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                                    <button
                                                                        onClick={(e) => handleFollow(e, church)}
                                                                        className={`p-1.5 rounded-full transition-colors ${church.isFollowed
                                                                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                                                            : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                                                                            }`}
                                                                        title={church.isFollowed ? "Unfollow" : "Follow Church"}
                                                                    >
                                                                        {church.isFollowed ? (
                                                                            <UserCheck className="w-4 h-4" />
                                                                        ) : (
                                                                            <UserPlus className="w-4 h-4" />
                                                                        )}
                                                                    </button>

                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            handleShare(church);
                                                                        }}
                                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                                        title="Share"
                                                                    >
                                                                        <ExternalLink className="w-4 h-4" />
                                                                    </button>

                                                                    {church.isVerified ? (
                                                                        <Link href={detailHref} className="group/badge relative z-10 ml-1">
                                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full cursor-help shadow-sm hover:shadow-md transition-all">
                                                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                                                Verified
                                                                            </span>
                                                                        </Link>
                                                                    ) : (
                                                                        <span />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Address */}
                                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
                                                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                                <span className="truncate">
                                                                    {[church.address, church.city, church.state, church.country].filter(Boolean).join(', ')}
                                                                </span>
                                                            </div>

                                                            {/* Enhanced Schedules with Grid */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                                                                {massInfo ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                                                        <span className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Mass:</span>
                                                                        <span className="truncate text-slate-600">{massInfo}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-slate-400">
                                                                        <Clock className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
                                                                        <span className="text-xs">No mass times listed</span>
                                                                    </div>
                                                                )}

                                                                {confessionInfo && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Heart className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                                                                        <span className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Confession:</span>
                                                                        <span className="truncate text-slate-600">{confessionInfo}</span>
                                                                    </div>
                                                                )}

                                                                {adorationInfo && (
                                                                    <div className="flex items-center gap-2 sm:col-span-2">
                                                                        <Flame className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                                                        <span className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Adoration:</span>
                                                                        <span className="truncate text-slate-600">{adorationInfo}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Tags Row */}
                                                            <div className="flex items-center gap-2">
                                                                {church.type && (
                                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                                                                        {CHURCH_TYPE_LABELS[church.type]?.replace(/^[^\s]+\s/, '') || church.type}
                                                                    </span>
                                                                )}
                                                                {church.denomination && (
                                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                                                                        {church.denomination}
                                                                    </span>
                                                                )}
                                                            </div>

                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            {church.phone && (
                                                                <a href={`tel:${church.phone}`} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors">
                                                                    <Phone className="w-4 h-4" />
                                                                    <span className="hidden sm:inline">{church.phone}</span>
                                                                </a>
                                                            )}
                                                            {church.website && (
                                                                <a href={church.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors">
                                                                    <Globe className="w-4 h-4" />
                                                                    <span className="hidden sm:inline">Website</span>
                                                                </a>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {church.latitude && church.longitude && (
                                                                <a
                                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                                                >
                                                                    <MapPin className="w-4 h-4" />
                                                                    Directions
                                                                </a>
                                                            )}
                                                            <Link
                                                                href={detailHref}
                                                                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                                            >
                                                                View Details
                                                                <ChevronRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Inline Ad every 5 items */}
                                            {(index + 1) % 5 === 0 && index < churches.length - 1 && (
                                                <div key={`ad-${index}`}>
                                                    <SmartAdSlot page="churches" position="inline" />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />

                    </div>

                    {/* Sidebar with Filters */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-24 space-y-6">

                            {/* Filters Card */}
                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold border-b border-slate-100 pb-3">
                                    <Search className="w-4 h-4 text-blue-600" />
                                    <h3>Refine Search</h3>
                                </div>
                                <div className="space-y-4">
                                    {/* Country Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Country</label>
                                        <select
                                            value={selectedCountry}
                                            onChange={(e) => setSelectedCountry(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        >
                                            <option value="">All Countries</option>
                                            {filters?.countries?.map(c => (
                                                <option key={c.code} value={c.code}>{c.name} ({c.count})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Type Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Church Type</label>
                                        <select
                                            value={selectedType}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        >
                                            <option value="">All Types</option>
                                            {filters?.types?.map(t => (
                                                <option key={t.type} value={t.type}>{CHURCH_TYPE_LABELS[t.type] || t.type} ({t.count})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Denomination Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Denomination</label>
                                        <select
                                            value={selectedDenomination}
                                            onChange={(e) => setSelectedDenomination(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        >
                                            <option value="">All Denominations</option>
                                            {filters?.denominations?.map(d => (
                                                <option key={d.denomination} value={d.denomination}>{d.denomination} ({d.count})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {(selectedCountry || selectedType || selectedDenomination) && (
                                        <button
                                            onClick={clearFilters}
                                            className="w-full py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors dashed border border-slate-200"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            <SmartAdSlot page="churches" position="sidebar" />

                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <h4 className="font-semibold text-slate-900 mb-3">Directory Stats</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total Churches</span>
                                        <span className="font-semibold text-slate-900">{Math.max(total, 8500).toLocaleString()}+</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Countries</span>
                                        <span className="font-semibold text-slate-900">{filters?.countries?.length || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                                <h4 className="font-bold text-gray-900 mb-2">Help Grow the Directory</h4>
                                <p className="text-gray-600 text-sm mb-3">Know a church that isn't listed? Help others find their way home.</p>
                                <Link href="/contact" className="block w-full text-center py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm border border-blue-200">
                                    Submit a Church
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
