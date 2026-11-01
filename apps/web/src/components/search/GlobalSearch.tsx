'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Search, X, Star, Heart, Building2, Flame, ArrowUpRight, 
    Loader2, BookOpen, Cross, Sparkles, Clock, ChevronRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface SearchResult {
    id: string;
    type: 'prayer' | 'novena' | 'saint' | 'church' | 'blog' | 'guide';
    title: string;
    subtitle?: string;
    snippet?: string;
    url: string;
    badge?: string;
}

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

const POPULAR_SEARCHES = [
    { label: 'St. Jude Novena', query: 'St. Jude Novena' },
    { label: 'Holy Rosary', query: 'Rosary' },
    { label: 'Divine Mercy Chaplet', query: 'Divine Mercy' },
    { label: 'Morning Offering', query: 'Morning Offering' },
    { label: 'St. Michael the Archangel', query: 'St. Michael' },
    { label: 'All Souls Day Prayers', query: 'All Souls' },
    { label: 'Prayer for Healing', query: 'Healing' },
    { label: 'Act of Contrition', query: 'Act of Contrition' }
];

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Load recent searches from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('mpt_recent_searches');
                if (stored) {
                    setRecentSearches(JSON.parse(stored).slice(0, 5));
                }
            } catch {
                // ignore
            }
        }
    }, [isOpen]);

    const saveRecentSearch = useCallback((searchTerm: string) => {
        if (!searchTerm.trim()) return;
        try {
            const updated = [searchTerm.trim(), ...recentSearches.filter(s => s.toLowerCase() !== searchTerm.toLowerCase().trim())].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('mpt_recent_searches', JSON.stringify(updated));
        } catch {
            // ignore
        }
    }, [recentSearches]);

    const clearRecentSearches = () => {
        setRecentSearches([]);
        try {
            localStorage.removeItem('mpt_recent_searches');
        } catch {
            // ignore
        }
    };

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 80);
            setSelectedIndex(-1);
        } else {
            setQuery('');
            setResults([]);
            setSelectedIndex(-1);
        }
    }, [isOpen]);

    // Handle Keyboard Shortcuts
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleSelect(results[selectedIndex].url, results[selectedIndex].title);
                } else if (query.trim().length > 0) {
                    saveRecentSearch(query.trim());
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                    onClose();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, query, onClose, router, saveRecentSearch]);

    // Unified Search via /api/search
    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setLoading(false);
            setSelectedIndex(-1);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        const searchTimer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=12`, {
                    signal: controller.signal
                });
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.results || []);
                    setSelectedIndex(-1);
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('Search fetch error:', err);
                }
            } finally {
                setLoading(false);
            }
        }, 220); // Responsive debounce

        return () => {
            clearTimeout(searchTimer);
            controller.abort();
        };
    }, [query]);

    // Scroll active item into view
    useEffect(() => {
        if (selectedIndex >= 0 && resultsContainerRef.current) {
            const activeEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    const handleSelect = (url: string, termToSave?: string) => {
        if (termToSave) saveRecentSearch(termToSave);
        router.push(url);
        onClose();
    };

    const handleChipClick = (searchQuery: string) => {
        setQuery(searchQuery);
        saveRecentSearch(searchQuery);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'prayer': return Heart;
            case 'novena': return Sparkles;
            case 'saint': return Star;
            case 'church': return Building2;
            case 'blog': return BookOpen;
            case 'guide': return Cross;
            default: return BookOpen;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'prayer': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
            case 'novena': return 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
            case 'saint': return 'bg-purple-500/10 text-purple-300 border border-purple-500/20';
            case 'church': return 'bg-sky-500/10 text-sky-300 border border-sky-500/20';
            case 'blog': return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
            case 'guide': return 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20';
            default: return 'bg-gray-500/10 text-gray-300 border border-gray-500/20';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-start justify-center pt-8 md:pt-16 px-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-2xl bg-[#0d0914] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up z-10">
                {/* Search Header Bar */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
                    <Search className="w-5 h-5 text-gold-400/80 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search prayers, novenas, saints, blog, churches..."
                        className="flex-1 bg-transparent text-base md:text-lg text-white placeholder-white/40 focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />}
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="p-1 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-colors"
                                aria-label="Clear query"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-white/60 hover:text-white text-xs border border-white/10 transition-colors"
                        >
                            Esc
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div ref={resultsContainerRef} className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {query.trim().length < 2 ? (
                        <div className="p-5 space-y-6">
                            {/* Recent Searches (if any) */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/50 uppercase tracking-wider">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Recent Searches</span>
                                        </div>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-[11px] text-white/40 hover:text-gold-300 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((term, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleChipClick(term)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/80 hover:text-white transition-colors"
                                            >
                                                <span>{term}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular Catholic Searches */}
                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-400/80 uppercase tracking-wider mb-2.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Popular Devotions & Prayers</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_SEARCHES.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleChipClick(item.query)}
                                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 text-xs font-medium text-gold-300 hover:text-gold-200 transition-all hover:scale-[1.02]"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Navigation Cards */}
                            <div>
                                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Explore Categories</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    <button onClick={() => handleSelect('/prayers')} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left group">
                                        <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
                                            <Heart className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-xs text-white/90">Prayers</div>
                                            <div className="text-[10px] text-white/40 truncate">4,000+ Catholic</div>
                                        </div>
                                    </button>

                                    <button onClick={() => handleSelect('/novenas')} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left group">
                                        <div className="p-2 bg-amber-500/10 text-amber-300 rounded-lg shrink-0">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-xs text-white/90">Novenas</div>
                                            <div className="text-[10px] text-white/40 truncate">9-Day Prayers</div>
                                        </div>
                                    </button>

                                    <button onClick={() => handleSelect('/saints')} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left group">
                                        <div className="p-2 bg-purple-500/10 text-purple-300 rounded-lg shrink-0">
                                            <Star className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-xs text-white/90">Saints</div>
                                            <div className="text-[10px] text-white/40 truncate">Patronages & Feasts</div>
                                        </div>
                                    </button>

                                    <button onClick={() => handleSelect('/candles')} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left group">
                                        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                                            <Flame className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-xs text-white/90">Votive Candles</div>
                                            <div className="text-[10px] text-white/40 truncate">Light a Candle</div>
                                        </div>
                                    </button>

                                    <button onClick={() => handleSelect('/churches')} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left group">
                                        <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg shrink-0">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-xs text-white/90">Parish Finder</div>
                                            <div className="text-[10px] text-white/40 truncate">Mass & Confession</div>
                                        </div>
                                    </button>

                                    <button onClick={() => handleSelect('/blog')} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left group">
                                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-xs text-white/90">Blog & Articles</div>
                                            <div className="text-[10px] text-white/40 truncate">Catholic Wisdom</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-2">
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((result, idx) => {
                                        const Icon = getIconForType(result.type);
                                        const isSelected = selectedIndex === idx;

                                        return (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                data-index={idx}
                                                onClick={() => handleSelect(result.url, result.title)}
                                                className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-all text-left group ${
                                                    isSelected 
                                                        ? 'bg-gold-500/15 border border-gold-500/30 shadow-md' 
                                                        : 'hover:bg-white/[0.06] border border-transparent'
                                                }`}
                                            >
                                                <div className={`p-2 rounded-lg shrink-0 ${getColorForType(result.type)}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-sm text-white flex items-center gap-2 truncate">
                                                        <span className="truncate">{result.title}</span>
                                                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-medium shrink-0">
                                                            {result.badge || result.type}
                                                        </span>
                                                    </div>
                                                    {result.subtitle && (
                                                        <div className="text-xs text-white/50 truncate mt-0.5">
                                                            {result.subtitle}
                                                        </div>
                                                    )}
                                                </div>
                                                <ArrowUpRight className={`w-4 h-4 transition-transform shrink-0 ${
                                                    isSelected ? 'text-gold-400 opacity-100 translate-x-0.5 -translate-y-0.5' : 'text-white/30 opacity-0 group-hover:opacity-100'
                                                }`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                !loading && (
                                    <div className="py-12 text-center text-white/50">
                                        <Search className="w-10 h-10 mx-auto mb-3 text-white/20" />
                                        <p className="text-sm font-medium text-white/70">No direct results for &ldquo;{query}&rdquo;</p>
                                        <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
                                            Try searching with alternate Catholic spellings, saint names, or intentions like healing, peace, or thanksgiving.
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Bar */}
                <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 text-xs text-white/50 flex items-center justify-between">
                    {query.trim().length >= 2 ? (
                        <button
                            onClick={() => {
                                saveRecentSearch(query.trim());
                                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                                onClose();
                            }}
                            className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 font-medium transition-colors"
                        >
                            <span>View all results for &ldquo;{query}&rdquo;</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-[11px] text-white/40">
                            <span>Navigate with</span>
                            <kbd className="font-mono px-1 py-0.5 rounded bg-white/10 text-white/60">↑</kbd>
                            <kbd className="font-mono px-1 py-0.5 rounded bg-white/10 text-white/60">↓</kbd>
                            <span>and</span>
                            <kbd className="font-mono px-1 py-0.5 rounded bg-white/10 text-white/60">Enter</kbd>
                        </div>
                    )}

                    <div className="text-[11px] text-white/40">
                        Press <kbd className="font-mono px-1 py-0.5 rounded bg-white/10 text-white/60">Esc</kbd> to close
                    </div>
                </div>
            </div>
        </div>
    );
}
