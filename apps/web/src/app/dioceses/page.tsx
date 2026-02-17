'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, Building2, Globe, Users, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';



import { getDioceses, DioceseDto } from '@/app/actions/dioceses';

const COUNTRIES = ['All Countries', 'United States', 'United Kingdom', 'India', 'Philippines', 'Australia'];

export default function DiocesesPage() {
    const [dioceses, setDioceses] = useState<DioceseDto[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('All Countries');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDioceses = async () => {
            setLoading(true);
            try {
                const data = await getDioceses(search, selectedCountry);
                setDioceses(data);
            } catch (error) {
                console.error('Failed to load dioceses', error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(() => {
            loadDioceses();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, selectedCountry]);

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'archdiocese': return { label: 'Archdiocese', color: 'bg-purple-100 text-purple-700' };
            case 'diocese': return { label: 'Diocese', color: 'bg-blue-100 text-blue-700' };
            case 'eparchy': return { label: 'Eparchy', color: 'bg-amber-100 text-amber-700' };
            default: return { label: 'Diocese', color: 'bg-blue-100 text-blue-700' };
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Building2 className="w-4 h-4 text-indigo-300" />
                        <span>Church Organization</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Diocese Directory</h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
                        Explore the territorial organization of the Catholic Church — archdioceses, dioceses, and eparchies worldwide.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold">3,000+</div>
                            <div className="text-indigo-200 text-sm">Dioceses Worldwide</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">120</div>
                            <div className="text-indigo-200 text-sm">Countries</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search diocese or province..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {COUNTRIES.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {/* Results */}
                {!loading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dioceses.map(diocese => {
                            const badge = getTypeBadge(diocese.type);
                            return (
                                <div key={diocese.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                        {diocese.churchCount > 0 && (
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Building2 className="w-3 h-3" />
                                                {diocese.churchCount} churches
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {diocese.name}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <Globe className="w-4 h-4" />
                                        <span>{diocese.country} {diocese.province ? `• ${diocese.province}` : ''}</span>
                                    </div>

                                    <Link
                                        href={`/churches?diocese=${encodeURIComponent(diocese.name)}`}
                                        className="flex items-center text-indigo-600 text-sm font-medium group-hover:underline"
                                    >
                                        View Churches
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && dioceses.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <MapPin className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No dioceses found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}

                {/* Info */}
                <div className="mt-16 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-3xl p-8 md:p-12 text-center">
                    <Users className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Expanding Global Directory</h3>
                    <p className="text-gray-600 max-w-xl mx-auto mb-8">
                        We are continuously updating our database with the latest information for over 3,000 dioceses worldwide.
                        If you don't see your diocese yet, it may be added in our next sync.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/churches" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors">
                            Browse Churches
                        </Link>
                        <Link href="/hierarchy" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors">
                            Cardinals Directory
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
