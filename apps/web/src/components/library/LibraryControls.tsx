'use client';

import { Search, X, ChevronLeft, ChevronRight, Filter, Sparkles, Compass, BookOpen } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// === QUICK SEARCH TOPICS ===
const QUICK_SEARCH_CHIPS = [
    { label: "🏥 Major Surgery", query: "surgery" },
    { label: "🕯️ Desert Fathers", query: "desert fathers" },
    { label: "😰 Anxiety & Panic", query: "anxiety" },
    { label: "👶 Childbirth", query: "childbirth" },
    { label: "🎓 Exams & Study", query: "exams" },
    { label: "⚖️ Court Trial", query: "court" },
    { label: "🏠 House Blessing", query: "house blessing" },
    { label: "🚗 Safe Driving", query: "driving" },
    { label: "🕊️ Deliverance", query: "deliverance" },
    { label: "🌅 Optina Elders", query: "optina" },
    { label: "💍 Anniversaries", query: "anniversary" },
    { label: "🛡️ Police & Military", query: "police" },
    { label: "💼 New Business", query: "business" },
    { label: "🍂 Retirement", query: "retirement" },
];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    'all': 'All Prayers',
    'general': 'General Devotions',
    'historical': 'Early Church & Ancient Roots',
    'spiritual-warfare': 'Spiritual Warfare & Deliverance',
    'healing': 'Healing & Recovery',
    'peace': 'Peace & Serenity',
    'protection': 'Divine Protection',
    'strength': 'Strength & Endurance',
    'guidance': 'Guidance & Discernment',
    'family': 'Family & Ancestry',
    'children': 'Children & Youth',
    'marriage': 'Marriage & Covenant',
    'work': 'Work & Calling',
    'travel': 'Travel & Safe Journeys',
    'morning': 'Morning Prayers',
    'evening': 'Evening & Compline',
    'thanksgiving': 'Thanksgiving & Praise',
    'repentance': 'Repentance & Mercy',
    'eternal': 'Eternal Rest & Departed',
    'feast': 'Feast Days & Seasons',
    'intercession': 'Intercession & Saints',
    'faith': 'Faith & Perseverance',
};

// === SEARCH ===
export function PrayerSearch() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [term, setTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setTerm(searchParams.get('q') || '');
    }, [searchParams]);

    const executeSearch = (query: string) => {
        setTerm(query);
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
            params.set('q', query.trim());
            params.set('page', '1');
        } else {
            params.delete('q');
        }
        router.replace(`/prayers?${params.toString()}`);
    };

    const handleSearchInput = (newValue: string) => {
        setTerm(newValue);
        const params = new URLSearchParams(searchParams.toString());
        if (newValue.trim()) {
            params.set('q', newValue.trim());
            params.set('page', '1'); // Reset page
        } else {
            params.delete('q');
        }
        // Debounce actual navigation
        const timeoutId = setTimeout(() => {
            router.replace(`/prayers?${params.toString()}`);
        }, 400);
        return () => clearTimeout(timeoutId);
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="relative mb-3">
                <input
                    type="text"
                    value={term}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    placeholder="Search by occasion, need, saint, or tradition (e.g. 'surgery', 'desert fathers', 'anxiety')..."
                    className="w-full pl-12 pr-12 py-4 rounded-full border border-gray-200/90 bg-white/95 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent text-base md:text-lg placeholder:text-gray-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {term && (
                    <button
                        onClick={() => executeSearch('')}
                        aria-label="Clear search"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* User-friendly Occasion & Crises Quick Search Chips */}
            <div className="flex items-center flex-wrap gap-1.5 justify-center pt-1 text-xs">
                <span className="text-gray-300 font-medium mr-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold-300" />
                    Trending Needs:
                </span>
                {QUICK_SEARCH_CHIPS.map((chip) => {
                    const isSelected = term.toLowerCase() === chip.query.toLowerCase();
                    return (
                        <button
                            key={chip.query}
                            type="button"
                            onClick={() => executeSearch(chip.query)}
                            className={`px-3 py-1 rounded-full border transition-all text-xs font-medium ${
                                isSelected
                                    ? 'bg-gold-500 text-sacred-950 border-gold-400 font-bold shadow-sm'
                                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                            }`}
                        >
                            {chip.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// === FILTER ===
interface CategoryProps {
    categories: { name: string; count: number }[];
}

const MACRO_GROUPS = [
    {
        id: 'all',
        label: 'All Categories',
        icon: '📖',
        categories: [] as string[]
    },
    {
        id: 'roots',
        label: '🏛️ Ancient Roots & Traditions',
        icon: '🏛️',
        categories: ['historical', 'spiritual-warfare', 'faith']
    },
    {
        id: 'crises',
        label: '🏥 Crises, Healing & Protection',
        icon: '🏥',
        categories: ['healing', 'peace', 'strength', 'protection', 'guidance']
    },
    {
        id: 'milestones',
        label: '🕊️ Family, Milestones & Children',
        icon: '🕊️',
        categories: ['family', 'children', 'marriage', 'travel']
    },
    {
        id: 'vocations',
        label: '💼 Vocations & Daily Rhythm',
        icon: '💼',
        categories: ['work', 'morning', 'evening', 'thanksgiving', 'repentance', 'feast', 'eternal', 'intercession']
    }
];

export function PrayerFilter({ categories }: CategoryProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentCategory = searchParams.get('category') || 'All';
    const currentQuery = searchParams.get('q') || '';
    const [isOpen, setIsOpen] = useState(false);
    const [activeGroup, setActiveGroup] = useState<string>('all');

    // Auto-select group if currentCategory belongs to it
    useEffect(() => {
        if (currentCategory === 'All') {
            setActiveGroup('all');
            return;
        }
        const found = MACRO_GROUPS.find(g => g.categories.includes(currentCategory));
        if (found) {
            setActiveGroup(found.id);
        }
    }, [currentCategory]);

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

    const clearAllFilters = () => {
        router.replace('/prayers');
    };

    const displayedCategories = activeGroup === 'all'
        ? categories
        : categories.filter(c => {
            const group = MACRO_GROUPS.find(g => g.id === activeGroup);
            return group ? group.categories.includes(c.name) : true;
        });

    return (
        <div className="mb-10">
            {/* Active Filters Clear Bar */}
            {(currentCategory !== 'All' || currentQuery) && (
                <div className="mb-4 flex items-center justify-between p-3 px-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs md:text-sm text-amber-950">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-amber-900">Active Filters:</span>
                        {currentCategory !== 'All' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/60 font-medium">
                                Category: {CATEGORY_DISPLAY_NAMES[currentCategory] || currentCategory}
                                <button onClick={() => handleSelect('All')} className="hover:text-red-700 ml-1">×</button>
                            </span>
                        )}
                        {currentQuery && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/60 font-medium">
                                Search: "{currentQuery}"
                                <button onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete('q');
                                    params.set('page', '1');
                                    router.replace(`/prayers?${params.toString()}`);
                                }} className="hover:text-red-700 ml-1">×</button>
                            </span>
                        )}
                    </div>
                    <button
                        onClick={clearAllFilters}
                        className="text-xs font-bold text-amber-800 hover:text-amber-950 underline shrink-0 ml-2"
                    >
                        Reset All
                    </button>
                </div>
            )}

            {/* Macro Themes Selector (Desktop & Tablet) */}
            <div className="hidden md:flex items-center justify-center gap-2 mb-4 p-1.5 bg-gray-100/80 rounded-2xl max-w-4xl mx-auto border border-gray-200/60">
                {MACRO_GROUPS.map((group) => {
                    const isActive = activeGroup === group.id;
                    return (
                        <button
                            key={group.id}
                            type="button"
                            onClick={() => setActiveGroup(group.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                isActive
                                    ? 'bg-white text-sacred-900 shadow-sm border border-gray-200/80'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                            }`}
                        >
                            <span>{group.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium"
                >
                    <span className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gold-600" />
                        {currentCategory === 'All'
                            ? 'All Categories'
                            : (CATEGORY_DISPLAY_NAMES[currentCategory] || currentCategory)}
                    </span>
                    <ChevronLeft className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-72 overflow-y-auto p-1 divide-y divide-gray-50">
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
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm flex justify-between items-center ${currentCategory === c.name ? 'bg-sacred-50 text-sacred-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span>{CATEGORY_DISPLAY_NAMES[c.name] || c.name}</span>
                                <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{c.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Category Pills (Filtered by selected Macro Group) */}
            <div className="hidden md:flex flex-wrap gap-2 justify-center pt-1">
                <button
                    onClick={() => handleSelect('All')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${currentCategory === 'All'
                        ? 'bg-sacred-900 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-sacred-300 hover:text-sacred-600'
                        }`}
                >
                    All ({categories.reduce((acc, c) => acc + c.count, 0)})
                </button>
                {displayedCategories.map((c) => {
                    const displayName = CATEGORY_DISPLAY_NAMES[c.name] || c.name;
                    const isSelected = currentCategory === c.name;
                    return (
                        <button
                            key={c.name}
                            onClick={() => handleSelect(c.name)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                                isSelected
                                    ? 'bg-sacred-900 text-white shadow-md font-bold'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-sacred-300 hover:text-sacred-600'
                            }`}
                        >
                            <span>{displayName}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {c.count}
                            </span>
                        </button>
                    );
                })}
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
                aria-label="Previous page"
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
                aria-label="Next page"
                className="p-3 rounded-full border border-gray-200 text-gray-600 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
