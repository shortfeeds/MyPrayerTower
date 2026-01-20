'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Users, Globe, Crown, ChevronDown } from 'lucide-react';

interface Cardinal {
    id: string;
    rank: number;
    name: string;
    country: string;
    born: string | null;
    order: string | null;
    consistory: string | null;
    office: string | null;
    papalConclaveEligible: boolean;
    createdCardinalBy: string | null;
}

interface CardinalsResponse {
    total: number;
    eligibleCount: number;
    countries: string[];
    cardinals: Cardinal[];
}

export default function HierarchyPage() {
    const [data, setData] = useState<CardinalsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('');
    const [showEligibleOnly, setShowEligibleOnly] = useState(false);

    useEffect(() => {
        fetchCardinals();
    }, [country, showEligibleOnly]);

    const fetchCardinals = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (country) params.set('country', country);
            if (showEligibleOnly) params.set('eligible', 'true');

            const res = await fetch(`/api/hierarchy/cardinals?${params.toString()}`);
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error('Failed to fetch cardinals:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCardinals = data?.cardinals.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.office?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const getOrderBadge = (order: string | null) => {
        switch (order) {
            case 'CB': return { label: 'Cardinal Bishop', color: 'bg-purple-100 text-purple-700' };
            case 'CP': return { label: 'Cardinal Priest', color: 'bg-blue-100 text-blue-700' };
            case 'CD': return { label: 'Cardinal Deacon', color: 'bg-green-100 text-green-700' };
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Crown className="w-4 h-4 text-yellow-300" />
                        <span>College of Cardinals</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Church Hierarchy</h1>
                    <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-10">
                        Explore the College of Cardinals — the Pope's principal counselors and electors.
                    </p>

                    {/* Stats */}
                    {data && (
                        <div className="flex justify-center gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold">{data.total}</div>
                                <div className="text-purple-200 text-sm">Total Cardinals</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-yellow-300">{data.eligibleCount}</div>
                                <div className="text-purple-200 text-sm">Papal Electors</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold">{data.countries.length}</div>
                                <div className="text-purple-200 text-sm">Countries</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or office..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 items-center">
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">All Countries</option>
                            {data?.countries.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showEligibleOnly}
                                onChange={(e) => setShowEligibleOnly(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Electors Only</span>
                        </label>
                    </div>
                </div>

                {/* Cardinals Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCardinals.map(cardinal => {
                            const orderBadge = getOrderBadge(cardinal.order);
                            return (
                                <div key={cardinal.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                                {cardinal.rank}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{cardinal.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Globe className="w-3 h-3" />
                                                    <span>{cardinal.country}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {cardinal.papalConclaveEligible && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                                                Elector
                                            </span>
                                        )}
                                    </div>

                                    {cardinal.office && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cardinal.office}</p>
                                    )}

                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {orderBadge && (
                                            <span className={`px-2 py-1 rounded-full font-medium ${orderBadge.color}`}>
                                                {orderBadge.label}
                                            </span>
                                        )}
                                        {cardinal.consistory && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                Created: {cardinal.consistory}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {filteredCardinals.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No cardinals found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
