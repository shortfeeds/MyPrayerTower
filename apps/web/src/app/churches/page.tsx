'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Church, ChevronRight, ChevronDown, Loader2, Globe, X, CheckCircle, Phone, Mail, ExternalLink, Clock, Calendar, Heart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SmartAdSlot } from '@/components/ads';

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

export default function ChurchesPage() {
    const [churches, setChurches] = useState<ChurchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState<Filters | null>(null);

    // Active filters
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedDenomination, setSelectedDenomination] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const activeFilterCount = [selectedCountry, selectedType, selectedDenomination].filter(Boolean).length;

    // Claim mode logic
    const searchParams = useSearchParams();
    const isClaimMode = searchParams.get('claim') === 'true';

    const fetchChurches = async (reset = false) => {
        try {
            setLoading(true);
            const currentPage = reset ? 1 : page;
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '15',
                ...(searchQuery && { search: searchQuery }),
                ...(selectedCountry && { country: selectedCountry }),
                ...(selectedType && { type: selectedType }),
                ...(selectedDenomination && { denomination: selectedDenomination })
            });

            const res = await fetch(`/api/churches?${params}`);
            const data = await res.json();

            if (reset) {
                setChurches(data.churches || []);
                setPage(2);
                if (data.filters) setFilters(data.filters);
            } else {
                setChurches(prev => [...prev, ...(data.churches || [])]);
                setPage(prev => prev + 1);
            }

            setTotal(data.total || 0);
            setHasMore((data.churches?.length || 0) === 15);
        } catch (err) {
            console.error('Failed to fetch churches:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchChurches(true), 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCountry, selectedType, selectedDenomination]);

    const clearFilters = () => {
        setSelectedCountry('');
        setSelectedType('');
        setSelectedDenomination('');
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

                        {/* Claim Mode Banner */}
                        {isClaimMode && (
                            <div className="mb-6 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-xl p-4 max-w-2xl mx-auto animate-fade-in-up">
                                <h2 className="text-xl font-bold text-amber-200 mb-1">Step 1: Find Your Parish</h2>
                                <p className="text-white text-sm">Search for your church below to claim it. If you can't find it, use the "Submit a Church" button.</p>
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
                            Church Directory
                        </h1>
                        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                            Find Mass times, confession schedules, and connect with parishes worldwide.
                        </p>

                        {/* Search */}
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

            {/* Filters Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${showFilters ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Quick Filter Pills */}
                            {selectedCountry && (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full">
                                    {filters?.countries.find(c => c.code === selectedCountry)?.name || selectedCountry}
                                    <button onClick={() => setSelectedCountry('')}><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {selectedType && (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-full">
                                    {CHURCH_TYPE_LABELS[selectedType] || selectedType}
                                    <button onClick={() => setSelectedType('')}><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {selectedDenomination && (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                                    {selectedDenomination}
                                    <button onClick={() => setSelectedDenomination('')}><X className="w-3 h-3" /></button>
                                </span>
                            )}

                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-slate-700 whitespace-nowrap">
                                    Clear all
                                </button>
                            )}
                        </div>

                        <span className="text-sm text-slate-500 whitespace-nowrap">
                            {total.toLocaleString()} results
                        </span>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && filters && (
                        <div className="grid sm:grid-cols-3 gap-4 pt-4 mt-3 border-t border-slate-100">
                            {/* Country */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Country</label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Countries</option>
                                    {filters.countries.map(c => (
                                        <option key={c.code} value={c.code}>{c.name} ({c.count})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Church Type</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {filters.types.map(t => (
                                        <option key={t.type} value={t.type}>{CHURCH_TYPE_LABELS[t.type] || t.type} ({t.count})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Denomination */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Denomination</label>
                                <select
                                    value={selectedDenomination}
                                    onChange={(e) => setSelectedDenomination(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Denominations</option>
                                    {filters.denominations.map(d => (
                                        <option key={d.denomination} value={d.denomination}>{d.denomination} ({d.count})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-4">
                <SmartAdSlot page="churches" position="top" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Listings */}
                    <div className="flex-1">
                        {loading && churches.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                                <p className="text-slate-500 text-sm">Loading churches...</p>
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
                                    const detailHref = `/churches/${church.slug || church.id}${isClaimMode ? '?claim=true' : ''}`;

                                    return (
                                        <React.Fragment key={church.id}>
                                            <div
                                                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all group"
                                            >
                                                <div className="p-5">
                                                    <div className="flex gap-4">
                                                        {/* Image/Icon */}
                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                            {church.primaryImageUrl ? (
                                                                <img src={church.primaryImageUrl} alt={church.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Church className="w-7 h-7 text-white" />
                                                            )}
                                                        </div>

                                                        {/* Main Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                                <div>
                                                                    <Link href={`/churches/${church.slug || church.id}`} className="block">
                                                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                                                                            {church.name}
                                                                        </h3>
                                                                    </Link>
                                                                    {church.Diocese && (
                                                                        <p className="text-sm text-slate-500">{church.Diocese.name}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    {church.isVerified ? (
                                                                        <div className="group relative">
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-800 text-xs font-bold rounded-full cursor-help shadow-sm">
                                                                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Verified Parish
                                                                            </span>
                                                                            {/* Tooltip */}
                                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                                                                                Verified by Parish Administration
                                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <Link
                                                                            href={`/churches/claim?id=${church.id}`}
                                                                            className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            Own this? Claim it
                                                                        </Link>
                                                                    )}
                                                                    {church.type && (
                                                                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                                                                            {CHURCH_TYPE_LABELS[church.type]?.replace(/^[^\s]+\s/, '') || church.type}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Address */}
                                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-2">
                                                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                                <span className="truncate">
                                                                    {[church.address, church.city, church.state, church.country].filter(Boolean).join(', ')}
                                                                </span>
                                                            </div>

                                                            {/* Schedules */}
                                                            <div className="flex flex-wrap gap-3 text-sm">
                                                                {massInfo && (
                                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                                        <Clock className="w-4 h-4 text-amber-500" />
                                                                        <span className="font-medium text-slate-700">Mass:</span>
                                                                        <span className="truncate max-w-[200px]">{massInfo}</span>
                                                                    </div>
                                                                )}
                                                                {confessionInfo && (
                                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                                        <Heart className="w-4 h-4 text-purple-500" />
                                                                        <span className="font-medium text-slate-700">Confession:</span>
                                                                        <span className="truncate max-w-[180px]">{confessionInfo}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Description */}
                                                            {church.shortDescription && (
                                                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{church.shortDescription}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            {church.phone && (
                                                                <a href={`tel:${church.phone}`} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600">
                                                                    <Phone className="w-4 h-4" />
                                                                    <span>{church.phone}</span>
                                                                </a>
                                                            )}
                                                            {church.email && (
                                                                <a href={`mailto:${church.email}`} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600">
                                                                    <Mail className="w-4 h-4" />
                                                                    <span className="hidden sm:inline">Email</span>
                                                                </a>
                                                            )}
                                                            {church.website && (
                                                                <a href={church.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600">
                                                                    <ExternalLink className="w-4 h-4" />
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
                                                                    className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1"
                                                                >
                                                                    <MapPin className="w-4 h-4" />
                                                                    Directions
                                                                </a>
                                                            )}
                                                            <Link
                                                                href={detailHref}
                                                                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
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

                        {/* Load More */}
                        {!loading && hasMore && churches.length > 0 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => fetchChurches(false)}
                                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg transition-all"
                                >
                                    Load More Churches
                                </button>
                            </div>
                        )}

                        {loading && churches.length > 0 && (
                            <div className="flex justify-center py-6">
                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-36 space-y-4">
                            <SmartAdSlot page="churches" position="sidebar" />

                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <h4 className="font-semibold text-slate-900 mb-3">Quick Stats</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total Churches</span>
                                        <span className="font-semibold text-slate-900">{Math.max(total, 8500).toLocaleString()}+</span>
                                    </div>
                                    {filters && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Countries</span>
                                                <span className="font-semibold text-slate-900">{filters.countries.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Church Types</span>
                                                <span className="font-semibold text-slate-900">{filters.types.length}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white">
                                <h4 className="font-bold mb-2">Are you a Parish?</h4>
                                <p className="text-blue-100 text-sm mb-3">Claim your listing to manage information and connect with parishioners.</p>
                                <Link href="/churches/demo" className="block w-full text-center py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm">
                                    See Demo Profile
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
