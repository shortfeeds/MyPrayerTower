'use client';

import { Search, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// === SEARCH ===
export function PrayerSearch() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [term, setTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setTerm(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = (newValue: string) => {
        setTerm(newValue);
        const params = new URLSearchParams(searchParams.toString());
        if (newValue) {
            params.set('q', newValue);
            params.set('page', '1'); // Reset page
        } else {
            params.delete('q');
        }
        // Debounce actual navigation
        const timeoutId = setTimeout(() => {
            router.replace(`/prayers?${params.toString()}`);
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    return (
        <div className="relative w-full max-w-xl mx-auto mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={term}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for prayers (e.g. 'healing', 'peace')..."
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sacred-500 focus:border-transparent text-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {term && (
                    <button
                        onClick={() => handleSearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full text-gray-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

// === FILTER ===
interface CategoryProps {
    categories: { name: string; count: number }[];
}

export function PrayerFilter({ categories }: CategoryProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentCategory = searchParams.get('category') || 'All';
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category && category !== 'All') {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        params.set('page', '1'); // Reset page
        router.replace(`/prayers?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <div className="mb-8">
            {/* Mobile Dropdown */}
            <div className="md:hidden relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium"
                >
                    <span className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        {currentCategory === 'All' ? 'All Categories' : currentCategory}
                    </span>
                    <ChevronLeft className={`w-4 h-4 transition-transform ${isOpen ? '-rotate-90' : '-rotate-90'}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-1">
                        <button
                            onClick={() => handleSelect('All')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm ${currentCategory === 'All' ? 'bg-sacred-50 text-sacred-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            All Categories
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => handleSelect(c.name)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm flex justify-between ${currentCategory === c.name ? 'bg-sacred-50 text-sacred-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span>{c.name}</span>
                                <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{c.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Pills */}
            <div className="hidden md:flex flex-wrap gap-2 justify-center">
                <button
                    onClick={() => handleSelect('All')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentCategory === 'All'
                        ? 'bg-sacred-900 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-sacred-300 hover:text-sacred-600'
                        }`}
                >
                    All
                </button>
                {categories.map((c) => (
                    <button
                        key={c.name}
                        onClick={() => handleSelect(c.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${currentCategory === c.name
                            ? 'bg-sacred-900 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-sacred-300 hover:text-sacred-600'
                            }`}
                    >
                        {c.name}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${currentCategory === c.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {c.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// === PAGINATION ===
interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`/prayers?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-12 mb-8">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-full border border-gray-200 text-gray-600 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-gray-500">
                Page <span className="text-gray-900 font-bold">{currentPage}</span> of {totalPages}
            </span>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full border border-gray-200 text-gray-600 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
