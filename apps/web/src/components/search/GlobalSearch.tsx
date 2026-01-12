'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Star, Heart, Building2, Flame, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    type: 'prayer' | 'saint' | 'church';
    title: string;
    subtitle?: string;
    url: string;
    icon?: any;
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
    }, [isOpen]);

    // Handle Esc key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onClose(); // Toggle logic handling should be in parent or here effectively
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Mock Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            // Mock Data
            const mockResults: SearchResult[] = [
                { id: '1', type: 'prayer', title: 'Hail Mary', subtitle: 'Common Prayer', url: '/prayers/hail-mary', icon: Heart },
                { id: '2', type: 'prayer', title: 'Our Father', subtitle: 'Common Prayer', url: '/prayers/our-father', icon: Heart },
                { id: '3', type: 'saint', title: 'St. Michael the Archangel', subtitle: 'Feast Day: Sept 29', url: '/saints/st-michael', icon: Star },
                { id: '4', type: 'saint', title: 'St. Francis of Assisi', subtitle: 'Feast Day: Oct 4', url: '/saints/st-francis', icon: Star },
                { id: '5', type: 'church', title: 'St. Patrick\'s Cathedral', subtitle: 'New York, NY', url: '/churches/st-patricks-nyc', icon: Building2 },
            ];

            const filtered = mockResults.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.type.includes(query.toLowerCase())
            );
            setResults(filtered);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (url: string) => {
        router.push(url);
        onClose();
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

                {/* Results / Empty State */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query.trim() === '' ? (
                        <div className="p-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Trending Searches</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleSelect('/prayers/rosary')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg group-hover:bg-white dark:group-hover:bg-rose-900 transition-colors">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Holy Rosary</span>
                                </button>
                                <button onClick={() => handleSelect('/candles')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg group-hover:bg-white dark:group-hover:bg-amber-900 transition-colors">
                                        <Flame className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Light a Candle</span>
                                </button>
                                <button onClick={() => handleSelect('/saints')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg group-hover:bg-white dark:group-hover:bg-purple-900 transition-colors">
                                        <Star className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Saint of the Day</span>
                                </button>
                                <button onClick={() => handleSelect('/churches')} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg group-hover:bg-white dark:group-hover:bg-blue-900 transition-colors">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Find a Parish</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-2">
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleSelect(result.url)}
                                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                                        >
                                            <div className={`p-2 rounded-lg ${result.type === 'prayer' ? 'bg-rose-100 text-rose-600' :
                                                    result.type === 'saint' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {result.icon && <result.icon className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                    {result.title}
                                                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                                                        {result.type}
                                                    </span>
                                                </div>
                                                {result.subtitle && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</div>
                                                )}
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                !loading && (
                                    <div className="py-12 text-center text-gray-500">
                                        <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No results found for "{query}"</p>
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
                        MyPrayerTower Global Search
                    </div>
                </div>
            </div>
        </div>
    );
}
