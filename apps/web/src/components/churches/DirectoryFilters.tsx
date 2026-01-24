'use client';

import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

const DENOMINATIONS = [
    'Catholic', 'Orthodox', 'Anglican', 'Lutheran', 'Other'
];

const CHURCH_TYPES = [
    'PARISH', 'CATHEDRAL', 'BASILICA', 'CHAPEL', 'SHRINE', 'MONASTERY', 'CONVENT'
];

export function DirectoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [denomination, setDenomination] = useState(searchParams.get('denomination') || '');
    const [type, setType] = useState(searchParams.get('type') || '');
    const [showFilters, setShowFilters] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        if (debouncedQuery === currentQ) return;

        const params = new URLSearchParams(searchParams.toString());
        if (debouncedQuery) params.set('q', debouncedQuery);
        else params.delete('q');
        params.set('page', '1'); // Reset to page 1 on search

        startTransition(() => {
            router.push(`/churches?${params.toString()}`);
        });
    }, [debouncedQuery, router, searchParams]);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        params.set('page', '1');

        startTransition(() => {
            router.push(`/churches?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        setQuery('');
        setDenomination('');
        setType('');
        router.push('/churches');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, city, or zip..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all shadow-sm"
                    />
                    {isPending && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gold-500 border-t-transparent"></div>
                        </div>
                    )}
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold"
                >
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Desktop Filters / Expandable Mobile Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                <div className="flex flex-wrap items-center gap-4 bg-gray-100/50 dark:bg-gray-800/30 p-2 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                    {/* Denomination Select */}
                    <div className="relative group">
                        <select
                            value={denomination}
                            onChange={(e) => {
                                setDenomination(e.target.value);
                                handleFilterChange('denomination', e.target.value);
                            }}
                            className="appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:border-gold-500 transition-all cursor-pointer"
                        >
                            <option value="">All Denominations</option>
                            {DENOMINATIONS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Church Type Select */}
                    <div className="relative group">
                        <select
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                handleFilterChange('type', e.target.value);
                            }}
                            className="appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:border-gold-500 transition-all cursor-pointer"
                        >
                            <option value="">All Types</option>
                            {CHURCH_TYPES.map(t => (
                                <option key={t} value={t}>{t.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {(query || denomination || type) && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
