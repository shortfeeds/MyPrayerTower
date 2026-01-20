'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Heart, Building2, Flame, ArrowUpRight, Loader2, BookOpen, Cross } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    type: 'prayer' | 'saint' | 'church';
    title: string;
    subtitle?: string;
    url: string;
}

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
        if (!isOpen) {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Handle Esc key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Real Search Logic - Fetch from APIs
    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        const searchAll = async () => {
            try {
                // Fetch from all three APIs in parallel
                const [prayersRes, saintsRes, churchesRes] = await Promise.allSettled([
                    fetch(`/api/prayers?search=${encodeURIComponent(query)}&limit=5`, { signal: controller.signal }),
                    fetch(`/api/saints?search=${encodeURIComponent(query)}&limit=5`, { signal: controller.signal }),
                    fetch(`/api/churches?search=${encodeURIComponent(query)}&limit=5`, { signal: controller.signal }),
                ]);

                const allResults: SearchResult[] = [];

                // Process Prayers
                if (prayersRes.status === 'fulfilled' && prayersRes.value.ok) {
                    const data = await prayersRes.value.json();
                    if (data.prayers) {
                        data.prayers.forEach((p: any) => {
                            allResults.push({
                                id: p.id,
                                type: 'prayer',
                                title: p.title,
                                subtitle: p.categoryName || 'Prayer',
                                url: `/prayers/${p.slug || p.id}`
                            });
                        });
                    }
                }

                // Process Saints
                if (saintsRes.status === 'fulfilled' && saintsRes.value.ok) {
                    const data = await saintsRes.value.json();
                    if (data.saints) {
                        data.saints.forEach((s: any) => {
                            allResults.push({
                                id: s.id,
                                type: 'saint',
                                title: s.name,
                                subtitle: s.feastDay ? `Feast: ${s.feastDay}` : 'Saint',
                                url: `/saints/${s.slug || s.id}`
                            });
                        });
                    }
                }

                // Process Churches
                if (churchesRes.status === 'fulfilled' && churchesRes.value.ok) {
                    const data = await churchesRes.value.json();
                    if (data.churches) {
                        data.churches.forEach((c: any) => {
                            allResults.push({
                                id: c.id,
                                type: 'church',
                                title: c.name,
                                subtitle: c.city ? `${c.city}, ${c.country}` : c.country || 'Church',
                                url: `/churches/${c.slug || c.id}`
                            });
                        });
                    }
                }

                setResults(allResults.slice(0, 12)); // Max 12 results
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('Search error:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchAll, 300); // Debounce

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    const handleSelect = (url: string) => {
        router.push(url);
        onClose();
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'prayer': return Heart;
            case 'saint': return Star;
            case 'church': return Building2;
            default: return BookOpen;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'prayer': return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30';
            case 'saint': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30';
            case 'church': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-gray-200 dark:border-gray-700">
                {/* Search Header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search prayers, saints, churches..."
                        className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />}
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Results / Quick Links */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query.trim().length < 2 ? (
                        <div className="p-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Links</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleSelect('/prayers')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Prayer Library</span>
                                </button>
                                <button onClick={() => handleSelect('/candles')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                                        <Flame className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Light a Candle</span>
                                </button>
                                <button onClick={() => handleSelect('/saints')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                        <Star className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">All Saints</span>
                                </button>
                                <button onClick={() => handleSelect('/churches')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Find a Parish</span>
                                </button>
                                <button onClick={() => handleSelect('/mass-offerings')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                                        <Cross className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Mass Offerings</span>
                                </button>
                                <button onClick={() => handleSelect('/donate')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-gold-100 dark:bg-gold-900/30 text-gold-600 rounded-lg">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Donate</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-2">
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((result) => {
                                        const Icon = getIconForType(result.type);
                                        return (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                onClick={() => handleSelect(result.url)}
                                                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                                            >
                                                <div className={`p-2 rounded-lg ${getColorForType(result.type)}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 truncate">
                                                        {result.title}
                                                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 font-medium shrink-0">
                                                            {result.type}
                                                        </span>
                                                    </div>
                                                    {result.subtitle && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{result.subtitle}</div>
                                                    )}
                                                </div>
                                                <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                !loading && (
                                    <div className="py-12 text-center text-gray-500">
                                        <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No results found for "{query}"</p>
                                        <p className="text-sm mt-2">Try searching for prayers, saints, or churches</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex justify-between">
                    <div>
                        Press <kbd className="font-sans px-1.5 py-0.5 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 mx-1">Esc</kbd> to close
                    </div>
                    <div>
                        MyPrayerTower Search
                    </div>
                </div>
            </div>
        </div>
    );
}
